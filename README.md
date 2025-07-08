# 🌳 Codebase Visualizer

A comprehensive tool for visualizing and exploring GitHub repository structures with a beautiful, interactive interface. This project consists of a backend worker service and reusable React components packaged as an npm module.

## 🚀 Features

- **🔍 Repository Analysis** - Clone and analyze any public GitHub repository
- **🌳 Interactive File Explorer** - Beautiful hierarchical view with search and filtering
- **🔗 GitHub Integration** - Direct links to files and directories on GitHub
- **📊 Detailed Metrics** - File counts, sizes, depths, and repository statistics
- **🎨 Modern UI** - Responsive design with light/dark theme support
- **⚡ Real-time Processing** - Live updates during repository analysis
- **📦 Reusable Components** - NPM package for easy integration into other projects
- **🗄️ Persistent Storage** - SQLite database for processed repositories

## 🏗️ Architecture

### Backend Worker Service (`/worker`)
- **Express.js API** - RESTful endpoints for repository processing
- **Repository Processor** - Clones and analyzes GitHub repositories
- **SQLite Database** - Stores jobs, files, and metadata
- **Real-time Status** - WebSocket-like polling for job progress

### Frontend NPM Module (`/frontend/codebase-visualizer-component`)
- **React Components** - `CodebaseVisualizer` and `FileExplorer`
- **TypeScript Support** - Fully typed for better DX
- **API Client** - Built-in client for backend communication
- **Utility Functions** - File handling, formatting, and search utilities

### Demo React App (`/frontend/codebase-visualizer-app`)
- **Complete Demo** - Shows how to use the npm module
- **Theme Switching** - Light/dark mode toggle
- **File Selection** - Interactive file and directory selection
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Installation & Setup

### 1. Backend Worker Service

```bash
# Navigate to worker directory
cd worker

# Install dependencies
npm install

# Start the server (development)
npm run dev

# Or start in production
npm start
```

The API will be available at `http://localhost:3001`

### 2. NPM Module Development

```bash
# Navigate to component directory
cd frontend/codebase-visualizer-component

# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes (development)
npm run dev
```

### 3. Demo React App

```bash
# Navigate to React app directory
cd frontend/codebase-visualizer-app

# Install dependencies (including local npm module)
npm install

# Start development server
npm start
```

The demo app will be available at `http://localhost:3000`

## 📦 Using the NPM Module

### Installation

```bash
npm install @codebase-visualizer/file-explorer
```

### Basic Usage

```typescript
import React from 'react';
import { CodebaseVisualizer, FileItem } from '@codebase-visualizer/file-explorer';

function App() {
  const handleFileSelect = (file: FileItem) => {
    console.log('Selected file:', file);
  };

  return (
    <CodebaseVisualizer
      apiBaseUrl="http://localhost:3001"
      onFileSelect={handleFileSelect}
      defaultRepoUrl="https://github.com/octocat/Hello-World"
      theme="light"
      showGitHubLinks={true}
    />
  );
}
```

### Standalone File Explorer

```typescript
import { FileExplorer } from '@codebase-visualizer/file-explorer';

<FileExplorer
  files={files}
  hierarchy={hierarchy}
  onFileSelect={handleFileSelect}
  showGitHubLinks={true}
  maxDepth={5}
/>
```

## 🔌 API Reference

### Worker Service Endpoints

- `POST /process` - Start processing a repository
- `GET /status/:jobId` - Get job status
- `GET /result/:jobId` - Get processed results
- `GET /jobs` - List all jobs
- `DELETE /job/:jobId` - Delete a job
- `GET /health` - Health check

### Example API Usage

```bash
# Process a repository
curl -X POST http://localhost:3001/process \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/octocat/Hello-World"}'

# Get job status
curl http://localhost:3001/status/{job_id}

# Get results (hierarchical format)
curl http://localhost:3001/result/{job_id}?format=hierarchical
```

## 🎯 Data Structure

### FileItem Interface

```typescript
interface FileItem {
  id: string;
  job_id: string;
  file_path: string;        // Relative path from repo root
  file_name: string;
  extension: string | null;
  parent_folder_id: string | null;
  is_directory: boolean;
  depth: number;
  size: number;
  github_url: string;       // Direct GitHub link
}
```

### Job Status

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

## 🎨 Customization

### Theming

The components support light and dark themes:

```typescript
<CodebaseVisualizer theme="dark" />
<FileExplorer className="dark" />
```

### Custom Styling

Override default styles with CSS:

```css
.file-explorer.custom-theme {
  --primary-color: #your-color;
  --background-color: #your-bg;
}
```

## 🧪 Testing

### Test with Popular Repositories

```bash
# Small repository
curl -X POST http://localhost:3001/process \
  -d '{"repo_url": "https://github.com/octocat/Hello-World"}'

# Medium repository
curl -X POST http://localhost:3001/process \
  -d '{"repo_url": "https://github.com/github/gitignore"}'

# Large repository (be patient!)
curl -X POST http://localhost:3001/process \
  -d '{"repo_url": "https://github.com/microsoft/vscode-extension-samples"}'
```

## 📊 Example Output

When processing a repository, you'll get structured data like:

```json
{
  "job_id": "uuid-here",
  "repo_name": "Hello-World",
  "status": "completed",
  "summary": {
    "total_files": 5,
    "total_directories": 2,
    "total_regular_files": 3,
    "max_depth": 1
  },
  "files": [
    {
      "id": "file-uuid",
      "file_path": "README.md",
      "file_name": "README.md",
      "extension": "md",
      "is_directory": false,
      "depth": 0,
      "size": 1024,
      "github_url": "https://github.com/octocat/Hello-World/blob/main/README.md"
    }
  ],
  "hierarchy": {
    "name": "Hello-World",
    "children": [...]
  }
}
```

## 🔧 Development

### Project Structure

```
visual/
├── worker/                 # Backend API service
│   ├── server.js          # Express server
│   ├── database.js        # SQLite operations
│   ├── repoProcessor.js   # Repository analysis
│   └── package.json
├── frontend/
│   ├── codebase-visualizer-component/  # NPM module
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   └── package.json
│   └── codebase-visualizer-app/       # Demo React app
│       ├── src/
│       └── package.json
└── README.md
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Building for Production

```bash
# Build the npm module
cd frontend/codebase-visualizer-component
npm run build

# Build the React app
cd ../codebase-visualizer-app
npm run build

# The worker service runs directly from source
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**: Worker runs on 3001, React dev server on 3000
2. **CORS Issues**: Both services include CORS headers
3. **Large Repositories**: May take several minutes to process
4. **Memory Usage**: Large repos require sufficient RAM

### Debug Commands

```bash
# Check if services are running
lsof -i :3000 -i :3001

# Test worker API
curl http://localhost:3001/health

# View logs
# Worker logs appear in terminal
# React logs appear in browser console
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

- Open an issue for bugs or feature requests
- Check existing issues for solutions
- Review the API documentation in `/CURL_EXAMPLES.md`

## 🎯 Roadmap

- [ ] WebSocket real-time updates
- [ ] File content preview
- [ ] Repository comparison
- [ ] Export functionality
- [ ] Additional visualization types
- [ ] Performance optimizations
- [ ] Docker containerization

## ⭐ Show Your Support

If you find this project useful, please consider giving it a star on GitHub! 