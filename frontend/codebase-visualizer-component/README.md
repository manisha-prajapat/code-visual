# @codebase-visualizer/file-explorer

A React component library for visualizing codebase structure with a beautiful file explorer interface. This component integrates with the Codebase Visualizer API to provide stunning visualizations of GitHub repositories.

## Features

- 🌳 **Hierarchical File Explorer** - Navigate repository structure with an intuitive tree view
- 🔍 **Search & Filter** - Find files and directories quickly
- 🎨 **Beautiful UI** - Modern design with light/dark theme support
- 🔗 **GitHub Integration** - Direct links to files and directories on GitHub
- 📊 **File Statistics** - Display file counts, sizes, and repository metrics
- ⚡ **Performance** - Efficient rendering of large codebases
- 📱 **Responsive** - Works great on desktop and mobile devices
- 🎯 **TypeScript Support** - Fully typed for better development experience

## Installation

```bash
npm install @codebase-visualizer/file-explorer
```

## Quick Start

```typescript
import React from 'react';
import { CodebaseVisualizer, FileItem } from '@codebase-visualizer/file-explorer';

function App() {
  const handleFileSelect = (file: FileItem) => {
    console.log('Selected file:', file);
  };

  const handleDirectorySelect = (directory: FileItem) => {
    console.log('Selected directory:', directory);
  };

  return (
    <CodebaseVisualizer
      apiBaseUrl="http://localhost:3000"
      onFileSelect={handleFileSelect}
      onDirectorySelect={handleDirectorySelect}
      defaultRepoUrl="https://github.com/octocat/Hello-World"
      theme="light"
      showGitHubLinks={true}
    />
  );
}
```

## Components

### CodebaseVisualizer

The main component that provides repository processing and visualization.

```typescript
<CodebaseVisualizer
  apiBaseUrl="http://localhost:3000"
  onFileSelect={handleFileSelect}
  onDirectorySelect={handleDirectorySelect}
  theme="light"
  defaultRepoUrl="https://github.com/user/repo"
  showGitHubLinks={true}
  maxDepth={10}
  className="custom-class"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiBaseUrl` | `string` | `"http://localhost:3000"` | Base URL for the Codebase Visualizer API |
| `onFileSelect` | `(file: FileItem) => void` | `undefined` | Callback when a file is selected |
| `onDirectorySelect` | `(directory: FileItem) => void` | `undefined` | Callback when a directory is selected |
| `theme` | `"light" \| "dark"` | `"light"` | UI theme |
| `defaultRepoUrl` | `string` | `""` | Default repository URL to load |
| `showGitHubLinks` | `boolean` | `true` | Show GitHub links for files and directories |
| `maxDepth` | `number` | `undefined` | Maximum depth to display in the tree |
| `className` | `string` | `""` | Additional CSS class |

### FileExplorer

A standalone file explorer component for displaying file structures.

```typescript
<FileExplorer
  files={files}
  hierarchy={hierarchy}
  onFileSelect={handleFileSelect}
  onDirectorySelect={handleDirectorySelect}
  showGitHubLinks={true}
  maxDepth={5}
  className="dark"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `FileItem[]` | `[]` | Array of file items to display |
| `hierarchy` | `HierarchyNode` | `undefined` | Hierarchical structure (optional) |
| `onFileSelect` | `(file: FileItem) => void` | `undefined` | Callback when a file is selected |
| `onDirectorySelect` | `(directory: FileItem) => void` | `undefined` | Callback when a directory is selected |
| `showGitHubLinks` | `boolean` | `true` | Show GitHub links |
| `maxDepth` | `number` | `undefined` | Maximum depth to display |
| `className` | `string` | `""` | Additional CSS class |

## API Client

### CodebaseVisualizerAPI

A client for interacting with the Codebase Visualizer API.

```typescript
import { CodebaseVisualizerAPI } from '@codebase-visualizer/file-explorer';

const api = new CodebaseVisualizerAPI('http://localhost:3000');

// Process a repository
const job = await api.processRepository('https://github.com/user/repo');

// Poll for completion
const completedJob = await api.pollJobUntilComplete(job.job_id);

// Get results
const result = await api.getJobResult(job.job_id, 'hierarchical');
```

#### Methods

- `processRepository(repoUrl: string, repoName?: string): Promise<Job>`
- `getJobStatus(jobId: string): Promise<Job>`
- `getJobResult(jobId: string, format?: 'flat' | 'hierarchical'): Promise<JobResult>`
- `getAllJobs(): Promise<{jobs: Job[], total: number}>`
- `deleteJob(jobId: string): Promise<{message: string, job_id: string}>`
- `healthCheck(): Promise<{status: string, timestamp: string, active_jobs: number}>`
- `pollJobUntilComplete(jobId: string, onProgress?: (job: Job) => void): Promise<Job>`

## Types

### FileItem

```typescript
interface FileItem {
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
```

### Job

```typescript
interface Job {
  job_id: string;
  repo_url: string;
  repo_name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  error_message: string | null;
  result_data: JobSummary | null;
}
```

### JobResult

```typescript
interface JobResult {
  job_id: string;
  repo_url: string;
  repo_name: string;
  status: string;
  summary: JobSummary;
  files: FileItem[];
  hierarchy?: HierarchyNode;
}
```

## Utilities

The package exports several utility functions for working with file data:

- `formatFileSize(bytes: number): string` - Format file size in human-readable format
- `getFileIcon(extension: string | null, isDirectory: boolean): string` - Get emoji icon for file type
- `sortFiles(files: FileItem[]): FileItem[]` - Sort files with directories first
- `searchFiles(files: FileItem[], query: string): FileItem[]` - Filter files by search query
- `getFileStats(files: FileItem[])` - Calculate file statistics

## Styling

The components come with built-in CSS that can be customized. The styles are automatically imported when you use the components.

### Custom Theming

You can override the default styles by providing your own CSS:

```css
.file-explorer.custom-theme {
  --primary-color: #your-color;
  --background-color: #your-bg;
  /* ... other custom properties */
}
```

### Dark Mode

Both components support dark mode through the `theme` prop or `dark` className:

```typescript
<CodebaseVisualizer theme="dark" />
<FileExplorer className="dark" />
```

## Backend Requirements

This component requires the Codebase Visualizer API backend to be running. The backend provides:

- Repository processing and cloning
- File structure analysis
- SQLite database for storage
- RESTful API endpoints

See the main project repository for backend setup instructions.

## Development

### Building the Package

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## Examples

### Basic Usage with Error Handling

```typescript
import React, { useState } from 'react';
import { CodebaseVisualizer, FileItem } from '@codebase-visualizer/file-explorer';

function MyApp() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    // Open file in editor, show preview, etc.
  };

  const handleError = (error: string) => {
    console.error('Visualization error:', error);
    // Show user-friendly error message
  };

  return (
    <div>
      <CodebaseVisualizer
        apiBaseUrl={process.env.REACT_APP_API_URL || 'http://localhost:3000'}
        onFileSelect={handleFileSelect}
        theme="light"
        showGitHubLinks={true}
      />
      
      {selectedFile && (
        <div>
          <h3>Selected: {selectedFile.file_name}</h3>
          <p>Path: {selectedFile.file_path}</p>
          <p>Size: {selectedFile.size} bytes</p>
        </div>
      )}
    </div>
  );
}
```

### Standalone File Explorer

```typescript
import React from 'react';
import { FileExplorer, FileItem } from '@codebase-visualizer/file-explorer';

function MyFileExplorer({ files }: { files: FileItem[] }) {
  return (
    <FileExplorer
      files={files}
      onFileSelect={(file) => console.log('File:', file.file_name)}
      onDirectorySelect={(dir) => console.log('Directory:', dir.file_name)}
      maxDepth={3}
      className="my-custom-explorer"
    />
  );
}
```

## License

MIT

## Contributing

Contributions are welcome! Please see the main project repository for contribution guidelines.

## Support

For issues and questions, please use the GitHub issues page of the main project repository. 