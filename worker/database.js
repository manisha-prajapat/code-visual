const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const dbPath = path.join(__dirname, 'codebase.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    const createJobsTable = `
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        repo_url TEXT NOT NULL,
        repo_name TEXT NOT NULL,
        branch TEXT DEFAULT 'main',
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        error_message TEXT,
        result_data TEXT
      )
    `;

    const createFilesTable = `
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_name TEXT NOT NULL,
        extension TEXT,
        parent_folder_id TEXT,
        is_directory BOOLEAN DEFAULT FALSE,
        depth INTEGER DEFAULT 0,
        size INTEGER DEFAULT 0,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
      )
    `;

    this.db.run(createJobsTable, (err) => {
      if (err) {
        console.error('Error creating jobs table:', err);
      } else {
        console.log('Jobs table created or already exists');
      }
    });

    this.db.run(createFilesTable, (err) => {
      if (err) {
        console.error('Error creating files table:', err);
      } else {
        console.log('Files table created or already exists');
      }
    });
  }

  // Job operations
  createJob(jobData) {
    return new Promise((resolve, reject) => {
      const { id, repo_url, repo_name } = jobData;
      const query = `
        INSERT INTO jobs (id, repo_url, repo_name, status)
        VALUES (?, ?, ?, 'pending')
      `;
      
      this.db.run(query, [id, repo_url, repo_name], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, repo_url, repo_name, status: 'pending' });
        }
      });
    });
  }

  updateJobStatus(jobId, status, errorMessage = null, resultData = null) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE jobs 
        SET status = ?, error_message = ?, result_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      this.db.run(query, [status, errorMessage, resultData, jobId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ jobId, status, errorMessage, resultData });
        }
      });
    });
  }

  getJob(jobId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM jobs WHERE id = ?`;
      
      this.db.get(query, [jobId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  getAllJobs() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM jobs ORDER BY created_at DESC`;
      
      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // File operations
  insertFile(fileData) {
    return new Promise((resolve, reject) => {
      const { id, job_id, file_path, file_name, extension, parent_folder_id, is_directory, depth, size } = fileData;
      const query = `
        INSERT INTO files (id, job_id, file_path, file_name, extension, parent_folder_id, is_directory, depth, size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(query, [id, job_id, file_path, file_name, extension, parent_folder_id, is_directory, depth, size], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...fileData });
        }
      });
    });
  }

  getFilesByJobId(jobId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM files WHERE job_id = ? ORDER BY file_path`;
      
      this.db.all(query, [jobId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  deleteJobFiles(jobId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM files WHERE job_id = ?`;
      
      this.db.run(query, [jobId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deletedCount: this.changes });
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = Database; 