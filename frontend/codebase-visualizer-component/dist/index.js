'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

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

var useState$1 = React__namespace.useState, useMemo = React__namespace.useMemo, useCallback$1 = React__namespace.useCallback;
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
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs("div", { className: "file-item ".concat(item.isDirectory ? 'directory' : ''), onClick: handleClick, style: indentStyle, children: [hasChildren && (jsxRuntime.jsx("button", { className: "file-item-expand ".concat(isExpanded ? 'expanded' : ''), onClick: function (e) {
                            e.stopPropagation();
                            onToggleExpand(item.path || '');
                        }, children: "\u25B6" })), !hasChildren && jsxRuntime.jsx("div", { className: "file-item-depth" }), jsxRuntime.jsx("span", { className: "file-item-icon", children: getFileIcon(item.extension || null, item.isDirectory) }), jsxRuntime.jsx("span", { className: "file-item-name", title: item.name, children: item.name }), !item.isDirectory && item.size !== undefined && (jsxRuntime.jsx("span", { className: "file-item-size", children: formatFileSize(item.size) })), showGitHubLinks && item.github_url && (jsxRuntime.jsx("a", { href: item.github_url, target: "_blank", rel: "noopener noreferrer", className: "file-item-github-link", onClick: function (e) { return e.stopPropagation(); }, title: "View on GitHub", children: "\uD83D\uDD17" }))] }), isExpanded && hasChildren && (jsxRuntime.jsx(jsxRuntime.Fragment, { children: (_b = item.children) === null || _b === void 0 ? void 0 : _b.map(function (child, index) { return (jsxRuntime.jsx(FileTreeItem, { item: child, depth: depth + 1, onFileSelect: onFileSelect, onDirectorySelect: onDirectorySelect, showGitHubLinks: showGitHubLinks, fileData: fileData, expandedItems: expandedItems, onToggleExpand: onToggleExpand }, "".concat(child.path || child.name, "-").concat(index))); }) }))] }));
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
    var renderFlatList = function () { return (jsxRuntime.jsx("div", { className: "file-tree", children: processedFiles.map(function (file) { return (jsxRuntime.jsxs("div", { className: "file-item ".concat(file.is_directory ? 'directory' : ''), onClick: function () {
                if (file.is_directory) {
                    onDirectorySelect === null || onDirectorySelect === void 0 ? void 0 : onDirectorySelect(file);
                }
                else {
                    onFileSelect === null || onFileSelect === void 0 ? void 0 : onFileSelect(file);
                }
            }, children: [jsxRuntime.jsx("div", { className: "file-item-depth", style: { width: "".concat(file.depth * 20, "px") } }), jsxRuntime.jsx("span", { className: "file-item-icon", children: getFileIcon(file.extension, file.is_directory) }), jsxRuntime.jsx("span", { className: "file-item-name", title: file.file_name, children: file.file_name }), !file.is_directory && (jsxRuntime.jsx("span", { className: "file-item-size", children: formatFileSize(file.size) })), showGitHubLinks && file.github_url && (jsxRuntime.jsx("a", { href: file.github_url, target: "_blank", rel: "noopener noreferrer", className: "file-item-github-link", onClick: function (e) { return e.stopPropagation(); }, title: "View on GitHub", children: "\uD83D\uDD17" }))] }, file.id)); }) })); };
    // Render hierarchical tree if hierarchy is provided
    var renderTree = function () {
        if (!hierarchy || !hierarchy.children) {
            return renderFlatList();
        }
        return (jsxRuntime.jsx("div", { className: "file-tree", children: hierarchy.children.map(function (child, index) { return (jsxRuntime.jsx(FileTreeItem, { item: child, depth: 0, onFileSelect: onFileSelect, onDirectorySelect: onDirectorySelect, showGitHubLinks: showGitHubLinks, fileData: fileDataLookup, expandedItems: expandedItems, onToggleExpand: handleToggleExpand }, "".concat(child.path || child.name, "-").concat(index))); }) }));
    };
    if (files.length === 0) {
        return (jsxRuntime.jsx("div", { className: "file-explorer ".concat(className), children: jsxRuntime.jsx("div", { className: "file-explorer-empty", children: "No files to display" }) }));
    }
    return (jsxRuntime.jsxs("div", { className: "file-explorer ".concat(className), children: [jsxRuntime.jsxs("div", { className: "file-explorer-header", children: [jsxRuntime.jsx("h3", { className: "file-explorer-title", children: "File Explorer" }), jsxRuntime.jsxs("div", { className: "file-explorer-stats", children: [jsxRuntime.jsxs("span", { children: [stats.totalFiles, " files"] }), jsxRuntime.jsxs("span", { children: [stats.totalDirectories, " folders"] }), jsxRuntime.jsx("span", { children: formatFileSize(stats.totalSize) })] })] }), jsxRuntime.jsx("div", { className: "file-explorer-search", children: jsxRuntime.jsx("input", { type: "text", placeholder: "Search files and folders...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); } }) }), jsxRuntime.jsx("div", { className: "file-explorer-content", children: processedFiles.length === 0 ? (jsxRuntime.jsx("div", { className: "file-explorer-empty", children: "No files match your search" })) : (renderTree()) })] }));
};

var useState = React__namespace.useState, useCallback = React__namespace.useCallback;
var CodebaseVisualizer = function (_a) {
    var _b = _a.apiBaseUrl, apiBaseUrl = _b === void 0 ? 'http://localhost:3000' : _b, onFileSelect = _a.onFileSelect, onDirectorySelect = _a.onDirectorySelect, _c = _a.theme, theme = _c === void 0 ? 'light' : _c, _d = _a.defaultRepoUrl, defaultRepoUrl = _d === void 0 ? '' : _d, _e = _a.showGitHubLinks, showGitHubLinks = _e === void 0 ? true : _e, maxDepth = _a.maxDepth, _f = _a.className, className = _f === void 0 ? '' : _f;
    var api = useState(function () { return new CodebaseVisualizerAPI(apiBaseUrl); })[0];
    var _g = useState(defaultRepoUrl), repoUrl = _g[0], setRepoUrl = _g[1];
    var _h = useState(false), isProcessing = _h[0], setIsProcessing = _h[1];
    var _j = useState(null), currentJob = _j[0], setCurrentJob = _j[1];
    var _k = useState(null), jobResult = _k[0], setJobResult = _k[1];
    var _l = useState(null), error = _l[0], setError = _l[1];
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
    return (jsxRuntime.jsxs("div", { className: "codebase-visualizer ".concat(theme, " ").concat(className), children: [jsxRuntime.jsxs("div", { className: "codebase-visualizer-header", children: [jsxRuntime.jsx("h2", { children: "Codebase Visualizer" }), jsxRuntime.jsxs("div", { className: "codebase-visualizer-controls", children: [jsxRuntime.jsx("input", { type: "text", placeholder: "Enter GitHub repository URL (e.g., https://github.com/user/repo)", value: repoUrl, onChange: function (e) { return setRepoUrl(e.target.value); }, className: "repo-input", disabled: isProcessing }), jsxRuntime.jsx("button", { onClick: processRepository, disabled: isProcessing || !repoUrl.trim(), className: "process-button", children: isProcessing ? 'Processing...' : 'Analyze Repository' })] })] }), error && (jsxRuntime.jsxs("div", { className: "codebase-visualizer-error", children: [jsxRuntime.jsx("strong", { children: "Error:" }), " ", error] })), currentJob && (jsxRuntime.jsx("div", { className: "codebase-visualizer-status", children: jsxRuntime.jsxs("div", { className: "status-info", children: [jsxRuntime.jsx("strong", { children: "Repository:" }), " ", currentJob.repo_name, jsxRuntime.jsx("br", {}), jsxRuntime.jsx("strong", { children: "Status:" }), " ", currentJob.status, currentJob.result_data && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("br", {}), jsxRuntime.jsx("strong", { children: "Files found:" }), " ", currentJob.result_data.total_files] }))] }) })), isProcessing && (jsxRuntime.jsxs("div", { className: "codebase-visualizer-loading", children: [jsxRuntime.jsx("div", { className: "loading-spinner" }), jsxRuntime.jsx("p", { children: "Processing repository... This may take a few minutes for large repositories." })] })), jobResult && (jsxRuntime.jsx(FileExplorer, { files: jobResult.files, hierarchy: jobResult.hierarchy, onFileSelect: handleFileSelect, onDirectorySelect: handleDirectorySelect, showGitHubLinks: showGitHubLinks, maxDepth: maxDepth, className: theme }))] }));
};

exports.CodebaseVisualizer = CodebaseVisualizer;
exports.CodebaseVisualizerAPI = CodebaseVisualizerAPI;
exports.FileExplorer = FileExplorer;
exports.filterFilesByDepth = filterFilesByDepth;
exports.formatFileSize = formatFileSize;
exports.getFileIcon = getFileIcon;
exports.getFileStats = getFileStats;
exports.getLanguageFromExtension = getLanguageFromExtension;
exports.groupFilesByParent = groupFilesByParent;
exports.searchFiles = searchFiles;
exports.sortFiles = sortFiles;
exports.truncateText = truncateText;
//# sourceMappingURL=index.js.map
