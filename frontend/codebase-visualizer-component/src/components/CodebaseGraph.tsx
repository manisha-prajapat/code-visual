import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { FileItem, HierarchyNode } from '../types';
import './CodebaseGraph.css';

export interface CodebaseGraphProps {
  files?: FileItem[];
  hierarchy?: HierarchyNode;
  className?: string;
  theme?: 'light' | 'dark';
  onNodeClick?: (item: FileItem | HierarchyNode) => void;
}

interface GraphNode extends d3.HierarchyNode<HierarchyNode> {
  id: string;
  name: string;
  type: 'file' | 'directory';
  extension?: string;
  size: number;
  radius: number;
  color: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

// Extension color mapping
const EXTENSION_COLORS: Record<string, string> = {
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

export const CodebaseGraph: React.FC<CodebaseGraphProps> = ({
  files = [],
  hierarchy,
  className = '',
  theme = 'light',
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const zoomRef = useRef<any>(null);
  const simulationRef = useRef<any>(null);
  
  // Simple state without complex types
  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [extensionCounts, setExtensionCounts] = useState<Record<string, number>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Track mount state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Clean up D3 objects
      if (zoomRef.current) {
        zoomRef.current = null;
      }
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, []);

  // Get color for file extension
  const getColorForExtension = useCallback((extension?: string, isDirectory = false): string => {
    if (isDirectory) return EXTENSION_COLORS.directory;
    if (!extension) return EXTENSION_COLORS.unknown;
    
    const ext = extension.toLowerCase().replace('.', '');
    return EXTENSION_COLORS[ext] || EXTENSION_COLORS.unknown;
  }, []);

  // Convert hierarchy to D3 hierarchy
  const convertToD3Hierarchy = useCallback((data: HierarchyNode): d3.HierarchyNode<HierarchyNode> => {
    return d3.hierarchy(data, d => d.children);
  }, []);

  // Create nodes from hierarchy
  const createNodes = useCallback((hierarchyData: HierarchyNode): GraphNode[] => {
    try {
      if (!hierarchyData) {
        console.warn('No hierarchy data provided to createNodes');
        return [];
      }

      const root = convertToD3Hierarchy(hierarchyData);
      
      // Calculate sizes and create nodes
      root.sum(d => d.isDirectory ? 0 : (d.size || 1));
      
      const nodes: GraphNode[] = [];
      const extCounts: Record<string, number> = {};
      
      root.each((node) => {
        if (!node || !node.data) {
          console.warn('Invalid node data encountered');
          return;
        }

        const radius = node.data.isDirectory 
          ? Math.max(20, Math.min(60, Math.sqrt((node.value || 1) / 10) + 15))
          : Math.max(8, Math.min(25, Math.sqrt((node.data.size || 1) / 100) + 5));
        
        const extension = node.data.extension || undefined;
        const color = getColorForExtension(extension, node.data.isDirectory);
        
        // Count extensions
        const ext = node.data.isDirectory ? 'directory' : (extension || 'unknown');
        extCounts[ext] = (extCounts[ext] || 0) + 1;
        
        const graphNode: GraphNode = Object.assign(node as GraphNode, {
          id: node.data.id || `${node.data.name || 'unknown'}-${Math.random()}`,
          name: node.data.name || 'Unknown',
          type: node.data.isDirectory ? 'directory' : 'file' as 'file' | 'directory',
          extension,
          size: node.data.size || 1,
          radius,
          color
        });
        
        nodes.push(graphNode);
      });
      
      setExtensionCounts(extCounts);
      return nodes;
    } catch (error) {
      console.error('Error creating nodes from hierarchy:', error);
      return [];
    }
  }, [convertToD3Hierarchy, getColorForExtension]);

  // Initialize visualization
  useEffect(() => {
    if (!mountedRef.current || !hierarchy || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Clear previous content and reset refs
    svg.selectAll('*').remove();
    zoomRef.current = null;
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    simulationRef.current = null;

    // Create main group first
    const g = svg.append('g');

    // Create zoom behavior with defensive initialization
    let zoomBehavior: any = null;
    try {
      zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          if (mountedRef.current && event && event.transform && g && g.node()) {
            try {
              g.attr('transform', event.transform);
            } catch (transformError) {
              console.warn('Transform error:', transformError);
            }
          }
        });

      // Apply zoom behavior to SVG
      if (zoomBehavior && svg && svg.node()) {
        svg.call(zoomBehavior);
        if (mountedRef.current) {
          zoomRef.current = zoomBehavior;
        }
      }
    } catch (error) {
      console.warn('Failed to initialize zoom behavior:', error);
      if (mountedRef.current) {
        zoomRef.current = null;
      }
    }

    // Create nodes
    const graphNodes = createNodes(hierarchy);
    setNodes(graphNodes);

    // Create force simulation
    const sim = d3.forceSimulation<GraphNode>(graphNodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + 5))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    simulationRef.current = sim;

    // Create tooltip
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden');

    // Draw nodes
    const nodeGroups = g.selectAll('.node')
      .data(graphNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add circles
    nodeGroups.append('circle')
      .attr('class', 'node-circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .on('click', (event, d) => {
        if (onNodeClick) {
          onNodeClick(d.data);
        }
      })
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>${d.name}</strong><br/>
            Type: ${d.type}<br/>
            ${d.extension ? `Extension: ${d.extension}<br/>` : ''}
            Size: ${d.type === 'directory' ? `${d.children?.length || 0} items` : `${d.size} bytes`}
          `)
          .style('left', (event.pageX - container.offsetLeft + 10) + 'px')
          .style('top', (event.pageY - container.offsetTop - 10) + 'px')
          .classed('visible', true);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden').classed('visible', false);
      })
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Add text labels
    nodeGroups.append('text')
      .attr('class', 'node-text')
      .text(d => d.name.length > 10 ? d.name.substring(0, 8) + '...' : d.name)
      .attr('font-size', d => Math.max(8, Math.min(12, d.radius / 3)))
      .attr('dy', d => d.radius > 15 ? 0 : -d.radius - 5);

    // Update positions on simulation tick
    sim.on('tick', () => {
      nodeGroups
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    setIsInitialized(true);

    // Cleanup function
    return () => {
      tooltip.remove();
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
      if (mountedRef.current) {
        zoomRef.current = null;
        simulationRef.current = null;
      }
    };
  }, [hierarchy, createNodes, onNodeClick]);

  // Handle search
  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      svg.selectAll('.node-circle')
        .classed('node-highlighted', (d: any) => 
          d.name.toLowerCase().includes(query)
        );
        
      svg.selectAll('.node-text')
        .classed('node-highlighted-text', (d: any) => 
          d.name.toLowerCase().includes(query)
        );
    } else {
      svg.selectAll('.node-circle').classed('node-highlighted', false);
      svg.selectAll('.node-text').classed('node-highlighted-text', false);
    }
  }, [searchQuery, nodes]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    if (!mountedRef.current || !zoomRef.current || !svgRef.current) {
      console.warn('Zoom behavior not initialized or component not mounted');
      return;
    }
    try {
      d3.select(svgRef.current).transition().duration(300).call(
        zoomRef.current.scaleBy, 1.5
      );
    } catch (error) {
      console.warn('Zoom in failed:', error);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!mountedRef.current || !zoomRef.current || !svgRef.current) {
      console.warn('Zoom behavior not initialized or component not mounted');
      return;
    }
    try {
      d3.select(svgRef.current).transition().duration(300).call(
        zoomRef.current.scaleBy, 0.75
      );
    } catch (error) {
      console.warn('Zoom out failed:', error);
    }
  }, []);

  const handleResetZoom = useCallback(() => {
    if (!mountedRef.current || !zoomRef.current || !svgRef.current || !containerRef.current) {
      console.warn('Zoom behavior not initialized or component not mounted');
      return;
    }
    try {
      const svg = d3.select(svgRef.current);
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      svg.transition().duration(500).call(
        zoomRef.current.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
      );
    } catch (error) {
      console.warn('Reset zoom failed:', error);
    }
  }, []);

  // Early return if no hierarchy data - but after all hooks
  if (!hierarchy) {
    return (
      <div className={`codebase-graph ${theme} ${className}`}>
        <div className="graph-loading">
          <div className="graph-loading-spinner"></div>
          <p>No data available for visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`codebase-graph ${theme} ${className}`}>
      <div className="graph-header">
        <h3 className="graph-title">Graph Visualization</h3>
        <div className="graph-controls">
          <div className="graph-search">
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="zoom-controls">
            <button 
              className="zoom-button" 
              onClick={handleZoomIn} 
              title="Zoom In"
              disabled={!isInitialized || !zoomRef.current}
            >
              +
            </button>
            <button 
              className="zoom-button" 
              onClick={handleResetZoom} 
              title="Reset Zoom"
              disabled={!isInitialized || !zoomRef.current}
            >
              ⌂
            </button>
            <button 
              className="zoom-button" 
              onClick={handleZoomOut} 
              title="Zoom Out"
              disabled={!isInitialized || !zoomRef.current}
            >
              −
            </button>
          </div>
        </div>
      </div>
      
      <div className="graph-container" ref={containerRef}>
        <svg ref={svgRef} className="graph-svg"></svg>
        
        {Object.keys(extensionCounts).length > 0 && (
          <div className="legend">
            <div className="legend-title">File Types</div>
            {Object.keys(extensionCounts)
              .map(ext => [ext, extensionCounts[ext]] as [string, number])
              .sort(([,a], [,b]) => b - a)
              .slice(0, 15)
              .map(([ext, count]) => (
                <div key={ext} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: getColorForExtension(ext, ext === 'directory') }}
                  ></div>
                  <span>{ext === 'directory' ? 'Folders' : `.${ext}`} ({count})</span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}; 