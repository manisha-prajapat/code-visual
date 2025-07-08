import { FileItem } from './types';
export declare const formatFileSize: (bytes: number) => string;
export declare const getFileIcon: (extension: string | null, isDirectory?: boolean) => string;
export declare const truncateText: (text: string, maxLength: number) => string;
export declare const sortFiles: (files: FileItem[]) => FileItem[];
export declare const filterFilesByDepth: (files: FileItem[], maxDepth: number) => FileItem[];
export declare const groupFilesByParent: (files: FileItem[]) => Record<string, FileItem[]>;
export declare const getFileStats: (files: FileItem[]) => {
    totalFiles: number;
    totalDirectories: number;
    totalRegularFiles: number;
    totalSize: number;
    maxDepth: number;
    fileExtensions: Record<string, number>;
};
export declare const searchFiles: (files: FileItem[], query: string) => FileItem[];
export declare const getLanguageFromExtension: (extension: string | null) => string;
