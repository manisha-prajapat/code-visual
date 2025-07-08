# 🌳 Codebase Visualizer

A powerful tool for analyzing and visualizing GitHub repository structures. This project consists of a Node.js worker service that processes repositories and generates structured JSON data perfect for creating codebase visualizations and graphs.

## 🚀 Features

- **Repository Processing**: Clone and analyze any public GitHub repository
- **File Structure Analysis**: Recursively process directories and extract metadata
- **SQLite Database**: Store processing results with proper relationships
- **RESTful API**: Clean HTTP endpoints for job management
- **Real-time Status**: Track processing progress with job status updates
- **Multiple Formats**: Get results in flat or hierarchical formats
- **Rich Metadata**: File sizes, extensions, parent-child relationships, and depth levels
- **Web Interface**: Beautiful frontend for easy interaction

## 📁 Project Structure

```
visual/
├── worker/              # Node.js backend service
│   ├── server.js        # Main Express server
│   ├── database.js      # SQLite database operations
│   ├── repoProcessor.js # Repository cloning and processing
│   ├── package.json     # Dependencies
│   └── README.md        # Worker documentation
├── frontend/            # Web interface
│   └── index.html       # Simple HTML frontend
└── README.md           # This file
```

## 🛠️ Quick Start

### 1. Start the Worker Service

```bash
cd worker
npm install
npm start
```

The worker service will start on `http://localhost:3001`

### 2. Open the Frontend

Open `frontend/index.html` in your browser or serve it via a local server:

```bash
cd frontend
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### 3. Process a Repository

Either use the web interface or make API calls directly:

```bash
# Start processing
curl -X POST http://localhost:3001/process \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/user/repository"}'

# Check status
curl http://localhost:3001/status/JOB_ID

# Get results
curl http://localhost:3001/result/JOB_ID?format=hierarchical
```

## 📊 Data Structure

Each file/directory is represented with comprehensive metadata:

```json
{
  "id": "unique-uuid",
  "job_id": "job-uuid", 
  "file_path": "src/components/Button.tsx",
  "file_name": "Button.tsx",
  "extension": "tsx",
  "parent_folder_id": "parent-uuid",
  "is_directory": false,
  "depth": 2,
  "size": 1024
}
```

## 🎯 Use Cases

- **Code Analysis**: Understand repository structure and complexity
- **Documentation**: Generate architectural diagrams and documentation
- **Project Planning**: Analyze codebase size and organization
- **Migration Planning**: Understand dependencies and file relationships
- **Learning**: Explore how popular projects are structured

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/process` | Start processing a repository |
| GET | `/status/:jobId` | Get job processing status |
| GET | `/result/:jobId` | Get complete file structure |
| GET | `/jobs` | List all processing jobs |
| DELETE | `/job/:jobId` | Delete a job and its data |
| GET | `/health` | Service health check |

## 📈 Example Output

### Summary Statistics
```json
{
  "total_files": 1026,
  "total_directories": 233,
  "total_regular_files": 793,
  "max_depth": 5,
  "repo_name": "vscode-extension-samples",
  "processed_at": "2025-07-08T06:15:30.343Z"
}
```

### Hierarchical Structure
```json
{
  "name": "root",
  "children": [
    {
      "id": "uuid",
      "name": "src",
      "isDirectory": true,
      "children": [
        {
          "id": "uuid",
          "name": "index.js", 
          "extension": "js",
          "size": 1024,
          "isDirectory": false
        }
      ]
    }
  ]
}
```

## 🔮 Future Enhancements

- **Private Repository Support**: OAuth integration for private repos
- **Advanced Visualizations**: Interactive tree maps, force-directed graphs
- **Code Metrics**: Lines of code, complexity analysis
- **Language Detection**: Automatic programming language identification
- **Export Options**: Generate reports in various formats (PDF, CSV)
- **Caching**: Improve performance with intelligent caching
- **Real-time Updates**: WebSocket support for live progress updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with Node.js, Express, and SQLite
- Uses simple-git for repository cloning
- Inspired by the need for better codebase visualization tools 