'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { District } from '@/lib/types';
import {
  MapPin,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Network,
  Activity,
  Radio,
} from 'lucide-react';

type MetricFilter = 'Coverage' | 'Utilization' | 'Beneficiaries' | 'Outcomes' | 'Gaps' | 'Signals';

export default function GeographicIntelligencePage() {
  const {
    openEvidence,
    openWhyFlagged,
    openWorkspace,
    openExecutiveBrief,
    activeDistrictLiveState,
    latestEvent,
  } = useIntelligence();

  const [viewLevel, setViewLevel] = useState<'INDIA' | 'MAHARASHTRA'>('MAHARASHTRA');
  const [activeFilter, setActiveFilter] = useState<MetricFilter>('Coverage');
  const [selectedDistrict, setSelectedDistrict] = useState<District>(
    MAHARASHTRA_DISTRICTS.find((d) => d.name === 'Nandurbar') || MAHARASHTRA_DISTRICTS[0]
  );
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [hoveredState, setHoveredState] = useState<typeof indiaStates[0] | null>(null);
  const [mapTooltipPos, setMapTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const indiaStates = [
    { name: 'Maharashtra', code: 'MH', coverage: 71.4, util: 73.0, alloc: '₹28,400 Cr', focus: true, x: 260, y: 310 },
    { name: 'Uttar Pradesh', code: 'UP', coverage: 64.2, util: 67.8, alloc: '₹34,200 Cr', focus: false, x: 340, y: 190 },
    { name: 'Madhya Pradesh', code: 'MP', coverage: 66.5, util: 65.2, alloc: '₹21,800 Cr', focus: false, x: 300, y: 250 },
    { name: 'Gujarat', code: 'GJ', coverage: 82.1, util: 84.6, alloc: '₹19,500 Cr', focus: false, x: 190, y: 250 },
    { name: 'Karnataka', code: 'KA', coverage: 78.4, util: 79.2, alloc: '₹22,100 Cr', focus: false, x: 260, y: 400 },
    { name: 'Bihar', code: 'BR', coverage: 61.3, util: 59.8, alloc: '₹24,600 Cr', focus: false, x: 440, y: 210 },
  ];

  const getFillColor = (d: District) => {
    if (activeFilter === 'Gaps') {
      if (d.isGapFlagged) {
        return d.gapPercentagePoints >= 30 ? '#A54848' : '#B58A45';
      }
      return '#28704D';
    }

    if (activeFilter === 'Coverage') {
      if (d.coverageRate >= 70) return '#164A3A';
      if (d.coverageRate >= 55) return '#5B8C78';
      if (d.coverageRate >= 40) return '#B58A45';
      return '#A54848';
    }

    if (activeFilter === 'Utilization') {
      if (d.fundUtilizationRate >= 75) return '#164A3A';
      if (d.fundUtilizationRate >= 60) return '#5B8C78';
      if (d.fundUtilizationRate >= 50) return '#B58A45';
      return '#A54848';
    }

    if (activeFilter === 'Signals') {
      return d.isGapFlagged ? '#A54848' : '#28704D';
    }

    return '#164A3A';
  };

  return (
    <AppShell>
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8D6CE] pb-6 select-none">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
            <span>TERRITORIAL GOVERNANCE LAYER</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
            GEOGRAPHIC INTELLIGENCE
          </h1>
          <p className="text-xs text-[#66706A] mt-0.5">
            {viewLevel === 'INDIA'
              ? 'National Overview: Select Maharashtra state to drill down into 36 districts.'
              : 'Cartographic spatial analysis across 36 districts of Maharashtra State.'}
          </p>
        </div>

        {/* View Zoom & Metric Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Toggle */}
          <div className="flex items-center p-0.5 bg-[#FFFFFF] border border-[#D8D6CE] rounded text-xs font-mono">
            <button
              onClick={() => setViewLevel('INDIA')}
              className={`px-3 py-1.5 rounded transition-all ${
                viewLevel === 'INDIA'
                  ? 'bg-[#164A3A] text-white font-bold'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              INDIA VIEW
            </button>
            <button
              onClick={() => setViewLevel('MAHARASHTRA')}
              className={`px-3 py-1.5 rounded transition-all ${
                viewLevel === 'MAHARASHTRA'
                  ? 'bg-[#164A3A] text-white font-bold'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              MAHARASHTRA (36 DISTS)
            </button>
          </div>

          {/* Metric Layer Controls */}
          <div className="flex flex-wrap items-center gap-1 p-0.5 bg-[#FFFFFF] border border-[#D8D6CE] rounded text-xs font-mono">
            {(['Coverage', 'Utilization', 'Beneficiaries', 'Gaps', 'Signals'] as MetricFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded transition-all ${
                    activeFilter === filter
                      ? 'bg-[#164A3A] text-white font-bold shadow-xs'
                      : 'text-[#66706A] hover:text-[#18201C]'
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
      <div className="grid lg:grid-cols-12 gap-6 items-start select-none">
        {/* Left 8 Cols: Custom Cartographic Visualizer */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg p-5 space-y-4 relative shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#66706A]">
              <MapPin className="w-3.5 h-3.5 text-[#164A3A]" />
              <span className="font-semibold text-[#18201C]">
                {viewLevel === 'INDIA'
                  ? 'NATIONAL ATLAS VIEW • CLICK MAHARASHTRA TO DRILL DOWN'
                  : 'REGION: MAHARASHTRA STATE (36 DISTRICT BOUNDARIES ACTIVE)'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#66706A] flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#A54848]" /> Severe Gap (&gt;30 pp)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B58A45]" /> Moderate Gap
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#164A3A]" /> Benchmark Met
              </span>
            </div>
          </div>

          {/* Interactive SVG Cartographic Grid */}
          <div
            className="relative w-full h-[520px] bg-[#F4F2EC] border border-[#D8D6CE] rounded-md overflow-hidden flex items-center justify-center p-4"
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
                  fill="#EAE8E1"
                  stroke="#D8D6CE"
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
                      fill={state.focus ? '#164A3A' : '#FFFFFF'}
                      stroke={state.focus ? '#164A3A' : '#D8D6CE'}
                      strokeWidth={state.focus ? 2 : 1}
                      className="shadow-xs"
                    />
                    <text
                      x={state.x}
                      y={state.y - 4}
                      textAnchor="middle"
                      fill={state.focus ? '#FFFFFF' : '#18201C'}
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
                      fill={state.focus ? '#F4F2EC' : '#66706A'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {state.coverage}% cov
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              /* Maharashtra 36 Districts Detailed Choropleth */
              <svg
                className="w-full h-full animate-in zoom-in-95 duration-250"
                viewBox="0 0 800 500"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* State boundary background outline */}
                <path
                  d="M 160 80 L 320 60 L 520 70 L 680 120 L 760 210 L 740 330 L 610 420 L 440 440 L 320 460 L 220 420 L 140 280 L 130 180 Z"
                  fill="#EAE8E1"
                  stroke="#D8D6CE"
                  strokeWidth="1.5"
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
                      className="cursor-pointer transition-transform duration-150"
                      onClick={() => setSelectedDistrict(district)}
                      onMouseEnter={() => setHoveredDistrict(district)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="28"
                          fill="none"
                          stroke="#164A3A"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* District Area Polygon */}
                      <rect
                        x={x - 22}
                        y={y - 18}
                        width="44"
                        height="36"
                        rx="4"
                        fill={fillColor}
                        stroke={isSelected ? '#18201C' : isHovered ? '#164A3A' : '#FFFFFF'}
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
                      >
                        {district.code}
                      </text>

                      {/* Metric indicator */}
                      <text
                        x={x}
                        y={y + 10}
                        textAnchor="middle"
                        fill="#F4F2EC"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        {activeFilter === 'Coverage'
                          ? `${district.coverageRate}%`
                          : activeFilter === 'Utilization'
                          ? `${district.fundUtilizationRate}%`
                          : `${district.projectsCount} proj`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Floating Tooltip for India State Hover */}
            {hoveredState && mapTooltipPos && viewLevel === 'INDIA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded bg-[#FFFFFF] border border-[#164A3A] text-[#18201C] font-mono text-xs shadow-md"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 90), 510),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="font-bold text-sm text-[#18201C]">{hoveredState.name}</div>
                <div className="text-[10px] text-[#66706A] mt-0.5">Allocation: {hoveredState.alloc}</div>
                <div className="flex gap-3 text-[10px] mt-1 pt-1 border-t border-[#EAE8E1]">
                  <span>Coverage: <strong className="text-[#164A3A]">{hoveredState.coverage}%</strong></span>
                  <span>Utilization: <strong className="text-[#28704D]">{hoveredState.util}%</strong></span>
                </div>
              </div>
            )}

            {/* Floating Tooltip for Maharashtra District Hover */}
            {hoveredDistrict && mapTooltipPos && viewLevel === 'MAHARASHTRA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded bg-[#FFFFFF] border border-[#164A3A] text-[#18201C] font-mono text-xs shadow-md min-w-[210px]"
                style={{
                  left: Math.min(Math.max(mapTooltipPos.x, 110), 690),
                  top: Math.max(mapTooltipPos.y - 10, 10),
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#EAE8E1] pb-1.5 mb-1.5">
                  <span className="font-bold text-sm text-[#18201C]">{hoveredDistrict.name}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      hoveredDistrict.isGapFlagged ? 'bg-[#FBF0F0] text-[#A54848] border border-[#A54848]/30' : 'bg-[#E3EDE7] text-[#28704D] border border-[#28704D]/30'
                    }`}
                  >
                    {hoveredDistrict.isGapFlagged ? `GAP ${hoveredDistrict.gapPercentagePoints} pp` : 'BENCHMARK MET'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                  <div>Coverage: <strong className="text-[#18201C]">{hoveredDistrict.coverageRate}%</strong></div>
                  <div>Utilization: <strong className="text-[#18201C]">{hoveredDistrict.fundUtilizationRate}%</strong></div>
                  <div>Projects: <strong className="text-[#18201C]">{hoveredDistrict.projectsCount}</strong></div>
                  <div>Allocation: <strong className="text-[#164A3A]">₹{hoveredDistrict.budgetAllocatedCr} Cr</strong></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#66706A] font-mono border-t border-[#EAE8E1] pt-3">
            <span>
              {viewLevel === 'INDIA'
                ? 'Click Maharashtra card to zoom into 36 districts'
                : 'Click any district marker to inspect granular telemetry'}
            </span>
            <span>
              Selected: <strong className="text-[#18201C]">{selectedDistrict.name}</strong>
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Contextual Intelligence Panel (Nandurbar focus) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="border-b border-[#EAE8E1] pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#B58A45] font-semibold flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[#B58A45]" />
                  DISTRICT LIVE INTELLIGENCE
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F4F2EC] text-[#66706A] border border-[#D8D6CE] font-bold">
                  LGD {selectedDistrict.name === 'Nandurbar' ? '512' : selectedDistrict.code}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#18201C] font-editorial uppercase mt-1">
                {selectedDistrict.name}
              </h2>
              <p className="text-xs text-[#66706A]">{selectedDistrict.zone}, Maharashtra</p>
            </div>

            {/* Triangulation */}
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#66706A] block font-semibold">
                CROSS-PROGRAMME TRIANGULATION
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-center">
                  <span className="text-[9px] text-[#66706A] block">JJM FHTC</span>
                  <span className="text-xs font-bold text-[#18201C]">28.4%</span>
                  <span className="text-[8px] text-[#28704D] block font-bold">Verified</span>
                </div>
                <div className="p-2 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-center">
                  <span className="text-[9px] text-[#66706A] block">PMAY-G</span>
                  <span className="text-xs font-bold text-[#28704D]">46.8%</span>
                  <span className="text-[8px] text-[#66706A] block">Physical</span>
                </div>
                <div className="p-2 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-center">
                  <span className="text-[9px] text-[#66706A] block">PKVY</span>
                  <span className="text-xs font-bold text-[#B58A45]">12 Clust</span>
                  <span className="text-[8px] text-[#66706A] block">Organic</span>
                </div>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-2 font-mono text-xs border-y border-[#EAE8E1] py-3">
              <div className="flex justify-between items-center">
                <span className="text-[#66706A]">Population</span>
                <span className="font-bold text-[#18201C]">
                  {(selectedDistrict.population / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66706A]">Active Schemes</span>
                <span className="font-bold text-[#18201C]">
                  {selectedDistrict.activeSchemesCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66706A]">Projects</span>
                <span className="font-bold text-[#18201C]">
                  {selectedDistrict.projectsCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66706A]">Fund Utilization</span>
                <span
                  className={`font-bold ${
                    selectedDistrict.fundUtilizationRate < 60
                      ? 'text-[#A54848]'
                      : 'text-[#28704D]'
                  }`}
                >
                  {selectedDistrict.fundUtilizationRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66706A]">Programme Coverage</span>
                <span
                  className={`font-bold ${
                    selectedDistrict.coverageRate < selectedDistrict.regionalBenchmarkRate
                      ? 'text-[#A54848]'
                      : 'text-[#28704D]'
                  }`}
                >
                  {selectedDistrict.coverageRate}%
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#898E89]">Regional Benchmark</span>
                <span className="text-[#66706A]">{selectedDistrict.regionalBenchmarkRate}%</span>
              </div>
            </div>

            {/* Gap Banner if Flagged */}
            {selectedDistrict.isGapFlagged ? (
              <div className="p-3.5 rounded bg-[#FBF0F0] border border-[#A54848]/30 space-y-2.5">
                <div className="flex items-center space-x-2 text-[#A54848] font-bold text-xs font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  <span>CROSS-PROGRAMME CONVERGENCE GAP</span>
                </div>
                <p className="text-xs text-[#18201C]">
                  Infrastructure divergence of{' '}
                  <strong className="text-[#A54848] font-mono">
                    {selectedDistrict.gapPercentagePoints} percentage points
                  </strong>{' '}
                  between PMAY-G dwelling completion (46.8%) and JJM tap connection (28.4%).
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                    className="py-1.5 px-3 rounded bg-[#FFFFFF] text-[#18201C] font-semibold text-[11px] font-mono flex items-center justify-center space-x-1.5 hover:bg-[#F4F2EC] border border-[#D8D6CE] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B58A45]" />
                    <span>WHY FLAGGED?</span>
                  </button>
                  <button
                    onClick={() => openWorkspace('SUTRA-INV-2026-0001')}
                    className="py-1.5 px-3 rounded bg-[#164A3A] text-white font-semibold text-[11px] font-mono flex items-center justify-center space-x-1.5 hover:bg-[#0D3026] transition-colors"
                  >
                    <span>INVESTIGATE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded bg-[#E3EDE7] border border-[#28704D]/30 text-xs text-[#28704D] flex items-center space-x-2">
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
                className="w-full py-2 px-3 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-xs font-mono text-[#18201C] hover:border-[#164A3A] transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-[#164A3A]" />
                  <span>TRACE IN GOVERNANCE GRAPH</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#66706A]" />
              </Link>

              <button
                onClick={() => openExecutiveBrief(selectedDistrict)}
                className="w-full py-2 px-3 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-mono text-xs font-semibold transition-all flex items-center justify-center space-x-2"
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
