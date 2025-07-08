import React, { useState } from 'react';
import { CodebaseVisualizer, FileItem } from '@codebase-visualizer/file-explorer';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedDirectory, setSelectedDirectory] = useState<FileItem | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    console.log('Selected file:', file);
  };

  const handleDirectorySelect = (directory: FileItem) => {
    setSelectedDirectory(directory);
    console.log('Selected directory:', directory);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <div className="header-content">
          <h1>🌳 Codebase Visualizer</h1>
          <p>Explore and visualize any GitHub repository structure</p>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </header>

      <main className="App-main">
        <CodebaseVisualizer
          apiBaseUrl="http://localhost:3001"
          onFileSelect={handleFileSelect}
          onDirectorySelect={handleDirectorySelect}
          theme={theme}
          defaultRepoUrl="https://github.com/octocat/Hello-World"
          showGitHubLinks={true}
          maxDepth={10}
        />

        {(selectedFile || selectedDirectory) && (
          <div className="selection-info">
            <h3>Selection Details</h3>
            {selectedFile && (
              <div className="file-details">
                <h4>📄 Selected File</h4>
                <div className="details-grid">
                  <span><strong>Name:</strong> {selectedFile.file_name}</span>
                  <span><strong>Path:</strong> {selectedFile.file_path}</span>
                  <span><strong>Extension:</strong> {selectedFile.extension || 'none'}</span>
                  <span><strong>Size:</strong> {selectedFile.size} bytes</span>
                  <span><strong>Depth:</strong> {selectedFile.depth}</span>
                  {selectedFile.github_url && (
                    <a 
                      href={selectedFile.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="github-link"
                    >
                      🔗 View on GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
            {selectedDirectory && (
              <div className="directory-details">
                <h4>📁 Selected Directory</h4>
                <div className="details-grid">
                  <span><strong>Name:</strong> {selectedDirectory.file_name}</span>
                  <span><strong>Path:</strong> {selectedDirectory.file_path}</span>
                  <span><strong>Depth:</strong> {selectedDirectory.depth}</span>
                  {selectedDirectory.github_url && (
                    <a 
                      href={selectedDirectory.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="github-link"
                    >
                      🔗 View on GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>
          Built with ❤️ using our custom{' '}
          <code>@codebase-visualizer/file-explorer</code> component
        </p>
        <p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            Try it with any public GitHub repository!
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
