// Main components
export { CodebaseVisualizer } from './components/CodebaseVisualizer';
export { FileExplorer } from './components/FileExplorer';

// API client
export { CodebaseVisualizerAPI } from './api';

// Types
export type {
  FileItem,
  JobSummary,
  Job,
  JobResult,
  HierarchyNode,
  CodebaseVisualizerProps,
  FileExplorerProps
} from './types';

// Utilities
export {
  formatFileSize,
  getFileIcon,
  truncateText,
  sortFiles,
  filterFilesByDepth,
  groupFilesByParent,
  getFileStats,
  searchFiles,
  getLanguageFromExtension
} from './utils';

// CSS files are automatically handled by the build process
// import './components/CodebaseVisualizer.css';
// import './components/FileExplorer.css';