'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { NationalGovernanceMap } from '@/components/analytics/NationalGovernanceMap';
import { LiveGovernancePulse } from '@/components/live/LiveGovernancePulse';
import { SourceHealthCard } from '@/components/live/SourceHealthCard';
import {
  GLOBAL_METRICS,
  SIGNALS_DATA,
  MAHARASHTRA_DISTRICTS,
} from '@/lib/data/governance-data';
import {
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  BarChart3,
  Layers,
  MapPin,
  CheckCircle2,
  PieChart,
  Activity,
  ArrowRight,
} from 'lucide-react';

export default function CommandCenterPage() {
  const { openEvidence, openExplain, sourceHealth } = useIntelligence();

  // Animated counters matching exact user requirements
  const [allocationCount, setAllocationCount] = useState(0);
  const [utilizationCount, setUtilizationCount] = useState(0);
  const [beneficiariesCount, setBeneficiariesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [coverageCount, setCoverageCount] = useState(0);
  const [outcomeCount, setOutcomeCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 25;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - (1 - progress) * (1 - progress);

      // Exact targets: ₹4.82T, 78.4%, 84.6M, 12,842, 81.6%, 74.2
      setAllocationCount(Number((4.82 * eased).toFixed(2)));
      setUtilizationCount(Number((78.4 * eased).toFixed(1)));
      setBeneficiariesCount(Number((84.6 * eased).toFixed(1)));
      setProjectsCount(Math.round(12842 * eased));
      setCoverageCount(Number((81.6 * eased).toFixed(1)));
      setOutcomeCount(Number((74.2 * eased).toFixed(1)));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Interactive Chart Hover States
  const [hoveredDrawdownIdx, setHoveredDrawdownIdx] = useState<number | null>(3);
  const [hoveredDistrict, setHoveredDistrict] = useState<typeof MAHARASHTRA_DISTRICTS[0] | null>(null);
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);
  const [hoveredScheme, setHoveredScheme] = useState<number | null>(null);
  const [hoveredOutcome, setHoveredOutcome] = useState<number | null>(4);

  const drawdownPoints = [
    { label: 'Q1 APR', month: 'April 2025', actual: 18.2, benchmark: 14.0, amountCr: 875.2, x: 10, yActual: 130, yBench: 120 },
    { label: 'JUN', month: 'June 2025', actual: 32.5, benchmark: 26.0, amountCr: 1560.4, x: 90, yActual: 110, yBench: 100 },
    { label: 'AUG', month: 'August 2025', actual: 48.0, benchmark: 42.0, amountCr: 2310.8, x: 170, yActual: 85, yBench: 78 },
    { label: 'OCT (Q3)', month: 'October 2025', actual: 62.4, benchmark: 56.0, amountCr: 3007.6, x: 250, yActual: 62, yBench: 58 },
    { label: 'DEC', month: 'December 2025', actual: 71.1, benchmark: 66.0, amountCr: 3427.0, x: 330, yActual: 46, yBench: 42 },
    { label: 'FEB', month: 'February 2026', actual: 76.3, benchmark: 73.0, amountCr: 3677.6, x: 410, yActual: 36, yBench: 30 },
    { label: 'CURRENT', month: 'Live Telemetry', actual: 78.4, benchmark: 76.0, amountCr: 3778.8, x: 490, yActual: 30, yBench: 24 },
  ];

  const outcomePoints = [
    { period: 'Q1-2025', score: 62.1, delta: 'Base', driver: 'Baseline governance audit assessment', x: 10, y: 95 },
    { period: 'Q2-2025', score: 66.4, delta: '+4.3', driver: 'Aadhaar DBT validation & PFMS integration', x: 80, y: 80 },
    { period: 'Q3-2025', score: 69.8, delta: '+3.4', driver: 'Inter-ministerial overlap mitigation pilot', x: 150, y: 66 },
    { period: 'Q4-2025', score: 72.5, delta: '+2.7', driver: 'PMAY-G & JJM joint telemetry inspection', x: 220, y: 52 },
    { period: 'Q1-2026 (Current)', score: 74.2, delta: '+1.7', driver: 'Direct bank transfers reached 84.6M citizens', x: 290, y: 38 },
  ];

  return (
    <AppShell>
      {/* Hero Section */}
      <div className="space-y-1.5 border-b border-[#D8D6CE] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
          <span>SUTRA GOVERNANCE WORKSTATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
          GOVERNANCE AT A GLANCE
        </h1>
        <p className="text-xs text-[#66706A] max-w-3xl leading-relaxed">
          National programme intelligence across resources, implementation, geography and outcomes.
        </p>
      </div>

      {/* 6 Clean White KPI Cards (Exact Values Requested by Spec) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. TOTAL ALLOCATION */}
        <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] border-l-3 border-l-[#164A3A] rounded-lg transition-all shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] block font-semibold">
            TOTAL ALLOCATION
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#18201C] mt-1">
            ₹{allocationCount}T
          </div>
          <span className="text-[10px] text-[#28704D] block mt-1 font-mono font-bold">
            +9.2% YoY Outlay
          </span>
        </div>

        {/* 2. FUND UTILIZATION */}
        <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] border-l-3 border-l-[#28704D] rounded-lg transition-all shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] block font-semibold">
            FUND UTILIZATION
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#18201C] mt-1">
            {utilizationCount}%
          </div>
          <span className="text-[10px] text-[#66706A] block mt-1 font-mono">
            Benchmark: 76.0%
          </span>
        </div>

        {/* 3. BENEFICIARIES REACHED */}
        <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] border-l-3 border-l-[#B58A45] rounded-lg transition-all shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] block font-semibold">
            BENEFICIARIES REACHED
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#18201C] mt-1">
            {beneficiariesCount}M
          </div>
          <span className="text-[10px] text-[#28704D] block mt-1 font-mono font-bold">
            DBT Direct Verified
          </span>
        </div>

        {/* 4. ACTIVE PROJECTS */}
        <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] border-l-3 border-l-[#66706A] rounded-lg transition-all shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] block font-semibold">
            ACTIVE PROJECTS
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#18201C] mt-1">
            {projectsCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#66706A] block mt-1 font-mono">
            Across 766 Districts
          </span>
        </div>

        {/* 5. PROGRAMME COVERAGE */}
        <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] border-l-3 border-l-[#164A3A] rounded-lg transition-all shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] block font-semibold">
            PROGRAMME COVERAGE
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#18201C] mt-1">
            {coverageCount}%
          </div>
          <span className="text-[10px] text-[#B56B32] block mt-1 font-mono font-bold">
            7 Priority Gaps
          </span>
        </div>

        {/* 6. OUTCOME INDEX */}
        <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] border-l-3 border-l-[#28704D] rounded-lg transition-all shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] block font-semibold">
            OUTCOME INDEX
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-[#18201C] mt-1">
            {outcomeCount}
          </div>
          <span className="text-[10px] text-[#28704D] block mt-1 font-mono font-bold">
            +6.4 pts QoQ (0–100)
          </span>
        </div>
      </div>

      {/* SPECIALIST INSIGHTS SHORTCUTS (Required by Spec: Geographic Gaps (07), Programme Overlap (04), Resource Anomalies (03)) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <Link
          href="/gaps"
          className="p-3.5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg hover:border-[#164A3A] transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#B56B32]" />
            <div>
              <span className="text-xs font-bold text-[#18201C] group-hover:text-[#164A3A] transition-colors">
                Geographic Gaps
              </span>
              <p className="text-[10px] text-[#66706A] font-mono">
                Identified spatial delivery deficits
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#18201C] bg-[#F4F2EC] px-2 py-0.5 rounded border border-[#D8D6CE]">
              07
            </span>
            <ChevronRight className="w-4 h-4 text-[#898E89] group-hover:text-[#18201C] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          href="/overlaps"
          className="p-3.5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg hover:border-[#164A3A] transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#B58A45]" />
            <div>
              <span className="text-xs font-bold text-[#18201C] group-hover:text-[#164A3A] transition-colors">
                Programme Overlap
              </span>
              <p className="text-[10px] text-[#66706A] font-mono">
                Cross-ministerial duplicated mandates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#18201C] bg-[#F4F2EC] px-2 py-0.5 rounded border border-[#D8D6CE]">
              04
            </span>
            <ChevronRight className="w-4 h-4 text-[#898E89] group-hover:text-[#18201C] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        <Link
          href="/signals"
          className="p-3.5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg hover:border-[#164A3A] transition-all flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#A54848]" />
            <div>
              <span className="text-xs font-bold text-[#18201C] group-hover:text-[#164A3A] transition-colors">
                Resource Anomalies
              </span>
              <p className="text-[10px] text-[#66706A] font-mono">
                Statistical expenditure outliers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#18201C] bg-[#F4F2EC] px-2 py-0.5 rounded border border-[#D8D6CE]">
              03
            </span>
            <ChevronRight className="w-4 h-4 text-[#898E89] group-hover:text-[#18201C] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* VISUAL CENTERPIECE: NATIONAL GIS GOVERNANCE MAP (India ➔ State ➔ District Drilldown) */}
      <NationalGovernanceMap />

      {/* SUTRA Live Governance Pulse & Connector Health */}
      <div className="space-y-4">
        <LiveGovernancePulse />
        <SourceHealthCard sourceHealth={sourceHealth} />
      </div>

      {/* 6 SPEC-REQUIRED INTELLIGENCE PANELS */}
      <div className="space-y-6">
        {/* Row 1: RESOURCE UTILIZATION + GEOGRAPHIC COVERAGE */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 1. RESOURCE UTILIZATION (Drawdown Pace Trend vs Statutory Benchmark) */}
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#B58A45] font-semibold">
                  PANEL 1 • RESOURCE UTILIZATION
                </span>
                <h3 className="text-sm font-bold text-[#18201C] font-editorial mt-0.5">
                  Fund Drawdown Velocity vs Statutory Benchmark
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#28704D] bg-[#E3EDE7] px-2 py-0.5 rounded border border-[#28704D]/30">
                FY 2025–26 LIVE
              </span>
            </div>

            {/* Hover details badge */}
            {hoveredDrawdownIdx !== null && (
              <div className="p-2.5 bg-[#F4F2EC] border border-[#D8D6CE] rounded font-mono text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#66706A] uppercase block">
                    PERIOD: {drawdownPoints[hoveredDrawdownIdx].month}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-[#18201C]">
                      {drawdownPoints[hoveredDrawdownIdx].actual}% Actual
                    </span>
                    <span className="text-xs text-[#B58A45] font-semibold">
                      (₹{drawdownPoints[hoveredDrawdownIdx].amountCr} Cr)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#66706A] uppercase block">
                    BENCHMARK: {drawdownPoints[hoveredDrawdownIdx].benchmark}%
                  </span>
                  <span className="text-xs font-bold text-[#28704D]">
                    +{(drawdownPoints[hoveredDrawdownIdx].actual - drawdownPoints[hoveredDrawdownIdx].benchmark).toFixed(1)} pp Variance
                  </span>
                </div>
              </div>
            )}

            <div className="h-44 w-full pt-2 relative">
              <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="civicDrawdownGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#164A3A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#164A3A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="35" x2="500" y2="35" stroke="#EAE8E1" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#EAE8E1" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="500" y2="105" stroke="#EAE8E1" strokeDasharray="3 3" />

                {/* Statutory Benchmark path */}
                <path
                  d="M 10 120 L 90 100 L 170 78 L 250 58 L 330 42 L 410 30 L 490 24"
                  fill="none"
                  stroke="#898E89"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Actual Area */}
                <path
                  d="M 10 130 L 90 110 L 170 85 L 250 62 L 330 46 L 410 36 L 490 30 L 490 140 L 10 140 Z"
                  fill="url(#civicDrawdownGrad)"
                />
                {/* Actual Line */}
                <path
                  d="M 10 130 L 90 110 L 170 85 L 250 62 L 330 46 L 410 36 L 490 30"
                  fill="none"
                  stroke="#164A3A"
                  strokeWidth="2.5"
                  className="animate-path-draw"
                />

                {/* Hover line */}
                {hoveredDrawdownIdx !== null && (
                  <line
                    x1={drawdownPoints[hoveredDrawdownIdx].x}
                    y1="0"
                    x2={drawdownPoints[hoveredDrawdownIdx].x}
                    y2="140"
                    stroke="#164A3A"
                    strokeWidth="1"
                    strokeDasharray="2 2"
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
                      <circle cx={pt.x} cy={pt.yActual} r="16" fill="transparent" />
                      <circle
                        cx={pt.x}
                        cy={pt.yActual}
                        r={isHovered ? '6' : '3.5'}
                        fill={isHovered ? '#B58A45' : '#164A3A'}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#66706A] border-t border-[#EAE8E1] pt-2">
              {drawdownPoints.map((pt, i) => (
                <span
                  key={i}
                  onMouseEnter={() => setHoveredDrawdownIdx(i)}
                  className={`cursor-pointer transition-colors ${
                    hoveredDrawdownIdx === i ? 'text-[#164A3A] font-bold underline' : 'hover:text-[#18201C]'
                  }`}
                >
                  {pt.label} ({pt.actual}%)
                </span>
              ))}
            </div>
          </div>

          {/* 2. GEOGRAPHIC COVERAGE (District Delivery Deficits vs Benchmark) */}
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#164A3A] font-semibold">
                  PANEL 2 • GEOGRAPHIC COVERAGE
                </span>
                <h3 className="text-sm font-bold text-[#18201C] font-editorial mt-0.5">
                  Territorial Delivery Distribution & Gaps
                </h3>
              </div>
              <Link href="/map" className="text-xs font-mono text-[#164A3A] hover:underline flex items-center gap-1 font-semibold">
                <span>FULL MAP</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Persistent Detail Bar */}
            <div className="p-2.5 bg-[#F4F2EC] border border-[#D8D6CE] rounded font-mono text-xs flex items-center justify-between">
              {hoveredDistrict ? (
                <>
                  <div>
                    <span className="font-bold text-[#18201C]">{hoveredDistrict.name} District</span>
                    <span className="text-[10px] text-[#66706A] block">
                      Pop: {(hoveredDistrict.population / 1000000).toFixed(2)}M • {hoveredDistrict.activeSchemesCount} Active Schemes
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#164A3A] font-bold">{hoveredDistrict.coverageRate}% Cov</span>
                    <span className="text-[10px] text-[#A54848] block font-semibold">
                      Util: {hoveredDistrict.fundUtilizationRate}%
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-[#18201C] font-bold">Maharashtra 36 Districts</span>
                    <span className="text-[10px] text-[#66706A] block">
                      Hover any district to inspect delivery variance
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#28704D] font-bold">81.6% National Coverage</span>
                    <span className="text-[10px] text-[#66706A] block">Benchmark: 70.0%</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2 font-mono text-xs">
              {MAHARASHTRA_DISTRICTS.slice(0, 5).map((dist) => {
                const isHovered = hoveredDistrict?.id === dist.id;
                return (
                  <div
                    key={dist.id}
                    onMouseEnter={() => setHoveredDistrict(dist)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => setHoveredDistrict(dist)}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      isHovered ? 'bg-[#F4F2EC] border border-[#164A3A]' : 'border border-transparent hover:bg-[#F4F2EC]'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={`font-semibold ${isHovered ? 'text-[#164A3A]' : 'text-[#18201C]'}`}>
                        {dist.name}
                      </span>
                      <span className={dist.isGapFlagged ? 'text-[#A54848] font-bold' : 'text-[#28704D] font-semibold'}>
                        {dist.coverageRate}% {dist.isGapFlagged ? `(-${dist.gapPercentagePoints} pp Gap)` : 'Verified'}
                      </span>
                    </div>
                    <div className="w-full bg-[#EAE8E1] h-1.5 rounded relative overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-[64%] w-0.5 bg-[#898E89] z-10" />
                      <div
                        className={`h-full rounded ${dist.isGapFlagged ? 'bg-[#A54848]' : 'bg-[#28704D]'}`}
                        style={{ width: `${dist.coverageRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: BENEFICIARY REACH + PROGRAMME PERFORMANCE + OUTCOME TRENDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 3. BENEFICIARY REACH */}
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#B58A45] font-semibold">
                  PANEL 3 • BENEFICIARY REACH
                </span>
                <h3 className="text-sm font-bold text-[#18201C] font-editorial mt-0.5">
                  Sectoral Demographics & DBT
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#18201C]">84.6M Total</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { sector: 'Agriculture (PM-KISAN/PKVY)', count: '32.8M', pct: 39, color: '#164A3A', verified: '99.4% DBT Verified' },
                { sector: 'Health (AB-PMJAY)', count: '24.5M', pct: 29, color: '#28704D', verified: '98.8% Cashless' },
                { sector: 'Rural Housing (PMAY-G)', count: '16.1M', pct: 19, color: '#B58A45', verified: '100% Geo-tagged' },
                { sector: 'Water (Jal Jeevan Mission)', count: '11.2M', pct: 13, color: '#5B8C78', verified: 'Flow Sensor Mapped' },
              ].map((item, idx) => {
                const isHovered = hoveredSector === idx;
                return (
                  <div
                    key={item.sector}
                    onMouseEnter={() => setHoveredSector(idx)}
                    onMouseLeave={() => setHoveredSector(null)}
                    className={`p-2.5 rounded bg-[#F4F2EC] border transition-colors cursor-pointer ${
                      isHovered ? 'border-[#164A3A]' : 'border-[#D8D6CE]'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className={`truncate font-medium ${isHovered ? 'text-[#164A3A] font-bold' : 'text-[#18201C]'}`}>
                        {item.sector}
                      </span>
                      <span className="font-bold text-[#18201C]">{item.count}</span>
                    </div>
                    <div className="w-full bg-[#EAE8E1] h-1.5 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-[#66706A]">
                      <span>Share: {item.pct}%</span>
                      <span className={isHovered ? 'text-[#28704D] font-bold' : 'text-[#66706A]'}>{item.verified}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. PROGRAMME PERFORMANCE */}
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#164A3A] font-semibold">
                  PANEL 4 • PROGRAMME PERFORMANCE
                </span>
                <h3 className="text-sm font-bold text-[#18201C] font-editorial mt-0.5">
                  Milestone Completion Velocity
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#28704D]">12,842 Projects</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { scheme: 'PM-KISAN (Direct Income)', rate: 92, status: 'On Track', milestone: 'Tranche 18 Disbursed' },
                { scheme: 'PMGSY-III (Rural Roads)', rate: 84, status: 'On Track', milestone: '18,420 km Built' },
                { scheme: 'PMAY-G (Rural Housing)', rate: 78, status: 'Normal', milestone: '48,200 Units Sanctioned' },
                { scheme: 'PKVY (Organic Farming)', rate: 64, status: 'Lagging', milestone: 'Cluster Certs Pending' },
                { scheme: 'Jal Jeevan Mission (Tap Water)', rate: 59, status: 'Attention', milestone: 'Pipeline Node Testing' },
              ].map((sch, idx) => {
                const isHovered = hoveredScheme === idx;
                return (
                  <div
                    key={sch.scheme}
                    onMouseEnter={() => setHoveredScheme(idx)}
                    onMouseLeave={() => setHoveredScheme(null)}
                    className={`p-2 rounded cursor-pointer transition-colors ${
                      isHovered ? 'bg-[#F4F2EC] border border-[#164A3A]' : 'border border-transparent hover:bg-[#F4F2EC]'
                    }`}
                  >
                    <div className="flex justify-between text-[11px]">
                      <span className={`truncate ${isHovered ? 'text-[#164A3A] font-bold' : 'text-[#18201C]'}`}>
                        {sch.scheme}
                      </span>
                      <span className={sch.rate < 65 ? 'text-[#A54848] font-bold' : 'text-[#28704D] font-bold'}>
                        {sch.rate}%
                      </span>
                    </div>
                    <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded ${sch.rate < 65 ? 'bg-[#A54848]' : 'bg-[#164A3A]'}`}
                        style={{ width: `${sch.rate}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-[#66706A]">
                      <span className="truncate">{sch.milestone}</span>
                      <span className={sch.rate < 65 ? 'text-[#A54848] font-bold' : 'text-[#28704D]'}>{sch.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. OUTCOME TRENDS */}
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#28704D] font-semibold">
                  PANEL 5 • OUTCOME TRENDS
                </span>
                <h3 className="text-sm font-bold text-[#18201C] font-editorial mt-0.5">
                  Governance Impact Trajectory
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#28704D]">+6.4 pts QoQ</span>
            </div>

            {/* Active hover indicator */}
            {hoveredOutcome !== null && (
              <div className="p-2 bg-[#F4F2EC] border border-[#D8D6CE] rounded font-mono text-[11px]">
                <div className="flex justify-between text-[#18201C]">
                  <span>{outcomePoints[hoveredOutcome].period}</span>
                  <span className="text-[#28704D] font-bold">Index: {outcomePoints[hoveredOutcome].score}/100</span>
                </div>
                <div className="text-[10px] text-[#66706A] mt-0.5 truncate">
                  {outcomePoints[hoveredOutcome].driver}
                </div>
              </div>
            )}

            <div className="h-32 w-full pt-1">
              <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="300" y2="30" stroke="#EAE8E1" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#EAE8E1" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="300" y2="90" stroke="#EAE8E1" strokeDasharray="3 3" />

                <path
                  d="M 10 95 L 80 80 L 150 66 L 220 52 L 290 38"
                  fill="none"
                  stroke="#28704D"
                  strokeWidth="2.5"
                  className="animate-path-draw"
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
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? '5' : '3'}
                        fill={isHovered ? '#B58A45' : '#28704D'}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] font-mono text-[#66706A] border-t border-[#EAE8E1] pt-1">
              {outcomePoints.map((pt, i) => (
                <span
                  key={i}
                  onMouseEnter={() => setHoveredOutcome(i)}
                  className={`cursor-pointer transition-colors ${
                    hoveredOutcome === i ? 'text-[#28704D] font-bold underline' : 'hover:text-[#18201C]'
                  }`}
                >
                  {pt.period.split('-')[0]} ({pt.score})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: PANEL 6 • IMPLEMENTATION SIGNALS & CROSS-PROGRAMME OVERLAP */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Implementation Signals */}
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#B58A45]" />
                <h3 className="text-sm font-bold text-[#18201C] font-editorial">
                  PANEL 6 • Active Implementation Signals
                </h3>
              </div>
              <Link href="/signals" className="text-xs font-mono text-[#164A3A] font-bold hover:underline">
                RADAR VIEW →
              </Link>
            </div>

            <div className="space-y-2.5">
              {SIGNALS_DATA.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE] hover:border-[#164A3A] transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#66706A] block font-semibold">
                      {sig.schemeId} • {sig.districtName || 'National'}
                    </span>
                    <h4 className="font-bold text-xs text-[#18201C]">{sig.schemeName}</h4>
                    <span className="text-[10px] font-mono text-[#66706A]">
                      Current: {sig.currentUtilization}% (expected {sig.expectedUtilization}%)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#A54848] block">
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
                      className="text-[10px] font-mono text-[#164A3A] font-bold hover:underline mt-0.5 block"
                    >
                      Why Flagged?
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Programme Overlap Callout */}
          <div className="p-5 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#B58A45] font-semibold">
                CROSS-PROGRAMME OVERLAP DETECTION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F9F4EB] text-[#B58A45] font-bold border border-[#B58A45]/30">
                82% SIMILARITY
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#18201C] font-editorial">
                PKVY (Paramparagat Krishi) ⇄ MOVCDNER (Organic Mission)
              </h4>
              <p className="text-xs text-[#66706A] mt-1 leading-relaxed">
                Dual bio-input and organic cluster certification subsidies active concurrently in Nandurbar & Dhule with 91% target smallholder overlap.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">TARGET GROUP</span>
                <span className="font-bold text-[#18201C]">91% MATCH</span>
              </div>
              <div className="p-2.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">INTERVENTION</span>
                <span className="font-bold text-[#18201C]">86% MATCH</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EAE8E1]">
              <Link
                href="/overlaps"
                className="text-xs font-mono text-[#164A3A] font-bold hover:underline flex items-center gap-1"
              >
                <span>OPEN OVERLAP DECOMPOSITION</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => openEvidence('#9281')}
                className="text-xs font-mono text-[#66706A] hover:text-[#18201C] underline"
              >
                Inspect Evidence Record #9281
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
