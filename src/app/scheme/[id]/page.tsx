'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { SCHEMES_DATA, OVERLAPS_DATA, EVIDENCE_RECORDS } from '@/lib/data/governance-data';
import { formatIndianNumber } from '@/lib/formatters';
import {
  ArrowLeft,
  Calendar,
  Layers,
  FileText,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Users,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface SchemeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SchemeDetailPage({ params }: SchemeDetailPageProps) {
  const resolvedParams = use(params);
  const schemeId = resolvedParams.id;
  const { openEvidence, openExplain } = useIntelligence();

  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Finance' | 'Geography' | 'Beneficiaries' | 'Outcomes' | 'Relationships' | 'Evidence'
  >('Overview');

  const scheme =
    SCHEMES_DATA.find(
      (s) =>
        s.id.toLowerCase() === schemeId.toLowerCase() ||
        s.code.toLowerCase() === schemeId.toLowerCase()
    ) || SCHEMES_DATA[0];

  const relatedOverlap = OVERLAPS_DATA.find(
    (o) => o.schemeAId === scheme.id || o.schemeBId === scheme.id
  );

  return (
    <AppShell>
      {/* Back button and breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link href="/schemes" className="hover:text-blue-700 flex items-center gap-1 font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>SCHEMES REGISTRY</span>
        </Link>
        <span>/</span>
        <span className="text-blue-700 font-bold">{scheme.code}</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6 my-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold uppercase">
            {scheme.id}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 uppercase font-semibold">
            {scheme.sector}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
              scheme.status === 'Review'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {scheme.status}
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
            {scheme.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {scheme.officialName} • {scheme.ministryName}
          </p>
        </div>
      </div>

      {/* 6 Key Executive Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 font-mono text-xs my-6">
        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[10px] block uppercase font-semibold">BUDGET</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">
            ₹{scheme.budgetAllocationCr} Cr
          </span>
          <span className="text-[10px] text-slate-400">Sanctioned</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[10px] block uppercase font-semibold">UTILIZED</span>
          <span className="text-xl font-bold text-blue-700 mt-0.5 block">
            ₹{scheme.fundUtilizedCr} Cr
          </span>
          <span className="text-[10px] text-slate-500">
            {scheme.utilizationRate}% drawdown
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[10px] block uppercase font-semibold">BENEFICIARIES</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">
            {(scheme.beneficiariesCount / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] text-slate-400">Enrolled</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[10px] block uppercase font-semibold">PROJECTS</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">
            {scheme.projectsCount}
          </span>
          <span className="text-[10px] text-slate-400">Field works</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[10px] block uppercase font-semibold">COVERAGE</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">
            {scheme.coverageRate}%
          </span>
          <span className="text-[10px] text-slate-500">Target habitations</span>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[10px] block uppercase font-semibold">OUTCOME</span>
          <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
            {scheme.outcomeIndex}%
          </span>
          <span className="text-[10px] text-slate-400">Quality index</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 flex flex-wrap gap-2 pt-2">
        {(
          [
            'Overview',
            'Finance',
            'Geography',
            'Beneficiaries',
            'Outcomes',
            'Relationships',
            'Evidence',
          ] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-mono transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? 'border-blue-600 text-blue-700 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200 rounded-b-lg p-6 min-h-[300px] shadow-sm mb-6">
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-editorial uppercase tracking-wider mb-2">
                Executive Scheme Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                {scheme.summary}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 font-editorial uppercase tracking-wider mb-3">
                Key Strategic Objectives
              </h3>
              <div className="space-y-2 text-xs">
                {scheme.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start space-x-2 text-slate-700">
                    <span className="text-blue-600 font-bold">↳</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">TARGET GROUP</span>
                <span className="text-slate-900 font-semibold">{scheme.targetGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold">NODAL DEPARTMENT</span>
                <span className="text-slate-900 font-semibold">{scheme.department}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Finance' && (
          <div className="space-y-5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 font-editorial">
                Financial Allocation vs Expenditure
              </h3>
              <span className="text-slate-500">Source: PFMS & Union Budget Statement</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 text-[10px] font-semibold">TOTAL SANCTION</span>
                <div className="text-xl font-bold text-slate-900 mt-1">₹{scheme.budgetAllocationCr} Cr</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 text-[10px] font-semibold">NET EXPENDITURE</span>
                <div className="text-xl font-bold text-blue-700 mt-1">₹{scheme.fundUtilizedCr} Cr</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-slate-500 text-[10px] font-semibold">UTILIZATION RATIO</span>
                <div className="text-xl font-bold text-emerald-700 mt-1">{scheme.utilizationRate}%</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-1.5">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">EXPENDITURE TRANCHES</span>
              <p className="text-slate-700 font-sans">
                First tranche of 45% cleared in Q1. Second tranche delayed in tribal district clusters pending farmer cluster verification.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Geography' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-editorial">
              Active Focus Districts (Maharashtra)
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              {scheme.keyDistricts.map((dist) => (
                <div key={dist} className="p-3.5 rounded-md bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">DISTRICT</span>
                  <span className="text-sm font-bold text-slate-900">{dist}</span>
                  <Link
                    href={`/map?district=${dist.toLowerCase()}`}
                    className="text-[11px] text-blue-700 hover:underline block mt-1 font-semibold"
                  >
                    View on Map →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Relationships' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-editorial">
              Cross-Programme Overlap & Linkage
            </h3>
            {relatedOverlap ? (
              <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-blue-800 font-bold">
                    OVERLAP DETECTED: {relatedOverlap.similarityScore}% SIMILARITY
                  </span>
                  <Link href="/relationships" className="text-blue-700 hover:underline font-semibold">
                    Inspect in Overlap Engine →
                  </Link>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {relatedOverlap.schemeAName} ⇄ {relatedOverlap.schemeBName}
                </h4>
                <div className="space-y-1 text-xs text-slate-700">
                  {relatedOverlap.whyFlagged.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono">No critical overlaps detected for this programme.</div>
            )}
          </div>
        )}

        {activeTab === 'Evidence' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 font-editorial">
                Supporting Verification Ledger
              </h3>
              <span className="text-xs font-mono text-slate-500">Audit Ready</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-blue-700 font-bold block">RECORD #9281</span>
                <span className="font-bold text-sm text-slate-900">
                  Nandurbar District Expenditure Sanction
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Source: Union Budget / PFMS Scheme-wise expenditure feed
                </span>
              </div>
              <button
                onClick={() => openEvidence('SUTRA-EVD-9281')}
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-md hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
              >
                Inspect Record #9281
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Beneficiaries' && (
          <div className="space-y-3 text-xs font-mono">
            <h3 className="text-sm font-bold text-slate-900 font-editorial">
              Beneficiary Enrollment Profile
            </h3>
            <p className="text-slate-700 font-sans leading-relaxed">
              Total Verified: {formatIndianNumber(scheme.beneficiariesCount)} individuals across marginal landholding categories. Direct Benefit Transfer Aadhaar seeding at 94.2%.
            </p>
          </div>
        )}

        {activeTab === 'Outcomes' && (
          <div className="space-y-3 text-xs font-mono">
            <h3 className="text-sm font-bold text-slate-900 font-editorial">
              Physical Milestone Outcomes
            </h3>
            <p className="text-slate-700 font-sans leading-relaxed">
              Current Outcome Index: {scheme.outcomeIndex}/100. Verification via remote sensing and block agricultural extension field reporting.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
