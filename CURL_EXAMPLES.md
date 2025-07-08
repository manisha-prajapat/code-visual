# 🚀 Codebase Visualizer - API Examples

Here are comprehensive curl examples to test the Codebase Visualizer worker service with the new relative path and GitHub URL features.

## Prerequisites

Make sure the worker service is running:
```bash
cd worker
PORT=3000 node server.js
```

## 1. Health Check
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-08T15:33:15.857Z",
  "active_jobs": 0
}
```

## 2. Process a Repository
```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/octocat/Hello-World"}'
```

**Expected Response:**
```json
{
  "message": "Repository processing started",
  "job_id": "e99dbaa0-f29c-4777-a04c-3a1ac88e8b60",
  "repo_url": "https://github.com/octocat/Hello-World",
  "repo_name": "Hello-World",
  "status": "pending",
  "status_url": "/status/e99dbaa0-f29c-4777-a04c-3a1ac88e8b60"
}
```

## 3. Check Job Status
```bash
curl http://localhost:3000/status/YOUR_JOB_ID
```

**Expected Response:**
```json
{
  "job_id": "e99dbaa0-f29c-4777-a04c-3a1ac88e8b60",
  "repo_url": "https://github.com/octocat/Hello-World",
  "repo_name": "Hello-World",
  "status": "completed",
  "created_at": "2025-07-08 15:33:20",
  "updated_at": "2025-07-08 15:33:22",
  "error_message": null,
  "result_data": {
    "total_files": 1,
    "total_directories": 0,
    "total_regular_files": 1,
    "max_depth": 0,
    "repo_name": "Hello-World",
    "processed_at": "2025-07-08T15:33:22.000Z"
  }
}
```

## 4. Get Results (Flat Format with GitHub URLs)
```bash
curl "http://localhost:3000/result/YOUR_JOB_ID"
```

**Expected Response:**
```json
{
  "job_id": "e99dbaa0-f29c-4777-a04c-3a1ac88e8b60",
  "repo_url": "https://github.com/octocat/Hello-World",
  "repo_name": "Hello-World",
  "status": "completed",
  "summary": {
    "total_files": 1,
    "total_directories": 0,
    "total_regular_files": 1,
    "max_depth": 0,
    "repo_name": "Hello-World",
    "processed_at": "2025-07-08T15:33:22.000Z"
  },
  "files": [
    {
      "id": "file-uuid",
      "job_id": "job-uuid",
      "file_path": "README",
      "file_name": "README",
      "extension": null,
      "parent_folder_id": null,
      "is_directory": false,
      "depth": 0,
      "size": 12,
      "github_url": "https://github.com/octocat/Hello-World/blob/main/README"
    }
  ]
}
```

## 5. Get Results (Hierarchical Format with GitHub URLs)
```bash
curl "http://localhost:3000/result/YOUR_JOB_ID?format=hierarchical"
```

**Features:**
- ✅ **Relative file paths** (no absolute system paths)
- ✅ **GitHub URLs** for direct linking to files and directories
- ✅ **File metadata** (size, extension, depth)
- ✅ **Parent-child relationships** for building visualizations

## 6. Test with More Complex Repository
```bash
# Process a repository with multiple files and directories
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/github/gitignore"}'

# Wait for processing to complete, then get results
curl "http://localhost:3000/result/YOUR_JOB_ID" | python3 -m json.tool
```

## 7. Formatted Output Examples

### Show file structure with relative paths:
```bash
curl -s "http://localhost:3000/result/YOUR_JOB_ID" | python3 -c "
import json
import sys
data = json.load(sys.stdin)
print('=== FILES WITH RELATIVE PATHS & GITHUB URLS ===')
for file in data['files'][:10]:
    print(f'📄 {file[\"file_name\"]}')
    print(f'   Path: {file[\"file_path\"]}')
    print(f'   GitHub: {file[\"github_url\"]}')
    print()
"
```

### Show hierarchical tree:
```bash
curl -s "http://localhost:3000/result/YOUR_JOB_ID?format=hierarchical" | python3 -c "
import json
import sys

def show_tree(node, indent=0, max_depth=3):
    if indent > max_depth:
        return
    prefix = '  ' * indent
    if 'children' in node and node['children']:
        github_url = node.get('github_url', '')
        print(f'{prefix}📁 {node[\"name\"]}/ -> {github_url}')
        for child in node['children'][:5]:
            show_tree(child, indent + 1, max_depth)
        if len(node['children']) > 5:
            print(f'{prefix}  ... and {len(node[\"children\"]) - 5} more items')
    elif 'name' in node:
        github_url = node.get('github_url', '')
        print(f'{prefix}📄 {node[\"name\"]} -> {github_url}')

data = json.load(sys.stdin)
show_tree(data['hierarchy'])
"
```

## 8. List All Jobs
```bash
curl http://localhost:3000/jobs | python3 -m json.tool
```

## 9. Delete a Job
```bash
curl -X DELETE http://localhost:3000/job/YOUR_JOB_ID
```

## Key Features Demonstrated

### ✅ Relative File Paths
- File paths are now relative to the repository root
- No more absolute system paths like `/Users/user/temp/...`
- Easy to work with and portable across systems

### ✅ GitHub URLs
- Direct links to files: `https://github.com/user/repo/blob/main/path/to/file.js`
- Direct links to directories: `https://github.com/user/repo/tree/main/path/to/dir`
- Ready for UI integration with clickable links

### ✅ Clean Data Structure
Perfect for building visualizations:
```json
{
  "file_path": "src/components/Button.tsx",
  "file_name": "Button.tsx",
  "extension": "tsx",
  "github_url": "https://github.com/user/repo/blob/main/src/components/Button.tsx",
  "parent_folder_id": "parent-uuid",
  "depth": 2,
  "size": 1024
}
```

## Example Workflow

```bash
# 1. Start processing
RESPONSE=$(curl -s -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/octocat/Hello-World"}')

# 2. Extract job ID
JOB_ID=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['job_id'])")

# 3. Wait and check status
sleep 3
curl -s http://localhost:3000/status/$JOB_ID | python3 -m json.tool

# 4. Get results with GitHub URLs
curl -s "http://localhost:3000/result/$JOB_ID" | python3 -m json.tool
``` 