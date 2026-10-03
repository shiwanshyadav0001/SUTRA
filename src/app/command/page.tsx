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
  Database,
  ArrowRight,
  Compass,
  FileSpreadsheet,
  CheckCircle,
  Eye,
  GitBranch,
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

  const pipelineStages = [
    { name: 'SOURCE', label: '1. Official Ledgers', href: '/data', icon: Database, desc: 'PFMS & MIS Ingestion' },
    { name: 'DATA', label: '2. Spatial Normalization', href: '/data', icon: CheckCircle2, desc: 'LGD Code Resolution' },
    { name: 'ANALYSIS', label: '3. Vector Similarity', href: '/overlaps', icon: GitBranch, desc: 'TF-IDF Overlap Engine' },
    { name: 'DETECTION', label: '4. Anomaly Flagging', href: '/signals', icon: AlertTriangle, desc: 'Z-Score Drawdown Lag' },
    { name: 'INVESTIGATION', label: '5. Sovereign Workspace', href: '/investigate', icon: Compass, desc: 'Multivariate Triangulation' },
    { name: 'EVIDENCE', label: '6. Cryptographic Hash', href: '/evidence', icon: ShieldCheck, desc: 'SHA-256 Provenance' },
    { name: 'HUMAN REVIEW', label: '7. Policy Attribution', href: '/intelligence/gaps', icon: Eye, desc: 'Decomposed Factors' },
    { name: 'ACTION', label: '8. Governance Directives', href: '/schemes', icon: ArrowUpRight, desc: 'Harmonization Mandate' },
  ];

  return (
    <AppShell>
      {/* 1. Governance Pipeline Flow Banner (Clear Visual Architecture) */}
      <div className="bg-[#0B132B] border border-[#1E293B] rounded-lg p-3.5 shadow-xl text-white">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-cyan-300 uppercase mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">END-TO-END GOVERNANCE INTELLIGENCE LIFECYCLE</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">DETERMINISTIC PIPELINE v2.6</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 font-mono text-xs">
          {pipelineStages.map((st, idx) => {
            const Icon = st.icon;
            return (
              <Link
                key={st.name}
                href={st.href}
                className="group p-2 rounded bg-[#080E21] hover:bg-[#132247] border border-[#1E293B] hover:border-cyan-400 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[9px] text-slate-400 group-hover:text-cyan-300">
                  <span>0{idx + 1}</span>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="font-bold text-[11px] text-white group-hover:text-cyan-200 mt-1">
                  {st.name}
                </div>
                <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                  {st.desc}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-800 uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <span>National Governance Apex Console • Cabinet Secretariat Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-editorial mt-0.5">
            Command Center
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl font-normal mt-0.5">
            Cross-ministry programme intelligence across regions, resources and statutory outcomes. All figures are deterministically aggregated from official state and central registers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/investigate"
            className="px-3.5 py-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open Sovereign Workspace</span>
          </Link>
        </div>
      </div>

      {/* 3. SUTRA Live Intelligence Pulse & Source Health */}
      <div className="space-y-5">
        <LiveGovernancePulse onOpenWhyFlagged={(id) => openWhyFlagged(id)} />
        <SourceHealthCard sourceHealth={sourceHealth} />
      </div>

      {/* 4. 6 Deliberate Surface Types for Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Surface 1: Dark Navy Intelligence Panel */}
        <Link
          href="/schemes"
          className="p-3.5 rounded-lg bg-[#0B132B] text-white border border-[#1E293B] hover:border-cyan-400 shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block font-bold">
              TOTAL ALLOCATION
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-cyan-200 transition-colors">
              ₹{allocationCount}B
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 block mt-2 font-mono font-medium flex items-center justify-between">
            <span>+8.4% vs FY25</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Surface 2: Royal Governance Drawdown Panel */}
        <Link
          href="/signals?filter=active"
          className="p-3.5 rounded-lg bg-[#0B1E3B] text-white border border-blue-800 hover:border-blue-400 shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 block font-bold">
              FUND DRAWDOWN RATE
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-blue-200 transition-colors">
              {utilizationCount}%
            </div>
          </div>
          <span className="text-[10px] text-blue-300 block mt-2 font-mono font-medium flex items-center justify-between">
            <span>Target: 80% (Signals)</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Surface 3: Muted Green Verification Panel */}
        <Link
          href="/data"
          className="p-3.5 rounded-lg bg-[#082618] text-emerald-100 border border-emerald-800/80 hover:border-emerald-400 shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 block font-bold">
              BENEFICIARIES
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-emerald-200 transition-colors">
              {beneficiariesCount}M
            </div>
          </div>
          <span className="text-[10px] text-emerald-300 block mt-2 font-mono font-medium flex items-center justify-between">
            <span>SECC / DBT Verified</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Surface 4: Dark Slate Project Panel */}
        <Link
          href="/schemes"
          className="p-3.5 rounded-lg bg-[#111C3A] text-slate-100 border border-[#233560] hover:border-slate-300 shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 block font-bold">
              ACTIVE PROJECTS
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-slate-200 transition-colors">
              {projectsCount}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block mt-2 font-mono font-medium flex items-center justify-between">
            <span>36 MH Districts</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Surface 5: Amber Alert Delivery Gap Panel */}
        <Link
          href="/intelligence/gaps"
          className="p-3.5 rounded-lg bg-[#2A1805] text-amber-200 border border-amber-700/80 hover:border-amber-400 shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold flex items-center justify-between">
              <span>COVERAGE</span>
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-amber-200 transition-colors">
              {coverageCount}%
            </div>
          </div>
          <span className="text-[10px] text-amber-400 block mt-2 font-mono font-bold flex items-center justify-between">
            <span>5 Critical Gaps</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Surface 6: Deep Sky Blue Outcome Index Panel */}
        <Link
          href="/evidence"
          className="p-3.5 rounded-lg bg-[#082238] text-cyan-200 border border-cyan-800/80 hover:border-cyan-400 shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block font-bold">
              OUTCOME INDEX
            </span>
            <div className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-cyan-200 transition-colors">
              {outcomeCount}/100
            </div>
          </div>
          <span className="text-[10px] text-cyan-300 block mt-2 font-mono font-medium flex items-center justify-between">
            <span>Cryptographic Trail</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>

      {/* 5. Core Visualizations & Deep Dive Telemetry (Cinematic Midnight Surfaces) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart 1: Fund Utilization Trend vs Statutory Benchmark */}
        <div className="p-5 bg-[#0B132B] border border-[#1E293B] rounded-lg shadow-xl text-white space-y-4 relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                1. DRAWDOWN PACE • INTERACTIVE TELEMETRY
              </span>
              <h3 className="text-base font-bold text-white font-editorial mt-0.5">
                Fund Drawdown Velocity vs Statutory Benchmark
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              FY 2025–26
            </span>
          </div>

          {/* Active Hover Detail Banner */}
          {hoveredDrawdownIdx !== null && (
            <div className="p-3 bg-[#080E21] border border-[#233560] rounded-md font-mono text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">
                  PERIOD: {drawdownPoints[hoveredDrawdownIdx].month}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-white">
                    {drawdownPoints[hoveredDrawdownIdx].actual}% Actual
                  </span>
                  <span className="text-xs font-semibold text-cyan-300">
                    (₹{drawdownPoints[hoveredDrawdownIdx].amountCr} Cr)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">
                  BENCHMARK: {drawdownPoints[hoveredDrawdownIdx].benchmark}%
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  +{(drawdownPoints[hoveredDrawdownIdx].actual - drawdownPoints[hoveredDrawdownIdx].benchmark).toFixed(1)} pp Variance
                </span>
              </div>
            </div>
          )}

          <div className="h-44 w-full pt-2 relative bg-[#080E21] rounded-md border border-[#1E293B]">
            <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="35" x2="500" y2="35" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="0" y1="105" x2="500" y2="105" stroke="#1E293B" strokeDasharray="3 3" />

              {/* Benchmark path */}
              <path
                d="M 10 120 L 90 100 L 170 80 L 250 62 L 330 45 L 410 32 L 490 22"
                fill="none"
                stroke="#64748B"
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
                stroke="#38BDF8"
                strokeWidth="2.5"
              />

              {/* Guide line for hover */}
              {hoveredDrawdownIdx !== null && (
                <line
                  x1={drawdownPoints[hoveredDrawdownIdx].x}
                  y1="0"
                  x2={drawdownPoints[hoveredDrawdownIdx].x}
                  y2="140"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  strokeOpacity="0.8"
                />
              )}

              {/* Points */}
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
                        r="8"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.yActual}
                      r={isHovered ? '6' : '3.5'}
                      fill={isHovered ? '#38BDF8' : '#0B132B'}
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-1 text-slate-300">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-1 bg-cyan-400 rounded-sm" />
                <span>State Actual Drawdown</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-400">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                <span>Statutory 80% Benchmark</span>
              </span>
            </div>
            <Link href="/signals" className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
              <span>View Signals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Chart 2: Statutory Outcome Progression & Reform Impact */}
        <div className="p-5 bg-[#0B132B] border border-[#1E293B] rounded-lg shadow-xl text-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                2. OUTCOME TRAJECTORY • 5-QUARTER CONVERGENCE
              </span>
              <h3 className="text-base font-bold text-white font-editorial mt-0.5">
                Composite Statutory Outcome Progression
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              Score: 78/100
            </span>
          </div>

          {/* Active Hover Outcome Detail */}
          {hoveredOutcome !== null && (
            <div className="p-3 bg-[#080E21] border border-[#233560] rounded-md font-mono text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">
                  PERIOD: {outcomePoints[hoveredOutcome].period}
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {outcomePoints[hoveredOutcome].score}/100 ({outcomePoints[hoveredOutcome].delta})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">STATUS</span>
                <span className="text-xs font-bold text-white">
                  {outcomePoints[hoveredOutcome].status}
                </span>
              </div>
            </div>
          )}

          <div className="h-44 w-full pt-2 relative bg-[#080E21] rounded-md border border-[#1E293B]">
            <svg className="w-full h-full" viewBox="0 0 320 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2="320" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="320" y2="60" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="320" y2="90" stroke="#1E293B" strokeDasharray="3 3" />

              <path
                d="M 10 95 L 80 82 L 150 68 L 220 54 L 290 38 L 290 120 L 10 120 Z"
                fill="url(#chartGrad2)"
              />
              <path
                d="M 10 95 L 80 82 L 150 68 L 220 54 L 290 38"
                fill="none"
                stroke="#10B981"
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
                    <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="8"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '6' : '3.5'}
                      fill={isHovered ? '#10B981' : '#0B132B'}
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1">
            <span className="text-slate-400">
              Driver: {hoveredOutcome !== null ? outcomePoints[hoveredOutcome].driver : 'Multi-ministerial reforms'}
            </span>
            <Link href="/evidence" className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
              <span>View Audit Lineage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Sector Distribution & Milestone Progress (Analytical Panels) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sector Allocation Breakdown */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">
                SECTORAL CAPITAL ALLOCATION
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Core Priority Mission Portfolios
              </h3>
            </div>
            <Link href="/schemes" className="text-xs text-blue-700 font-mono font-medium hover:underline">
              View All 12 Schemes →
            </Link>
          </div>

          <div className="space-y-3">
            {sectorData.map((sec) => (
              <div key={sec.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{sec.name}</span>
                  <span className="font-mono text-slate-700 font-bold">{sec.outlay} ({sec.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                  <div className={`${sec.color} h-full rounded transition-all duration-500`} style={{ width: `${sec.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Programme Milestone Achievements */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                STATUTORY MILESTONES
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Verification Ledger Milestones
              </h3>
            </div>
            <Link href="/evidence" className="text-xs text-emerald-700 font-mono font-medium hover:underline">
              Audit Hashes →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { scheme: 'Jal Jeevan Mission', milestone: 'Functional Tap Connections (FHTC)', rate: 68 },
              { scheme: 'PMAY-G Rural Housing', milestone: 'SECC Geo-tagged Pucca Units', rate: 74 },
              { scheme: 'PKVY Organic Farming', milestone: 'Certified Tribal Organic Clusters', rate: 61 },
              { scheme: 'PMGSY Rural Roads', milestone: 'All-Weather Habitation Links', rate: 82 },
            ].map((ms) => (
              <div key={ms.scheme} className="p-2.5 rounded bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">{ms.scheme}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{ms.milestone}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {ms.rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Active Anomaly Radar & Programme Overlap Spotlight */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Signals Table (High-contrast Anomaly Radar) */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold block">
                  EARLY ANOMALY SIGNALS
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Priority Implementation Variance Flags
                </h3>
              </div>
            </div>
            <Link href="/signals" className="text-xs text-blue-700 font-mono font-medium hover:underline">
              Inspect All Signals →
            </Link>
          </div>

          <div className="space-y-2.5">
            {SIGNALS_DATA.slice(0, 3).map((sig) => (
              <div
                key={sig.id}
                className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{sig.schemeName.split('(')[0]}</span>
                  <span className="font-mono text-xs font-bold text-rose-700">
                    -{sig.deviation}% Deficit
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>Territory: {sig.districtName || 'Nandurbar'}</span>
                  <span>Disbursed: {sig.currentUtilization}% vs {sig.expectedUtilization}%</span>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-1 border-t border-amber-200/60">
                  <button
                    onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-400"
                  >
                    Why Flagged?
                  </button>
                  <Link
                    href={`/investigate?signal=${sig.id}`}
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Investigate →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Programme Overlap Spotlight (Venn / Network Convergence) */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 font-bold block">
                PROGRAMMATIC CONVERGENCE
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Cross-Scheme Vector Overlap Alert
              </h3>
            </div>
            <Link href="/overlaps" className="text-xs text-blue-700 font-mono font-medium hover:underline">
              Weight Sandbox →
            </Link>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                PKVY (Organic Cluster) ⇄ MOVCDNER
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                82% Overlap
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Concurrent financial subsidies targeting identical smallholder clusters in Nandurbar, Gadchiroli, and Dhule with duplicate bio-input funding.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">TARGET GROUP</span>
                <span className="font-bold text-slate-900">91% MATCH</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">INTERVENTION</span>
                <span className="font-bold text-slate-900">86% MATCH</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-mono">
              <Link href="/relationships" className="text-blue-700 font-semibold hover:underline">
                Explore Knowledge Graph →
              </Link>
              <button
                onClick={() => openEvidence('SUTRA-EVD-9281')}
                className="text-slate-600 hover:text-blue-700 font-medium"
              >
                Inspect Record #9281
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8. 36 Maharashtra District Statutory Coverage Matrix */}
      <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold block">
              36 MAHARASHTRA DISTRICT STATUTORY COVERAGE MATRIX
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              LGD-First Governance Mesh State
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              28 VERIFIED
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              5 STALE
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              3 PENDING
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 font-mono text-xs">
          {MAHARASHTRA_DISTRICTS.map((dist, idx) => {
            const isVerified = idx < 28;
            const isStale = idx >= 28 && idx < 33;
            const statusStyle = isVerified
              ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900 hover:border-emerald-500'
              : isStale
              ? 'border-amber-200 bg-amber-50/60 text-amber-900 hover:border-amber-500'
              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400';

            return (
              <Link
                key={dist.id}
                href={`/map?district=${dist.id}`}
                className={`p-2 rounded border transition-all text-center group cursor-pointer ${statusStyle}`}
              >
                <div className="text-[9px] text-slate-500 font-bold">LGD:{dist.lgdCode || 492 + idx}</div>
                <div className="font-semibold text-xs truncate group-hover:text-blue-700 mt-0.5">
                  {dist.name}
                </div>
                <div className="text-[9px] mt-1 font-semibold">
                  {isVerified ? '● VERIFIED' : isStale ? '▲ STALE' : '○ PENDING'}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-100">
          <span>100% Deterministic LGD Spatial Keying</span>
          <Link href="/map" className="text-blue-700 font-semibold hover:underline flex items-center gap-1">
            <span>Explore Full GIS Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
