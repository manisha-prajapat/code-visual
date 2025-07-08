const simpleGit = require('simple-git');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class RepoProcessor {
  constructor(database) {
    this.db = database;
    this.tempDir = path.join(__dirname, 'temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.ensureDir(this.tempDir);
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  extractRepoName(repoUrl) {
    // Extract repo name from URL
    // Handles both https://github.com/user/repo and https://github.com/user/repo.git
    const match = repoUrl.match(/\/([^\/]+)(?:\.git)?$/);
    return match ? match[1] : 'unknown-repo';
  }

  async cloneRepository(repoUrl, jobId) {
    const repoName = this.extractRepoName(repoUrl);
    const clonePath = path.join(this.tempDir, `${jobId}-${repoName}`);
    
    try {
      // Remove existing directory if it exists
      await fs.remove(clonePath);
      
      // Clone the repository
      const git = simpleGit();
      await git.clone(repoUrl, clonePath, ['--depth', '1']); // Shallow clone for faster processing
      
      console.log(`Successfully cloned ${repoUrl} to ${clonePath}`);
      return { clonePath, repoName };
    } catch (error) {
      console.error('Error cloning repository:', error);
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  getFileExtension(filePath) {
    const ext = path.extname(filePath);
    return ext ? ext.substring(1) : null; // Remove the dot
  }

  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  async processDirectory(dirPath, jobId, parentFolderId = null, depth = 0, repoRootPath = null) {
    const files = [];
    const folderMap = new Map(); // To track folder IDs for parent-child relationships
    
    // Set repo root path if not provided (first call)
    if (repoRootPath === null) {
      repoRootPath = dirPath;
    }
    
    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        // Skip hidden files and common ignore patterns
        if (item.startsWith('.') || item === 'node_modules' || item === '__pycache__') {
          continue;
        }
        
        const itemPath = path.join(dirPath, item);
        const stats = await fs.stat(itemPath);
        const isDirectory = stats.isDirectory();
        const fileId = uuidv4();
        
        // Create relative path from repo root
        const relativePath = path.relative(repoRootPath, itemPath);
        
        const fileData = {
          id: fileId,
          job_id: jobId,
          file_path: relativePath || '.', // Use '.' for root directory
          file_name: item,
          extension: isDirectory ? null : this.getFileExtension(item),
          parent_folder_id: parentFolderId,
          is_directory: isDirectory,
          depth: depth,
          size: isDirectory ? 0 : await this.getFileSize(itemPath)
        };
        
        files.push(fileData);
        
        // Store folder ID for potential child items
        if (isDirectory) {
          folderMap.set(itemPath, fileId);
          
          // Recursively process subdirectories
          const subFiles = await this.processDirectory(itemPath, jobId, fileId, depth + 1, repoRootPath);
          files.push(...subFiles);
        }
      }
      
      return files;
    } catch (error) {
      console.error('Error processing directory:', error);
      throw new Error(`Failed to process directory: ${error.message}`);
    }
  }

  async processRepository(repoUrl, jobId) {
    let clonePath = null;
    
    try {
      // Update job status to processing
      await this.db.updateJobStatus(jobId, 'processing');
      
      // Clone the repository
      const { clonePath: repoPath, repoName } = await this.cloneRepository(repoUrl, jobId);
      clonePath = repoPath;
      
      // Process the repository structure
      const files = await this.processDirectory(clonePath, jobId);
      
      // Save files to database
      for (const file of files) {
        await this.db.insertFile(file);
      }
      
      // Prepare result data
      const resultData = {
        total_files: files.length,
        total_directories: files.filter(f => f.is_directory).length,
        total_regular_files: files.filter(f => !f.is_directory).length,
        max_depth: Math.max(...files.map(f => f.depth)),
        repo_name: repoName,
        processed_at: new Date().toISOString()
      };
      
      // Update job status to completed
      await this.db.updateJobStatus(jobId, 'completed', null, JSON.stringify(resultData));
      
      return {
        success: true,
        jobId,
        files,
        summary: resultData
      };
      
    } catch (error) {
      console.error('Error processing repository:', error);
      
      // Update job status to failed
      await this.db.updateJobStatus(jobId, 'failed', error.message);
      
      throw error;
    } finally {
      // Clean up cloned repository
      if (clonePath) {
        try {
          await fs.remove(clonePath);
          console.log(`Cleaned up temporary directory: ${clonePath}`);
        } catch (cleanupError) {
          console.error('Error cleaning up temporary directory:', cleanupError);
        }
      }
    }
  }

  // Generate GitHub URL for a file
  generateGitHubUrl(repoUrl, filePath, branch = 'main') {
    // Remove .git suffix if present
    const baseUrl = repoUrl.replace(/\.git$/, '');
    
    // Handle root directory
    if (filePath === '.' || filePath === '') {
      return baseUrl;
    }
    
    // Convert path separators to forward slashes for URLs
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    return `${baseUrl}/blob/${branch}/${normalizedPath}`;
  }

  // Generate GitHub tree URL for directories
  generateGitHubTreeUrl(repoUrl, filePath, branch = 'main') {
    // Remove .git suffix if present
    const baseUrl = repoUrl.replace(/\.git$/, '');
    
    // Handle root directory
    if (filePath === '.' || filePath === '') {
      return `${baseUrl}/tree/${branch}`;
    }
    
    // Convert path separators to forward slashes for URLs
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    return `${baseUrl}/tree/${branch}/${normalizedPath}`;
  }

  // Add GitHub URLs to file data
  enrichWithGitHubUrls(files, repoUrl, branch = 'main') {
    return files.map(file => ({
      ...file,
      github_url: file.is_directory 
        ? this.generateGitHubTreeUrl(repoUrl, file.file_path, branch)
        : this.generateGitHubUrl(repoUrl, file.file_path, branch)
    }));
  }

  // Generate a hierarchical structure for visualization
  generateHierarchy(files) {
    const hierarchy = {
      name: 'root',
      children: []
    };
    
    const nodeMap = new Map();
    nodeMap.set(null, hierarchy); // Root node
    
    // Sort files by depth and path to ensure parents are processed before children
    const sortedFiles = files.sort((a, b) => {
      if (a.depth !== b.depth) return a.depth - b.depth;
      return a.file_path.localeCompare(b.file_path);
    });
    
    for (const file of sortedFiles) {
      const node = {
        id: file.id,
        name: file.file_name,
        path: file.file_path,
        extension: file.extension,
        isDirectory: file.is_directory,
        size: file.size,
        depth: file.depth,
        github_url: file.github_url,
        children: file.is_directory ? [] : undefined
      };
      
      const parent = nodeMap.get(file.parent_folder_id);
      if (parent) {
        parent.children.push(node);
      }
      
      if (file.is_directory) {
        nodeMap.set(file.id, node);
      }
    }
    
    return hierarchy;
  }
}

module.exports = RepoProcessor; 