export interface FileItem {
    id: string;
    job_id: string;
    file_path: string;
    file_name: string;
    extension: string | null;
    parent_folder_id: string | null;
    is_directory: boolean;
    depth: number;
    size: number;
    github_url: string;
}
export interface JobSummary {
    total_files: number;
    total_directories: number;
    total_regular_files: number;
    max_depth: number;
    repo_name: string;
    processed_at: string;
}
export interface Job {
    job_id: string;
    repo_url: string;
    repo_name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
    error_message: string | null;
    result_data: JobSummary | null;
}
export interface JobResult {
    job_id: string;
    repo_url: string;
    repo_name: string;
    status: string;
    summary: JobSummary;
    files: FileItem[];
    hierarchy?: HierarchyNode;
}
export interface HierarchyNode {
    id?: string;
    name: string;
    path?: string;
    extension?: string | null;
    isDirectory?: boolean;
    size?: number;
    depth?: number;
    github_url?: string;
    children?: HierarchyNode[];
}
export interface CodebaseVisualizerProps {
    apiBaseUrl?: string;
    onFileSelect?: (file: FileItem) => void;
    onDirectorySelect?: (directory: FileItem) => void;
    theme?: 'light' | 'dark';
    defaultRepoUrl?: string;
    showGitHubLinks?: boolean;
    maxDepth?: number;
    className?: string;
    viewMode?: 'tree' | 'graph';
}
export interface FileExplorerProps {
    files: FileItem[];
    hierarchy?: HierarchyNode;
    onFileSelect?: (file: FileItem) => void;
    onDirectorySelect?: (directory: FileItem) => void;
    showGitHubLinks?: boolean;
    maxDepth?: number;
    className?: string;
}
