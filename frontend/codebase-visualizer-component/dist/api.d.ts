import { Job, JobResult } from './types';
export declare class CodebaseVisualizerAPI {
    private baseUrl;
    constructor(baseUrl?: string);
    processRepository(repoUrl: string, repoName?: string): Promise<Job>;
    getJobStatus(jobId: string): Promise<Job>;
    getJobResult(jobId: string, format?: 'flat' | 'hierarchical'): Promise<JobResult>;
    getAllJobs(): Promise<{
        jobs: Job[];
        total: number;
    }>;
    deleteJob(jobId: string): Promise<{
        message: string;
        job_id: string;
    }>;
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
        active_jobs: number;
    }>;
    pollJobUntilComplete(jobId: string, onProgress?: (job: Job) => void, pollInterval?: number, maxAttempts?: number): Promise<Job>;
}
