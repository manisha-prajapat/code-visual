import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useRef, useState as useState$2, useEffect, useCallback as useCallback$2 } from 'react';
import * as d3 from 'd3';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var CodebaseVisualizerAPI = /** @class */ (function () {
    function CodebaseVisualizerAPI(baseUrl) {
        if (baseUrl === void 0) { baseUrl = 'http://localhost:3000'; }
        this.baseUrl = baseUrl;
    }
    CodebaseVisualizerAPI.prototype.processRepository = function (repoUrl, repoName) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/process"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                repo_url: repoUrl,
                                repo_name: repoName,
                            }),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw new Error(error.details || error.error || 'Failed to process repository');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    CodebaseVisualizerAPI.prototype.getJobStatus = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/status/").concat(jobId))];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw new Error(error.details || error.error || 'Failed to get job status');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    CodebaseVisualizerAPI.prototype.getJobResult = function (jobId_1) {
        return __awaiter(this, arguments, void 0, function (jobId, format) {
            var response, error;
            if (format === void 0) { format = 'hierarchical'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/result/").concat(jobId, "?format=").concat(format))];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw new Error(error.details || error.error || 'Failed to get job result');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    CodebaseVisualizerAPI.prototype.getAllJobs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/jobs"))];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw new Error(error.details || error.error || 'Failed to get jobs');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    CodebaseVisualizerAPI.prototype.deleteJob = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/job/").concat(jobId), {
                            method: 'DELETE',
                        })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        error = _a.sent();
                        throw new Error(error.details || error.error || 'Failed to delete job');
                    case 3: return [2 /*return*/, response.json()];
                }
            });
        });
    };
    CodebaseVisualizerAPI.prototype.healthCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/health"))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Health check failed');
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        });
    };
    // Utility function to poll job status until completion
    CodebaseVisualizerAPI.prototype.pollJobUntilComplete = function (jobId_1, onProgress_1) {
        return __awaiter(this, arguments, void 0, function (jobId, onProgress, pollInterval, maxAttempts) {
            var attempts, job;
            if (pollInterval === void 0) { pollInterval = 2000; }
            if (maxAttempts === void 0) { maxAttempts = 30; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempts = 0;
                        _a.label = 1;
                    case 1:
                        if (!(attempts < maxAttempts)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getJobStatus(jobId)];
                    case 2:
                        job = _a.sent();
                        if (onProgress) {
                            onProgress(job);
                        }
                        if (job.status === 'completed' || job.status === 'failed') {
                            return [2 /*return*/, job];
                        }
                        attempts++;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, pollInterval); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 4: throw new Error('Job polling timeout');
                }
            });
        });
    };
    return CodebaseVisualizerAPI;
}());

var formatFileSize = function (bytes) {
    if (bytes === 0)
        return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
var getFileIcon = function (extension, isDirectory) {
    if (isDirectory === void 0) { isDirectory = false; }
    if (isDirectory)
        return '📁';
    if (!extension)
        return '📄';
    var icons = {
        // JavaScript/TypeScript
        'js': '🟨',
        'jsx': '⚛️',
        'ts': '🔷',
        'tsx': '⚛️',
        'vue': '💚',
        'svelte': '🧡',
        // Web
        'html': '🌐',
        'htm': '🌐',
        'css': '🎨',
        'scss': '🎨',
        'sass': '🎨',
        'less': '🎨',
        // Programming Languages
        'py': '🐍',
        'java': '☕',
        'cpp': '⚙️',
        'c': '⚙️',
        'cs': '🔷',
        'php': '🐘',
        'rb': '💎',
        'go': '🐹',
        'rs': '🦀',
        'swift': '🐦',
        'kt': '🟪',
        'scala': '🔴',
        'clj': '🔵',
        // Data/Config
        'json': '📋',
        'xml': '📋',
        'yaml': '📋',
        'yml': '📋',
        'toml': '📋',
        'ini': '📋',
        'env': '🔧',
        'config': '🔧',
        // Documentation
        'md': '📝',
        'txt': '📄',
        'rtf': '📄',
        'pdf': '📕',
        'doc': '📘',
        'docx': '📘',
        // Images
        'png': '🖼️',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'gif': '🖼️',
        'svg': '🖼️',
        'webp': '🖼️',
        'ico': '🖼️',
        // Media
        'mp4': '🎬',
        'avi': '🎬',
        'mov': '🎬',
        'mp3': '🎵',
        'wav': '🎵',
        'flac': '🎵',
        // Archives
        'zip': '📦',
        'tar': '📦',
        'gz': '📦',
        'rar': '📦',
        '7z': '📦',
        // Shell/Scripts
        'sh': '💻',
        'bash': '💻',
        'zsh': '💻',
        'fish': '💻',
        'ps1': '💻',
        'bat': '💻',
        // Database
        'sql': '🗄️',
        'db': '🗄️',
        'sqlite': '🗄️',
        // Build/Config
        'dockerfile': '🐳',
        'makefile': '🔨',
        'gradle': '🐘',
        'maven': '📦',
        'npm': '📦',
        'yarn': '🧶',
        // Version Control
        'gitignore': '🙈',
        'gitattributes': '🔧',
    };
    var lowerExt = extension.toLowerCase();
    return icons[lowerExt] || '📄';
};
var truncateText = function (text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
};
var sortFiles = function (files) {
    return __spreadArray([], files, true).sort(function (a, b) {
        // Directories first
        if (a.is_directory && !b.is_directory)
            return -1;
        if (!a.is_directory && b.is_directory)
            return 1;
        // Then by name
        return a.file_name.localeCompare(b.file_name);
    });
};
var filterFilesByDepth = function (files, maxDepth) {
    return files.filter(function (file) { return file.depth <= maxDepth; });
};
var groupFilesByParent = function (files) {
    return files.reduce(function (groups, file) {
        var parentId = file.parent_folder_id || 'root';
        if (!groups[parentId]) {
            groups[parentId] = [];
        }
        groups[parentId].push(file);
        return groups;
    }, {});
};
var getFileStats = function (files) {
    var stats = {
        totalFiles: files.length,
        totalDirectories: 0,
        totalRegularFiles: 0,
        totalSize: 0,
        maxDepth: 0,
        fileExtensions: {},
    };
    files.forEach(function (file) {
        if (file.is_directory) {
            stats.totalDirectories++;
        }
        else {
            stats.totalRegularFiles++;
            stats.totalSize += file.size;
            if (file.extension) {
                stats.fileExtensions[file.extension] = (stats.fileExtensions[file.extension] || 0) + 1;
            }
        }
        stats.maxDepth = Math.max(stats.maxDepth, file.depth);
    });
    return stats;
};
var searchFiles = function (files, query) {
    var lowercaseQuery = query.toLowerCase();
    return files.filter(function (file) {
        return file.file_name.toLowerCase().includes(lowercaseQuery) ||
            file.file_path.toLowerCase().includes(lowercaseQuery);
    });
};
var getLanguageFromExtension = function (extension) {
    if (!extension)
        return 'text';
    var languageMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'cs': 'csharp',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'scala': 'scala',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'json': 'json',
        'xml': 'xml',
        'yaml': 'yaml',
        'yml': 'yaml',
        'md': 'markdown',
        'sql': 'sql',
        'sh': 'bash',
        'bash': 'bash',
        'zsh': 'bash',
    };
    return languageMap[extension.toLowerCase()] || 'text';
};

var useState$1 = React.useState, useMemo = React.useMemo, useCallback$1 = React.useCallback;
var FileTreeItem = function (_a) {
    var _b;
    var item = _a.item, depth = _a.depth, onFileSelect = _a.onFileSelect, onDirectorySelect = _a.onDirectorySelect, _c = _a.showGitHubLinks, showGitHubLinks = _c === void 0 ? true : _c, fileData = _a.fileData, expandedItems = _a.expandedItems, onToggleExpand = _a.onToggleExpand;
    var fileItem = fileData[item.path || ''];
    var isExpanded = expandedItems.has(item.path || '');
    var hasChildren = item.children && item.children.length > 0;
    var handleClick = useCallback$1(function () {
        if (item.isDirectory) {
            if (hasChildren) {
                onToggleExpand(item.path || '');
            }
            if (onDirectorySelect && fileItem) {
                onDirectorySelect(fileItem);
            }
        }
        else {
            if (onFileSelect && fileItem) {
                onFileSelect(fileItem);
            }
        }
    }, [item, fileItem, hasChildren, onToggleExpand, onFileSelect, onDirectorySelect]);
    var indentStyle = {
        marginLeft: "".concat(depth * 20, "px")
    };
    return (jsxs(Fragment, { children: [jsxs("div", { className: "file-item ".concat(item.isDirectory ? 'directory' : ''), onClick: handleClick, style: indentStyle, children: [hasChildren && (jsx("button", { className: "file-item-expand ".concat(isExpanded ? 'expanded' : ''), onClick: function (e) {
                            e.stopPropagation();
                            onToggleExpand(item.path || '');
                        }, children: "\u25B6" })), !hasChildren && jsx("div", { className: "file-item-depth" }), jsx("span", { className: "file-item-icon", children: getFileIcon(item.extension || null, item.isDirectory) }), jsx("span", { className: "file-item-name", title: item.name, children: item.name }), !item.isDirectory && item.size !== undefined && (jsx("span", { className: "file-item-size", children: formatFileSize(item.size) })), showGitHubLinks && item.github_url && (jsx("a", { href: item.github_url, target: "_blank", rel: "noopener noreferrer", className: "file-item-github-link", onClick: function (e) { return e.stopPropagation(); }, title: "View on GitHub", children: "\uD83D\uDD17" }))] }), isExpanded && hasChildren && (jsx(Fragment, { children: (_b = item.children) === null || _b === void 0 ? void 0 : _b.map(function (child, index) { return (jsx(FileTreeItem, { item: child, depth: depth + 1, onFileSelect: onFileSelect, onDirectorySelect: onDirectorySelect, showGitHubLinks: showGitHubLinks, fileData: fileData, expandedItems: expandedItems, onToggleExpand: onToggleExpand }, "".concat(child.path || child.name, "-").concat(index))); }) }))] }));
};
var FileExplorer = function (_a) {
    var files = _a.files, hierarchy = _a.hierarchy, onFileSelect = _a.onFileSelect, onDirectorySelect = _a.onDirectorySelect, _b = _a.showGitHubLinks, showGitHubLinks = _b === void 0 ? true : _b, maxDepth = _a.maxDepth, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = useState$1(''), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = useState$1(new Set()), expandedItems = _e[0], setExpandedItems = _e[1];
    // Process files for display
    var processedFiles = useMemo(function () {
        var result = files;
        if (maxDepth !== undefined) {
            result = filterFilesByDepth(result, maxDepth);
        }
        if (searchQuery) {
            result = searchFiles(result, searchQuery);
        }
        return sortFiles(result);
    }, [files, maxDepth, searchQuery]);
    // Create file data lookup for tree rendering
    var fileDataLookup = useMemo(function () {
        return files.reduce(function (acc, file) {
            acc[file.file_path] = file;
            return acc;
        }, {});
    }, [files]);
    // Get file statistics
    var stats = useMemo(function () { return getFileStats(processedFiles); }, [processedFiles]);
    var handleToggleExpand = useCallback$1(function (path) {
        setExpandedItems(function (prev) {
            var newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            }
            else {
                newSet.add(path);
            }
            return newSet;
        });
    }, []);
    // Render flat list if no hierarchy is provided
    var renderFlatList = function () { return (jsx("div", { className: "file-tree", children: processedFiles.map(function (file) { return (jsxs("div", { className: "file-item ".concat(file.is_directory ? 'directory' : ''), onClick: function () {
                if (file.is_directory) {
                    onDirectorySelect === null || onDirectorySelect === void 0 ? void 0 : onDirectorySelect(file);
                }
                else {
                    onFileSelect === null || onFileSelect === void 0 ? void 0 : onFileSelect(file);
                }
            }, children: [jsx("div", { className: "file-item-depth", style: { width: "".concat(file.depth * 20, "px") } }), jsx("span", { className: "file-item-icon", children: getFileIcon(file.extension, file.is_directory) }), jsx("span", { className: "file-item-name", title: file.file_name, children: file.file_name }), !file.is_directory && (jsx("span", { className: "file-item-size", children: formatFileSize(file.size) })), showGitHubLinks && file.github_url && (jsx("a", { href: file.github_url, target: "_blank", rel: "noopener noreferrer", className: "file-item-github-link", onClick: function (e) { return e.stopPropagation(); }, title: "View on GitHub", children: "\uD83D\uDD17" }))] }, file.id)); }) })); };
    // Render hierarchical tree if hierarchy is provided
    var renderTree = function () {
        if (!hierarchy || !hierarchy.children) {
            return renderFlatList();
        }
        return (jsx("div", { className: "file-tree", children: hierarchy.children.map(function (child, index) { return (jsx(FileTreeItem, { item: child, depth: 0, onFileSelect: onFileSelect, onDirectorySelect: onDirectorySelect, showGitHubLinks: showGitHubLinks, fileData: fileDataLookup, expandedItems: expandedItems, onToggleExpand: handleToggleExpand }, "".concat(child.path || child.name, "-").concat(index))); }) }));
    };
    if (files.length === 0) {
        return (jsx("div", { className: "file-explorer ".concat(className), children: jsx("div", { className: "file-explorer-empty", children: "No files to display" }) }));
    }
    return (jsxs("div", { className: "file-explorer ".concat(className), children: [jsxs("div", { className: "file-explorer-header", children: [jsx("h3", { className: "file-explorer-title", children: "File Explorer" }), jsxs("div", { className: "file-explorer-stats", children: [jsxs("span", { children: [stats.totalFiles, " files"] }), jsxs("span", { children: [stats.totalDirectories, " folders"] }), jsx("span", { children: formatFileSize(stats.totalSize) })] })] }), jsx("div", { className: "file-explorer-search", children: jsx("input", { type: "text", placeholder: "Search files and folders...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); } }) }), jsx("div", { className: "file-explorer-content", children: processedFiles.length === 0 ? (jsx("div", { className: "file-explorer-empty", children: "No files match your search" })) : (renderTree()) })] }));
};

// Extension color mapping
var EXTENSION_COLORS = {
    // JavaScript/TypeScript
    'js': '#f7df1e',
    'jsx': '#61dafb',
    'ts': '#3178c6',
    'tsx': '#61dafb',
    // Web Technologies
    'html': '#e34f26',
    'css': '#1572b6',
    'scss': '#cf649a',
    'sass': '#cf649a',
    'less': '#1d365d',
    // Programming Languages
    'py': '#3776ab',
    'java': '#ed8b00',
    'cpp': '#00599c',
    'c': '#a8b9cc',
    'cs': '#239120',
    'php': '#777bb4',
    'rb': '#cc342d',
    'go': '#00add8',
    'rs': '#dea584',
    'swift': '#fa7343',
    'kt': '#7f52ff',
    // Data & Config
    'json': '#000000',
    'xml': '#ff6600',
    'yaml': '#cb171e',
    'yml': '#cb171e',
    'toml': '#9c4221',
    'ini': '#427819',
    'env': '#ecd53f',
    // Documentation
    'md': '#083fa1',
    'txt': '#89cdf1',
    'rst': '#141414',
    // Images
    'png': '#ff69b4',
    'jpg': '#ff1493',
    'jpeg': '#ff1493',
    'gif': '#ff6347',
    'svg': '#ffb13b',
    'webp': '#8a2be2',
    // Archives
    'zip': '#ff9500',
    'tar': '#8b4513',
    'gz': '#654321',
    // Default
    'directory': '#6366f1',
    'unknown': '#9ca3af'
};
var CodebaseGraph = function (_a) {
    _a.files; var hierarchy = _a.hierarchy, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.theme, theme = _d === void 0 ? 'light' : _d, onNodeClick = _a.onNodeClick;
    var svgRef = useRef(null);
    var containerRef = useRef(null);
    var mountedRef = useRef(false);
    var _e = useState$2(''), searchQuery = _e[0], setSearchQuery = _e[1];
    var _f = useState$2(null), zoom = _f[0], setZoom = _f[1];
    var _g = useState$2(null); _g[0]; var setSimulation = _g[1];
    var _h = useState$2([]), nodes = _h[0], setNodes = _h[1];
    var _j = useState$2({}), extensionCounts = _j[0], setExtensionCounts = _j[1];
    // Track mount state
    useEffect(function () {
        mountedRef.current = true;
        return function () {
            mountedRef.current = false;
        };
    }, []);
    // Get color for file extension
    var getColorForExtension = useCallback$2(function (extension, isDirectory) {
        if (isDirectory === void 0) { isDirectory = false; }
        if (isDirectory)
            return EXTENSION_COLORS.directory;
        if (!extension)
            return EXTENSION_COLORS.unknown;
        var ext = extension.toLowerCase().replace('.', '');
        return EXTENSION_COLORS[ext] || EXTENSION_COLORS.unknown;
    }, []);
    // Convert hierarchy to D3 hierarchy
    var convertToD3Hierarchy = useCallback$2(function (data) {
        return d3.hierarchy(data, function (d) { return d.children; });
    }, []);
    // Create nodes from hierarchy
    var createNodes = useCallback$2(function (hierarchyData) {
        var root = convertToD3Hierarchy(hierarchyData);
        // Calculate sizes and create nodes
        root.sum(function (d) { return d.isDirectory ? 0 : (d.size || 1); });
        var nodes = [];
        var extCounts = {};
        root.each(function (node) {
            var radius = node.data.isDirectory
                ? Math.max(20, Math.min(60, Math.sqrt((node.value || 1) / 10) + 15))
                : Math.max(8, Math.min(25, Math.sqrt((node.data.size || 1) / 100) + 5));
            var extension = node.data.extension || undefined;
            var color = getColorForExtension(extension, node.data.isDirectory);
            // Count extensions
            var ext = node.data.isDirectory ? 'directory' : (extension || 'unknown');
            extCounts[ext] = (extCounts[ext] || 0) + 1;
            var graphNode = Object.assign(node, {
                id: node.data.id || "".concat(node.data.name, "-").concat(Math.random()),
                name: node.data.name,
                type: node.data.isDirectory ? 'directory' : 'file',
                extension: extension,
                size: node.data.size || 1,
                radius: radius,
                color: color
            });
            nodes.push(graphNode);
        });
        setExtensionCounts(extCounts);
        return nodes;
    }, [convertToD3Hierarchy, getColorForExtension]);
    // Initialize visualization
    useEffect(function () {
        if (!mountedRef.current || !hierarchy || !svgRef.current || !containerRef.current)
            return;
        var svg = d3.select(svgRef.current);
        var container = containerRef.current;
        var width = container.clientWidth || 800;
        var height = container.clientHeight || 600;
        // Clear previous content and zoom state
        svg.selectAll('*').remove();
        setZoom(null);
        // Create main group first
        var g = svg.append('g');
        // Create zoom behavior with proper error handling
        var zoomBehavior = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', function (event) {
            if (mountedRef.current && event && event.transform && g && g.node()) {
                g.attr('transform', event.transform);
            }
        });
        // Apply zoom behavior to SVG
        try {
            svg.call(zoomBehavior);
            if (mountedRef.current) {
                setZoom(zoomBehavior);
            }
        }
        catch (error) {
            console.warn('Failed to initialize zoom behavior:', error);
            if (mountedRef.current) {
                setZoom(null);
            }
        }
        // Create nodes
        var graphNodes = createNodes(hierarchy);
        setNodes(graphNodes);
        // Create force simulation
        var sim = d3.forceSimulation(graphNodes)
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(function (d) { return d.radius + 5; }))
            .force('x', d3.forceX(width / 2).strength(0.1))
            .force('y', d3.forceY(height / 2).strength(0.1));
        setSimulation(sim);
        // Create tooltip
        var tooltip = d3.select(container)
            .append('div')
            .attr('class', 'graph-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden');
        // Draw nodes
        var nodeGroups = g.selectAll('.node')
            .data(graphNodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .style('cursor', 'pointer');
        // Add circles
        nodeGroups.append('circle')
            .attr('class', 'node-circle')
            .attr('r', function (d) { return d.radius; })
            .attr('fill', function (d) { return d.color; })
            .on('click', function (event, d) {
            if (onNodeClick) {
                onNodeClick(d.data);
            }
        })
            .on('mouseover', function (event, d) {
            var _a;
            tooltip
                .style('visibility', 'visible')
                .html("\n            <strong>".concat(d.name, "</strong><br/>\n            Type: ").concat(d.type, "<br/>\n            ").concat(d.extension ? "Extension: ".concat(d.extension, "<br/>") : '', "\n            Size: ").concat(d.type === 'directory' ? "".concat(((_a = d.children) === null || _a === void 0 ? void 0 : _a.length) || 0, " items") : "".concat(d.size, " bytes"), "\n          "))
                .style('left', (event.pageX - container.offsetLeft + 10) + 'px')
                .style('top', (event.pageY - container.offsetTop - 10) + 'px')
                .classed('visible', true);
        })
            .on('mouseout', function () {
            tooltip.style('visibility', 'hidden').classed('visible', false);
        })
            .call(d3.drag()
            .on('start', function (event, d) {
            if (!event.active)
                sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
            .on('drag', function (event, d) {
            d.fx = event.x;
            d.fy = event.y;
        })
            .on('end', function (event, d) {
            if (!event.active)
                sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }));
        // Add text labels
        nodeGroups.append('text')
            .attr('class', 'node-text')
            .text(function (d) { return d.name.length > 10 ? d.name.substring(0, 8) + '...' : d.name; })
            .attr('font-size', function (d) { return Math.max(8, Math.min(12, d.radius / 3)); })
            .attr('dy', function (d) { return d.radius > 15 ? 0 : -d.radius - 5; });
        // Update positions on simulation tick
        sim.on('tick', function () {
            nodeGroups
                .attr('transform', function (d) { return "translate(".concat(d.x, ",").concat(d.y, ")"); });
        });
        // Cleanup function
        return function () {
            tooltip.remove();
            sim.stop();
            if (mountedRef.current) {
                setZoom(null);
                setSimulation(null);
            }
        };
    }, [hierarchy, createNodes, onNodeClick]);
    // Handle search
    useEffect(function () {
        if (!svgRef.current || !nodes.length)
            return;
        var svg = d3.select(svgRef.current);
        if (searchQuery.trim()) {
            var query_1 = searchQuery.toLowerCase();
            svg.selectAll('.node-circle')
                .classed('node-highlighted', function (d) {
                return d.name.toLowerCase().includes(query_1);
            });
            svg.selectAll('.node-text')
                .classed('node-highlighted-text', function (d) {
                return d.name.toLowerCase().includes(query_1);
            });
        }
        else {
            svg.selectAll('.node-circle').classed('node-highlighted', false);
            svg.selectAll('.node-text').classed('node-highlighted-text', false);
        }
    }, [searchQuery, nodes]);
    // Zoom functions
    var handleZoomIn = useCallback$2(function () {
        if (!mountedRef.current || !zoom || !svgRef.current) {
            console.warn('Zoom behavior not initialized or component not mounted');
            return;
        }
        try {
            d3.select(svgRef.current).transition().duration(300).call(zoom.scaleBy, 1.5);
        }
        catch (error) {
            console.warn('Zoom in failed:', error);
        }
    }, [zoom]);
    var handleZoomOut = useCallback$2(function () {
        if (!mountedRef.current || !zoom || !svgRef.current) {
            console.warn('Zoom behavior not initialized or component not mounted');
            return;
        }
        try {
            d3.select(svgRef.current).transition().duration(300).call(zoom.scaleBy, 0.75);
        }
        catch (error) {
            console.warn('Zoom out failed:', error);
        }
    }, [zoom]);
    var handleResetZoom = useCallback$2(function () {
        if (!mountedRef.current || !zoom || !svgRef.current || !containerRef.current) {
            console.warn('Zoom behavior not initialized or component not mounted');
            return;
        }
        try {
            var svg = d3.select(svgRef.current);
            var width = containerRef.current.clientWidth;
            var height = containerRef.current.clientHeight;
            svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(1));
        }
        catch (error) {
            console.warn('Reset zoom failed:', error);
        }
    }, [zoom]);
    // Early return if no hierarchy data - but after all hooks
    if (!hierarchy) {
        return (jsx("div", { className: "codebase-graph ".concat(theme, " ").concat(className), children: jsxs("div", { className: "graph-loading", children: [jsx("div", { className: "graph-loading-spinner" }), jsx("p", { children: "No data available for visualization" })] }) }));
    }
    return (jsxs("div", { className: "codebase-graph ".concat(theme, " ").concat(className), children: [jsxs("div", { className: "graph-header", children: [jsx("h3", { className: "graph-title", children: "Graph Visualization" }), jsxs("div", { className: "graph-controls", children: [jsx("div", { className: "graph-search", children: jsx("input", { type: "text", placeholder: "Search files...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); } }) }), jsxs("div", { className: "zoom-controls", children: [jsx("button", { className: "zoom-button", onClick: handleZoomIn, title: "Zoom In", disabled: !zoom, children: "+" }), jsx("button", { className: "zoom-button", onClick: handleResetZoom, title: "Reset Zoom", disabled: !zoom, children: "\u2302" }), jsx("button", { className: "zoom-button", onClick: handleZoomOut, title: "Zoom Out", disabled: !zoom, children: "\u2212" })] })] })] }), jsxs("div", { className: "graph-container", ref: containerRef, children: [jsx("svg", { ref: svgRef, className: "graph-svg" }), Object.keys(extensionCounts).length > 0 && (jsxs("div", { className: "legend", children: [jsx("div", { className: "legend-title", children: "File Types" }), Object.keys(extensionCounts)
                                .map(function (ext) { return [ext, extensionCounts[ext]]; })
                                .sort(function (_a, _b) {
                                var a = _a[1];
                                var b = _b[1];
                                return b - a;
                            })
                                .slice(0, 15)
                                .map(function (_a) {
                                var ext = _a[0], count = _a[1];
                                return (jsxs("div", { className: "legend-item", children: [jsx("div", { className: "legend-color", style: { backgroundColor: getColorForExtension(ext, ext === 'directory') } }), jsxs("span", { children: [ext === 'directory' ? 'Folders' : ".".concat(ext), " (", count, ")"] })] }, ext));
                            })] }))] })] }));
};

var useState = React.useState, useCallback = React.useCallback;
var CodebaseVisualizer = function (_a) {
    var _b = _a.apiBaseUrl, apiBaseUrl = _b === void 0 ? 'http://localhost:3000' : _b, onFileSelect = _a.onFileSelect, onDirectorySelect = _a.onDirectorySelect, _c = _a.theme, theme = _c === void 0 ? 'light' : _c, _d = _a.defaultRepoUrl, defaultRepoUrl = _d === void 0 ? '' : _d, _e = _a.showGitHubLinks, showGitHubLinks = _e === void 0 ? true : _e, maxDepth = _a.maxDepth, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.viewMode, viewMode = _g === void 0 ? 'tree' : _g;
    var api = useState(function () { return new CodebaseVisualizerAPI(apiBaseUrl); })[0];
    var _h = useState(defaultRepoUrl), repoUrl = _h[0], setRepoUrl = _h[1];
    var _j = useState(false), isProcessing = _j[0], setIsProcessing = _j[1];
    var _k = useState(null), currentJob = _k[0], setCurrentJob = _k[1];
    var _l = useState(null), jobResult = _l[0], setJobResult = _l[1];
    var _m = useState(null), error = _m[0], setError = _m[1];
    var processRepository = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var job, completedJob, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!repoUrl.trim()) {
                        setError('Please enter a repository URL');
                        return [2 /*return*/];
                    }
                    setIsProcessing(true);
                    setError(null);
                    setJobResult(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    return [4 /*yield*/, api.processRepository(repoUrl)];
                case 2:
                    job = _a.sent();
                    setCurrentJob(job);
                    return [4 /*yield*/, api.pollJobUntilComplete(job.job_id, function (updatedJob) {
                            setCurrentJob(updatedJob);
                        })];
                case 3:
                    completedJob = _a.sent();
                    if (!(completedJob.status === 'completed')) return [3 /*break*/, 5];
                    return [4 /*yield*/, api.getJobResult(completedJob.job_id, 'hierarchical')];
                case 4:
                    result = _a.sent();
                    setJobResult(result);
                    return [3 /*break*/, 6];
                case 5:
                    setError(completedJob.error_message || 'Processing failed');
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'An error occurred');
                    return [3 /*break*/, 9];
                case 8:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [api, repoUrl]);
    var handleFileSelect = useCallback(function (file) {
        onFileSelect === null || onFileSelect === void 0 ? void 0 : onFileSelect(file);
    }, [onFileSelect]);
    var handleDirectorySelect = useCallback(function (directory) {
        onDirectorySelect === null || onDirectorySelect === void 0 ? void 0 : onDirectorySelect(directory);
    }, [onDirectorySelect]);
    return (jsxs("div", { className: "codebase-visualizer ".concat(theme, " ").concat(className), children: [jsxs("div", { className: "codebase-visualizer-header", children: [jsx("h2", { children: "Codebase Visualizer" }), jsxs("div", { className: "codebase-visualizer-controls", children: [jsx("input", { type: "text", placeholder: "Enter GitHub repository URL (e.g., https://github.com/user/repo)", value: repoUrl, onChange: function (e) { return setRepoUrl(e.target.value); }, className: "repo-input", disabled: isProcessing }), jsx("button", { onClick: processRepository, disabled: isProcessing || !repoUrl.trim(), className: "process-button", children: isProcessing ? 'Processing...' : 'Analyze Repository' })] })] }), error && (jsxs("div", { className: "codebase-visualizer-error", children: [jsx("strong", { children: "Error:" }), " ", error] })), currentJob && (jsx("div", { className: "codebase-visualizer-status", children: jsxs("div", { className: "status-info", children: [jsx("strong", { children: "Repository:" }), " ", currentJob.repo_name, jsx("br", {}), jsx("strong", { children: "Status:" }), " ", currentJob.status, currentJob.result_data && (jsxs(Fragment, { children: [jsx("br", {}), jsx("strong", { children: "Files found:" }), " ", currentJob.result_data.total_files] }))] }) })), isProcessing && (jsxs("div", { className: "codebase-visualizer-loading", children: [jsx("div", { className: "loading-spinner" }), jsx("p", { children: "Processing repository... This may take a few minutes for large repositories." })] })), jobResult && (jsx(Fragment, { children: viewMode === 'tree' ? (jsx(FileExplorer, { files: jobResult.files, hierarchy: jobResult.hierarchy, onFileSelect: handleFileSelect, onDirectorySelect: handleDirectorySelect, showGitHubLinks: showGitHubLinks, maxDepth: maxDepth, className: theme })) : (jsx(CodebaseGraph, { files: jobResult.files, hierarchy: jobResult.hierarchy, onNodeClick: function (item) {
                        if ('file_path' in item) {
                            // It's a FileItem
                            if (item.is_directory) {
                                handleDirectorySelect(item);
                            }
                            else {
                                handleFileSelect(item);
                            }
                        }
                        else {
                            // It's a HierarchyNode - convert to FileItem-like object
                            console.log('Selected node:', item);
                        }
                    }, theme: theme, className: theme })) }))] }));
};

export { CodebaseGraph, CodebaseVisualizer, CodebaseVisualizerAPI, FileExplorer, filterFilesByDepth, formatFileSize, getFileIcon, getFileStats, getLanguageFromExtension, groupFilesByParent, searchFiles, sortFiles, truncateText };
//# sourceMappingURL=index.esm.js.map
