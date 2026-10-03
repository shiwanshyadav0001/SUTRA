'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

type MetricFilter = 'Coverage' | 'Utilization' | 'Beneficiaries' | 'Outcomes' | 'Gaps' | 'Signals';

export default function GeographicIntelligencePage() {
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
        if (d.gapPercentagePoints >= 30) return '#A66A62';
        return '#B59A63';
      }
      return '#20201D';
    }

    if (activeFilter === 'Coverage') {
      if (d.coverageRate >= 75) return '#5E8B72';
      if (d.coverageRate >= 60) return '#B78A5A';
      return '#A66A62';
    }

    if (activeFilter === 'Utilization') {
      if (d.fundUtilizationRate >= 75) return '#5E8B72';
      if (d.fundUtilizationRate >= 55) return '#B78A5A';
      return '#A66A62';
    }

    if (activeFilter === 'Signals') {
      return d.isGapFlagged ? '#A66A62' : '#20201D';
    }

    return '#B78A5A';
  };

  return (
    <AppShell>
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2926] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
            <span>TERRITORIAL GOVERNANCE LAYER</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
            GEOGRAPHIC INTELLIGENCE
          </h1>
          <p className="text-xs text-[#8E887E] mt-0.5">
            {viewLevel === 'INDIA'
              ? 'National Overview: Select Maharashtra state to drill down into 36 districts.'
              : 'Cartographic analysis across 36 districts of Maharashtra State.'}
          </p>
        </div>

        {/* View Zoom & Metric Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Toggle */}
          <div className="flex items-center p-1 bg-[#141412] border border-[#2A2926] rounded-sm text-xs font-mono">
            <button
              onClick={() => setViewLevel('INDIA')}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                viewLevel === 'INDIA'
                  ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold'
                  : 'text-[#8E887E] hover:text-[#F3F0E8]'
              }`}
            >
              INDIA VIEW
            </button>
            <button
              onClick={() => setViewLevel('MAHARASHTRA')}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                viewLevel === 'MAHARASHTRA'
                  ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold'
                  : 'text-[#8E887E] hover:text-[#F3F0E8]'
              }`}
            >
              MAHARASHTRA (36 DISTS)
            </button>
          </div>

          {/* Metric Layer Controls */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#141412] border border-[#2A2926] rounded-sm text-xs font-mono">
            {(['Coverage', 'Utilization', 'Beneficiaries', 'Outcomes', 'Gaps', 'Signals'] as MetricFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-sm transition-all ${
                    activeFilter === filter
                      ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold shadow'
                      : 'text-[#8E887E] hover:text-[#F3F0E8]'
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
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Custom Cartographic Visualizer */}
        <div className="lg:col-span-8 bg-[#141412] border border-[#2A2926] rounded-sm p-6 space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#8E887E]">
              <MapPin className="w-3.5 h-3.5 text-[#B78A5A]" />
              <span>
                {viewLevel === 'INDIA'
                  ? 'NATIONAL ATLAS VIEW • CLICK MAHARASHTRA TO DRILL DOWN'
                  : 'REGION: MAHARASHTRA STATE (36 DISTRICT BOUNDARIES ACTIVE)'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#8E887E] flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#A66A62]" /> Severe Gap (&gt;30 pp)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B59A63]" /> Moderate Gap
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#5E8B72]" /> Benchmark Met
              </span>
            </div>
          </div>

          {/* Interactive SVG Cartographic Grid */}
          <div
            className="relative w-full h-[520px] bg-[#0D0D0C] border border-[#2A2926] rounded-sm overflow-hidden flex items-center justify-center p-4"
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
            {viewLevel === 'INDIA' ? (
              /* All-India National Map View */
              <svg className="w-full h-full" viewBox="0 0 600 500">
                {/* Simplified India silhouette outline */}
                <path
                  d="M 230 60 L 290 80 L 330 130 L 400 170 L 480 200 L 520 220 L 460 270 L 410 260 L 370 330 L 320 440 L 280 470 L 260 410 L 210 330 L 160 260 L 190 190 L 180 130 Z"
                  fill="#161614"
                  stroke="#2A2926"
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
                      rx="3"
                      fill={state.focus ? '#B78A5A' : '#191917'}
                      fillOpacity={state.focus ? 0.9 : 0.6}
                      stroke={state.focus ? '#F3F0E8' : '#2A2926'}
                      strokeWidth={state.focus ? 2 : 1}
                    />
                    <text
                      x={state.x}
                      y={state.y - 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
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
                      fill={state.focus ? '#0D0D0C' : '#8E887E'}
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
                        fill="#5E8B72"
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
                  <pattern id="gridPattern2" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1F1E1B" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="800" height="500" fill="url(#gridPattern2)" />

                {/* State boundary background outline */}
                <path
                  d="M 160 80 L 320 60 L 520 70 L 680 120 L 760 210 L 740 330 L 610 420 L 440 440 L 320 460 L 220 420 L 140 280 L 130 180 Z"
                  fill="#161614"
                  stroke="#2A2926"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
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
                          stroke="#B78A5A"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '8s' }}
                        />
                      )}

                      {/* Sonar Radar Pulse Ring on Priority Flagged Districts */}
                      {district.isGapFlagged && (
                        <circle
                          cx={x}
                          cy={y}
                          r="22"
                          fill="none"
                          stroke="#A66A62"
                          className="animate-sonar-ring pointer-events-none"
                        />
                      )}

                      {/* District Area Polygon representation */}
                      <rect
                        x={x - 22}
                        y={y - 18}
                        width="44"
                        height="36"
                        rx="3"
                        fill={fillColor}
                        fillOpacity={isSelected ? 0.9 : isHovered ? 0.85 : 0.6}
                        stroke={isSelected ? '#F3F0E8' : isHovered ? '#B78A5A' : '#2A2926'}
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
                        fill="#C9C2B7"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        {activeFilter === 'Coverage'
                          ? `${district.coverageRate}%`
                          : activeFilter === 'Utilization'
                          ? `${district.fundUtilizationRate}%`
                          : `${district.projectsCount} proj`}
                      </text>

                      {/* Priority Warning Dot on flagged districts */}
                      {district.isGapFlagged && (
                        <circle cx={x + 18} cy={y - 14} r="3.5" fill="#A66A62" stroke="#0D0D0C" strokeWidth="1" />
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Floating Tooltip for India State Hover */}
            {hoveredState && mapTooltipPos && viewLevel === 'INDIA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded bg-[#141412]/95 border border-[#B78A5A] text-[#F3F0E8] font-mono text-xs shadow-2xl backdrop-blur-md transition-opacity duration-150"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 90), 510),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="font-bold text-sm text-[#F3F0E8]">{hoveredState.name}</div>
                <div className="text-[10px] text-[#8E887E] mt-0.5">Allocation: {hoveredState.alloc}</div>
                <div className="flex gap-3 text-[10px] mt-1 pt-1 border-t border-[#2A2926]">
                  <span>Coverage: <strong className="text-[#5E8B72]">{hoveredState.coverage}%</strong></span>
                  <span>Utilization: <strong className="text-[#B78A5A]">{hoveredState.util}%</strong></span>
                </div>
              </div>
            )}

            {/* Floating Tooltip for Maharashtra District Hover */}
            {hoveredDistrict && mapTooltipPos && viewLevel === 'MAHARASHTRA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded bg-[#141412]/95 border border-[#B78A5A] text-[#F3F0E8] font-mono text-xs shadow-2xl backdrop-blur-md min-w-[210px] transition-opacity duration-150"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 110), 690),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#2A2926] pb-1.5 mb-1.5">
                  <span className="font-bold text-sm text-[#F3F0E8]">{hoveredDistrict.name}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      hoveredDistrict.isGapFlagged ? 'bg-[#A66A62]/20 text-[#A66A62] border border-[#A66A62]/40' : 'bg-[#5E8B72]/20 text-[#5E8B72] border border-[#5E8B72]/40'
                    }`}
                  >
                    {hoveredDistrict.isGapFlagged ? `GAP ${hoveredDistrict.gapPercentagePoints} pp` : 'BENCHMARK MET'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                  <div>Coverage: <strong className="text-[#F3F0E8]">{hoveredDistrict.coverageRate}%</strong></div>
                  <div>Utilization: <strong className="text-[#F3F0E8]">{hoveredDistrict.fundUtilizationRate}%</strong></div>
                  <div>Projects: <strong className="text-[#F3F0E8]">{hoveredDistrict.projectsCount}</strong></div>
                  <div>Allocation: <strong className="text-[#B78A5A]">₹{hoveredDistrict.budgetAllocatedCr} Cr</strong></div>
                </div>
                <div className="mt-1.5 pt-1 border-t border-[#2A2926] text-[9px] text-[#8E887E]">
                  Click district to inspect cross-ministry telemetry
                </div>
              </div>
            )}

            {/* Floating Map Watermark */}
            <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#7E7A72]">
              LGD CODE MAPPED • EPSG:4326 PROJECTION
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#8E887E] font-mono">
            <span>
              {viewLevel === 'INDIA'
                ? 'Click Maharashtra card to zoom into district choropleth'
                : 'Click any district marker to inspect cross-ministry telemetry'}
            </span>
            <span>
              Target Selected: <strong className="text-[#F3F0E8]">{selectedDistrict.name}</strong>
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Contextual Intelligence Panel (Nandurbar focus) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A] flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  DISTRICT LIVE INTELLIGENCE
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  LGD {selectedDistrict.name === 'Nandurbar' ? '512' : selectedDistrict.code}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#F3F0E8] font-editorial mt-1">
                {selectedDistrict.name.toUpperCase()}
              </h2>
              <p className="text-xs text-[#8E887E]">{selectedDistrict.zone}, Maharashtra</p>
            </div>

            {/* Real-time Event Telemetry Banner if active */}
            {activeDistrictLiveState[selectedDistrict.name] || (latestEvent && latestEvent.districtId === selectedDistrict.name) ? (
              <div className="p-3.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE TELEMETRY STREAM
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    MODE B • SIMULATED LIVE
                  </span>
                </div>
                <div className="text-zinc-200 text-xs">
                  {latestEvent?.districtId === selectedDistrict.name ? (
                    <>
                      <div className="font-semibold text-emerald-300">{latestEvent.schemeId}: {latestEvent.eventType.replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        ₹{latestEvent.previousValue} Cr → ₹{latestEvent.currentValue} Cr ({latestEvent.deltaPercent > 0 ? '+' : ''}{latestEvent.deltaPercent.toFixed(1)}%)
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-emerald-300">JJM DRAWDOWN TELEMETRY</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        ₹22.10 Cr → ₹24.70 Cr (+11.8%)
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : null}

            {/* Cross-Programme Triangulation Status */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                CROSS-PROGRAMME TRIANGULATION
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-400 block">JJM FHTC</span>
                  <span className="text-xs font-bold text-zinc-100">28.4%</span>
                  <span className="text-[8px] text-zinc-400 block">Verified</span>
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-400 block">PMAY-G</span>
                  <span className="text-xs font-bold text-emerald-400">46.8%</span>
                  <span className="text-[8px] text-zinc-400 block">Physical</span>
                </div>
                <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[9px] text-zinc-400 block">PKVY</span>
                  <span className="text-xs font-bold text-amber-400">12 Clust</span>
                  <span className="text-[8px] text-zinc-400 block">Organic</span>
                </div>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-2.5 font-mono text-xs border-y border-[#2A2926] py-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[#8E887E]">Population</span>
                <span className="font-bold text-[#F3F0E8]">
                  {(selectedDistrict.population / 1000000).toFixed(1)}M
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E887E]">Active Schemes</span>
                <span className="font-bold text-[#F3F0E8]">
                  {selectedDistrict.activeSchemesCount}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E887E]">Projects</span>
                <span className="font-bold text-[#F3F0E8]">
                  {selectedDistrict.projectsCount}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E887E]">Fund Utilization</span>
                <span
                  className={`font-bold ${
                    selectedDistrict.fundUtilizationRate < 60
                      ? 'text-[#A66A62]'
                      : 'text-[#5E8B72]'
                  }`}
                >
                  {selectedDistrict.fundUtilizationRate}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E887E]">Programme Coverage</span>
                <span
                  className={`font-bold ${
                    selectedDistrict.coverageRate < selectedDistrict.regionalBenchmarkRate
                      ? 'text-[#A66A62]'
                      : 'text-[#5E8B72]'
                  }`}
                >
                  {selectedDistrict.coverageRate}%
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#7E7A72]">Regional Benchmark</span>
                <span className="text-[#C9C2B7]">{selectedDistrict.regionalBenchmarkRate}%</span>
              </div>
            </div>

            {/* Gap Banner if Flagged */}
            {selectedDistrict.isGapFlagged ? (
              <div className="p-4 rounded bg-[#A66A62]/10 border border-[#A66A62]/40 space-y-3">
                <div className="flex items-center space-x-2 text-[#A66A62] font-semibold text-xs font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  <span>CROSS-PROGRAMME CONVERGENCE GAP</span>
                </div>
                <p className="text-xs text-[#F3F0E8]">
                  Infrastructure divergence of{' '}
                  <strong className="text-[#A66A62] font-mono">
                    {selectedDistrict.gapPercentagePoints} percentage points
                  </strong>{' '}
                  between PMAY-G dwelling completion (46.8%) and JJM functional tap connection (28.4%).
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                    className="py-2 px-3 rounded-sm bg-zinc-800 text-zinc-100 font-semibold text-[11px] font-mono flex items-center justify-center space-x-1.5 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>WHY FLAGGED?</span>
                  </button>
                  <button
                    onClick={() => openWorkspace('SUTRA-INV-2026-0001')}
                    className="py-2 px-3 rounded-sm bg-[#A66A62] text-white font-semibold text-[11px] font-mono flex items-center justify-center space-x-1.5 hover:bg-[#8F554E] transition-colors"
                  >
                    <span>INVESTIGATE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded bg-[#5E8B72]/10 border border-[#5E8B72]/30 text-xs text-[#5E8B72] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>
                  Delivery metrics align with or exceed the 64% regional administrative benchmark.
                </span>
              </div>
            )}

            {/* Direct Multi-Action Navigators */}
            <div className="space-y-2 pt-1">
              <Link
                href="/relationships"
                className="w-full py-2.5 px-4 rounded-sm bg-[#191917] border border-[#2A2926] text-xs font-mono text-[#F3F0E8] hover:border-[#B78A5A] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-[#B78A5A]" />
                  <span>TRACE IN GOVERNANCE GRAPH</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B78A5A]" />
              </Link>

              <button
                onClick={() => openExecutiveBrief(selectedDistrict)}
                className="w-full py-2.5 px-4 rounded-sm bg-[#191917] border border-[#B78A5A]/50 text-xs font-mono text-[#B78A5A] hover:bg-[#B78A5A] hover:text-[#0D0D0C] font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <span>GENERATE APEX POLICY BRIEF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
