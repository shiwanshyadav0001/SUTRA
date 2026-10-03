'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { LiveGovernancePulse } from '@/components/live/LiveGovernancePulse';
import { SourceHealthCard } from '@/components/live/SourceHealthCard';
import {
  GLOBAL_METRICS,
  SIGNALS_DATA,
  OVERLAPS_DATA,
  MAHARASHTRA_DISTRICTS,
  SCHEMES_DATA,
} from '@/lib/data/governance-data';
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
  MapPin,
  CheckCircle2,
  PieChart,
  Activity,
} from 'lucide-react';

export default function CommandCenterPage() {
  const { openEvidence, openExplain, sourceHealth } = useIntelligence();

  // Animated counters
  const [allocationCount, setAllocationCount] = useState(0);
  const [utilizationCount, setUtilizationCount] = useState(0);
  const [beneficiariesCount, setBeneficiariesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [coverageCount, setCoverageCount] = useState(0);
  const [outcomeCount, setOutcomeCount] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - (1 - progress) * (1 - progress);

      setAllocationCount(Number((2.84 * eased).toFixed(2)));
      setUtilizationCount(Math.round(73 * eased));
      setBeneficiariesCount(Number((12.4 * eased).toFixed(1)));
      setProjectsCount(Math.round(684 * eased));
      setCoverageCount(Math.round(71 * eased));
      setOutcomeCount(Math.round(78 * eased));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Interactive Chart Hover States
  const [hoveredDrawdownIdx, setHoveredDrawdownIdx] = useState<number | null>(3); // Default to Q3 OCT
  const [hoveredDistrict, setHoveredDistrict] = useState<typeof MAHARASHTRA_DISTRICTS[0] | null>(null);
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);
  const [hoveredScheme, setHoveredScheme] = useState<number | null>(null);
  const [hoveredOutcome, setHoveredOutcome] = useState<number | null>(4); // Default to Q1-26

  const drawdownPoints = [
    { label: 'Q1 APR', month: 'April 2025', actual: 18.2, benchmark: 14.0, amountCr: 516.8, x: 10, yActual: 130, yBench: 120 },
    { label: 'JUN', month: 'June 2025', actual: 28.5, benchmark: 24.0, amountCr: 809.4, x: 90, yActual: 115, yBench: 100 },
    { label: 'AUG', month: 'August 2025', actual: 41.0, benchmark: 36.0, amountCr: 1164.4, x: 170, yActual: 95, yBench: 80 },
    { label: 'OCT (Q3)', month: 'October 2025', actual: 54.2, benchmark: 48.0, amountCr: 1539.3, x: 250, yActual: 72, yBench: 62 },
    { label: 'DEC', month: 'December 2025', actual: 65.1, benchmark: 60.0, amountCr: 1848.8, x: 330, yActual: 52, yBench: 45 },
    { label: 'FEB', month: 'February 2026', actual: 71.3, benchmark: 68.0, amountCr: 2024.9, x: 410, yActual: 40, yBench: 32 },
    { label: 'CURRENT', month: 'March 2026 (Live)', actual: 73.0, benchmark: 72.0, amountCr: 2073.2, x: 490, yActual: 35, yBench: 22 },
  ];

  const outcomePoints = [
    { period: 'Q1-2025', score: 62, delta: 'Base', status: 'Under Inspection', x: 10, y: 95, driver: 'Baseline composite governance assessment' },
    { period: 'Q2-2025', score: 67, delta: '+5 pts', status: 'Reforms Initiated', x: 80, y: 82, driver: 'Aadhaar DBT validation integration' },
    { period: 'Q3-2025', score: 71, delta: '+4 pts', status: 'Convergence Pilot', x: 150, y: 68, driver: 'Inter-ministerial overlap mitigation' },
    { period: 'Q4-2025', score: 74, delta: '+3 pts', status: 'Telemetry Validated', x: 220, y: 54, driver: 'PMAY-G & JJM joint inspection' },
    { period: 'Q1-2026 (Current)', score: 78, delta: '+4 pts', status: 'Optimal Velocity', x: 290, y: 38, driver: 'Direct bank transfers reached 12.4M citizens' },
  ];

  return (
    <AppShell>
      {/* Hero Section */}
      <div className="space-y-2 border-b border-[#2A2926] pb-8">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
          <span>NATIONAL GOVERNANCE APEX CONSOLE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
          GOVERNANCE AT A GLANCE
        </h1>
        <p className="text-sm text-[#C9C2B7] max-w-2xl font-normal">
          Cross-ministry programme intelligence across regions, resources and outcomes. Hover over charts to inspect live statutory deviations.
        </p>
      </div>

      {/* SUTRA V2 Live Intelligence Pulse */}
      <div className="space-y-6">
        <LiveGovernancePulse />
        <SourceHealthCard sourceHealth={sourceHealth} />
      </div>

      {/* Editorial Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-b border-[#2A2926] pb-8">
        <div className="p-4 bg-[#141412] border-l-2 border-[#B78A5A] rounded-r-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block">
            TOTAL ALLOCATION
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#F3F0E8] mt-1">
            ₹{allocationCount}B
          </div>
          <span className="text-[10px] text-[#5E8B72] block mt-1 font-mono">
            +8.4% vs FY25
          </span>
        </div>

        <div className="p-4 bg-[#141412] border-l-2 border-[#5E8B72] rounded-r-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block">
            FUND UTILIZATION
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#F3F0E8] mt-1">
            {utilizationCount}%
          </div>
          <span className="text-[10px] text-[#8E887E] block mt-1 font-mono">
            Target: 80%
          </span>
        </div>

        <div className="p-4 bg-[#141412] border-l-2 border-[#B78A5A] rounded-r-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block">
            BENEFICIARIES
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#F3F0E8] mt-1">
            {beneficiariesCount}M
          </div>
          <span className="text-[10px] text-[#8E887E] block mt-1 font-mono">
            Direct DBT Verified
          </span>
        </div>

        <div className="p-4 bg-[#141412] border-l-2 border-[#7E7A72] rounded-r-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block">
            ACTIVE PROJECTS
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#F3F0E8] mt-1">
            {projectsCount}
          </div>
          <span className="text-[10px] text-[#8E887E] block mt-1 font-mono">
            Across 36 Districts
          </span>
        </div>

        <div className="p-4 bg-[#141412] border-l-2 border-[#B59A63] rounded-r-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block">
            COVERAGE
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#F3F0E8] mt-1">
            {coverageCount}%
          </div>
          <span className="text-[10px] text-[#A66A62] block mt-1 font-mono">
            5 Critical Gaps
          </span>
        </div>

        <div className="p-4 bg-[#141412] border-l-2 border-[#5E8B72] rounded-r-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block">
            OUTCOME INDEX
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#F3F0E8] mt-1">
            {outcomeCount}
          </div>
          <span className="text-[10px] text-[#5E8B72] block mt-1 font-mono">
            Scale: 0–100
          </span>
        </div>
      </div>

      {/* Part 7: All 6 Core Visualizations */}
      <div className="space-y-8">
        {/* Row 1: Chart 1 & Chart 2 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 1. Fund Utilization Trend */}
          <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A]">
                  1. DRAWDOWN PACE • INTERACTIVE TELEMETRY
                </span>
                <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
                  Fund Utilization Trend vs Statutory Benchmark
                </h3>
              </div>
              <span className="text-xs font-mono text-[#5E8B72]">FY 2025–26</span>
            </div>

            {/* Active Hover Detail Banner for Chart 1 */}
            {hoveredDrawdownIdx !== null && (
              <div className="p-3 bg-[#191917] border border-[#B78A5A]/50 rounded font-mono text-xs flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
                <div>
                  <span className="text-[10px] text-[#8E887E] uppercase block">
                    PERIOD: {drawdownPoints[hoveredDrawdownIdx].month}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-[#F3F0E8]">
                      {drawdownPoints[hoveredDrawdownIdx].actual}% Actual
                    </span>
                    <span className="text-xs text-[#B78A5A]">
                      (₹{drawdownPoints[hoveredDrawdownIdx].amountCr} Cr)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8E887E] uppercase block">
                    BENCHMARK: {drawdownPoints[hoveredDrawdownIdx].benchmark}%
                  </span>
                  <span className="text-xs font-bold text-[#5E8B72]">
                    +{(drawdownPoints[hoveredDrawdownIdx].actual - drawdownPoints[hoveredDrawdownIdx].benchmark).toFixed(1)} pp Variance
                  </span>
                </div>
              </div>
            )}

            <div className="h-44 w-full pt-2 relative">
              <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B78A5A" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#B78A5A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="35" x2="500" y2="35" stroke="#2A2926" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#2A2926" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="500" y2="105" stroke="#2A2926" strokeDasharray="3 3" />

                {/* Benchmark path */}
                <path
                  d="M 10 120 L 90 100 L 170 80 L 250 62 L 330 45 L 410 32 L 490 22"
                  fill="none"
                  stroke="#7E7A72"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Actual Area */}
                <path
                  d="M 10 130 L 90 115 L 170 95 L 250 72 L 330 52 L 410 40 L 490 35 L 490 140 L 10 140 Z"
                  fill="url(#chartGrad1)"
                />
                {/* Actual Stroke */}
                <path
                  d="M 10 130 L 90 115 L 170 95 L 250 72 L 330 52 L 410 40 L 490 35"
                  fill="none"
                  stroke="#B78A5A"
                  strokeWidth="2.5"
                  className="animate-path-draw"
                />

                {/* Vertical cursor guide line for active hover */}
                {hoveredDrawdownIdx !== null && (
                  <line
                    x1={drawdownPoints[hoveredDrawdownIdx].x}
                    y1="0"
                    x2={drawdownPoints[hoveredDrawdownIdx].x}
                    y2="140"
                    stroke="#B78A5A"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.8"
                  />
                )}

                {/* Interactive Points */}
                {drawdownPoints.map((pt, i) => {
                  const isHovered = hoveredDrawdownIdx === i;
                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDrawdownIdx(i)}
                    >
                      {/* Generous invisible target for seamless hover */}
                      <circle cx={pt.x} cy={pt.yActual} r="18" fill="transparent" />
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.yActual}
                          r="9"
                          fill="none"
                          stroke="#B78A5A"
                          strokeWidth="2"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.yActual}
                        r={isHovered ? '6' : '3.5'}
                        fill={isHovered ? '#B78A5A' : '#F3F0E8'}
                        stroke="#0D0D0C"
                        strokeWidth="1.5"
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#7E7A72] border-t border-[#2A2926] pt-2">
              {drawdownPoints.map((pt, i) => (
                <span
                  key={i}
                  onMouseEnter={() => setHoveredDrawdownIdx(i)}
                  className={`cursor-pointer transition-colors ${
                    hoveredDrawdownIdx === i ? 'text-[#B78A5A] font-bold underline' : 'hover:text-[#F3F0E8]'
                  }`}
                >
                  {pt.label} ({pt.actual}%)
                </span>
              ))}
            </div>
          </div>

          {/* 2. Regional Coverage */}
          <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B59A63]">
                  2. GEOGRAPHIC DISTRIBUTION • HOVER DETAILS
                </span>
                <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
                  Regional Coverage (36 Maharashtra Districts)
                </h3>
              </div>
              <Link href="/map" className="text-xs font-mono text-[#B78A5A] hover:underline flex items-center gap-1">
                <span>VIEW MAP</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Persistent Fixed-Height Callout Slot (ZERO Layout Shift / ZERO Vibration) */}
            <div className="h-[54px] w-full p-2.5 bg-[#191917] border border-[#2A2926] rounded font-mono text-xs flex items-center justify-between transition-colors duration-150">
              {hoveredDistrict ? (
                <>
                  <div>
                    <span className="font-bold text-[#F3F0E8]">{hoveredDistrict.name} District</span>
                    <span className="text-[10px] text-[#8E887E] block">
                      Pop: {(hoveredDistrict.population / 1000000).toFixed(2)}M • {hoveredDistrict.activeSchemesCount} Active Schemes
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#B78A5A] font-bold">{hoveredDistrict.coverageRate}% Cov</span>
                    <span className="text-[10px] text-[#A66A62] block">
                      Fund Util: {hoveredDistrict.fundUtilizationRate}%
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] text-[#C9C2B7] font-semibold">36 Maharashtra Districts</span>
                    <span className="text-[10px] text-[#7E7A72] block">
                      Hover any district below to lock granular telemetry
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#5E8B72] font-bold">71% Avg Cov</span>
                    <span className="text-[10px] text-[#8E887E] block">Benchmark: 64%</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3 font-mono text-xs">
              {MAHARASHTRA_DISTRICTS.slice(0, 5).map((dist) => {
                const isHovered = hoveredDistrict?.id === dist.id;
                return (
                  <div
                    key={dist.id}
                    onMouseEnter={() => setHoveredDistrict(dist)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => setHoveredDistrict(dist)}
                    className={`p-1.5 rounded cursor-pointer transition-colors ${
                      isHovered ? 'bg-[#1E1E1A] border border-[#B78A5A]' : 'border border-transparent hover:bg-[#191917]'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={`font-semibold ${isHovered ? 'text-[#B78A5A]' : 'text-[#F3F0E8]'}`}>
                        {dist.name}
                      </span>
                      <span className={dist.isGapFlagged ? 'text-[#A66A62] font-bold' : 'text-[#5E8B72]'}>
                        {dist.coverageRate}% {dist.isGapFlagged ? `(Gap ${dist.gapPercentagePoints} pp)` : 'Benchmark Met'}
                      </span>
                    </div>
                    <div className="w-full bg-[#191917] h-2 rounded border border-[#2A2926] relative overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-[64%] w-0.5 bg-[#8E887E] z-10" />
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          dist.isGapFlagged ? 'bg-[#A66A62]' : 'bg-[#5E8B72]'
                        }`}
                        style={{ width: `${dist.coverageRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Chart 3, Chart 4, Chart 5 */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* 3. Beneficiary Reach */}
          <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A]">
                  3. SECTORAL DEMOGRAPHICS
                </span>
                <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
                  Beneficiary Reach by Sector
                </h3>
              </div>
              <span className="text-xs font-mono text-[#C9C2B7]">12.4M Total</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { sector: 'Agriculture (PM-KISAN/PKVY)', count: '4.8M', pct: 39, color: '#B78A5A', verified: '99.4% DBT Linked' },
                { sector: 'Health (AB-PMJAY)', count: '3.6M', pct: 29, color: '#5E8B72', verified: '98.8% Cashless' },
                { sector: 'Rural Infra & Housing (PMAY-G)', count: '2.4M', pct: 19, color: '#B59A63', verified: 'Geo-tagged 100%' },
                { sector: 'Water (Jal Jeevan Mission)', count: '1.6M', pct: 13, color: '#8E887E', verified: 'Flow Sensor Mapped' },
              ].map((item, idx) => {
                const isHovered = hoveredSector === idx;
                return (
                  <div
                    key={item.sector}
                    onMouseEnter={() => setHoveredSector(idx)}
                    onMouseLeave={() => setHoveredSector(null)}
                    className={`p-2.5 rounded bg-[#191917] border transition-colors cursor-pointer ${
                      isHovered ? 'border-[#B78A5A]' : 'border-[#2A2926]'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={`truncate ${isHovered ? 'text-[#B78A5A] font-bold' : 'text-[#F3F0E8]'}`}>
                        {item.sector}
                      </span>
                      <span className="font-bold text-[#F3F0E8]">{item.count}</span>
                    </div>
                    <div className="w-full bg-[#141412] h-1.5 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-[#8E887E]">
                      <span>Share: {item.pct}%</span>
                      <span className={isHovered ? 'text-[#5E8B72] font-semibold' : 'text-[#7E7A72]'}>{item.verified}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Programme Completion */}
          <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E8B72]">
                  4. WORK VELOCITY
                </span>
                <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
                  Programme Milestone Completion
                </h3>
              </div>
              <span className="text-xs font-mono text-[#5E8B72]">684 Projects</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                { scheme: 'PM-KISAN (Direct Income)', rate: 90, status: 'On Track', milestone: 'Tranche 17 Released' },
                { scheme: 'PMGSY-III (Rural Roads)', rate: 76, status: 'Normal', milestone: '3,410 km Completed' },
                { scheme: 'PMAY-G (Rural Housing)', rate: 74, status: 'Normal', milestone: '18,400 Units Built' },
                { scheme: 'PKVY (Organic Farming)', rate: 61, status: 'Lagging', milestone: 'Bio-hub Cert Pending' },
                { scheme: 'Jal Jeevan Mission (Water)', rate: 58, status: 'Review', milestone: 'Sensor Calibrations' },
              ].map((sch, idx) => {
                const isHovered = hoveredScheme === idx;
                return (
                  <div
                    key={sch.scheme}
                    onMouseEnter={() => setHoveredScheme(idx)}
                    onMouseLeave={() => setHoveredScheme(null)}
                    className={`p-1.5 rounded cursor-pointer transition-colors ${
                      isHovered ? 'bg-[#191917] border border-[#B78A5A]/50' : 'hover:bg-[#191917]/50'
                    }`}
                  >
                    <div className="flex justify-between text-[11px]">
                      <span className={`truncate ${isHovered ? 'text-[#F3F0E8] font-bold' : 'text-[#C9C2B7]'}`}>
                        {sch.scheme}
                      </span>
                      <span className={sch.rate < 65 ? 'text-[#A66A62] font-bold' : 'text-[#5E8B72] font-bold'}>
                        {sch.rate}%
                      </span>
                    </div>
                    <div className="w-full bg-[#191917] h-1.5 rounded mt-1">
                      <div
                        className={`h-full rounded ${sch.rate < 65 ? 'bg-[#A66A62]' : 'bg-[#5E8B72]'}`}
                        style={{ width: `${sch.rate}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-[#7E7A72]">
                      <span className="truncate">{sch.milestone}</span>
                      <span className={sch.rate < 65 ? 'text-[#A66A62]' : 'text-[#5E8B72]'}>{sch.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Outcome Trend */}
          <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B59A63]">
                  5. IMPACT VELOCITY • HOVER
                </span>
                <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
                  Outcome Trend (Index 78/100)
                </h3>
              </div>
              <span className="text-xs font-mono text-[#5E8B72]">+6 pts QoQ</span>
            </div>

            {/* Active Hover Detail for Chart 5 */}
            {hoveredOutcome !== null && (
              <div className="p-2 bg-[#191917] border border-[#5E8B72]/50 rounded font-mono text-[11px] animate-in fade-in duration-150">
                <div className="flex justify-between text-[#F3F0E8]">
                  <span>{outcomePoints[hoveredOutcome].period}</span>
                  <span className="text-[#5E8B72] font-bold">Score: {outcomePoints[hoveredOutcome].score}/100</span>
                </div>
                <div className="text-[10px] text-[#8E887E] mt-0.5 truncate">
                  {outcomePoints[hoveredOutcome].driver}
                </div>
              </div>
            )}

            <div className="h-32 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="300" y2="30" stroke="#2A2926" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#2A2926" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="#2A2926" strokeDasharray="3 3" />

                <path
                  d="M 10 95 L 80 82 L 150 68 L 220 54 L 290 38"
                  fill="none"
                  stroke="#5E8B72"
                  strokeWidth="2.5"
                />

                {outcomePoints.map((pt, i) => {
                  const isHovered = hoveredOutcome === i;
                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredOutcome(i)}
                    >
                      <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                      {isHovered && (
                        <circle cx={pt.x} cy={pt.y} r="7" fill="none" stroke="#5E8B72" strokeWidth="1.5" className="animate-ping" />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? '5' : '3'}
                        fill={isHovered ? '#5E8B72' : '#F3F0E8'}
                        stroke="#0D0D0C"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#7E7A72] border-t border-[#2A2926] pt-1">
              {outcomePoints.map((pt, i) => (
                <span
                  key={i}
                  onMouseEnter={() => setHoveredOutcome(i)}
                  className={`cursor-pointer transition-colors ${
                    hoveredOutcome === i ? 'text-[#5E8B72] font-bold underline' : 'hover:text-[#F3F0E8]'
                  }`}
                >
                  {pt.period.split('-')[0]} ({pt.score})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: 6. Active Intelligence Signals & Overlaps */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Implementation Signals */}
          <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#B59A63]" />
                <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
                  6. Active Implementation Signals
                </h3>
              </div>
              <Link href="/signals" className="text-xs font-mono text-[#B78A5A] hover:underline">
                VIEW SIGNALS RADAR →
              </Link>
            </div>

            <div className="space-y-3">
              {SIGNALS_DATA.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3.5 rounded bg-[#191917] border border-[#2A2926] hover:border-[#B78A5A]/50 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#B78A5A] block">
                      {sig.schemeId} • {sig.districtName || 'National'}
                    </span>
                    <h4 className="font-semibold text-xs text-[#F3F0E8]">{sig.schemeName}</h4>
                    <span className="text-[10px] font-mono text-[#8E887E]">
                      Current: {sig.currentUtilization}% (expected {sig.expectedUtilization}%)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#A66A62] block">
                      {sig.deviation} pp
                    </span>
                    <button
                      onClick={() =>
                        openExplain({
                          title: `${sig.schemeName} (${sig.districtName})`,
                          confidence: sig.confidence,
                          factors: sig.factors.map((f) => ({ title: f.title, weight: f.value })),
                          evidenceRecordNumber: sig.evidenceRecordId,
                        })
                      }
                      className="text-[11px] font-mono text-[#B78A5A] hover:underline mt-1 block"
                    >
                      Why Flagged?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Programme Overlap Callout */}
          <div className="p-6 bg-[#141412] border border-[#B78A5A]/40 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A]">
                CROSS-PROGRAMME OVERLAP DETECTION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B78A5A]/20 text-[#B78A5A]">
                82% SIMILARITY
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-[#F3F0E8] font-editorial">
                PKVY (Scheme A) ⇄ MOVCDNER (Scheme B)
              </h4>
              <p className="text-xs text-[#C9C2B7] mt-1 leading-relaxed">
                Dual bio-input and organic cluster certification subsidies active concurrently in Nandurbar & Dhule with 91% target smallholder overlap.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">TARGET GROUP</span>
                <span className="font-bold text-[#F3F0E8]">91% MATCH</span>
              </div>
              <div className="p-2.5 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">INTERVENTION</span>
                <span className="font-bold text-[#F3F0E8]">86% MATCH</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2A2926]">
              <Link
                href="/overlaps"
                className="text-xs font-mono text-[#B78A5A] hover:underline flex items-center gap-1"
              >
                <span>OPEN OVERLAP DECOMPOSITION</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => openEvidence('#9281')}
                className="text-xs font-mono text-[#8E887E] hover:text-[#F3F0E8]"
              >
                Inspect Evidence Record #9281
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: SUTRA V4 — Maharashtra 36-District Coverage & Live Anomaly Mesh */}
        <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2926] pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PHASE 9 — 36 MAHARASHTRA DISTRICT STATUTORY COVERAGE MATRIX</span>
              </div>
              <h3 className="text-xl font-bold text-[#F3F0E8] font-editorial mt-1">
                LGD-First Governance Mesh State
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                28 VERIFIED SOURCES
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                5 STALE REPORTING
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                3 PENDING SYNC
              </span>
            </div>
          </div>

          {/* 36 District Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 font-mono text-xs">
            {MAHARASHTRA_DISTRICTS.map((dist, idx) => {
              const isVerified = idx < 28;
              const isStale = idx >= 28 && idx < 33;
              const statusColor = isVerified
                ? 'border-emerald-500/30 text-emerald-300 hover:border-emerald-400 bg-emerald-950/10'
                : isStale
                ? 'border-amber-500/30 text-amber-300 hover:border-amber-400 bg-amber-950/10'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 bg-zinc-950/40';

              return (
                <Link
                  key={dist.id}
                  href="/map"
                  className={`p-2 rounded border transition-all text-center group cursor-pointer ${statusColor}`}
                >
                  <div className="text-[10px] text-zinc-400 font-bold">LGD:{dist.lgdCode || 492 + idx}</div>
                  <div className="font-semibold text-xs truncate group-hover:text-white mt-0.5">
                    {dist.name}
                  </div>
                  <div className="text-[9px] mt-1 opacity-80">
                    {isVerified ? '● VERIFIED' : isStale ? '▲ STALE' : '○ PENDING'}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-[#2A2926]">
            <span>100% Deterministic LGD Resolution (Census 2011 & MoPR Registry)</span>
            <Link href="/map" className="text-[#B78A5A] hover:underline flex items-center gap-1">
              <span>View Full GIS Spatial Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
