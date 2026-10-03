'use client';

import React, { useState, useMemo } from 'react';
import { GraphNode, GraphLink, NodeType } from '@/lib/types';
import {
  Network,
  Info,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface InvestigationGraphExplorerProps {
  nodes: GraphNode[];
  links: GraphLink[];
  targetDistrictName?: string;
  onSelectFinding?: (findingId: string) => void;
  onOpenWhyFlagged?: (findingId: string) => void;
  onSelectEvidence?: (evidenceId: string) => void;
}

export const InvestigationGraphExplorer: React.FC<InvestigationGraphExplorerProps> = ({
  nodes,
  links,
  onSelectFinding,
  onOpenWhyFlagged,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('dist_512');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Active focus node
  const activeFocusId = hoveredNodeId || selectedNodeId;

  // Selected node object
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  const activeConnectedNodeIds = useMemo(() => {
    const targetId = activeFocusId;
    const set = new Set<string>();
    set.add(targetId);
    links.forEach((l) => {
      const src = typeof l.source === 'object' && l.source !== null ? (l.source as { id: string }).id : String(l.source);
      const tgt = typeof l.target === 'object' && l.target !== null ? (l.target as { id: string }).id : String(l.target);
      if (src === targetId) set.add(tgt);
      if (tgt === targetId) set.add(src);
    });
    return set;
  }, [links, activeFocusId]);

  // Hierarchical layout coordinate mapping for sovereign clarity
  const nodePositions: Record<string, { x: number; y: number }> = useMemo(() => {
    return {
      // Ministries (Top tier)
      min_water: { x: 180, y: 70 },
      min_rural: { x: 450, y: 70 },
      min_agri: { x: 720, y: 70 },

      // Schemes (Second tier)
      sch_jjm: { x: 180, y: 175 },
      sch_pmayg: { x: 450, y: 175 },
      sch_pkvy: { x: 720, y: 175 },

      // Datasets (Left/Right flanks)
      ds_jjm: { x: 60, y: 175 },
      ds_pmayg: { x: 450, y: 255 },
      ds_pkvy: { x: 840, y: 175 },

      // Target District (Center Hub)
      dist_512: { x: 450, y: 350 },
      dist_ndb: { x: 450, y: 350 },

      // Multi-Finding Portfolio (Tier below District)
      fnd_0001: { x: 180, y: 460 },
      fnd_0002: { x: 360, y: 460 },
      fnd_0003: { x: 540, y: 460 },
      fnd_0004: { x: 720, y: 460 },

      // Evidence Lineage Records (Bottom tier)
      ev_jjm: { x: 180, y: 550 },
      ev_pmayg: { x: 360, y: 550 },
      ev_pkvy: { x: 540, y: 550 },
      ev_jjm_ndb: { x: 180, y: 550 },
      ev_pmayg_ndb: { x: 360, y: 550 },
      ev_pkvy_ndb: { x: 540, y: 550 },
    };
  }, []);

  const getNodeColor = (type: NodeType | string) => {
    switch (type.toLowerCase()) {
      case 'ministry':
        return {
          fill: 'rgba(59, 130, 246, 0.15)',
          stroke: '#3b82f6',
          text: '#93c5fd',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        };
      case 'scheme':
        return {
          fill: 'rgba(16, 185, 129, 0.15)',
          stroke: '#10b981',
          text: '#6ee7b7',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'district':
        return {
          fill: 'rgba(245, 158, 11, 0.2)',
          stroke: '#f59e0b',
          text: '#fcd34d',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        };
      case 'dataset':
        return {
          fill: 'rgba(168, 85, 247, 0.15)',
          stroke: '#a855f7',
          text: '#d8b4fe',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        };
      case 'finding':
        return {
          fill: 'rgba(244, 63, 94, 0.18)',
          stroke: '#f43f5e',
          text: '#fda4af',
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        };
      case 'evidence':
        return {
          fill: 'rgba(6, 182, 212, 0.15)',
          stroke: '#06b6d4',
          text: '#67e8f9',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        };
      case 'signal':
        return {
          fill: 'rgba(234, 179, 8, 0.15)',
          stroke: '#eab308',
          text: '#fde047',
          badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        };
      default:
        return {
          fill: 'rgba(113, 113, 122, 0.15)',
          stroke: '#71717a',
          text: '#d4d4d8',
          badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        };
    }
  };

  const getEdgeStroke = (linkType: string) => {
    switch (linkType) {
      case 'ADMINISTERS':
        return '#3b82f6';
      case 'OPERATES_IN':
        return '#10b981';
      case 'REPORTS':
        return '#a855f7';
      case 'GENERATES':
        return '#f43f5e';
      case 'CO_OCCURS_WITH':
        return '#f59e0b';
      case 'SUPPORTS':
        return '#06b6d4';
      default:
        return '#52525b';
    }
  };

  const filterOptions = [
    { label: 'All Entities', value: 'ALL' },
    { label: 'Ministries', value: 'ministry' },
    { label: 'Schemes', value: 'scheme' },
    { label: 'District', value: 'district' },
    { label: 'Datasets', value: 'dataset' },
    { label: 'Findings', value: 'finding' },
    { label: 'Evidence', value: 'evidence' },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Graph Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 border-b border-zinc-800/80 bg-zinc-900/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-emerald-400">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                GOVERNANCE GRAPH
              </span>
              <span className="font-mono text-xs text-zinc-400">
                {nodes.length} Nodes · {links.length} Relations
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-100 tracking-tight mt-0.5">
              Multi-Tier Cross-Programme Relational Graph
            </h3>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-xl border border-zinc-800">
          <Filter className="h-3.5 w-3.5 text-zinc-400 ml-2 mr-1" />
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterType === opt.value
                  ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph & Context Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* SVG Graph View (8 cols) */}
        <div className="lg:col-span-8 p-4 md:p-6 bg-zinc-950/60 flex flex-col justify-center items-center relative overflow-x-auto min-h-[520px]">
          <svg
            viewBox="0 0 900 620"
            className="w-full h-auto max-w-[900px] select-none"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4))' }}
          >
            <defs>
              {/* Arrowhead Markers for Directed Links */}
              {['ADMINISTERS', 'OPERATES_IN', 'REPORTS', 'GENERATES', 'CO_OCCURS_WITH', 'SUPPORTS'].map((type) => (
                <marker
                  key={type}
                  id={`arrow-${type}`}
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={getEdgeStroke(type)} fillOpacity="0.8" />
                </marker>
              ))}
            </defs>

            {/* Render Links */}
            <g className="links">
              {links.map((link, idx) => {
                const srcId = typeof link.source === 'object' && link.source !== null ? (link.source as { id: string }).id : String(link.source);
                const tgtId = typeof link.target === 'object' && link.target !== null ? (link.target as { id: string }).id : String(link.target);
                const p1 = nodePositions[srcId] || { x: 100, y: 100 };
                const p2 = nodePositions[tgtId] || { x: 200, y: 200 };

                const isConnected =
                  activeConnectedNodeIds.has(srcId) && activeConnectedNodeIds.has(tgtId);
                const isDimmed = activeFocusId && !isConnected;

                return (
                  <g key={`${srcId}-${tgtId}-${idx}`} className="transition-opacity duration-300">
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={getEdgeStroke(link.type)}
                      strokeWidth={isConnected ? 2.5 : 1.2}
                      strokeOpacity={isDimmed ? 0.15 : isConnected ? 0.9 : 0.4}
                      strokeDasharray={link.type === 'CO_OCCURS_WITH' ? '4,4' : undefined}
                      markerEnd={`url(#arrow-${link.type})`}
                    />
                    {/* Link Label along path */}
                    {isConnected && (
                      <text
                        x={(p1.x + p2.x) / 2}
                        y={(p1.y + p2.y) / 2 - 6}
                        fill={getEdgeStroke(link.type)}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="pointer-events-none font-bold tracking-wider"
                      >
                        {link.label || link.type}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Render Nodes */}
            <g className="nodes">
              {nodes.map((node) => {
                const pos = nodePositions[node.id] || { x: 450, y: 300 };
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isConnected = activeConnectedNodeIds.has(node.id);
                const isDimmed = activeFocusId && !isConnected;
                const isFiltered =
                  filterType !== 'ALL' &&
                  node.type.toLowerCase() !== filterType.toLowerCase();

                if (isFiltered) return null;

                const styling = getNodeColor(node.type);
                const radius = node.val ? Math.max(14, node.val) : 18;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      if (node.type === 'finding' && onSelectFinding) {
                        const rawId = node.id.replace('fnd_', 'SUTRA-FND-');
                        onSelectFinding(rawId);
                      }
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer transition-all duration-200"
                    opacity={isDimmed ? 0.2 : 1}
                  >
                    {/* Selection halo */}
                    {(isSelected || isHovered) && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={styling.stroke}
                        strokeWidth="2"
                        strokeDasharray="3,3"
                        className="animate-spin-slow"
                        opacity="0.8"
                      />
                    )}

                    {/* Node Main Circle */}
                    <circle
                      r={radius}
                      fill={styling.fill}
                      stroke={styling.stroke}
                      strokeWidth={isSelected ? 3 : 1.8}
                      className="transition-transform duration-200 hover:scale-110"
                    />

                    {/* Center Icon/Initial */}
                    <text
                      textAnchor="middle"
                      dy=".3em"
                      fill={styling.text}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {node.type.substring(0, 3).toUpperCase()}
                    </text>

                    {/* Node Text Label below */}
                    <text
                      y={radius + 14}
                      textAnchor="middle"
                      fill="#e4e4e7"
                      fontSize="10.5"
                      fontFamily="sans-serif"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none drop-shadow"
                    >
                      {node.label}
                    </text>

                    {/* Subtext label */}
                    {node.subtext && (
                      <text
                        y={radius + 25}
                        textAnchor="middle"
                        fill="#a1a1aa"
                        fontSize="8.5"
                        fontFamily="monospace"
                        className="pointer-events-none"
                      >
                        {node.subtext}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Entity Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 p-5 md:p-6 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-blue-400" />
                Entity Context Inspector
              </span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  getNodeColor(selectedNode?.type || 'entity').badge
                }`}
              >
                {selectedNode?.type || 'ENTITY'}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-zinc-100 tracking-tight">
                {selectedNode?.label}
              </h4>
              {selectedNode?.subtext && (
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  {selectedNode.subtext}
                </p>
              )}
            </div>

            {/* Entity Specific Meta Breakdown */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Identifier ID:</span>
                  <span className="font-mono text-zinc-200">{selectedNode?.id}</span>
                </div>
                {selectedNode?.ministry && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Administering Ministry:</span>
                    <span className="font-medium text-blue-300">{selectedNode.ministry}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Connected Neighbours:</span>
                  <span className="font-mono text-emerald-400">
                    {activeConnectedNodeIds.size - 1} Entities
                  </span>
                </div>
              </div>

              {/* Node Type Specific Actions */}
              {selectedNode?.type === 'finding' && (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                  <div className="text-xs text-rose-300 font-medium">
                    Verified finding derived from cross-programme data.
                  </div>
                  <div className="flex flex-col gap-2">
                    {onOpenWhyFlagged && (
                      <button
                        onClick={() => {
                          const rawId = selectedNode.id.replace('fnd_', 'SUTRA-FND-');
                          onOpenWhyFlagged(rawId);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Why Flagged? (Forensic Chain)
                      </button>
                    )}
                    {onSelectFinding && (
                      <button
                        onClick={() => {
                          const rawId = selectedNode.id.replace('fnd_', 'SUTRA-FND-');
                          onSelectFinding(rawId);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        Inspect Finding Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {selectedNode?.type === 'district' && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2 text-xs">
                  <div className="font-semibold text-amber-300">
                    Target District Hub (LGD: 512)
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Nandurbar operates across 3 active central flagship schemes with 284,000 rural households and ₹126.90 Cr in sanctioned allocations.
                  </p>
                </div>
              )}

              {selectedNode?.type === 'dataset' && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2 text-xs">
                  <div className="font-semibold text-purple-300">
                    Dataset Source Authority
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Official ministerial telemetry registry providing deterministic reporting records and cryptographic hash seals.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400">
            Click any node in the graph to inspect entity attributes, relationships, and evidence lineage.
          </div>
        </div>
      </div>
    </div>
  );
};
