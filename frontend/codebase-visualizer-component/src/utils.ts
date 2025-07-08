import { FileItem } from './types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileIcon = (extension: string | null, isDirectory: boolean = false): string => {
  if (isDirectory) return '📁';
  
  if (!extension) return '📄';
  
  const icons: Record<string, string> = {
    // JavaScript/TypeScript
    'js': '🟨',
    'jsx': '⚛️',
    'ts': '🔷',
    'tsx': '⚛️',
    'vue': '💚',
    'svelte': '🧡',
    
    // Web
    'html': '🌐',
    'htm': '🌐',
    'css': '🎨',
    'scss': '🎨',
    'sass': '🎨',
    'less': '🎨',
    
    // Programming Languages
    'py': '🐍',
    'java': '☕',
    'cpp': '⚙️',
    'c': '⚙️',
    'cs': '🔷',
    'php': '🐘',
    'rb': '💎',
    'go': '🐹',
    'rs': '🦀',
    'swift': '🐦',
    'kt': '🟪',
    'scala': '🔴',
    'clj': '🔵',
    
    // Data/Config
    'json': '📋',
    'xml': '📋',
    'yaml': '📋',
    'yml': '📋',
    'toml': '📋',
    'ini': '📋',
    'env': '🔧',
    'config': '🔧',
    
    // Documentation
    'md': '📝',
    'txt': '📄',
    'rtf': '📄',
    'pdf': '📕',
    'doc': '📘',
    'docx': '📘',
    
    // Images
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'webp': '🖼️',
    'ico': '🖼️',
    
    // Media
    'mp4': '🎬',
    'avi': '🎬',
    'mov': '🎬',
    'mp3': '🎵',
    'wav': '🎵',
    'flac': '🎵',
    
    // Archives
    'zip': '📦',
    'tar': '📦',
    'gz': '📦',
    'rar': '📦',
    '7z': '📦',
    
    // Shell/Scripts
    'sh': '💻',
    'bash': '💻',
    'zsh': '💻',
    'fish': '💻',
    'ps1': '💻',
    'bat': '💻',
    
    // Database
    'sql': '🗄️',
    'db': '🗄️',
    'sqlite': '🗄️',
    
    // Build/Config
    'dockerfile': '🐳',
    'makefile': '🔨',
    'gradle': '🐘',
    'maven': '📦',
    'npm': '📦',
    'yarn': '🧶',
    
    // Version Control
    'gitignore': '🙈',
    'gitattributes': '🔧',
  };
  
  const lowerExt = extension.toLowerCase();
  return icons[lowerExt] || '📄';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const sortFiles = (files: FileItem[]): FileItem[] => {
  return [...files].sort((a, b) => {
    // Directories first
    if (a.is_directory && !b.is_directory) return -1;
    if (!a.is_directory && b.is_directory) return 1;
    
    // Then by name
    return a.file_name.localeCompare(b.file_name);
  });
};

export const filterFilesByDepth = (files: FileItem[], maxDepth: number): FileItem[] => {
  return files.filter(file => file.depth <= maxDepth);
};

export const groupFilesByParent = (files: FileItem[]): Record<string, FileItem[]> => {
  return files.reduce((groups, file) => {
    const parentId = file.parent_folder_id || 'root';
    if (!groups[parentId]) {
      groups[parentId] = [];
    }
    groups[parentId].push(file);
    return groups;
  }, {} as Record<string, FileItem[]>);
};

export const getFileStats = (files: FileItem[]) => {
  const stats = {
    totalFiles: files.length,
    totalDirectories: 0,
    totalRegularFiles: 0,
    totalSize: 0,
    maxDepth: 0,
    fileExtensions: {} as Record<string, number>,
  };
  
  files.forEach(file => {
    if (file.is_directory) {
      stats.totalDirectories++;
    } else {
      stats.totalRegularFiles++;
      stats.totalSize += file.size;
      
      if (file.extension) {
        stats.fileExtensions[file.extension] = (stats.fileExtensions[file.extension] || 0) + 1;
      }
    }
    
    stats.maxDepth = Math.max(stats.maxDepth, file.depth);
  });
  
  return stats;
};

export const searchFiles = (files: FileItem[], query: string): FileItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return files.filter(file => 
    file.file_name.toLowerCase().includes(lowercaseQuery) ||
    file.file_path.toLowerCase().includes(lowercaseQuery)
  );
};

export const getLanguageFromExtension = (extension: string | null): string => {
  if (!extension) return 'text';
  
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
  };
  
  return languageMap[extension.toLowerCase()] || 'text';
}; 