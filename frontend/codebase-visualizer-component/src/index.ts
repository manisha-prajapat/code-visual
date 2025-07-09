// CSS imports - must be first
import './components/CodebaseVisualizer.css';
import './components/FileExplorer.css';
import './components/CodebaseGraph.css';

// Main components
export { CodebaseVisualizer } from './components/CodebaseVisualizer';
export { FileExplorer } from './components/FileExplorer';
export { CodebaseGraph } from './components/CodebaseGraph';

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

// Component-specific props types
export type { CodebaseGraphProps } from './components/CodebaseGraph';

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