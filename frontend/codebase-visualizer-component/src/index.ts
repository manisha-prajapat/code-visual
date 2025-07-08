// CSS imports - must be first
import './components/CodebaseVisualizer.css';
import './components/FileExplorer.css';

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