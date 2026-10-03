'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { GOVERNANCE_GRAPH_DATA } from '@/lib/data/governance-data';
import { GraphNode, GraphLink, NodeType } from '@/lib/types';
import {
  Network,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Activity,
  Layers,
  MapPin,
  FolderKanban,
} from 'lucide-react';

export default function GovernanceGraphPage() {
  const { openEvidence, openWhyFlagged, openWorkspace } = useIntelligence();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('fnd_conv_gap');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

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

  const activeFocusId = hoveredNodeId || selectedNodeId;

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

  const nodePositions: Record<string, { x: number; y: number }> = {
    min_agri: { x: 180, y: 60 },
    min_rural: { x: 420, y: 60 },
    min_water: { x: 640, y: 60 },

    dept_agri: { x: 180, y: 130 },
    dept_rural: { x: 420, y: 130 },
    dept_water: { x: 640, y: 130 },

    sch_pkvy: { x: 120, y: 210 },
    sch_movcd: { x: 250, y: 210 },
    sch_pmkisan: { x: 370, y: 210 },
    sch_pmgsy: { x: 490, y: 210 },
    sch_pmayg: { x: 610, y: 210 },
    sch_jjm: { x: 730, y: 210 },

    bud_pkvy: { x: 50, y: 280 },
    bud_movcd: { x: 210, y: 280 },
    bud_pmkisan: { x: 370, y: 280 },

    dist_ndb: { x: 150, y: 340 },
    dist_gdc: { x: 580, y: 340 },
    dist_wsm: { x: 710, y: 340 },
    dist_pun: { x: 390, y: 340 },

    evt_jjm_ndb: { x: 260, y: 410 },
    fnd_conv_gap: { x: 440, y: 410 },
    evi_imis_7201: { x: 370, y: 480 },
    evi_awaas_4401: { x: 530, y: 480 },

    proj_ndb_soil: { x: 70, y: 470 },
    proj_ndb_road: { x: 160, y: 470 },
    proj_ndb_water: { x: 250, y: 480 },

    ben_smallholders: { x: 630, y: 470 },
    ben_tribal: { x: 720, y: 470 },

    out_soil_health: { x: 80, y: 390 },
    out_tap_security: { x: 730, y: 390 },
  };

  // Strictly using SUTRA Civic Intelligence palette for nodes
  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'ministry':
        return '#164A3A'; // Primary SUTRA Green
      case 'department':
        return '#5B8C78'; // Muted Green
      case 'scheme':
        return '#18201C'; // Deep Forest Charcoal
      case 'budget':
        return '#B58A45'; // Brand Gold
      case 'district':
        return '#28704D'; // Verified Green
      case 'event':
        return '#B56B32'; // Muted Saffron (emerging signals)
      case 'finding':
        return '#A54848'; // Alert Red
      case 'evidence':
        return '#28704D'; // Verified Green
      case 'project':
        return '#66706A'; // Secondary text
      case 'beneficiary':
        return '#B58A45'; // Brand Gold
      case 'outcome':
        return '#28704D'; // Verified Green
      default:
        return '#164A3A';
    }
  };

  const filteredNodes = useMemo(() => {
    if (filterType === 'ALL') return nodes;
    return nodes.filter((n) => n.type.toLowerCase() === filterType.toLowerCase());
  }, [nodes, filterType]);

  return (
    <AppShell>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D6CE] pb-6 select-none">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
            <span>GRAPH TOPOLOGY INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
            GOVERNANCE RELATIONSHIP GRAPH
          </h1>
          <p className="text-xs text-[#66706A] mt-0.5">
            Interactive multi-relational network mapping policy intent to ground outcomes. Hover over any node or link for details.
          </p>
        </div>

        {/* Node Type Filter Bar */}
        <div className="flex flex-wrap items-center gap-1 bg-[#FFFFFF] p-0.5 border border-[#D8D6CE] rounded text-xs font-mono">
          {['ALL', 'MINISTRY', 'SCHEME', 'DISTRICT', 'EVENT', 'FINDING', 'EVIDENCE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded transition-all ${
                filterType === type
                  ? 'bg-[#164A3A] text-white font-bold'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Interactive Canvas + Context Panel */}
      <div className="grid lg:grid-cols-12 gap-6 items-start select-none">
        {/* Left 8 Cols: Interactive Network Visualizer */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-[#66706A] border-b border-[#EAE8E1] pb-3">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#28704D]" />
              <span>Inspecting Node: <strong className="text-[#18201C]">{hoveredNode ? hoveredNode.label : selectedNode.label}</strong></span>
            </span>
            <span className="text-[11px] text-[#164A3A] font-semibold">
              {hoveredNode ? 'Hovering Node • Click to Lock' : 'Hover over any node or link for details'}
            </span>
          </div>

          {/* SVG Graph View */}
          <div
            className="w-full h-[540px] bg-[#F4F2EC] border border-[#D8D6CE] rounded-md overflow-hidden relative"
            onMouseLeave={() => {
              setHoveredNodeId(null);
              setHoveredLink(null);
              setTooltipPos(null);
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 820 520">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#898E89" opacity="0.8" />
                </marker>
                <marker
                  id="arrowhead-active"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#164A3A" />
                </marker>
              </defs>

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
                    <line
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke="transparent"
                      strokeWidth="14"
                    />

                    <line
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke={
                        isLinkHovered
                          ? '#164A3A'
                          : isOverlap
                          ? '#B58A45'
                          : isHighlighted
                          ? '#164A3A'
                          : '#C9C6BC'
                      }
                      strokeWidth={isLinkHovered ? 3 : isHighlighted || isOverlap ? 2.5 : 1.2}
                      strokeDasharray={isOverlap ? '4 4' : undefined}
                      markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    />

                    {isOverlap && (
                      <text
                        x={(sPos.x + tPos.x) / 2}
                        y={(sPos.y + tPos.y) / 2 - 8}
                        fill="#B58A45"
                        fontSize="9.5"
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {link.label || '82% Overlap'}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes (Crisp, High Visibility) */}
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
                    className="cursor-pointer transition-all duration-150"
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => {
                      setHoveredNodeId(node.id);
                      setTooltipPos(pos);
                    }}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Focus ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={node.val + 7}
                        fill="none"
                        stroke="#164A3A"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Outer node circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={node.val}
                      fill="#FFFFFF"
                      stroke={color}
                      strokeWidth={isSelected || isHovered ? 3 : 2}
                      className="transition-colors duration-150"
                    />

                    {/* Inner core circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={node.val - 5}
                      fill={color}
                      fillOpacity={0.15}
                    />

                    {/* Center dot */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="4"
                      fill={color}
                    />

                    {/* Legible Dark Label */}
                    <text
                      x={pos.x}
                      y={pos.y + node.val + 13}
                      textAnchor="middle"
                      fill="#18201C"
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight={isSelected || isHovered || isConnected ? 'bold' : '600'}
                      className="select-none pointer-events-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip on Node Hover */}
            {hoveredNode && tooltipPos && (() => {
              const isNearTop = tooltipPos.y < 160;
              const safeX = Math.max(150, Math.min(tooltipPos.x, 670));

              return (
                <div
                  className={`absolute z-30 pointer-events-none transform -translate-x-1/2 ${
                    isNearTop ? 'mt-8' : '-translate-y-full mb-3'
                  } px-3.5 py-2.5 rounded bg-[#FFFFFF] border border-[#164A3A] text-[#18201C] font-mono text-xs shadow-md max-w-xs`}
                  style={{
                    left: `${(safeX / 820) * 100}%`,
                    top: `${(tooltipPos.y / 520) * 100}%`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[#EAE8E1] pb-1.5 mb-1.5">
                    <span
                      className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold"
                      style={{
                        backgroundColor: `${getNodeColor(hoveredNode.type)}15`,
                        color: getNodeColor(hoveredNode.type),
                      }}
                    >
                      {hoveredNode.type}
                    </span>
                    <span className="text-[10px] text-[#66706A]">
                      {activeConnectedNodeIds.size - 1} Links
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[#18201C]">{hoveredNode.label}</div>
                  {hoveredNode.subtext && (
                    <div className="text-[11px] text-[#66706A] mt-1">{hoveredNode.subtext}</div>
                  )}
                </div>
              );
            })()}

            {/* Edge Type Legend */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#66706A] flex flex-wrap gap-2.5 bg-[#FFFFFF] px-3 py-1.5 border border-[#D8D6CE] rounded shadow-xs font-semibold">
              <span>OWNS</span>
              <span>•</span>
              <span>FUNDS</span>
              <span>•</span>
              <span>IMPLEMENTED_IN</span>
              <span>•</span>
              <span className="text-[#B58A45] font-bold">OVERLAPS_WITH</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Selected Node Contextual Panel */}
        <div className="lg:col-span-4 p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-5 shadow-xs">
          <div className="border-b border-[#EAE8E1] pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#66706A] font-semibold">
                NODE METADATA
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-[#18201C] font-bold">
                {selectedNode.type}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#18201C] font-editorial mt-1">
              {selectedNode.label}
            </h3>
            {selectedNode.subtext && (
              <p className="text-xs text-[#66706A] mt-1 leading-relaxed">{selectedNode.subtext}</p>
            )}
          </div>

          {/* Connected Edges */}
          <div className="space-y-2.5 font-mono text-xs">
            <span className="text-[10px] text-[#66706A] uppercase block font-semibold">
              Direct Relationships ({connectedNodeIds.size - 1})
            </span>

            <div className="space-y-1.5">
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
                      className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] hover:border-[#164A3A] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[9px] text-[#164A3A] font-bold block">
                          {isOut ? `──[${link.type}]──▶` : `◀──[${link.type}]──`}
                        </span>
                        <span className="font-semibold text-xs text-[#18201C]">
                          {otherNode?.label}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#66706A] uppercase">
                        {otherNode?.type}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="pt-2 border-t border-[#EAE8E1] space-y-2">
            {selectedNode.type === 'finding' && (
              <button
                onClick={() => openWorkspace('SUTRA-INV-2026-0001')}
                className="w-full py-2 px-3 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>OPEN INVESTIGATION WORKSPACE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {selectedNode.type === 'evidence' && (
              <button
                onClick={() => openEvidence('#7201')}
                className="w-full py-2 px-3 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>INSPECT EVIDENCE AUDIT</span>
              </button>
            )}
            {selectedNode.type === 'district' && (
              <Link
                href="/map"
                className="w-full py-2 px-3 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
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
