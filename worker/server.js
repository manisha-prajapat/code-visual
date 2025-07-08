const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Database = require('./database');
const RepoProcessor = require('./repoProcessor');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database and repo processor
const database = new Database();
const repoProcessor = new RepoProcessor(database);

// Middleware
app.use(cors());
app.use(express.json());

// Store active jobs for progress tracking
const activeJobs = new Map();

// Utility function to validate GitHub URL
function isValidGitHubUrl(url) {
  const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(?:\.git)?$/;
  return githubRegex.test(url);
}

// POST /process - Start processing a repository
app.post('/process', async (req, res) => {
  try {
    const { repo_url, repo_name } = req.body;
    
    // Validate input
    if (!repo_url) {
      return res.status(400).json({
        error: 'Repository URL is required',
        details: 'Please provide a valid GitHub repository URL'
      });
    }
    
    if (!isValidGitHubUrl(repo_url)) {
      return res.status(400).json({
        error: 'Invalid GitHub URL',
        details: 'Please provide a valid GitHub repository URL (e.g., https://github.com/user/repo)'
      });
    }
    
    // Generate job ID
    const jobId = uuidv4();
    const extractedRepoName = repo_name || repoProcessor.extractRepoName(repo_url);
    
    // Create job in database
    const job = await database.createJob({
      id: jobId,
      repo_url: repo_url,
      repo_name: extractedRepoName
    });
    
    // Mark job as active
    activeJobs.set(jobId, {
      status: 'pending',
      started_at: new Date().toISOString()
    });
    
    // Start processing asynchronously
    processRepositoryAsync(repo_url, jobId);
    
    res.status(202).json({
      message: 'Repository processing started',
      job_id: jobId,
      repo_url: repo_url,
      repo_name: extractedRepoName,
      status: 'pending',
      status_url: `/status/${jobId}`
    });
    
  } catch (error) {
    console.error('Error starting repository processing:', error);
    res.status(500).json({
      error: 'Failed to start repository processing',
      details: error.message
    });
  }
});

// GET /status/:jobId - Get job status
app.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Get job from database
    const job = await database.getJob(jobId);
    
    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        details: `No job found with ID: ${jobId}`
      });
    }
    
    // Parse result data if available
    let resultData = null;
    if (job.result_data) {
      try {
        resultData = JSON.parse(job.result_data);
      } catch (parseError) {
        console.error('Error parsing result data:', parseError);
      }
    }
    
    res.json({
      job_id: job.id,
      repo_url: job.repo_url,
      repo_name: job.repo_name,
      status: job.status,
      created_at: job.created_at,
      updated_at: job.updated_at,
      error_message: job.error_message,
      result_data: resultData
    });
    
  } catch (error) {
    console.error('Error getting job status:', error);
    res.status(500).json({
      error: 'Failed to get job status',
      details: error.message
    });
  }
});

// GET /result/:jobId - Get job result with file structure
app.get('/result/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { format = 'flat' } = req.query; // flat or hierarchical
    
    // Get job from database
    const job = await database.getJob(jobId);
    
    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        details: `No job found with ID: ${jobId}`
      });
    }
    
    if (job.status !== 'completed') {
      return res.status(400).json({
        error: 'Job not completed',
        details: `Job status is: ${job.status}`,
        status: job.status
      });
    }
    
    // Get files from database
    const files = await database.getFilesByJobId(jobId);
    
    // Parse result data
    let resultData = null;
    if (job.result_data) {
      try {
        resultData = JSON.parse(job.result_data);
      } catch (parseError) {
        console.error('Error parsing result data:', parseError);
      }
    }
    
    // Enrich files with GitHub URLs
    const enrichedFiles = repoProcessor.enrichWithGitHubUrls(files, job.repo_url);
    
    // Format response based on requested format
    let responseData = {
      job_id: job.id,
      repo_url: job.repo_url,
      repo_name: job.repo_name,
      status: job.status,
      summary: resultData,
      files: enrichedFiles
    };
    
    if (format === 'hierarchical') {
      responseData.hierarchy = repoProcessor.generateHierarchy(enrichedFiles);
    }
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Error getting job result:', error);
    res.status(500).json({
      error: 'Failed to get job result',
      details: error.message
    });
  }
});

// GET /jobs - Get all jobs
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await database.getAllJobs();
    
    // Parse result data for each job
    const jobsWithParsedData = jobs.map(job => {
      let resultData = null;
      if (job.result_data) {
        try {
          resultData = JSON.parse(job.result_data);
        } catch (parseError) {
          console.error('Error parsing result data:', parseError);
        }
      }
      
      return {
        ...job,
        result_data: resultData
      };
    });
    
    res.json({
      jobs: jobsWithParsedData,
      total: jobs.length
    });
    
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({
      error: 'Failed to get jobs',
      details: error.message
    });
  }
});

// DELETE /job/:jobId - Delete a job and its files
app.delete('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Check if job exists
    const job = await database.getJob(jobId);
    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        details: `No job found with ID: ${jobId}`
      });
    }
    
    // Delete files first
    await database.deleteJobFiles(jobId);
    
    // Delete job (this will cascade delete files due to foreign key constraint)
    await database.db.run('DELETE FROM jobs WHERE id = ?', [jobId]);
    
    // Remove from active jobs if present
    activeJobs.delete(jobId);
    
    res.json({
      message: 'Job deleted successfully',
      job_id: jobId
    });
    
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      error: 'Failed to delete job',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    active_jobs: activeJobs.size
  });
});

// Async function to process repository
async function processRepositoryAsync(repoUrl, jobId) {
  try {
    activeJobs.set(jobId, {
      status: 'processing',
      started_at: activeJobs.get(jobId)?.started_at || new Date().toISOString()
    });
    
    const result = await repoProcessor.processRepository(repoUrl, jobId);
    
    activeJobs.set(jobId, {
      status: 'completed',
      started_at: activeJobs.get(jobId)?.started_at,
      completed_at: new Date().toISOString()
    });
    
    console.log(`Repository processing completed for job ${jobId}`);
    
  } catch (error) {
    activeJobs.set(jobId, {
      status: 'failed',
      started_at: activeJobs.get(jobId)?.started_at,
      failed_at: new Date().toISOString(),
      error: error.message
    });
    
    console.error(`Repository processing failed for job ${jobId}:`, error);
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    details: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Codebase Visualizer Worker running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST /process - Start repository processing`);
  console.log(`   GET /status/:jobId - Get job status`);
  console.log(`   GET /result/:jobId - Get job result with files`);
  console.log(`   GET /jobs - Get all jobs`);
  console.log(`   DELETE /job/:jobId - Delete a job`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  database.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  database.close();
  process.exit(0);
});

module.exports = app; 