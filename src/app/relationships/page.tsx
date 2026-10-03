'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { GOVERNANCE_GRAPH_DATA } from '@/lib/data/governance-data';
import { GraphNode, GraphLink, NodeType } from '@/lib/types';
import {
  Network,
  Info,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
} from 'lucide-react';

export default function GovernanceGraphPage() {
  const { openEvidence, openExplain, openWhyFlagged, openWorkspace } = useIntelligence();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('fnd_conv_gap');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Enhanced V2 graph data with Event, Finding, and Evidence nodes
  const graphData = useMemo(() => {
    const baseNodes: GraphNode[] = [
      ...GOVERNANCE_GRAPH_DATA.nodes,
      {
        id: 'evt_jjm_ndb',
        label: 'JJM Drawdown Event (+11.8%)',
        type: 'event' as NodeType,
        val: 18,
        subtext: 'LGD 512 Nandurbar • ₹22.10 Cr → ₹24.70 Cr Live Mutation',
      },
      {
        id: 'fnd_conv_gap',
        label: 'SUTRA-FND-0001 (18.4 pp Gap)',
        type: 'finding' as NodeType,
        val: 22,
        subtext: 'PMAY-G Completion (46.8%) vs JJM Tap Rate (28.4%) Divergence',
      },
      {
        id: 'evi_imis_7201',
        label: 'Evidence #7201 (JJM IMIS)',
        type: 'evidence' as NodeType,
        val: 16,
        subtext: 'Verified Official IMIS Record • Hash e3b0c442...',
      },
      {
        id: 'evi_awaas_4401',
        label: 'Evidence #4401 (AwaasSoft)',
        type: 'evidence' as NodeType,
        val: 16,
        subtext: 'Verified MoRD AwaasSoft Record • Hash 7d5a881a...',
      },
    ];

    const baseLinks: GraphLink[] = [
      ...GOVERNANCE_GRAPH_DATA.links,
      {
        source: 'dist_ndb',
        target: 'evt_jjm_ndb',
        type: 'TRIGGERS',
        label: 'Live Telemetry',
      },
      {
        source: 'evt_jjm_ndb',
        target: 'fnd_conv_gap',
        type: 'PRODUCES',
        label: 'Cross-Correlated',
      },
      {
        source: 'fnd_conv_gap',
        target: 'evi_imis_7201',
        type: 'SUPPORTED_BY',
        label: 'Lineage',
      },
      {
        source: 'fnd_conv_gap',
        target: 'evi_awaas_4401',
        type: 'SUPPORTED_BY',
        label: 'Lineage',
      },
      {
        source: 'sch_jjm',
        target: 'evt_jjm_ndb',
        type: 'AFFECTS',
        label: 'Expenditure',
      },
    ];

    return { nodes: baseNodes, links: baseLinks };
  }, []);

  const { nodes, links } = graphData;

  // Active focus node is hovered node if present, else selected node
  const activeFocusId = hoveredNodeId || selectedNodeId;

  // Find selected node and connected node IDs
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  const hoveredNode = useMemo(
    () => (hoveredNodeId ? nodes.find((n) => n.id === hoveredNodeId) || null : null),
    [nodes, hoveredNodeId]
  );

  const connectedNodeIds = useMemo(() => {
    const set = new Set<string>();
    set.add(selectedNode.id);
    links.forEach((l) => {
      if (l.source === selectedNode.id) set.add(l.target);
      if (l.target === selectedNode.id) set.add(l.source);
    });
    return set;
  }, [links, selectedNode]);

  const activeConnectedNodeIds = useMemo(() => {
    const targetId = activeFocusId;
    const set = new Set<string>();
    set.add(targetId);
    links.forEach((l) => {
      if (l.source === targetId) set.add(l.target);
      if (l.target === targetId) set.add(l.source);
    });
    return set;
  }, [links, activeFocusId]);

  // Node position map layout (organized hierarchically for clean editorial aesthetics)
  const nodePositions: Record<string, { x: number; y: number }> = {
    // Ministries (Top layer)
    min_agri: { x: 180, y: 60 },
    min_rural: { x: 420, y: 60 },
    min_water: { x: 640, y: 60 },

    // Departments (Second layer)
    dept_agri: { x: 180, y: 130 },
    dept_rural: { x: 420, y: 130 },
    dept_water: { x: 640, y: 130 },

    // Schemes (Center layer)
    sch_pkvy: { x: 120, y: 210 },
    sch_movcd: { x: 250, y: 210 },
    sch_pmkisan: { x: 370, y: 210 },
    sch_pmgsy: { x: 490, y: 210 },
    sch_pmayg: { x: 610, y: 210 },
    sch_jjm: { x: 730, y: 210 },

    // Budgets (Side nodes)
    bud_pkvy: { x: 50, y: 280 },
    bud_movcd: { x: 210, y: 280 },
    bud_pmkisan: { x: 370, y: 280 },

    // Districts (Regional layer)
    dist_ndb: { x: 150, y: 340 },
    dist_gdc: { x: 580, y: 340 },
    dist_wsm: { x: 710, y: 340 },
    dist_pun: { x: 390, y: 340 },

    // V2 Live Event & Forensic Investigation layer
    evt_jjm_ndb: { x: 260, y: 410 },
    fnd_conv_gap: { x: 440, y: 410 },
    evi_imis_7201: { x: 370, y: 480 },
    evi_awaas_4401: { x: 530, y: 480 },

    // Projects (Execution layer)
    proj_ndb_soil: { x: 70, y: 470 },
    proj_ndb_road: { x: 160, y: 470 },
    proj_ndb_water: { x: 250, y: 480 },

    // Beneficiaries
    ben_smallholders: { x: 630, y: 470 },
    ben_tribal: { x: 720, y: 470 },

    // Outcomes
    out_soil_health: { x: 80, y: 390 },
    out_tap_security: { x: 730, y: 390 },
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'ministry':
        return '#DFB88B'; // Warm Luminous Gold
      case 'department':
        return '#8DB4C7'; // Crisp Steel Blue
      case 'scheme':
        return '#FAF8F5'; // Crisp Pure Ivory
      case 'budget':
        return '#E5B869'; // Radiant Amber
      case 'district':
        return '#DDD7CD'; // Crisp Silver Stone
      case 'event':
        return '#38BDF8'; // Sky Blue
      case 'finding':
        return '#F87171'; // Luminous Coral Red
      case 'evidence':
        return '#7DC09C'; // Bright Sage
      case 'project':
        return '#C9C2B7'; // Warm Stone
      case 'beneficiary':
        return '#DFB88B'; // Warm Gold
      case 'outcome':
        return '#7DC09C'; // Bright Sage
      default:
        return '#DDD7CD';
    }
  };

  const filteredNodes = useMemo(() => {
    if (filterType === 'ALL') return nodes;
    return nodes.filter((n) => n.type.toLowerCase() === filterType.toLowerCase());
  }, [nodes, filterType]);

  return (
    <AppShell>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2926] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
            <span>GRAPH TOPOLOGY INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
            GOVERNANCE RELATIONSHIP GRAPH
          </h1>
          <p className="text-xs text-[#8E887E] mt-0.5">
            Interactive multi-relational network mapping policy intent to ground outcomes. Hover over any node or relationship link to inspect granular data.
          </p>
        </div>

        {/* Node Type Filter Bar */}
        <div className="flex flex-wrap items-center gap-1 bg-[#141412] p-1 border border-[#2A2926] rounded-sm text-xs font-mono">
          {['ALL', 'MINISTRY', 'SCHEME', 'DISTRICT', 'EVENT', 'FINDING', 'EVIDENCE', 'OUTCOME'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-sm transition-all ${
                filterType === type
                  ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold'
                  : 'text-[#8E887E] hover:text-[#F3F0E8]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Interactive Canvas + Context Panel */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Interactive Network Visualizer */}
        <div className="lg:col-span-8 bg-[#181816] border border-[#33312D] rounded-sm p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-[#A39D92]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6DAA8A] animate-pulse" />
              <span>Interactive Graph: <strong className="text-white">{hoveredNode ? hoveredNode.label : selectedNode.label}</strong></span>
            </span>
            <span className="text-[11px] text-[#DFB88B] font-semibold">
              {hoveredNode ? 'Hovering Node • Click to Lock' : 'Hover over any node or link for details'}
            </span>
          </div>

          {/* SVG Graph View */}
          <div
            className="w-full h-[560px] bg-[#121210] border border-[#33312D] rounded-sm overflow-hidden relative shadow-inner"
            onMouseLeave={() => {
              setHoveredNodeId(null);
              setHoveredLink(null);
              setTooltipPos(null);
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 820 520">
              <defs>
                <radialGradient id="graphAmbientGlow" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#C89B65" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#C89B65" stopOpacity="0" />
                </radialGradient>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#A39D92" opacity="0.8" />
                </marker>
                <marker
                  id="arrowhead-active"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#DFB88B" />
                </marker>
              </defs>

              {/* Ambient Canvas Lighting */}
              <rect width="100%" height="100%" fill="url(#graphAmbientGlow)" />

              {/* Render Links */}
              {links.map((link, idx) => {
                const sPos = nodePositions[link.source];
                const tPos = nodePositions[link.target];
                if (!sPos || !tPos) return null;

                const isConnectedToSelected =
                  link.source === selectedNode.id || link.target === selectedNode.id;
                const isConnectedToHovered =
                  hoveredNodeId && (link.source === hoveredNodeId || link.target === hoveredNodeId);
                const isLinkHovered =
                  hoveredLink &&
                  hoveredLink.source === link.source &&
                  hoveredLink.target === link.target;
                const isOverlap = link.type === 'OVERLAPS_WITH';
                const isHighlighted = isConnectedToHovered || isConnectedToSelected || isLinkHovered;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredLink(link);
                      setTooltipPos({
                        x: (sPos.x + tPos.x) / 2,
                        y: (sPos.y + tPos.y) / 2,
                      });
                    }}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {/* Invisible fat stroke for easy hover detection */}
                    <line
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke="transparent"
                      strokeWidth="14"
                    />

                    {/* Visible line */}
                    <line
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke={
                        isLinkHovered
                          ? '#FFFFFF'
                          : isOverlap
                          ? '#DFB88B'
                          : isHighlighted
                          ? '#DFB88B'
                          : '#38352F'
                      }
                      strokeWidth={isLinkHovered ? 3 : isHighlighted || isOverlap ? 2.5 : 1.2}
                      strokeDasharray={isOverlap ? '4 4' : isHighlighted ? '6 6' : undefined}
                      className={isHighlighted || isOverlap ? 'animate-beam-flow' : undefined}
                      strokeOpacity={isLinkHovered ? 1 : isHighlighted || isOverlap ? 0.95 : 0.55}
                      markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    />

                    {/* Link label for overlap */}
                    {isOverlap && (
                      <text
                        x={(sPos.x + tPos.x) / 2}
                        y={(sPos.y + tPos.y) / 2 - 8}
                        fill="#DFB88B"
                        fontSize="9.5"
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {link.label || '82% Overlap'}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = selectedNode.id === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isConnected = activeConnectedNodeIds.has(node.id);
                const color = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => {
                      setHoveredNodeId(node.id);
                      setTooltipPos(pos);
                    }}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    opacity={isSelected || isHovered ? 1 : isConnected ? 0.95 : 0.78}
                  >
                    {/* Interactive glowing halo ring on hover or selection */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={node.val + 8}
                        fill="none"
                        stroke={isHovered ? '#FFFFFF' : '#DFB88B'}
                        strokeWidth="1.8"
                        strokeDasharray="3 3"
                        className="animate-spin pointer-events-none"
                        style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '8s' }}
                      />
                    )}

                    {/* Outer circle with vibrant category accent */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={node.val}
                      fill="#1E1D1A"
                      stroke={isHovered ? '#FFFFFF' : isSelected ? '#DFB88B' : isConnected ? color : `${color}B0`}
                      strokeWidth={isSelected || isHovered ? 2.5 : isConnected ? 2 : 1.5}
                      className="transition-colors duration-200"
                    />

                    {/* Inner tint circle for rich depth */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={node.val - 2}
                      fill={color}
                      fillOpacity={isHovered || isSelected ? 0.25 : 0.12}
                      className="pointer-events-none"
                    />

                    {/* Inner indicator dot */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered || isSelected ? 5 : 4}
                      fill={color}
                      className="pointer-events-none shadow-sm"
                    />

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + node.val + 13}
                      textAnchor="middle"
                      fill={isHovered ? '#FFFFFF' : isSelected ? '#DFB88B' : isConnected ? '#FAF8F5' : '#DDD7CD'}
                      fontSize={isHovered || isSelected ? '10' : '9.5'}
                      fontFamily="monospace"
                      fontWeight={isSelected || isHovered || isConnected ? 'bold' : '600'}
                      className="select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Rich Floating Glassmorphic Tooltip on Node Hover (Anchored to node with smart boundary flipping) */}
            {hoveredNode && tooltipPos && (() => {
              const isNearTop = tooltipPos.y < 160;
              const safeX = Math.max(150, Math.min(tooltipPos.x, 670));
              const safeXPercent = (safeX / 820) * 100;
              const safeYPercent = (tooltipPos.y / 520) * 100;

              return (
                <div
                  className={`absolute z-30 pointer-events-none transform -translate-x-1/2 ${
                    isNearTop ? 'mt-8' : '-translate-y-full mb-3'
                  } px-3.5 py-2.5 rounded bg-[#181816]/98 border border-[#DFB88B] text-white font-mono text-xs shadow-2xl backdrop-blur-md max-w-xs transition-all duration-150`}
                  style={{
                    left: `${safeXPercent}%`,
                    top: `${safeYPercent}%`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[#33312D] pb-1.5 mb-1.5">
                    <span
                      className="text-[9px] uppercase px-2 py-0.5 rounded font-bold"
                      style={{
                        backgroundColor: `${getNodeColor(hoveredNode.type)}25`,
                        color: getNodeColor(hoveredNode.type),
                        border: `1px solid ${getNodeColor(hoveredNode.type)}50`,
                      }}
                    >
                      {hoveredNode.type}
                    </span>
                    <span className="text-[10px] text-[#A39D92]">
                      {activeConnectedNodeIds.size - 1} Links Connected
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white">{hoveredNode.label}</div>
                  {hoveredNode.subtext && (
                    <div className="text-[11px] text-[#DDD7CD] mt-1 leading-snug">{hoveredNode.subtext}</div>
                  )}
                  <div className="mt-2 pt-1.5 border-t border-[#33312D] flex items-center justify-between text-[9px] text-[#DFB88B] font-semibold">
                    <span>Click to lock & view dossier</span>
                    <span>ID: {hoveredNode.id}</span>
                  </div>
                </div>
              );
            })()}

            {/* Floating Tooltip on Link Hover (with smart boundary flipping) */}
            {hoveredLink && tooltipPos && !hoveredNode && (() => {
              const isNearTop = tooltipPos.y < 140;
              const safeX = Math.max(130, Math.min(tooltipPos.x, 690));

              return (
                <div
                  className={`absolute z-30 pointer-events-none transform -translate-x-1/2 ${
                    isNearTop ? 'mt-6' : '-translate-y-full mb-2'
                  } px-3.5 py-2 rounded bg-[#181816]/98 border border-[#7DC09C] text-white font-mono text-xs shadow-xl backdrop-blur-md transition-opacity duration-150`}
                  style={{
                    left: `${(safeX / 820) * 100}%`,
                    top: `${(tooltipPos.y / 520) * 100}%`,
                  }}
                >
                  <div className="text-[9px] text-[#7DC09C] uppercase font-bold tracking-wider">
                    RELATIONSHIP EDGE
                  </div>
                  <div className="text-[11px] font-bold text-white mt-0.5">
                    {nodes.find((n) => n.id === hoveredLink.source)?.label} ──[{hoveredLink.type}]──▶{' '}
                    {nodes.find((n) => n.id === hoveredLink.target)?.label}
                  </div>
                  {hoveredLink.label && (
                    <div className="text-[10px] text-[#DFB88B] mt-1 font-bold">
                      {hoveredLink.label}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Edge Type Legend */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#DDD7CD] flex flex-wrap gap-3 bg-[#181816]/90 px-3.5 py-1.5 border border-[#33312D] rounded backdrop-blur-sm shadow-md font-medium">
              <span className="hover:text-white transition-colors">OWNS</span>
              <span className="text-[#605B53]">•</span>
              <span className="hover:text-white transition-colors">FUNDS</span>
              <span className="text-[#605B53]">•</span>
              <span className="hover:text-white transition-colors">IMPLEMENTED_IN</span>
              <span className="text-[#605B53]">•</span>
              <span className="hover:text-white transition-colors">SERVES</span>
              <span className="text-[#605B53]">•</span>
              <span className="hover:text-white transition-colors">PRODUCES</span>
              <span className="text-[#605B53]">•</span>
              <span className="text-[#DFB88B] font-bold">OVERLAPS_WITH</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Selected Node Contextual Panel */}
        <div className="lg:col-span-4 p-6 bg-[#181816] border border-[#33312D] rounded-sm space-y-6 shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFB88B] font-semibold">
                NODE METADATA
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#22211D] border border-[#38352F] text-[#FAF8F5] font-semibold">
                {selectedNode.type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-editorial mt-2">
              {selectedNode.label}
            </h3>
            {selectedNode.subtext && (
              <p className="text-xs text-[#DDD7CD] mt-1 leading-relaxed">{selectedNode.subtext}</p>
            )}
          </div>

          {/* Connected Edges */}
          <div className="space-y-3 font-mono text-xs border-t border-[#302E2A] pt-4">
            <span className="text-[10px] text-[#8E887E] uppercase block">
              Direct Relationships ({connectedNodeIds.size - 1})
            </span>

            <div className="space-y-2">
              {links
                .filter(
                  (l) => l.source === selectedNode.id || l.target === selectedNode.id
                )
                .map((link, i) => {
                  const otherNodeId =
                    link.source === selectedNode.id ? link.target : link.source;
                  const otherNode = nodes.find((n) => n.id === otherNodeId);
                  const isOut = link.source === selectedNode.id;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedNodeId(otherNodeId)}
                      className="p-2.5 rounded bg-[#191917] border border-[#2A2926] hover:border-[#B78A5A]/50 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[9px] text-[#B78A5A] block">
                          {isOut ? `──[${link.type}]──▶` : `◀──[${link.type}]──`}
                        </span>
                        <span className="font-semibold text-xs text-[#F3F0E8]">
                          {otherNode?.label}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#8E887E] uppercase">
                        {otherNode?.type}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Action Link */}
          <div className="pt-2 border-t border-[#2A2926] space-y-2">
            {selectedNode.type === 'finding' && (
              <div className="space-y-2">
                <button
                  onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                  className="w-full py-2.5 px-3 rounded-sm bg-zinc-800 text-zinc-100 font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>WHY WAS THIS FLAGGED?</span>
                </button>
                <button
                  onClick={() => openWorkspace('SUTRA-INV-2026-0001')}
                  className="w-full py-2.5 px-3 rounded-sm bg-[#A66A62] text-white font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-[#8F554E] transition-colors"
                >
                  <span>OPEN INVESTIGATION WORKSPACE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {selectedNode.type === 'event' && (
              <button
                onClick={() => openWorkspace('SUTRA-INV-2026-0001')}
                className="w-full py-2.5 px-3 rounded-sm bg-sky-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-sky-500 transition-colors"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>INSPECT CORRELATED INVESTIGATION</span>
              </button>
            )}
            {selectedNode.type === 'evidence' && (
              <button
                onClick={() => openEvidence('#7201')}
                className="w-full py-2.5 px-3 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-[#C99A6A] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFY CRYPTOGRAPHIC PROVENANCE</span>
              </button>
            )}
            {selectedNode.type === 'scheme' && (
              <Link
                href="/scheme/AGR-004"
                className="w-full py-2.5 px-3 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-[#CBB093] transition-colors"
              >
                <span>OPEN SCHEME DOSSIER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {selectedNode.type === 'district' && (
              <Link
                href="/map"
                className="w-full py-2.5 px-3 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-[#CBB093] transition-colors"
              >
                <span>FOCUS ON GEOGRAPHIC MAP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
