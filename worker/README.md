# Codebase Visualizer Worker

A Node.js service that processes GitHub repositories and generates structured data for codebase visualization. The worker clones repositories, analyzes their file structure, and stores the results in a SQLite database.

## Features

- **Repository Processing**: Clone and analyze GitHub repositories
- **File Structure Analysis**: Recursively process directories and files
- **Database Storage**: Store results in SQLite with proper relationships
- **Job Management**: Track processing status and manage multiple jobs
- **RESTful API**: Clean HTTP endpoints for interaction
- **Hierarchical Data**: Generate both flat and hierarchical file structures
- **Error Handling**: Comprehensive error handling and logging

## Installation

1. Navigate to the worker directory:
```bash
cd worker
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /process
Start processing a GitHub repository.

**Request Body:**
```json
{
  "repo_url": "https://github.com/user/repository",
  "repo_name": "optional-custom-name"
}
```

**Response:**
```json
{
  "message": "Repository processing started",
  "job_id": "uuid-job-id",
  "repo_url": "https://github.com/user/repository",
  "repo_name": "repository",
  "status": "pending",
  "status_url": "/status/uuid-job-id"
}
```

### GET /status/:jobId
Get the current status of a processing job.

**Response:**
```json
{
  "job_id": "uuid-job-id",
  "repo_url": "https://github.com/user/repository",
  "repo_name": "repository",
  "status": "completed",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:01:00.000Z",
  "error_message": null,
  "result_data": {
    "total_files": 150,
    "total_directories": 25,
    "total_regular_files": 125,
    "max_depth": 5,
    "repo_name": "repository",
    "processed_at": "2024-01-01T00:01:00.000Z"
  }
}
```

### GET /result/:jobId
Get the complete file structure for a completed job.

**Query Parameters:**
- `format`: `flat` (default) or `hierarchical`

**Response:**
```json
{
  "job_id": "uuid-job-id",
  "repo_url": "https://github.com/user/repository",
  "repo_name": "repository",
  "status": "completed",
  "summary": {
    "total_files": 150,
    "total_directories": 25,
    "total_regular_files": 125,
    "max_depth": 5,
    "repo_name": "repository",
    "processed_at": "2024-01-01T00:01:00.000Z"
  },
  "files": [
    {
      "id": "file-uuid",
      "job_id": "uuid-job-id",
      "file_path": "/path/to/file.js",
      "file_name": "file.js",
      "extension": "js",
      "parent_folder_id": "parent-uuid",
      "is_directory": false,
      "depth": 2,
      "size": 1024
    }
  ]
}
```

### GET /jobs
Get all processing jobs.

**Response:**
```json
{
  "jobs": [
    {
      "id": "uuid-job-id",
      "repo_url": "https://github.com/user/repository",
      "repo_name": "repository",
      "status": "completed",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:01:00.000Z",
      "error_message": null,
      "result_data": {...}
    }
  ],
  "total": 1
}
```

### DELETE /job/:jobId
Delete a job and all its associated files.

**Response:**
```json
{
  "message": "Job deleted successfully",
  "job_id": "uuid-job-id"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "active_jobs": 2
}
```

## Data Structure

### File Object
Each file/directory is represented with the following structure:

```json
{
  "id": "unique-uuid",
  "job_id": "job-uuid",
  "file_path": "relative/path/to/file.js",
  "file_name": "file.js",
  "extension": "js",
  "parent_folder_id": "parent-folder-uuid",
  "is_directory": false,
  "depth": 2,
  "size": 1024
}
```

### Job Statuses
- `pending`: Job created but not started
- `processing`: Currently cloning and analyzing repository
- `completed`: Successfully processed
- `failed`: Processing failed with error

## Database Schema

### Jobs Table
- `id`: Primary key (UUID)
- `repo_url`: GitHub repository URL
- `repo_name`: Repository name
- `status`: Current job status
- `created_at`: Job creation timestamp
- `updated_at`: Last update timestamp
- `error_message`: Error details if failed
- `result_data`: JSON summary of results

### Files Table
- `id`: Primary key (UUID)
- `job_id`: Foreign key to jobs table
- `file_path`: Full file path
- `file_name`: File/directory name
- `extension`: File extension (null for directories)
- `parent_folder_id`: Parent directory ID
- `is_directory`: Boolean flag
- `depth`: Directory depth level
- `size`: File size in bytes

## Configuration

### Environment Variables
- `PORT`: Server port (default: 3001)

### Ignored Files/Directories
The processor automatically skips:
- Hidden files/directories (starting with `.`)
- `node_modules` directories
- `__pycache__` directories

## Error Handling

The service includes comprehensive error handling:
- Invalid GitHub URLs are rejected
- Repository cloning failures are captured
- File processing errors are logged
- Database errors are handled gracefully
- Jobs are marked as failed with error details

## Development

### Project Structure
```
worker/
├── server.js          # Main Express server
├── database.js        # SQLite database operations
├── repoProcessor.js   # Repository cloning and processing
├── package.json       # Dependencies and scripts
├── README.md         # This file
├── temp/             # Temporary directory for cloning
└── codebase.db       # SQLite database file
```

### Adding New Features
1. Extend the database schema in `database.js`
2. Add processing logic in `repoProcessor.js`
3. Create new endpoints in `server.js`
4. Update this README

## Testing

Example curl commands:

```bash
# Start processing a repository
curl -X POST http://localhost:3001/process \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/user/repository"}'

# Check job status
curl http://localhost:3001/status/job-id

# Get results
curl http://localhost:3001/result/job-id?format=hierarchical

# Health check
curl http://localhost:3001/health
```

## License

MIT License 