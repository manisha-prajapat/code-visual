import { Job, JobResult } from './types';

export class CodebaseVisualizerAPI {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async processRepository(repoUrl: string, repoName?: string): Promise<Job> {
    const response = await fetch(`${this.baseUrl}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo_url: repoUrl,
        repo_name: repoName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to process repository');
    }

    return response.json();
  }

  async getJobStatus(jobId: string): Promise<Job> {
    const response = await fetch(`${this.baseUrl}/status/${jobId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to get job status');
    }

    return response.json();
  }

  async getJobResult(jobId: string, format: 'flat' | 'hierarchical' = 'hierarchical'): Promise<JobResult> {
    const response = await fetch(`${this.baseUrl}/result/${jobId}?format=${format}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to get job result');
    }

    return response.json();
  }

  async getAllJobs(): Promise<{ jobs: Job[]; total: number }> {
    const response = await fetch(`${this.baseUrl}/jobs`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to get jobs');
    }

    return response.json();
  }

  async deleteJob(jobId: string): Promise<{ message: string; job_id: string }> {
    const response = await fetch(`${this.baseUrl}/job/${jobId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to delete job');
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; active_jobs: number }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }

  // Utility function to poll job status until completion
  async pollJobUntilComplete(
    jobId: string,
    onProgress?: (job: Job) => void,
    pollInterval: number = 2000,
    maxAttempts: number = 30
  ): Promise<Job> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const job = await this.getJobStatus(jobId);
      
      if (onProgress) {
        onProgress(job);
      }
      
      if (job.status === 'completed' || job.status === 'failed') {
        return job;
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    throw new Error('Job polling timeout');
  }
} 