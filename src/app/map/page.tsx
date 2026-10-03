'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { District } from '@/lib/types';
import {
  MapPin,
  Layers,
  Info,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Zap,
  Activity,
  Radio,
  AlertCircle,
  Network,
  Sparkles,
  FileText,
} from 'lucide-react';

type MetricFilter = 'Coverage' | 'Utilization' | 'Beneficiaries' | 'Outcomes' | 'Gaps' | 'Signals';

export default function GeographicIntelligencePage() {
  const router = useRouter();
  const {
    openEvidence,
    openExplain,
    openExecutiveBrief,
    openWorkspace,
    openWhyFlagged,
    latestEvent,
    activeDistrictLiveState,
  } = useIntelligence();

  const [viewLevel, setViewLevel] = useState<'INDIA' | 'MAHARASHTRA'>('MAHARASHTRA');
  const [activeFilter, setActiveFilter] = useState<MetricFilter>('Gaps');
  const [selectedDistrict, setSelectedDistrict] = useState<District>(
    MAHARASHTRA_DISTRICTS.find((d) => d.name === 'Nandurbar') || MAHARASHTRA_DISTRICTS[0]
  );
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [hoveredState, setHoveredState] = useState<typeof indiaStates[0] | null>(null);
  const [mapTooltipPos, setMapTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const indiaStates = [
    { name: 'Maharashtra', code: 'MH', coverage: 71, util: 73, alloc: '₹28,400 Cr', focus: true, x: 260, y: 310 },
    { name: 'Uttar Pradesh', code: 'UP', coverage: 68, util: 69, alloc: '₹34,200 Cr', focus: false, x: 340, y: 190 },
    { name: 'Madhya Pradesh', code: 'MP', coverage: 66, util: 65, alloc: '₹21,800 Cr', focus: false, x: 300, y: 250 },
    { name: 'Gujarat', code: 'GJ', coverage: 78, util: 81, alloc: '₹19,500 Cr', focus: false, x: 190, y: 250 },
    { name: 'Karnataka', code: 'KA', coverage: 76, util: 78, alloc: '₹22,100 Cr', focus: false, x: 260, y: 400 },
    { name: 'Bihar', code: 'BR', coverage: 61, util: 59, alloc: '₹24,600 Cr', focus: false, x: 440, y: 210 },
  ];

  const getFillColor = (d: District) => {
    if (activeFilter === 'Gaps') {
      if (d.isGapFlagged) {
        if (d.gapPercentagePoints >= 30) return '#F43F5E'; // rose-500
        return '#F59E0B'; // amber-500
      }
      return '#E2E8F0'; // slate-200
    }

    if (activeFilter === 'Coverage') {
      if (d.coverageRate >= 75) return '#10B981';
      if (d.coverageRate >= 60) return '#3B82F6';
      return '#F43F5E';
    }

    if (activeFilter === 'Utilization') {
      if (d.fundUtilizationRate >= 75) return '#10B981';
      if (d.fundUtilizationRate >= 55) return '#3B82F6';
      return '#F43F5E';
    }

    if (activeFilter === 'Signals') {
      return d.isGapFlagged ? '#F43F5E' : '#334155';
    }

    return '#3B82F6';
  };

  // Sub-district blocks for administrative hierarchy demonstration
  const districtBlocks: Record<string, Array<{ name: string; lgd: string; coverage: number; status: 'CRITICAL' | 'MODERATE' | 'NORMAL' }>> = {
    Nandurbar: [
      { name: 'Akkalkuwa', lgd: '4831', coverage: 24, status: 'CRITICAL' },
      { name: 'Akrani (Dhadgaon)', lgd: '4832', coverage: 21, status: 'CRITICAL' },
      { name: 'Taloda', lgd: '4833', coverage: 31, status: 'MODERATE' },
      { name: 'Shahada', lgd: '4834', coverage: 38, status: 'MODERATE' },
      { name: 'Nandurbar (Hq)', lgd: '4835', coverage: 42, status: 'MODERATE' },
      { name: 'Navapur', lgd: '4836', coverage: 29, status: 'CRITICAL' },
    ],
    Gadchiroli: [
      { name: 'Bhamragad', lgd: '4790', coverage: 19, status: 'CRITICAL' },
      { name: 'Etapalli', lgd: '4791', coverage: 22, status: 'CRITICAL' },
      { name: 'Aheri', lgd: '4792', coverage: 28, status: 'MODERATE' },
      { name: 'Sironcha', lgd: '4793', coverage: 33, status: 'MODERATE' },
    ],
    Washim: [
      { name: 'Malegaon', lgd: '4980', coverage: 39, status: 'MODERATE' },
      { name: 'Mangrulpir', lgd: '4981', coverage: 41, status: 'MODERATE' },
      { name: 'Manora', lgd: '4982', coverage: 35, status: 'CRITICAL' },
      { name: 'Washim (Hq)', lgd: '4983', coverage: 48, status: 'NORMAL' },
    ],
  };

  const activeBlocks = districtBlocks[selectedDistrict.name] || [
    { name: `${selectedDistrict.name} North`, lgd: '5001', coverage: selectedDistrict.coverageRate - 6, status: 'MODERATE' as const },
    { name: `${selectedDistrict.name} Central`, lgd: '5002', coverage: selectedDistrict.coverageRate, status: 'NORMAL' as const },
    { name: `${selectedDistrict.name} South`, lgd: '5003', coverage: selectedDistrict.coverageRate - 9, status: selectedDistrict.isGapFlagged ? 'CRITICAL' as const : 'NORMAL' as const },
  ];

  return (
    <AppShell>
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>TERRITORIAL GOVERNANCE LAYER • GIS CARTOGRAPHIC MESH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
            GEOGRAPHIC INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {viewLevel === 'INDIA'
              ? 'National Atlas View: Inspect inter-state allocations. Select Maharashtra State to drill down into 36 districts.'
              : 'Cartographic GIS analysis across 36 districts and administrative blocks of Maharashtra State.'}
          </p>
        </div>

        {/* View Zoom & Metric Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Toggle */}
          <div className="flex items-center p-1 bg-[#0B132B] border border-[#1E293B] rounded-md text-xs font-mono">
            <button
              onClick={() => setViewLevel('INDIA')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewLevel === 'INDIA'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              INDIA VIEW
            </button>
            <button
              onClick={() => setViewLevel('MAHARASHTRA')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewLevel === 'MAHARASHTRA'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MAHARASHTRA (36 DISTS)
            </button>
          </div>

          {/* Metric Layer Controls */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-md text-xs font-mono shadow-2xs">
            {(['Coverage', 'Utilization', 'Beneficiaries', 'Outcomes', 'Gaps', 'Signals'] as MetricFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Map & Intelligence Contextual Split */}
      <div className="grid lg:grid-cols-12 gap-6 items-start my-6">
        {/* Left 8 Cols: Custom Cartographic Visualizer on Deep GIS Command Surface */}
        <div className="lg:col-span-8 surface-dark-intel rounded-lg p-5 space-y-4 relative shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {viewLevel === 'INDIA'
                  ? 'NATIONAL ATLAS MESH • CLICK MAHARASHTRA TO DRILL DOWN'
                  : 'REGION: MAHARASHTRA STATE (36 DISTRICT BOUNDARIES ACTIVE)'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-300 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Severe Gap (&gt;30 pp)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate Gap
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Benchmark Met
              </span>
            </div>
          </div>

          {/* Interactive SVG Cartographic Grid with Satellite Coordinate Matrix */}
          <div
            className="relative w-full h-[520px] bg-[#080E21] border border-[#1E293B] rounded-md overflow-hidden flex items-center justify-center p-4 shadow-inner"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setMapTooltipPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }}
            onMouseLeave={() => {
              setHoveredDistrict(null);
              setHoveredState(null);
              setMapTooltipPos(null);
            }}
          >
            {/* Latitude / Longitude Coordinate Ticks */}
            <div className="absolute top-2 left-3 font-mono text-[9px] text-cyan-500/60 pointer-events-none">
              LAT: 15°45&apos;N — 22°02&apos;N
            </div>
            <div className="absolute top-2 right-3 font-mono text-[9px] text-cyan-500/60 pointer-events-none">
              LNG: 72°36&apos;E — 80°54&apos;E
            </div>

            {viewLevel === 'INDIA' ? (
              /* All-India National Map View */
              <svg className="w-full h-full" viewBox="0 0 600 500">
                <defs>
                  <pattern id="gridPatternDarkIndia" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="600" height="500" fill="url(#gridPatternDarkIndia)" />

                {/* Simplified India silhouette outline */}
                <path
                  d="M 230 60 L 290 80 L 330 130 L 400 170 L 480 200 L 520 220 L 460 270 L 410 260 L 370 330 L 320 440 L 280 470 L 260 410 L 210 330 L 160 260 L 190 190 L 180 130 Z"
                  fill="#0B132B"
                  stroke="#233560"
                  strokeWidth="1.5"
                />

                {/* State Clusters */}
                {indiaStates.map((state) => (
                  <g
                    key={state.code}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => {
                      if (state.name === 'Maharashtra') {
                        setViewLevel('MAHARASHTRA');
                      }
                    }}
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    <rect
                      x={state.x - 35}
                      y={state.y - 20}
                      width="70"
                      height="40"
                      rx="4"
                      fill={state.focus ? '#1D4ED8' : '#101F42'}
                      fillOpacity={state.focus ? 0.95 : 0.85}
                      stroke={state.focus ? '#38BDF8' : '#233560'}
                      strokeWidth={state.focus ? 2 : 1}
                    />
                    <text
                      x={state.x}
                      y={state.y - 4}
                      textAnchor="middle"
                      fill={state.focus ? '#FFFFFF' : '#CBD5E1'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {state.code}
                    </text>
                    <text
                      x={state.x}
                      y={state.y + 10}
                      textAnchor="middle"
                      fill={state.focus ? '#BAE6FD' : '#64748B'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {state.coverage}% cov
                    </text>
                    {state.focus && (
                      <circle
                        cx={state.x + 30}
                        cy={state.y - 15}
                        r="4"
                        fill="#38BDF8"
                        className="animate-ping"
                      />
                    )}
                  </g>
                ))}
              </svg>
            ) : (
              /* Maharashtra 36 Districts Detailed Choropleth */
              <svg
                className="w-full h-full animate-in zoom-in-95 duration-300"
                viewBox="0 0 800 500"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <pattern id="gridPatternDarkMh" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#172554" strokeWidth="0.5" />
                  </pattern>
                  {/* Subtle topo-contour rings pattern */}
                  <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="800" height="500" fill="url(#gridPatternDarkMh)" />

                {/* State boundary background outline with topographic silhouette */}
                <path
                  d="M 160 80 L 320 60 L 520 70 L 680 120 L 760 210 L 740 330 L 610 420 L 440 440 L 320 460 L 220 420 L 140 280 L 130 180 Z"
                  fill="#0B1E3B"
                  fillOpacity="0.75"
                  stroke="#1E3A8A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Major River Basins (Godavari, Krishna, Tapi topological conduits) */}
                <path
                  d="M 170 120 Q 320 180 520 220 T 730 300"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  strokeDasharray="2 3"
                />
                <path
                  d="M 220 280 Q 360 340 540 380"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeDasharray="2 3"
                />

                {/* Render 36 District Polygons / Nodes mapped to geo coordinates */}
                {MAHARASHTRA_DISTRICTS.map((district) => {
                  const minLng = 72.5;
                  const maxLng = 80.5;
                  const minLat = 15.5;
                  const maxLat = 22.0;

                  const x = ((district.coordinates[1] - minLng) / (maxLng - minLng)) * 620 + 80;
                  const y = (1 - (district.coordinates[0] - minLat) / (maxLat - minLat)) * 360 + 70;

                  const isSelected = selectedDistrict.id === district.id;
                  const isHovered = hoveredDistrict?.id === district.id;
                  const fillColor = getFillColor(district);

                  return (
                    <g
                      key={district.id}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => setSelectedDistrict(district)}
                      onMouseEnter={() => setHoveredDistrict(district)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    >
                      {/* Pulsing ring if selected */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="32"
                          fill="none"
                          stroke="#38BDF8"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="animate-spin"
                          style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '9s' }}
                        />
                      )}

                      {/* Sonar Radar Pulse Ring on Priority Flagged Districts */}
                      {district.isGapFlagged && (
                        <circle
                          cx={x}
                          cy={y}
                          r="22"
                          fill="none"
                          stroke="#F43F5E"
                          className="animate-ping opacity-40 pointer-events-none"
                        />
                      )}

                      {/* District Area Polygon representation */}
                      <rect
                        x={x - 22}
                        y={y - 18}
                        width="44"
                        height="36"
                        rx="4"
                        fill={isSelected ? '#1D4ED8' : fillColor}
                        fillOpacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
                        stroke={isSelected ? '#38BDF8' : isHovered ? '#60A5FA' : '#334155'}
                        strokeWidth={isSelected || isHovered ? 2 : 1}
                      />

                      {/* District Code Label */}
                      <text
                        x={x}
                        y={y - 2}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        letterSpacing="0.05em"
                      >
                        {district.code}
                      </text>

                      {/* Metric indicator */}
                      <text
                        x={x}
                        y={y + 10}
                        textAnchor="middle"
                        fill={isSelected ? '#BAE6FD' : '#CBD5E1'}
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {activeFilter === 'Coverage'
                          ? `${district.coverageRate}%`
                          : activeFilter === 'Utilization'
                          ? `${district.fundUtilizationRate}%`
                          : `${district.projectsCount} proj`}
                      </text>

                      {/* Priority Warning Dot on flagged districts */}
                      {district.isGapFlagged && (
                        <circle cx={x + 18} cy={y - 14} r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Floating Tooltip for India State Hover */}
            {hoveredState && mapTooltipPos && viewLevel === 'INDIA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-md bg-[#0B132B] border border-[#233560] text-white font-mono text-xs shadow-2xl transition-opacity duration-150"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 90), 510),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="font-bold text-sm text-cyan-300">{hoveredState.name}</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Allocation: {hoveredState.alloc}</div>
                <div className="flex gap-3 text-[10px] mt-1 pt-1 border-t border-[#1E293B]">
                  <span>Coverage: <strong className="text-emerald-400">{hoveredState.coverage}%</strong></span>
                  <span>Utilization: <strong className="text-cyan-400">{hoveredState.util}%</strong></span>
                </div>
              </div>
            )}

            {/* Floating Tooltip for Maharashtra District Hover */}
            {hoveredDistrict && mapTooltipPos && viewLevel === 'MAHARASHTRA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-md bg-[#0B132B] border border-cyan-500/50 text-white font-mono text-xs shadow-2xl min-w-[220px] transition-opacity duration-150"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 110), 690),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#1E293B] pb-1.5 mb-1.5">
                  <span className="font-bold text-sm text-white">{hoveredDistrict.name}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      hoveredDistrict.isGapFlagged
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {hoveredDistrict.isGapFlagged ? `GAP ${hoveredDistrict.gapPercentagePoints} pp` : 'BENCHMARK MET'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                  <div>Coverage: <strong className="text-cyan-300">{hoveredDistrict.coverageRate}%</strong></div>
                  <div>Utilization: <strong className="text-white">{hoveredDistrict.fundUtilizationRate}%</strong></div>
                  <div>Projects: <strong className="text-slate-300">{hoveredDistrict.projectsCount}</strong></div>
                  <div>Allocation: <strong className="text-emerald-400">₹{hoveredDistrict.budgetAllocatedCr} Cr</strong></div>
                </div>
                <div className="mt-1.5 pt-1 border-t border-[#1E293B] text-[9px] text-cyan-400">
                  Click district to inspect cross-ministry telemetry
                </div>
              </div>
            )}

            {/* Floating Map Watermark */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500">
              LGD CODE MAPPED • EPSG:4326 PROJECTION • SURVEY OF INDIA COMPLIANT
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <span>
              {viewLevel === 'INDIA'
                ? 'Click Maharashtra card to zoom into district choropleth'
                : 'Click any district marker to inspect cross-ministry telemetry'}
            </span>
            <span>
              Target Selected: <strong className="text-cyan-400">{selectedDistrict.name} (LGD: {selectedDistrict.code})</strong>
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Contextual Intelligence Panel with Deliberate Surfaces */}
        <div className="lg:col-span-4 space-y-5">
          {/* Blue Geographic Panel Header */}
          <div className="surface-geo-blue rounded-lg p-5 shadow-lg space-y-4 text-white">
            <div className="border-b border-[#1E3A8A] pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  DISTRICT LIVE INTELLIGENCE
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#080E21] text-cyan-300 border border-[#1E3A8A] font-semibold">
                  LGD {selectedDistrict.name === 'Nandurbar' ? '512' : selectedDistrict.code}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-editorial mt-1">
                {selectedDistrict.name.toUpperCase()}
              </h2>
              <p className="text-xs text-blue-200">{selectedDistrict.zone}, Maharashtra State</p>
            </div>

            {/* Key Metrics on Deliberate Surfaces */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-md bg-[#080E21] border border-[#1E3A8A]">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">PROGRAMME COVERAGE</span>
                <div className="text-xl font-bold text-white mt-0.5">{selectedDistrict.coverageRate}%</div>
                <span className="text-[10px] text-slate-400">Benchmark: {selectedDistrict.regionalBenchmarkRate}%</span>
              </div>

              <div className="p-3 rounded-md bg-[#080E21] border border-[#1E3A8A]">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">FUND UTILIZATION</span>
                <div className="text-xl font-bold text-white mt-0.5">{selectedDistrict.fundUtilizationRate}%</div>
                <span className="text-[10px] text-slate-400">Pace Target: 80%</span>
              </div>

              <div className="p-3 rounded-md bg-[#080E21] border border-[#1E3A8A]">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">BUDGET ALLOCATED</span>
                <div className="text-base font-bold text-cyan-300 mt-0.5">₹{selectedDistrict.budgetAllocatedCr} Cr</div>
                <span className="text-[10px] text-slate-400">Across 4 schemes</span>
              </div>

              <div className={`p-3 rounded-md border ${selectedDistrict.isGapFlagged ? 'bg-rose-950/80 border-rose-800' : 'bg-emerald-950/80 border-emerald-800'}`}>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">DRAWDOWN DEFICIT</span>
                <div className={`text-base font-bold mt-0.5 ${selectedDistrict.isGapFlagged ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {selectedDistrict.gapPercentagePoints} pp
                </div>
                <span className="text-[10px] text-slate-400">Variance Index</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#1E3A8A]">
              <button
                onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>WHY FLAGGED? EXPLAIN INSIGHT</span>
              </button>

              <button
                onClick={() => router.push('/investigation/SUTRA-INV-2026-0001')}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>OPEN INVESTIGATION WORKSPACE</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => openEvidence(selectedDistrict.evidenceRecordId || '#7201')}
                  className="py-1.5 px-2.5 bg-[#080E21] hover:bg-[#101F42] border border-[#233560] text-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer text-center truncate"
                >
                  View Evidence
                </button>
                <button
                  onClick={() => openExecutiveBrief(selectedDistrict)}
                  className="py-1.5 px-2.5 bg-[#080E21] hover:bg-[#101F42] border border-[#233560] text-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer text-center truncate"
                >
                  Executive Brief
                </button>
              </div>
            </div>
          </div>

          {/* Sub-District Administrative Hierarchy (District -> Block -> GP) */}
          <div className="surface-neutral-analytical rounded-lg p-4 space-y-3 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-blue-600" />
                ADMINISTRATIVE HIERARCHY DRILL-DOWN
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                LGD Level 3 (Taluka)
              </span>
            </div>

            <div className="font-mono text-xs text-slate-600 flex items-center gap-1.5">
              <span className="font-bold text-slate-900">MH</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-bold text-blue-700">{selectedDistrict.name}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-500">Sub-District Blocks</span>
            </div>

            <div className="space-y-2 pt-1">
              {activeBlocks.map((block) => (
                <div
                  key={block.lgd}
                  className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs font-mono"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">{block.name}</span>
                    <span className="text-[10px] text-slate-400">LGD: {block.lgd} • Block Hub</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{block.coverage}% cov</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1 rounded ${
                        block.status === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : block.status === 'MODERATE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {block.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>Habitations: ~1,240</span>
              <span>GPs: 593 Active</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
