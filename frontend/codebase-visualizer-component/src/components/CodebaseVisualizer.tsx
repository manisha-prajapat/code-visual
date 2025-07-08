import * as React from 'react';
const { useState, useCallback } = React;
import { CodebaseVisualizerProps, Job, JobResult, FileItem } from '../types';
import { CodebaseVisualizerAPI } from '../api';
import { FileExplorer } from './FileExplorer';
import './CodebaseVisualizer.css';

export const CodebaseVisualizer: React.FC<CodebaseVisualizerProps> = ({
  apiBaseUrl = 'http://localhost:3000',
  onFileSelect,
  onDirectorySelect,
  theme = 'light',
  defaultRepoUrl = '',
  showGitHubLinks = true,
  maxDepth,
  className = ''
}) => {
  const [api] = useState(() => new CodebaseVisualizerAPI(apiBaseUrl));
  const [repoUrl, setRepoUrl] = useState(defaultRepoUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processRepository = useCallback(async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setJobResult(null);

    try {
      // Start processing
      const job = await api.processRepository(repoUrl);
      setCurrentJob(job);

      // Poll for completion
      const completedJob = await api.pollJobUntilComplete(
        job.job_id,
        (updatedJob) => {
          setCurrentJob(updatedJob);
        }
      );

      if (completedJob.status === 'completed') {
        // Get the result
        const result = await api.getJobResult(completedJob.job_id, 'hierarchical');
        setJobResult(result);
      } else {
        setError(completedJob.error_message || 'Processing failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, [api, repoUrl]);

  const handleFileSelect = useCallback((file: FileItem) => {
    onFileSelect?.(file);
  }, [onFileSelect]);

  const handleDirectorySelect = useCallback((directory: FileItem) => {
    onDirectorySelect?.(directory);
  }, [onDirectorySelect]);

  return (
    <div className={`codebase-visualizer ${theme} ${className}`}>
      <div className="codebase-visualizer-header">
        <h2>Codebase Visualizer</h2>
        <div className="codebase-visualizer-controls">
          <input
            type="text"
            placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="repo-input"
            disabled={isProcessing}
          />
          <button
            onClick={processRepository}
            disabled={isProcessing || !repoUrl.trim()}
            className="process-button"
          >
            {isProcessing ? 'Processing...' : 'Analyze Repository'}
          </button>
        </div>
      </div>

      {error && (
        <div className="codebase-visualizer-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {currentJob && (
        <div className="codebase-visualizer-status">
          <div className="status-info">
            <strong>Repository:</strong> {currentJob.repo_name}
            <br />
            <strong>Status:</strong> {currentJob.status}
            {currentJob.result_data && (
              <>
                <br />
                <strong>Files found:</strong> {currentJob.result_data.total_files}
              </>
            )}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="codebase-visualizer-loading">
          <div className="loading-spinner"></div>
          <p>Processing repository... This may take a few minutes for large repositories.</p>
        </div>
      )}

      {jobResult && (
        <FileExplorer
          files={jobResult.files}
          hierarchy={jobResult.hierarchy}
          onFileSelect={handleFileSelect}
          onDirectorySelect={handleDirectorySelect}
          showGitHubLinks={showGitHubLinks}
          maxDepth={maxDepth}
          className={theme}
        />
      )}
    </div>
  );
}; 