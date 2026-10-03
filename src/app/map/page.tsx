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
      return d.isGapFlagged ? '#F43F5E' : '#E2E8F0';
    }

    return '#3B82F6';
  };

  return (
    <AppShell>
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>TERRITORIAL GOVERNANCE LAYER • GIS MESH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
            GEOGRAPHIC INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {viewLevel === 'INDIA'
              ? 'National Overview: Select Maharashtra state to drill down into 36 districts.'
              : 'Cartographic analysis across 36 districts of Maharashtra State.'}
          </p>
        </div>

        {/* View Zoom & Metric Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Toggle */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono">
            <button
              onClick={() => setViewLevel('INDIA')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewLevel === 'INDIA'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              INDIA VIEW
            </button>
            <button
              onClick={() => setViewLevel('MAHARASHTRA')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewLevel === 'MAHARASHTRA'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MAHARASHTRA (36 DISTS)
            </button>
          </div>

          {/* Metric Layer Controls */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono">
            {(['Coverage', 'Utilization', 'Beneficiaries', 'Outcomes', 'Gaps', 'Signals'] as MetricFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
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
        {/* Left 8 Cols: Custom Cartographic Visualizer */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 space-y-4 relative shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {viewLevel === 'INDIA'
                  ? 'NATIONAL ATLAS VIEW • CLICK MAHARASHTRA TO DRILL DOWN'
                  : 'REGION: MAHARASHTRA STATE (36 DISTRICT BOUNDARIES ACTIVE)'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Severe Gap (&gt;30 pp)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate Gap
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Benchmark Met
              </span>
            </div>
          </div>

          {/* Interactive SVG Cartographic Grid */}
          <div
            className="relative w-full h-[520px] bg-slate-50 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center p-4"
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
                  fill="#F8FAFC"
                  stroke="#CBD5E1"
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
                      fill={state.focus ? '#2563EB' : '#FFFFFF'}
                      fillOpacity={state.focus ? 0.95 : 0.85}
                      stroke={state.focus ? '#1D4ED8' : '#CBD5E1'}
                      strokeWidth={state.focus ? 2 : 1}
                    />
                    <text
                      x={state.x}
                      y={state.y - 4}
                      textAnchor="middle"
                      fill={state.focus ? '#FFFFFF' : '#0F172A'}
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
                      fill={state.focus ? '#DBEAFE' : '#64748B'}
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
                        fill="#10B981"
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
                  <pattern id="gridPatternLight" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="800" height="500" fill="url(#gridPatternLight)" />

                {/* State boundary background outline */}
                <path
                  d="M 160 80 L 320 60 L 520 70 L 680 120 L 760 210 L 740 330 L 610 420 L 440 440 L 320 460 L 220 420 L 140 280 L 130 180 Z"
                  fill="#F1F5F9"
                  stroke="#CBD5E1"
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
                          r="30"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="2"
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
                          r="20"
                          fill="none"
                          stroke="#F43F5E"
                          className="animate-ping opacity-30 pointer-events-none"
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
                        fillOpacity={isSelected ? 1 : isHovered ? 0.95 : 0.8}
                        stroke={isSelected ? '#1E40AF' : isHovered ? '#2563EB' : '#94A3B8'}
                        strokeWidth={isSelected || isHovered ? 2 : 1}
                      />

                      {/* District Code Label */}
                      <text
                        x={x}
                        y={y - 2}
                        textAnchor="middle"
                        fill={isSelected ? '#FFFFFF' : '#0F172A'}
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
                        fill={isSelected ? '#DBEAFE' : '#334155'}
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
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-900 font-mono text-xs shadow-lg transition-opacity duration-150"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 90), 510),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="font-bold text-sm text-slate-900">{hoveredState.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Allocation: {hoveredState.alloc}</div>
                <div className="flex gap-3 text-[10px] mt-1 pt-1 border-t border-slate-200">
                  <span>Coverage: <strong className="text-emerald-700">{hoveredState.coverage}%</strong></span>
                  <span>Utilization: <strong className="text-blue-700">{hoveredState.util}%</strong></span>
                </div>
              </div>
            )}

            {/* Floating Tooltip for Maharashtra District Hover */}
            {hoveredDistrict && mapTooltipPos && viewLevel === 'MAHARASHTRA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-md bg-white border border-slate-300 text-slate-900 font-mono text-xs shadow-xl min-w-[210px] transition-opacity duration-150"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 110), 690),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-1 mb-1">
                  <span className="font-bold text-sm text-slate-900">{hoveredDistrict.name}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      hoveredDistrict.isGapFlagged ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {hoveredDistrict.isGapFlagged ? `GAP ${hoveredDistrict.gapPercentagePoints} pp` : 'BENCHMARK MET'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                  <div>Coverage: <strong className="text-slate-900">{hoveredDistrict.coverageRate}%</strong></div>
                  <div>Utilization: <strong className="text-slate-900">{hoveredDistrict.fundUtilizationRate}%</strong></div>
                  <div>Projects: <strong className="text-slate-900">{hoveredDistrict.projectsCount}</strong></div>
                  <div>Allocation: <strong className="text-blue-700">₹{hoveredDistrict.budgetAllocatedCr} Cr</strong></div>
                </div>
                <div className="mt-1.5 pt-1 border-t border-slate-100 text-[9px] text-slate-500">
                  Click district to inspect cross-ministry telemetry
                </div>
              </div>
            )}

            {/* Floating Map Watermark */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400">
              LGD CODE MAPPED • EPSG:4326 PROJECTION
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
            <span>
              {viewLevel === 'INDIA'
                ? 'Click Maharashtra card to zoom into district choropleth'
                : 'Click any district marker to inspect cross-ministry telemetry'}
            </span>
            <span>
              Target Selected: <strong className="text-slate-900">{selectedDistrict.name}</strong>
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Contextual Intelligence Panel */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  DISTRICT LIVE INTELLIGENCE
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  LGD {selectedDistrict.name === 'Nandurbar' ? '512' : selectedDistrict.code}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-editorial mt-1">
                {selectedDistrict.name.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-500">{selectedDistrict.zone}, Maharashtra</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">PROGRAMME COVERAGE</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{selectedDistrict.coverageRate}%</div>
                <span className="text-[10px] text-slate-500">Benchmark: {selectedDistrict.regionalBenchmarkRate}%</span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">FUND UTILIZATION</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{selectedDistrict.fundUtilizationRate}%</div>
                <span className="text-[10px] text-slate-500">Pace Target: 80%</span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">BUDGET ALLOCATED</span>
                <div className="text-base font-bold text-blue-700 mt-0.5">₹{selectedDistrict.budgetAllocatedCr} Cr</div>
                <span className="text-[10px] text-slate-500">Across 4 schemes</span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">DRAWDOWN DEFICIT</span>
                <div className={`text-base font-bold mt-0.5 ${selectedDistrict.isGapFlagged ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {selectedDistrict.gapPercentagePoints} pp
                </div>
                <span className="text-[10px] text-slate-500">Variance Index</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>WHY FLAGGED? EXPLAIN INSIGHT</span>
              </button>

              <button
                onClick={() => router.push('/investigation/SUTRA-INV-2026-0001')}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>OPEN INVESTIGATION WORKSPACE</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => openEvidence(selectedDistrict.evidenceRecordId || '#7201')}
                  className="py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-md text-xs font-medium transition-colors cursor-pointer text-center truncate"
                >
                  View Evidence
                </button>
                <button
                  onClick={() => openExecutiveBrief(selectedDistrict)}
                  className="py-1.5 px-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-md text-xs font-medium transition-colors cursor-pointer text-center truncate"
                >
                  Executive Brief
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
