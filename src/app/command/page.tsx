'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  FileText,
  Search,
} from 'lucide-react';

export default function CommandCenterPage() {
  const router = useRouter();
  const { openEvidence, openExplain, openWhyFlagged, sourceHealth } = useIntelligence();

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

  const sectorData = [
    { name: 'Rural Water & JJM', outlay: '₹980 Cr', pct: 86, color: 'bg-blue-600', link: '/schemes' },
    { name: 'Affordable Housing (PMAY-G)', outlay: '₹740 Cr', pct: 64, color: 'bg-emerald-600', link: '/schemes' },
    { name: 'Organic Farming (PKVY)', outlay: '₹420 Cr', pct: 58, color: 'bg-amber-600', link: '/schemes' },
    { name: 'PM-KISAN Direct DBT', outlay: '₹700 Cr', pct: 92, color: 'bg-indigo-600', link: '/schemes' },
  ];

  const schemeMilestones = [
    { scheme: 'JJM Tap Connections', rate: 76, milestone: '3.2M Households Verified', status: 'On Target' },
    { scheme: 'PMAY-G Unit Completions', rate: 58, milestone: '412K Units Sanctioned', status: 'Drawdown Deficit' },
    { scheme: 'PKVY Soil Certification', rate: 64, milestone: '184 Clusters Formed', status: 'Overlapping Subsidy' },
    { scheme: 'PM-KISAN Aadhaar DBT', rate: 94, milestone: '2.8M Accounts Credited', status: 'Fully Disbursed' },
  ];

  return (
    <AppShell>
      {/* Hero Section */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>NATIONAL GOVERNANCE APEX CONSOLE • AUDITED REGISTRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
          GOVERNANCE AT A GLANCE
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
          Cross-ministry programme intelligence across regions, resources and statutory outcomes. All figures are deterministically aggregated from official state and central registers.
        </p>
      </div>

      {/* SUTRA Live Intelligence Pulse & Source Health */}
      <div className="space-y-5 my-6">
        <LiveGovernancePulse onOpenWhyFlagged={(id) => openWhyFlagged(id)} />
        <SourceHealthCard sourceHealth={sourceHealth} />
      </div>

      {/* Editorial Key Metrics Grid - All Connected to Real Destinaions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 border-b border-slate-200 pb-6">
        <Link
          href="/schemes"
          className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-md hover:border-blue-400 hover:shadow-xs transition-all group cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
            TOTAL ALLOCATION
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 group-hover:text-blue-700 transition-colors">
            ₹{allocationCount}B
          </div>
          <span className="text-[10px] text-emerald-700 block mt-1 font-mono font-medium">
            +8.4% vs FY25 →
          </span>
        </Link>

        <Link
          href="/signals?filter=active"
          className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-md hover:border-emerald-400 hover:shadow-xs transition-all group cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
            FUND UTILIZATION
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 group-hover:text-emerald-700 transition-colors">
            {utilizationCount}%
          </div>
          <span className="text-[10px] text-slate-500 block mt-1 font-mono">
            Target: 80% (View Signals) →
          </span>
        </Link>

        <Link
          href="/data"
          className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-indigo-600 rounded-md hover:border-indigo-400 hover:shadow-xs transition-all group cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
            BENEFICIARIES
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 group-hover:text-indigo-700 transition-colors">
            {beneficiariesCount}M
          </div>
          <span className="text-[10px] text-slate-500 block mt-1 font-mono">
            Direct DBT Verified →
          </span>
        </Link>

        <Link
          href="/schemes"
          className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-slate-400 rounded-md hover:border-slate-500 hover:shadow-xs transition-all group cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
            ACTIVE PROJECTS
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 group-hover:text-slate-700 transition-colors">
            {projectsCount}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1 font-mono">
            Across 36 Districts →
          </span>
        </Link>

        <Link
          href="/intelligence/gaps"
          className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-md hover:border-amber-400 hover:shadow-xs transition-all group cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
            COVERAGE
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 group-hover:text-amber-700 transition-colors">
            {coverageCount}%
          </div>
          <span className="text-[10px] text-amber-700 block mt-1 font-mono font-medium">
            5 Critical Gaps →
          </span>
        </Link>

        <Link
          href="/evidence"
          className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-md hover:border-emerald-400 hover:shadow-xs transition-all group cursor-pointer"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
            OUTCOME INDEX
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5 group-hover:text-emerald-700 transition-colors">
            {outcomeCount}
          </div>
          <span className="text-[10px] text-emerald-700 block mt-1 font-mono font-medium">
            Audit Lineage →
          </span>
        </Link>
      </div>

      {/* Part 7: Core Visualizations & Deep Dive Controllers */}
      <div className="space-y-6 my-6">
        {/* Row 1: Chart 1 & Chart 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 1. Fund Utilization Trend */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-semibold">
                  1. DRAWDOWN PACE • INTERACTIVE TELEMETRY
                </span>
                <h3 className="text-base font-bold text-slate-900 font-editorial">
                  Fund Utilization Trend vs Statutory Benchmark
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                FY 2025–26
              </span>
            </div>

            {/* Active Hover Detail Banner for Chart 1 */}
            {hoveredDrawdownIdx !== null && (
              <div className="p-3 bg-slate-50 border border-blue-200 rounded-md font-mono text-xs flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    PERIOD: {drawdownPoints[hoveredDrawdownIdx].month}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-slate-900">
                      {drawdownPoints[hoveredDrawdownIdx].actual}% Actual
                    </span>
                    <span className="text-xs font-semibold text-blue-700">
                      (₹{drawdownPoints[hoveredDrawdownIdx].amountCr} Cr)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    BENCHMARK: {drawdownPoints[hoveredDrawdownIdx].benchmark}%
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    +{(drawdownPoints[hoveredDrawdownIdx].actual - drawdownPoints[hoveredDrawdownIdx].benchmark).toFixed(1)} pp Variance
                  </span>
                </div>
              </div>
            )}

            <div className="h-44 w-full pt-2 relative bg-slate-50/50 rounded-md border border-slate-100">
              <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="35" x2="500" y2="35" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="500" y2="105" stroke="#E2E8F0" strokeDasharray="3 3" />

                {/* Benchmark path */}
                <path
                  d="M 10 120 L 90 100 L 170 80 L 250 62 L 330 45 L 410 32 L 490 22"
                  fill="none"
                  stroke="#94A3B8"
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
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />

                {/* Vertical cursor guide line for active hover */}
                {hoveredDrawdownIdx !== null && (
                  <line
                    x1={drawdownPoints[hoveredDrawdownIdx].x}
                    y1="0"
                    x2={drawdownPoints[hoveredDrawdownIdx].x}
                    y2="140"
                    stroke="#2563EB"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.6"
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
                      <circle cx={pt.x} cy={pt.yActual} r="18" fill="transparent" />
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.yActual}
                          r="9"
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="2"
                          className="animate-ping"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.yActual}
                        r={isHovered ? '6' : '3.5'}
                        fill={isHovered ? '#2563EB' : '#FFFFFF'}
                        stroke="#1D4ED8"
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-2">
              {drawdownPoints.map((pt, i) => (
                <span
                  key={i}
                  onMouseEnter={() => setHoveredDrawdownIdx(i)}
                  className={`cursor-pointer transition-colors ${
                    hoveredDrawdownIdx === i ? 'text-blue-700 font-bold underline' : 'hover:text-slate-900'
                  }`}
                >
                  {pt.label} ({pt.actual}%)
                </span>
              ))}
            </div>
          </div>

          {/* 2. Regional Coverage */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-semibold">
                  2. GEOGRAPHIC DISTRIBUTION • HOVER DETAILS
                </span>
                <h3 className="text-base font-bold text-slate-900 font-editorial">
                  Regional Coverage (36 Maharashtra Districts)
                </h3>
              </div>
              <Link href="/map" className="text-xs font-mono text-blue-700 font-semibold hover:underline flex items-center gap-1">
                <span>VIEW MAP</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Persistent Fixed-Height Callout Slot */}
            <div className="h-[54px] w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs flex items-center justify-between">
              {hoveredDistrict ? (
                <>
                  <div>
                    <span className="font-bold text-slate-900">{hoveredDistrict.name} District</span>
                    <span className="text-[10px] text-slate-500 block">
                      Pop: {(hoveredDistrict.population / 1000000).toFixed(2)}M • {hoveredDistrict.activeSchemesCount} Active Schemes
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-700 font-bold">{hoveredDistrict.coverageRate}% Cov</span>
                    <span className="text-[10px] text-rose-700 block font-semibold">
                      Fund Util: {hoveredDistrict.fundUtilizationRate}%
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] text-slate-800 font-semibold">36 Maharashtra Districts</span>
                    <span className="text-[10px] text-slate-500 block">
                      Hover any district below to lock granular telemetry
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-bold">71% Avg Cov</span>
                    <span className="text-[10px] text-slate-500 block">Benchmark: 64%</span>
                  </div>
                </>
              )}
            </div>

            {/* Mini District Strip */}
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 pt-1">
              {MAHARASHTRA_DISTRICTS.slice(0, 18).map((dist) => (
                <div
                  key={dist.id}
                  onMouseEnter={() => setHoveredDistrict(dist)}
                  onClick={() => router.push(`/map?district=${dist.id}`)}
                  className={`h-8 rounded flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all border ${
                    hoveredDistrict?.id === dist.id
                      ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                      : dist.isGapFlagged
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                  title={`${dist.name}: ${dist.coverageRate}% coverage`}
                >
                  {dist.name.slice(0, 3).toUpperCase()}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-rose-500" /> Gap Flagged (5)
                <span className="w-2 h-2 rounded bg-slate-300 ml-2" /> Compliant (31)
              </span>
              <Link href="/intelligence/gaps" className="text-blue-700 hover:underline">
                Explore Gaps Matrix →
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Sectoral Outlay & Delivery Milestone Pace */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 3. Sector Outlays */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  3. BUDGETARY ALLOCATION • BY SECTOR
                </span>
                <h3 className="text-base font-bold text-slate-900 font-editorial">
                  Sectoral Outlay Breakdown
                </h3>
              </div>
              <Link href="/schemes" className="text-xs font-mono text-blue-700 font-semibold hover:underline">
                ALL SCHEMES →
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {sectorData.map((sec, idx) => (
                <Link
                  key={idx}
                  href={sec.link}
                  onMouseEnter={() => setHoveredSector(idx)}
                  onMouseLeave={() => setHoveredSector(null)}
                  className={`block p-2.5 rounded-md border transition-all ${
                    hoveredSector === idx ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between text-xs font-medium text-slate-900">
                    <span>{sec.name}</span>
                    <span className="font-mono font-bold text-slate-700">{sec.outlay} ({sec.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div className={`${sec.color} h-full rounded-full transition-all`} style={{ width: `${sec.pct}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 4. Delivery Milestone Pace */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  4. IMPLEMENTATION VELOCITY • MILESTONES
                </span>
                <h3 className="text-base font-bold text-slate-900 font-editorial">
                  Flagship Delivery Milestones
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Q4 Inspection</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {schemeMilestones.map((sch, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-md bg-slate-50 border border-slate-200"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-900">{sch.scheme}</span>
                    <span className={`font-mono font-bold ${sch.rate < 65 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {sch.rate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>{sch.milestone}</span>
                    <span className={`font-medium ${sch.rate < 65 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {sch.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Active Implementation Signals & Cross-Programme Overlaps */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Implementation Signals */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 font-editorial">
                  Active Implementation Signals
                </h3>
              </div>
              <Link href="/signals?filter=active" className="text-xs font-mono font-semibold text-blue-700 hover:underline">
                VIEW SIGNALS RADAR ({SIGNALS_DATA.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {SIGNALS_DATA.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3.5 rounded-md bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <span className="text-[10px] font-mono text-blue-700 font-semibold block">
                      {sig.schemeId} • {sig.districtName || 'Maharashtra'}
                    </span>
                    <h4 className="font-semibold text-xs text-slate-900 mt-0.5">{sig.schemeName}</h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      Current: {sig.currentUtilization}% (expected {sig.expectedUtilization}%)
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 block">
                      {sig.deviation} pp
                    </span>
                    <button
                      onClick={() => openWhyFlagged(sig.id)}
                      className="text-[11px] font-mono text-blue-700 hover:underline font-semibold block ml-auto cursor-pointer"
                    >
                      Why Flagged?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Programme Overlap Callout */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-semibold">
                CROSS-PROGRAMME OVERLAP DETECTION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                82% SIMILARITY
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-slate-900 font-editorial">
                PKVY (Scheme A) ⇄ MOVCDNER (Scheme B)
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dual bio-input and organic cluster certification subsidies active concurrently in Nandurbar & Dhule with 91% target smallholder overlap.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">TARGET GROUP</span>
                <span className="font-bold text-slate-900">91% MATCH</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">INTERVENTION</span>
                <span className="font-bold text-slate-900">86% MATCH</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                href="/relationships"
                className="text-xs font-mono font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>OPEN OVERLAP DECOMPOSITION</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => openEvidence('SUTRA-EVD-9281')}
                className="text-xs font-mono text-slate-600 hover:text-blue-700 cursor-pointer"
              >
                Inspect Evidence Record #9281
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: 36 Maharashtra District Statutory Coverage Matrix */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>36 MAHARASHTRA DISTRICT STATUTORY COVERAGE MATRIX</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-editorial mt-0.5">
                LGD-First Governance Mesh State
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                28 VERIFIED SOURCES
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                5 STALE REPORTING
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
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
                ? 'border-emerald-200 text-emerald-800 hover:border-emerald-400 bg-emerald-50/50'
                : isStale
                ? 'border-amber-200 text-amber-800 hover:border-amber-400 bg-amber-50/50'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50';

              return (
                <Link
                  key={dist.id}
                  href={`/map?district=${dist.id}`}
                  className={`p-2 rounded border transition-all text-center group cursor-pointer shadow-2xs ${statusColor}`}
                >
                  <div className="text-[10px] text-slate-500 font-bold">LGD:{dist.lgdCode || 492 + idx}</div>
                  <div className="font-semibold text-xs truncate group-hover:text-blue-700 mt-0.5">
                    {dist.name}
                  </div>
                  <div className="text-[9px] mt-1 font-medium opacity-90">
                    {isVerified ? '● VERIFIED' : isStale ? '▲ STALE' : '○ PENDING'}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
            <span>100% Deterministic LGD Resolution (Census 2011 & MoPR Registry)</span>
            <Link href="/map" className="text-blue-700 font-semibold hover:underline flex items-center gap-1">
              <span>View Full GIS Spatial Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
