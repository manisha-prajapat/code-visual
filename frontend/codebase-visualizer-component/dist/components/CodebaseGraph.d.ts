import React from 'react';
import { FileItem, HierarchyNode } from '../types';
import './CodebaseGraph.css';
export interface CodebaseGraphProps {
    files?: FileItem[];
    hierarchy?: HierarchyNode;
    className?: string;
    theme?: 'light' | 'dark';
    onNodeClick?: (item: FileItem | HierarchyNode) => void;
}
export declare const CodebaseGraph: React.FC<CodebaseGraphProps>;
