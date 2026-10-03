'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { GOVERNANCE_GRAPH_DATA } from '@/lib/data/governance-data';
import { GraphNode, GraphLink, NodeType } from '@/lib/types';
import {
  Network,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Activity,
  MapPin,
} from 'lucide-react';

const SCHEME_DOSSIER_MAP: Record<string, string> = {
  sch_pkvy: 'AGR-004',
  sch_movcd: 'AGR-008',
  sch_pmkisan: 'AGR-001',
  sch_pmgsy: 'RUR-002',
  sch_pmayg: 'RUR-003',
  sch_jjm: 'JAL-001',
};

const GRAPH_DISTRICT_MAP: Record<string, string> = {
  dist_ndb: 'DIST-27',
  dist_gdc: 'DIST-34',
  dist_wsm: 'DIST-16',
  dist_pun: 'DIST-25',
};

const GRAPH_EVIDENCE_MAP: Record<string, string> = {
  evi_rec_9281: 'REC-9281',
  evi_rec_4412: 'REC-4412',
};

const FILTER_SCOPE: Record<string, NodeType[]> = {
  ALL: [],
  SCHEMES: ['scheme', 'budget', 'project'],
  MINISTRIES: ['ministry', 'department'],
  FINDINGS: ['finding', 'event'],
  EVIDENCE: ['evidence'],
};

export default function GovernanceGraphPage() {
  const router = useRouter();
  const { openEvidence, openWhyFlagged } = useIntelligence();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('fnd_conv_gap');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
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
        subtext: 'LGD 512 Nandurbar • ₹22.10 Cr → ₹24.70 Cr (synthetic stream movement)',
      },
      {
        id: 'fnd_conv_gap',
        label: 'SUTRA-FND-0001 (18.4 pp Gap)',
        type: 'finding' as NodeType,
        val: 22,
        subtext: 'PMAY-G Completion (46.8%) vs JJM Tap Rate (28.4%) Divergence',
      },
      {
        id: 'evi_rec_9281',
        label: 'Evidence #9281 (PFMS Finance)',
        type: 'evidence' as NodeType,
        val: 16,
        subtext: 'Nandurbar finance record • Union Budget / PFMS',
      },
      {
        id: 'evi_rec_4412',
        label: 'Evidence #4412 (Housing Outcome)',
        type: 'evidence' as NodeType,
        val: 16,
        subtext: 'Gadchiroli housing record • State Administrative Register',
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
        target: 'evi_rec_9281',
        type: 'SUPPORTED_BY',
        label: 'Lineage',
      },
      {
        source: 'fnd_conv_gap',
        target: 'evi_rec_4412',
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
    min_rural: { x: 430, y: 60 },
    min_water: { x: 680, y: 60 },

    dept_agri: { x: 180, y: 130 },
    dept_rural: { x: 430, y: 130 },
    dept_water: { x: 680, y: 130 },

    sch_pkvy: { x: 90, y: 215 },
    sch_movcd: { x: 225, y: 215 },
    sch_pmkisan: { x: 360, y: 215 },
    sch_pmgsy: { x: 495, y: 215 },
    sch_pmayg: { x: 625, y: 215 },
    sch_jjm: { x: 755, y: 215 },

    bud_pkvy: { x: 90, y: 290 },
    bud_movcd: { x: 225, y: 290 },
    bud_pmkisan: { x: 360, y: 290 },

    dist_ndb: { x: 110, y: 370 },
    dist_gdc: { x: 330, y: 370 },
    dist_wsm: { x: 540, y: 370 },
    dist_pun: { x: 740, y: 370 },

    proj_ndb_soil: { x: 80, y: 455 },
    proj_ndb_road: { x: 220, y: 455 },
    proj_ndb_water: { x: 360, y: 455 },
    ben_smallholders: { x: 540, y: 455 },
    ben_tribal: { x: 710, y: 455 },

    out_soil_health: { x: 220, y: 530 },
    out_tap_security: { x: 480, y: 530 },

    evt_jjm_ndb: { x: 180, y: 610 },
    fnd_conv_gap: { x: 400, y: 610 },
    evi_rec_9281: { x: 590, y: 610 },
    evi_rec_4412: { x: 750, y: 610 },
  };

  const inFilterScope = (type: NodeType): boolean => {
    const scope = FILTER_SCOPE[filterType];
    if (!scope || scope.length === 0) return true;
    return scope.includes(type);
  };

  const scopedNodeCount = nodes.filter((n) => inFilterScope(n.type)).length;

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'ministry':
        return '#1D4ED8';
      case 'department':
        return '#475569';
      case 'scheme':
        return '#4F46E5';
      case 'budget':
        return '#D97706';
      case 'district':
        return '#059669';
      case 'finding':
        return '#DC2626';
      case 'event':
        return '#2563EB';
      case 'evidence':
        return '#0D9488';
      default:
        return '#64748B';
    }
  };

  return (
    <AppShell>
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>CROSS-MINISTRY KNOWLEDGE GRAPH • DETERMINISTIC TOPOLOGY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
            RELATIONSHIPS & TOPOLOGY
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Inter-ministerial relational graph revealing programmatic overlaps, funding conduits, territorial convergence, and live statutory findings.
          </p>
        </div>

        {/* Filter Types */}
        <div
          className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono"
          role="tablist"
          aria-label="Filter graph nodes by category"
        >
          {['ALL', 'SCHEMES', 'MINISTRIES', 'FINDINGS', 'EVIDENCE'].map((type) => (
            <button
              key={type}
              role="tab"
              aria-selected={filterType === type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph & Context Split */}
      <div className="grid lg:grid-cols-12 gap-6 items-start my-6">
        {/* Left 8 Cols: Interactive Graph SVG Visualizer on Deep Midnight Intelligence Surface */}
        <div className="lg:col-span-8 surface-dark-intel rounded-lg p-5 space-y-4 relative shadow-xl">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 border-b border-[#1E293B] pb-3">
            <div className="flex items-center space-x-2 font-semibold text-cyan-400">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>INTERACTIVE TOPOLOGY CANVAS ({nodes.length} NODES, {links.length} CONDUITS{filterType !== 'ALL' ? ` • ${scopedNodeCount} IN ${filterType} SCOPE` : ''})</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Ministry
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Scheme
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Finding
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400" /> Evidence
              </span>
            </div>
          </div>

          <div className="relative w-full h-[560px] bg-[#080E21] border border-[#1E293B] rounded-md overflow-hidden flex items-center justify-center shadow-inner">
            <svg
              className="w-full h-full"
              viewBox="0 0 860 660"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Governance relationship graph. Use Tab to move between nodes and Enter to select."
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setHoveredNodeId(null);
                }
              }}
            >
              <defs>
                <pattern id="graphGridDark" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                </pattern>
                <marker
                  id="arrowheadDark"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#475569" />
                </marker>
                <marker
                  id="arrowheadActiveDark"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#38BDF8" />
                </marker>
              </defs>

              <rect width="860" height="660" fill="url(#graphGridDark)" />

              {/* Render Graph Links */}
              {links.map((link, i) => {
                const sPos = nodePositions[link.source];
                const tPos = nodePositions[link.target];
                if (!sPos || !tPos) return null;

                const isConnectedToFocus =
                  link.source === activeFocusId || link.target === activeFocusId;
                const isOverlap = link.type === 'OVERLAPS_WITH';

                return (
                  <line
                    key={i}
                    x1={sPos.x}
                    y1={sPos.y}
                    x2={tPos.x}
                    y2={tPos.y}
                    stroke={
                      isOverlap
                        ? '#F59E0B'
                        : isConnectedToFocus
                        ? '#38BDF8'
                        : '#334155'
                    }
                    strokeWidth={isConnectedToFocus ? 2.5 : isOverlap ? 2 : 1}
                    strokeDasharray={isOverlap ? '4 4' : undefined}
                    opacity={isConnectedToFocus ? 1 : 0.65}
                    markerEnd={isConnectedToFocus ? 'url(#arrowheadActiveDark)' : 'url(#arrowheadDark)'}
                    className="transition-all duration-200"
                  />
                );
              })}

              {/* Render Graph Nodes */}
              {nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isConnected = activeConnectedNodeIds.has(node.id);
                const inScope = inFilterScope(node.type);
                const color = getNodeColor(node.type);

                return (
                  <g
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.type} node: ${node.label}. Press Enter to view dossier.`}
                    className="cursor-pointer"
                    onClick={() => setSelectedNodeId(node.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNodeId(node.id);
                      }
                    }}
                    onMouseEnter={() => {
                      setHoveredNodeId(node.id);
                    }}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onFocus={() => {
                      setHoveredNodeId(node.id);
                    }}
                    onBlur={() => setHoveredNodeId(null)}
                    opacity={!inScope ? 0.12 : isSelected || isHovered ? 1 : isConnected ? 0.95 : 0.4}
                  >
                    {/* Glowing halo ring on hover or selection */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={node.val + 8}
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-spin pointer-events-none"
                        style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '8s' }}
                      />
                    )}

                    {/* Outer circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={node.val}
                      fill="#0B132B"
                      stroke={isSelected ? '#38BDF8' : isHovered ? '#60A5FA' : color}
                      strokeWidth={isSelected || isHovered ? 3 : 2}
                      className="transition-colors duration-200 shadow-sm"
                    />

                    {/* Inner indicator dot */}
                    <circle cx={pos.x} cy={pos.y} r="4" fill={color} className="pointer-events-none" />

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + node.val + 13}
                      textAnchor="middle"
                      fill={isSelected ? '#38BDF8' : '#CBD5E1'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight={isSelected || isHovered ? 'bold' : '600'}
                      className="select-none pointer-events-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hovered-node readout bar — fixed position so it can never clip at SVG edges */}
            {hoveredNode && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3.5 py-2 rounded-md bg-[#0B132B]/95 border border-cyan-500/50 text-white font-mono text-xs shadow-2xl w-max max-w-[92%]">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0"
                    style={{
                      backgroundColor: `${getNodeColor(hoveredNode.type)}25`,
                      color: '#FFFFFF',
                      border: `1px solid ${getNodeColor(hoveredNode.type)}80`,
                    }}
                  >
                    {hoveredNode.type}
                  </span>
                  <span className="font-bold text-sm text-cyan-300 truncate">{hoveredNode.label}</span>
                  <span className="text-[10px] text-slate-300 shrink-0">
                    {activeConnectedNodeIds.size - 1} links
                  </span>
                </div>
                {hoveredNode.subtext && (
                  <div className="text-[11px] text-slate-300 mt-0.5 truncate">{hoveredNode.subtext}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Selected Node Contextual Panel with Deliberate Surfaces */}
        <div className="lg:col-span-4 surface-neutral-analytical rounded-lg p-5 border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">
                RELATIONAL NODE METADATA
              </span>
              <span
                className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                style={{
                  backgroundColor: `${getNodeColor(selectedNode.type)}15`,
                  color: getNodeColor(selectedNode.type),
                  border: `1px solid ${getNodeColor(selectedNode.type)}40`,
                }}
              >
                {selectedNode.type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-editorial mt-1">
              {selectedNode.label}
            </h3>
            {selectedNode.subtext && (
              <p className="text-xs text-slate-600 mt-0.5">{selectedNode.subtext}</p>
            )}
          </div>

          {/* Connected Edges */}
          <div className="space-y-2.5 font-mono text-xs border-t border-slate-100 pt-3">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Direct Governance Conduits ({connectedNodeIds.size - 1})
            </span>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
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
                      className="p-2.5 rounded-md bg-white border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-between shadow-2xs"
                    >
                      <div>
                        <span className="text-[9px] text-blue-700 block font-bold">
                          {isOut ? `──[${link.type}]──▶` : `◀──[${link.type}]──`}
                        </span>
                        <span className="font-semibold text-xs text-slate-900">
                          {otherNode?.label}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase font-semibold">
                        {otherNode?.type}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Action Link */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {selectedNode.type === 'finding' && (
              <div className="space-y-2">
                <button
                  onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                  className="w-full py-2 px-3 rounded-md bg-amber-50 text-amber-900 font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>WHY WAS THIS FLAGGED?</span>
                </button>
                <button
                  onClick={() => router.push('/investigation/SUTRA-INV-2026-0001')}
                  className="w-full py-2 px-3 rounded-md bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>OPEN INVESTIGATION WORKSPACE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {selectedNode.type === 'event' && (
              <button
                onClick={() => router.push('/investigation/SUTRA-INV-2026-0001')}
                className="w-full py-2 px-3 rounded-md bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>INSPECT CORRELATED INVESTIGATION</span>
              </button>
            )}
            {selectedNode.type === 'evidence' && (
              <button
                onClick={() => openEvidence(GRAPH_EVIDENCE_MAP[selectedNode.id] || 'REC-9281')}
                className="w-full py-2 px-3 rounded-md bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFY CRYPTOGRAPHIC PROVENANCE</span>
              </button>
            )}
            {selectedNode.type === 'scheme' &&
              (SCHEME_DOSSIER_MAP[selectedNode.id] ? (
                <Link
                  href={`/scheme/${SCHEME_DOSSIER_MAP[selectedNode.id]}`}
                  className="w-full py-2 px-3 rounded-md bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  <span>OPEN SCHEME DOSSIER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href="/schemes"
                  className="w-full py-2 px-3 rounded-md bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  <span>BROWSE SCHEME REGISTRY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            {selectedNode.type === 'district' && (
              <Link
                href={`/map?district=${GRAPH_DISTRICT_MAP[selectedNode.id] || 'DIST-27'}`}
                className="w-full py-2 px-3 rounded-md bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-700 transition-colors shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>FOCUS ON GEOGRAPHIC MAP</span>
              </Link>
            )}
            {(selectedNode.type === 'ministry' ||
              selectedNode.type === 'department' ||
              selectedNode.type === 'budget' ||
              selectedNode.type === 'project' ||
              selectedNode.type === 'beneficiary' ||
              selectedNode.type === 'outcome') && (
              <Link
                href="/evidence"
                className="w-full py-2 px-3 rounded-md bg-slate-700 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-600 transition-colors shadow-2xs"
              >
                <span>TRACE IN EVIDENCE HUB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
