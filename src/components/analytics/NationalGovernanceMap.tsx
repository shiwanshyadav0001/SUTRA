'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { District } from '@/lib/types';
import {
  MapPin,
  ChevronRight,
  ArrowLeft,
  Search,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useIntelligence } from '@/context/IntelligenceContext';

interface StateData {
  id: string;
  name: string;
  code: string;
  coverage: number;
  utilization: number;
  beneficiaries: string;
  projects: number;
  schemes: number;
  signals: number;
  signalType: 'normal' | 'signal' | 'critical';
  x: number;
  y: number;
  width: number;
  height: number;
}

const ALL_INDIA_STATES: StateData[] = [
  { id: 'MH', name: 'Maharashtra', code: 'MH', coverage: 71.4, utilization: 73.0, beneficiaries: '12.4M', projects: 684, schemes: 24, signals: 7, signalType: 'critical', x: 210, y: 260, width: 85, height: 75 },
  { id: 'GJ', name: 'Gujarat', code: 'GJ', coverage: 82.1, utilization: 84.6, beneficiaries: '8.2M', projects: 412, schemes: 19, signals: 1, signalType: 'normal', x: 130, y: 215, width: 70, height: 60 },
  { id: 'RJ', name: 'Rajasthan', code: 'RJ', coverage: 69.8, utilization: 68.4, beneficiaries: '9.6M', projects: 520, schemes: 21, signals: 3, signalType: 'signal', x: 155, y: 140, width: 85, height: 70 },
  { id: 'MP', name: 'Madhya Pradesh', code: 'MP', coverage: 66.5, utilization: 65.2, beneficiaries: '11.1M', projects: 590, schemes: 22, signals: 5, signalType: 'signal', x: 235, y: 195, width: 95, height: 65 },
  { id: 'UP', name: 'Uttar Pradesh', code: 'UP', coverage: 64.2, utilization: 67.8, beneficiaries: '26.8M', projects: 1240, schemes: 28, signals: 8, signalType: 'critical', x: 285, y: 135, width: 95, height: 65 },
  { id: 'KA', name: 'Karnataka', code: 'KA', coverage: 78.4, utilization: 79.2, beneficiaries: '7.8M', projects: 395, schemes: 18, signals: 2, signalType: 'normal', x: 220, y: 345, width: 65, height: 80 },
  { id: 'TN', name: 'Tamil Nadu', code: 'TN', coverage: 84.6, utilization: 86.1, beneficiaries: '8.9M', projects: 430, schemes: 19, signals: 0, signalType: 'normal', x: 250, y: 430, width: 60, height: 75 },
  { id: 'AP', name: 'Andhra Pradesh', code: 'AP', coverage: 73.1, utilization: 75.4, beneficiaries: '6.4M', projects: 360, schemes: 17, signals: 3, signalType: 'signal', x: 280, y: 325, width: 70, height: 75 },
  { id: 'TG', name: 'Telangana', code: 'TG', coverage: 75.8, utilization: 77.0, beneficiaries: '5.1M', projects: 290, schemes: 16, signals: 2, signalType: 'normal', x: 260, y: 280, width: 60, height: 50 },
  { id: 'OD', name: 'Odisha', code: 'OD', coverage: 67.9, utilization: 70.3, beneficiaries: '6.2M', projects: 340, schemes: 18, signals: 4, signalType: 'signal', x: 375, y: 245, width: 65, height: 60 },
  { id: 'WB', name: 'West Bengal', code: 'WB', coverage: 71.0, utilization: 72.5, beneficiaries: '11.8M', projects: 580, schemes: 20, signals: 4, signalType: 'signal', x: 420, y: 195, width: 55, height: 70 },
  { id: 'BR', name: 'Bihar', code: 'BR', coverage: 61.3, utilization: 59.8, beneficiaries: '14.2M', projects: 710, schemes: 22, signals: 9, signalType: 'critical', x: 380, y: 145, width: 65, height: 50 },
  { id: 'PB', name: 'Punjab', code: 'PB', coverage: 83.4, utilization: 81.2, beneficiaries: '3.4M', projects: 210, schemes: 15, signals: 1, signalType: 'normal', x: 190, y: 80, width: 45, height: 45 },
  { id: 'HR', name: 'Haryana', code: 'HR', coverage: 80.5, utilization: 82.0, beneficiaries: '3.6M', projects: 220, schemes: 16, signals: 1, signalType: 'normal', x: 215, y: 105, width: 40, height: 40 },
  { id: 'KL', name: 'Kerala', code: 'KL', coverage: 88.2, utilization: 89.4, beneficiaries: '4.2M', projects: 260, schemes: 16, signals: 0, signalType: 'normal', x: 220, y: 440, width: 35, height: 65 },
  { id: 'AS', name: 'Assam', code: 'AS', coverage: 65.4, utilization: 64.0, beneficiaries: '4.8M', projects: 310, schemes: 18, signals: 4, signalType: 'signal', x: 485, y: 145, width: 65, height: 45 },
];

export function NationalGovernanceMap() {
  const { openEvidence, openExplain } = useIntelligence();

  // Navigation Drill-Down State: 'INDIA' | 'MAHARASHTRA' | 'DISTRICT'
  const [level, setLevel] = useState<'INDIA' | 'STATE' | 'DISTRICT'>('STATE');
  const [selectedState, setSelectedState] = useState<StateData>(ALL_INDIA_STATES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<District>(
    MAHARASHTRA_DISTRICTS.find((d) => d.name === 'Nandurbar') || MAHARASHTRA_DISTRICTS[0]
  );

  const [activeMetric, setActiveMetric] = useState<'coverage' | 'utilization' | 'signals'>('coverage');
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

  // Color functions strictly following the SUTRA Civic Intelligence palette
  const getStateFill = (state: StateData) => {
    if (activeMetric === 'signals') {
      if (state.signalType === 'critical') return '#A54848'; // Alert Red
      if (state.signalType === 'signal') return '#B58A45';   // Brand Gold / Attention
      return '#28704D'; // Verified Green
    }
    if (activeMetric === 'utilization') {
      if (state.utilization >= 80) return '#164A3A'; // Deep SUTRA Green
      if (state.utilization >= 70) return '#5B8C78'; // Muted Green
      if (state.utilization >= 60) return '#B58A45'; // Brand Gold
      return '#A54848';                              // Alert Red
    }
    // Default Coverage
    if (state.coverage >= 80) return '#164A3A';      // Deep SUTRA Green (High Coverage)
    if (state.coverage >= 70) return '#5B8C78';      // Muted Green (Medium Coverage)
    if (state.coverage >= 60) return '#B58A45';      // Brand Gold (Intelligence Signal)
    return '#A54848';                                // Alert Red (Critical Gap)
  };

  const getDistrictFill = (dist: District) => {
    if (activeMetric === 'signals') {
      if (dist.isGapFlagged) {
        return dist.gapPercentagePoints >= 30 ? '#A54848' : '#B58A45';
      }
      return '#28704D';
    }
    if (activeMetric === 'utilization') {
      if (dist.fundUtilizationRate >= 75) return '#164A3A';
      if (dist.fundUtilizationRate >= 60) return '#5B8C78';
      if (dist.fundUtilizationRate >= 50) return '#B58A45';
      return '#A54848';
    }
    // Coverage
    if (dist.coverageRate >= 70) return '#164A3A';
    if (dist.coverageRate >= 55) return '#5B8C78';
    if (dist.coverageRate >= 40) return '#B58A45';
    return '#A54848';
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg p-5 md:p-6 space-y-5 select-none shadow-sm">
      {/* Top Bar: Title, Drilldown Breadcrumbs, Metric Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE8E1]">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#66706A] uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
            <span>NATIONAL GIS GOVERNANCE CENTERPIECE</span>
          </div>
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 mt-1">
            <button
              onClick={() => setLevel('INDIA')}
              className={`text-sm font-semibold tracking-tight transition-colors ${
                level === 'INDIA'
                  ? 'text-[#18201C] underline font-bold'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              India (National)
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#898E89]" />
            <button
              onClick={() => setLevel('STATE')}
              className={`text-sm font-semibold tracking-tight transition-colors ${
                level === 'STATE'
                  ? 'text-[#18201C] underline font-bold'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              Maharashtra (36 Districts)
            </button>
            {level === 'DISTRICT' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#898E89]" />
                <span className="text-sm font-bold text-[#164A3A]">
                  {selectedDistrict.name} District
                </span>
              </>
            )}
          </div>
        </div>

        {/* Metric Layer Controls & Back Button */}
        <div className="flex items-center space-x-2">
          {level !== 'INDIA' && (
            <button
              onClick={() => {
                if (level === 'DISTRICT') setLevel('STATE');
                else setLevel('INDIA');
              }}
              className="px-2.5 py-1.5 text-xs font-mono rounded bg-[#F4F2EC] border border-[#D8D6CE] hover:bg-[#EAE8E1] text-[#18201C] flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
          )}

          <div className="inline-flex rounded border border-[#D8D6CE] p-0.5 bg-[#F4F2EC] text-xs font-mono">
            <button
              onClick={() => setActiveMetric('coverage')}
              className={`px-3 py-1 rounded transition-colors ${
                activeMetric === 'coverage'
                  ? 'bg-[#FFFFFF] text-[#18201C] font-bold shadow-xs'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              Coverage
            </button>
            <button
              onClick={() => setActiveMetric('utilization')}
              className={`px-3 py-1 rounded transition-colors ${
                activeMetric === 'utilization'
                  ? 'bg-[#FFFFFF] text-[#18201C] font-bold shadow-xs'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              Utilization
            </button>
            <button
              onClick={() => setActiveMetric('signals')}
              className={`px-3 py-1 rounded transition-colors ${
                activeMetric === 'signals'
                  ? 'bg-[#FFFFFF] text-[#18201C] font-bold shadow-xs'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              Signals
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Cartographic Analytical Canvas (Left) + Intelligence Inspection Dossier (Right) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Analytical Canvas */}
        <div className="lg:col-span-8 bg-[#F4F2EC] border border-[#D8D6CE] rounded-md p-4 relative min-h-[460px] flex flex-col justify-between">
          {/* Map Header Instructions & Legend */}
          <div className="flex items-center justify-between text-xs font-mono text-[#66706A] mb-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#164A3A]" />
              <span className="font-semibold text-[#18201C]">
                {level === 'INDIA'
                  ? 'National Territory Atlas • Click Maharashtra to inspect districts'
                  : level === 'STATE'
                  ? 'Maharashtra State Mesh • Click any district for deep intelligence'
                  : `${selectedDistrict.name} Boundary • Inspecting statutory compliance`}
              </span>
            </div>
            {/* Color Legend */}
            <div className="hidden sm:flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#164A3A]" /> High (≥70%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#5B8C78]" /> Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B58A45]" /> Signal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#A54848]" /> Critical
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
            {level === 'INDIA' ? (
              /* LEVEL 1: ALL-INDIA ANALYTICAL TERRITORY GRID */
              <svg className="w-full h-full" viewBox="0 0 580 520">
                {/* Subtle India boundary watermark */}
                <path
                  d="M 210 50 L 250 65 L 290 110 L 350 140 L 420 160 L 460 180 L 520 150 L 550 170 L 490 220 L 430 220 L 380 280 L 330 380 L 290 470 L 250 490 L 230 430 L 190 350 L 140 270 L 120 220 L 160 170 L 160 110 Z"
                  fill="#EAE8E1"
                  stroke="#D8D6CE"
                  strokeWidth="1.5"
                />

                {/* State Analytical Blocks */}
                {ALL_INDIA_STATES.map((st) => {
                  const fillColor = getStateFill(st);
                  const isHovered = hoveredState?.id === st.id;
                  const isMH = st.code === 'MH';

                  return (
                    <g
                      key={st.id}
                      className="cursor-pointer transition-all duration-150"
                      onClick={() => {
                        setSelectedState(st);
                        if (isMH) setLevel('STATE');
                      }}
                      onMouseEnter={() => setHoveredState(st)}
                      onMouseLeave={() => setHoveredState(null)}
                    >
                      <rect
                        x={st.x}
                        y={st.y}
                        width={st.width}
                        height={st.height}
                        rx="4"
                        fill={fillColor}
                        stroke={isHovered || isMH ? '#18201C' : '#FFFFFF'}
                        strokeWidth={isHovered ? 2.5 : isMH ? 2 : 1}
                        className="transition-all duration-150"
                      />
                      <text
                        x={st.x + st.width / 2}
                        y={st.y + st.height / 2 - 4}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {st.code}
                      </text>
                      <text
                        x={st.x + st.width / 2}
                        y={st.y + st.height / 2 + 10}
                        textAnchor="middle"
                        fill="#F4F2EC"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        {activeMetric === 'coverage'
                          ? `${st.coverage}%`
                          : activeMetric === 'utilization'
                          ? `${st.utilization}%`
                          : `${st.signals} sig`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* LEVEL 2 & 3: MAHARASHTRA 36 DISTRICTS ANALYTICAL MESH */
              <div className="w-full h-full flex flex-col justify-between">
                {/* 36-District Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-1.5 p-2 font-mono text-xs">
                  {MAHARASHTRA_DISTRICTS.map((dist) => {
                    const isSelected = selectedDistrict.id === dist.id;
                    const isHovered = hoveredDistrict?.id === dist.id;
                    const fillColor = getDistrictFill(dist);

                    return (
                      <div
                        key={dist.id}
                        onClick={() => {
                          setSelectedDistrict(dist);
                          setLevel('DISTRICT');
                        }}
                        onMouseEnter={() => setHoveredDistrict(dist)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                        className={`p-2 rounded cursor-pointer transition-all duration-150 text-center flex flex-col justify-between ${
                          isSelected
                            ? 'ring-2 ring-[#18201C] shadow-md scale-102 z-10'
                            : 'hover:scale-101 border border-[#D8D6CE]'
                        }`}
                        style={{
                          backgroundColor: isSelected ? '#FFFFFF' : '#FFFFFF',
                          borderTop: `3px solid ${fillColor}`,
                        }}
                      >
                        <span className="text-[9px] text-[#66706A] font-bold block">
                          {dist.code}
                        </span>
                        <span
                          className={`font-semibold text-[11px] truncate block ${
                            isSelected ? 'text-[#164A3A]' : 'text-[#18201C]'
                          }`}
                        >
                          {dist.name}
                        </span>
                        <div className="mt-1 flex items-center justify-center gap-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: fillColor }}
                          />
                          <span className="text-[10px] text-[#18201C] font-bold">
                            {activeMetric === 'coverage'
                              ? `${dist.coverageRate}%`
                              : activeMetric === 'utilization'
                              ? `${dist.fundUtilizationRate}%`
                              : dist.isGapFlagged
                              ? `-${dist.gapPercentagePoints}pp`
                              : '0'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#66706A] pt-2 border-t border-[#D8D6CE]">
                  <span>Source: Survey of India + LGD Spatial Core (Census 2011/2026 Registry)</span>
                  <button
                    onClick={() => {
                      const nandurbar = MAHARASHTRA_DISTRICTS.find((d) => d.name === 'Nandurbar');
                      if (nandurbar) {
                        setSelectedDistrict(nandurbar);
                        setLevel('DISTRICT');
                      }
                    }}
                    className="text-[#164A3A] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Nandurbar Gap →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Analytical Intelligence Dossier (Drill-Down Detail Panel) */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#D8D6CE] rounded-md p-5 space-y-4">
          <div className="border-b border-[#EAE8E1] pb-3">
            <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#66706A] font-semibold block">
              {level === 'INDIA' ? 'STATE TELEMETRY' : 'DISTRICT INTELLIGENCE DOSSIER'}
            </span>
            <h3 className="text-xl font-bold text-[#18201C] font-editorial mt-0.5">
              {level === 'INDIA' ? selectedState.name : selectedDistrict.name}
            </h3>
            <p className="text-xs text-[#66706A]">
              {level === 'INDIA'
                ? `${selectedState.code} • ${selectedState.projects} active projects in national registry`
                : `${selectedDistrict.zone} • LGD Code: ${selectedDistrict.code}`}
            </p>
          </div>

          {/* 5 Specific Metrics Required by Spec: Coverage, Fund Utilization, Beneficiary Reach, Active Schemes, Implementation Signals */}
          <div className="space-y-3 font-mono text-xs">
            {/* 1. Coverage */}
            <div className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#66706A] font-semibold uppercase">1. PROGRAMME COVERAGE</span>
                <span className="font-bold text-[#18201C]">
                  {level === 'INDIA' ? selectedState.coverage : selectedDistrict.coverageRate}%
                </span>
              </div>
              <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded bg-[#164A3A]"
                  style={{
                    width: `${level === 'INDIA' ? selectedState.coverage : selectedDistrict.coverageRate}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#66706A] block mt-1">
                Regional Benchmark: {selectedDistrict.regionalBenchmarkRate || 64}%
              </span>
            </div>

            {/* 2. Fund Utilization */}
            <div className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#66706A] font-semibold uppercase">2. FUND UTILIZATION</span>
                <span className="font-bold text-[#18201C]">
                  {level === 'INDIA' ? selectedState.utilization : selectedDistrict.fundUtilizationRate}%
                </span>
              </div>
              <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-1.5 overflow-hidden">
                <div
                  className="h-full rounded bg-[#5B8C78]"
                  style={{
                    width: `${level === 'INDIA' ? selectedState.utilization : selectedDistrict.fundUtilizationRate}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#66706A] block mt-1">
                {level === 'INDIA' ? 'Allocated: ₹28,400 Cr' : `Utilized ₹${selectedDistrict.fundUtilizedCr} Cr of ₹${selectedDistrict.budgetAllocatedCr} Cr`}
              </span>
            </div>

            {/* 3. Beneficiary Reach */}
            <div className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#66706A] font-semibold uppercase block">
                  3. BENEFICIARY REACH
                </span>
                <span className="text-sm font-bold text-[#18201C] mt-0.5 block">
                  {level === 'INDIA'
                    ? selectedState.beneficiaries
                    : `${(selectedDistrict.beneficiariesCount / 1000).toFixed(0)}K Citizens`}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#D8D6CE] text-[#28704D] font-bold">
                DBT VERIFIED
              </span>
            </div>

            {/* 4. Active Schemes */}
            <div className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#66706A] font-semibold uppercase block">
                  4. ACTIVE SCHEMES
                </span>
                <span className="text-sm font-bold text-[#18201C] mt-0.5 block">
                  {level === 'INDIA' ? `${selectedState.schemes} Central Schemes` : `${selectedDistrict.activeSchemesCount} Active Schemes`}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#66706A]">
                JJM • PMAY-G • PM-KISAN
              </span>
            </div>

            {/* 5. Implementation Signals */}
            <div className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-semibold uppercase">
                <span className="text-[#66706A]">5. IMPLEMENTATION SIGNALS</span>
                <span className={selectedDistrict.isGapFlagged ? 'text-[#A54848] font-bold' : 'text-[#28704D]'}>
                  {selectedDistrict.isGapFlagged ? 'ATTENTION REQUIRED' : 'NORMAL'}
                </span>
              </div>
              <ul className="text-[10px] text-[#18201C] space-y-1 pl-3 list-disc">
                {selectedDistrict.flagFactors?.slice(0, 2).map((factor, i) => (
                  <li key={i}>{factor}</li>
                )) || <li>No anomaly detected. Tranches delivering within SLA.</li>}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center gap-2">
            <Link
              href={`/investigate?district=${selectedDistrict.id}`}
              className="flex-1 py-2 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-medium text-xs text-center transition-colors font-editorial"
            >
              Investigate District
            </Link>
            <button
              onClick={() => openEvidence('#9281')}
              className="px-3 py-2 rounded bg-[#FFFFFF] hover:bg-[#F4F2EC] border border-[#D8D6CE] text-xs font-mono text-[#18201C] transition-colors"
            >
              Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
