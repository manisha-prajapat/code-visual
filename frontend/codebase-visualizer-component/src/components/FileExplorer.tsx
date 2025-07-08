import * as React from 'react';
const { useState, useMemo, useCallback } = React;
import { FileItem, FileExplorerProps, HierarchyNode } from '../types';
import { 
  formatFileSize, 
  getFileIcon, 
  sortFiles, 
  filterFilesByDepth, 
  getFileStats, 
  searchFiles 
} from '../utils';
import './FileExplorer.css';

interface FileTreeItemProps {
  item: HierarchyNode;
  depth: number;
  onFileSelect?: (file: FileItem) => void;
  onDirectorySelect?: (directory: FileItem) => void;
  showGitHubLinks?: boolean;
  fileData: Record<string, FileItem>;
  expandedItems: Set<string>;
  onToggleExpand: (path: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  item,
  depth,
  onFileSelect,
  onDirectorySelect,
  showGitHubLinks = true,
  fileData,
  expandedItems,
  onToggleExpand
}) => {
  const fileItem = fileData[item.path || ''];
  const isExpanded = expandedItems.has(item.path || '');
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = useCallback(() => {
    if (item.isDirectory) {
      if (hasChildren) {
        onToggleExpand(item.path || '');
      }
      if (onDirectorySelect && fileItem) {
        onDirectorySelect(fileItem);
      }
    } else {
      if (onFileSelect && fileItem) {
        onFileSelect(fileItem);
      }
    }
  }, [item, fileItem, hasChildren, onToggleExpand, onFileSelect, onDirectorySelect]);

  const indentStyle = {
    marginLeft: `${depth * 20}px`
  };

  return (
    <>
      <div 
        className={`file-item ${item.isDirectory ? 'directory' : ''}`}
        onClick={handleClick}
        style={indentStyle}
      >
        {hasChildren && (
          <button
            className={`file-item-expand ${isExpanded ? 'expanded' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(item.path || '');
            }}
          >
            ▶
          </button>
        )}
        {!hasChildren && <div className="file-item-depth" />}
        
        <span className="file-item-icon">
          {getFileIcon(item.extension || null, item.isDirectory)}
        </span>
        
        <span className="file-item-name" title={item.name}>
          {item.name}
        </span>
        
        {!item.isDirectory && item.size !== undefined && (
          <span className="file-item-size">
            {formatFileSize(item.size)}
          </span>
        )}
        
        {showGitHubLinks && item.github_url && (
          <a
            href={item.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="file-item-github-link"
            onClick={(e) => e.stopPropagation()}
            title="View on GitHub"
          >
            🔗
          </a>
        )}
      </div>
      
      {isExpanded && hasChildren && (
        <>
          {item.children?.map((child, index) => (
            <FileTreeItem
              key={`${child.path || child.name}-${index}`}
              item={child}
              depth={depth + 1}
              onFileSelect={onFileSelect}
              onDirectorySelect={onDirectorySelect}
              showGitHubLinks={showGitHubLinks}
              fileData={fileData}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </>
      )}
    </>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  hierarchy,
  onFileSelect,
  onDirectorySelect,
  showGitHubLinks = true,
  maxDepth,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Process files for display
  const processedFiles = useMemo(() => {
    let result = files;
    
    if (maxDepth !== undefined) {
      result = filterFilesByDepth(result, maxDepth);
    }
    
    if (searchQuery) {
      result = searchFiles(result, searchQuery);
    }
    
    return sortFiles(result);
  }, [files, maxDepth, searchQuery]);

  // Create file data lookup for tree rendering
  const fileDataLookup = useMemo(() => {
    return files.reduce((acc, file) => {
      acc[file.file_path] = file;
      return acc;
    }, {} as Record<string, FileItem>);
  }, [files]);

  // Get file statistics
  const stats = useMemo(() => getFileStats(processedFiles), [processedFiles]);

  const handleToggleExpand = useCallback((path: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  // Render flat list if no hierarchy is provided
  const renderFlatList = () => (
    <div className="file-tree">
      {processedFiles.map((file) => (
        <div
          key={file.id}
          className={`file-item ${file.is_directory ? 'directory' : ''}`}
          onClick={() => {
            if (file.is_directory) {
              onDirectorySelect?.(file);
            } else {
              onFileSelect?.(file);
            }
          }}
        >
          <div className="file-item-depth" style={{ width: `${file.depth * 20}px` }} />
          
          <span className="file-item-icon">
            {getFileIcon(file.extension, file.is_directory)}
          </span>
          
          <span className="file-item-name" title={file.file_name}>
            {file.file_name}
          </span>
          
          {!file.is_directory && (
            <span className="file-item-size">
              {formatFileSize(file.size)}
            </span>
          )}
          
          {showGitHubLinks && file.github_url && (
            <a
              href={file.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="file-item-github-link"
              onClick={(e) => e.stopPropagation()}
              title="View on GitHub"
            >
              🔗
            </a>
          )}
        </div>
      ))}
    </div>
  );

  // Render hierarchical tree if hierarchy is provided
  const renderTree = () => {
    if (!hierarchy || !hierarchy.children) {
      return renderFlatList();
    }

    return (
      <div className="file-tree">
        {hierarchy.children.map((child, index) => (
          <FileTreeItem
            key={`${child.path || child.name}-${index}`}
            item={child}
            depth={0}
            onFileSelect={onFileSelect}
            onDirectorySelect={onDirectorySelect}
            showGitHubLinks={showGitHubLinks}
            fileData={fileDataLookup}
            expandedItems={expandedItems}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>
    );
  };

  if (files.length === 0) {
    return (
      <div className={`file-explorer ${className}`}>
        <div className="file-explorer-empty">
          No files to display
        </div>
      </div>
    );
  }

  return (
    <div className={`file-explorer ${className}`}>
      <div className="file-explorer-header">
        <h3 className="file-explorer-title">File Explorer</h3>
        <div className="file-explorer-stats">
          <span>{stats.totalFiles} files</span>
          <span>{stats.totalDirectories} folders</span>
          <span>{formatFileSize(stats.totalSize)}</span>
        </div>
      </div>
      
      <div className="file-explorer-search">
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="file-explorer-content">
        {processedFiles.length === 0 ? (
          <div className="file-explorer-empty">
            No files match your search
          </div>
        ) : (
          renderTree()
        )}
      </div>
    </div>
  );
}; 