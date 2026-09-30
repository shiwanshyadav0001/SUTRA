'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { SCHEMES_DATA, OVERLAPS_DATA, EVIDENCE_RECORDS } from '@/lib/data/governance-data';
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
      <div className="flex items-center space-x-2 text-xs font-mono text-[#8E887E]">
        <Link href="/schemes" className="hover:text-[#F3F0E8] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>SCHEMES REGISTRY</span>
        </Link>
        <span>/</span>
        <span className="text-[#B78A5A]">{scheme.code}</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-[#2A2926] pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191917] border border-[#B78A5A]/40 text-[#B78A5A] uppercase">
            {scheme.id}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191917] border border-[#2A2926] text-[#C9C2B7] uppercase">
            {scheme.sector}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              scheme.status === 'Review'
                ? 'bg-[#A66A62]/10 border-[#A66A62]/30 text-[#A66A62]'
                : 'bg-[#5E8B72]/10 border-[#5E8B72]/30 text-[#5E8B72]'
            }`}
          >
            {scheme.status}
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
            {scheme.name}
          </h1>
          <p className="text-xs text-[#8E887E] mt-1 font-mono">
            {scheme.officialName} • {scheme.ministryName}
          </p>
        </div>
      </div>

      {/* 6 Key Executive Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
        <div className="p-4 rounded bg-[#141412] border border-[#2A2926]">
          <span className="text-[#8E887E] text-[10px] block">BUDGET</span>
          <span className="text-xl font-bold text-[#F3F0E8] mt-0.5 block">
            ₹{scheme.budgetAllocationCr} Cr
          </span>
          <span className="text-[10px] text-[#7E7A72]">Sanctioned</span>
        </div>

        <div className="p-4 rounded bg-[#141412] border border-[#2A2926]">
          <span className="text-[#8E887E] text-[10px] block">UTILIZED</span>
          <span className="text-xl font-bold text-[#B78A5A] mt-0.5 block">
            ₹{scheme.fundUtilizedCr} Cr
          </span>
          <span className="text-[10px] text-[#8E887E]">
            {scheme.utilizationRate}% drawdown
          </span>
        </div>

        <div className="p-4 rounded bg-[#141412] border border-[#2A2926]">
          <span className="text-[#8E887E] text-[10px] block">BENEFICIARIES</span>
          <span className="text-xl font-bold text-[#F3F0E8] mt-0.5 block">
            {(scheme.beneficiariesCount / 1000000).toFixed(1)}M
          </span>
          <span className="text-[10px] text-[#7E7A72]">Enrolled</span>
        </div>

        <div className="p-4 rounded bg-[#141412] border border-[#2A2926]">
          <span className="text-[#8E887E] text-[10px] block">PROJECTS</span>
          <span className="text-xl font-bold text-[#F3F0E8] mt-0.5 block">
            {scheme.projectsCount}
          </span>
          <span className="text-[10px] text-[#7E7A72]">Field works</span>
        </div>

        <div className="p-4 rounded bg-[#141412] border border-[#2A2926]">
          <span className="text-[#8E887E] text-[10px] block">COVERAGE</span>
          <span className="text-xl font-bold text-[#F3F0E8] mt-0.5 block">
            {scheme.coverageRate}%
          </span>
          <span className="text-[10px] text-[#8E887E]">Target habitations</span>
        </div>

        <div className="p-4 rounded bg-[#141412] border border-[#2A2926]">
          <span className="text-[#8E887E] text-[10px] block">OUTCOME</span>
          <span className="text-xl font-bold text-[#5E8B72] mt-0.5 block">
            {scheme.outcomeIndex}%
          </span>
          <span className="text-[10px] text-[#7E7A72]">Quality index</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-[#2A2926] flex flex-wrap gap-2 pt-2">
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
            className={`px-4 py-2.5 text-xs font-mono transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#B78A5A] text-[#F3F0E8] font-bold bg-[#141412]'
                : 'border-transparent text-[#8E887E] hover:text-[#C9C2B7]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#141412] border border-[#2A2926] rounded-sm p-6 min-h-[300px]">
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial uppercase tracking-wider mb-2">
                Executive Scheme Summary
              </h3>
              <p className="text-xs text-[#C9C2B7] leading-relaxed max-w-3xl">
                {scheme.summary}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial uppercase tracking-wider mb-3">
                Key Strategic Objectives
              </h3>
              <div className="space-y-2 text-xs">
                {scheme.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start space-x-2 text-[#C9C2B7]">
                    <span className="text-[#B78A5A] font-bold">↳</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A2926] grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#8E887E] text-[10px] block">TARGET GROUP</span>
                <span className="text-[#F3F0E8] font-semibold">{scheme.targetGroup}</span>
              </div>
              <div>
                <span className="text-[#8E887E] text-[10px] block">NODAL DEPARTMENT</span>
                <span className="text-[#F3F0E8] font-semibold">{scheme.department}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Finance' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
                Financial Allocation vs Expenditure
              </h3>
              <span className="text-[#8E887E]">Source: PFMS & Union Budget Statement</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded">
                <span className="text-[#8E887E] text-[10px]">TOTAL SANCTION</span>
                <div className="text-xl font-bold text-[#F3F0E8] mt-1">₹{scheme.budgetAllocationCr} Cr</div>
              </div>
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded">
                <span className="text-[#8E887E] text-[10px]">NET EXPENDITURE</span>
                <div className="text-xl font-bold text-[#B78A5A] mt-1">₹{scheme.fundUtilizedCr} Cr</div>
              </div>
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded">
                <span className="text-[#8E887E] text-[10px]">UTILIZATION RATIO</span>
                <div className="text-xl font-bold text-[#5E8B72] mt-1">{scheme.utilizationRate}%</div>
              </div>
            </div>

            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
              <span className="text-[#8E887E] text-[10px] uppercase">EXPENDITURE TRANCHES</span>
              <p className="text-[#C9C2B7]">
                First tranche of 45% cleared in Q1. Second tranche delayed in tribal district clusters pending farmer cluster verification.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Geography' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
              Active Focus Districts (Maharashtra)
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              {scheme.keyDistricts.map((dist) => (
                <div key={dist} className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                  <span className="text-[10px] text-[#8E887E] block">DISTRICT</span>
                  <span className="text-sm font-bold text-[#F3F0E8]">{dist}</span>
                  <Link
                    href="/map"
                    className="text-[10px] text-[#B78A5A] hover:underline block mt-1"
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
            <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
              Cross-Programme Overlap & Linkage
            </h3>
            {relatedOverlap ? (
              <div className="p-5 bg-[#191917] border border-[#B78A5A]/30 rounded space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#B78A5A] font-bold">
                    OVERLAP DETECTED: {relatedOverlap.similarityScore}% SIMILARITY
                  </span>
                  <Link href="/overlaps" className="text-[#8E887E] hover:text-[#F3F0E8]">
                    Inspect in Overlap Engine →
                  </Link>
                </div>
                <h4 className="text-sm font-bold text-[#F3F0E8]">
                  {relatedOverlap.schemeAName} ⇄ {relatedOverlap.schemeBName}
                </h4>
                <div className="space-y-1 text-xs text-[#C9C2B7]">
                  {relatedOverlap.whyFlagged.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span className="text-[#5E8B72]">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#8E887E]">No critical overlaps detected for this programme.</div>
            )}
          </div>
        )}

        {activeTab === 'Evidence' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
                Supporting Verification Ledger
              </h3>
              <span className="text-xs font-mono text-[#8E887E]">Audit Ready</span>
            </div>

            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#B78A5A] block">RECORD #9281</span>
                <span className="font-bold text-sm text-[#F3F0E8]">
                  Nandurbar District Expenditure Sanction
                </span>
                <span className="text-xs text-[#8E887E] block mt-0.5">
                  Source: Union Budget / PFMS Scheme-wise expenditure feed
                </span>
              </div>
              <button
                onClick={() => openEvidence('#9281')}
                className="px-4 py-2 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs rounded-sm hover:bg-[#CBB093]"
              >
                Inspect Record #9281
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Beneficiaries' && (
          <div className="space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
              Beneficiary Enrollment Profile
            </h3>
            <p className="text-[#C9C2B7]">
              Total Verified: {(scheme.beneficiariesCount).toLocaleString()} individuals across marginal landholding categories. Direct Benefit Transfer Aadhaar seeding at 94.2%.
            </p>
          </div>
        )}

        {activeTab === 'Outcomes' && (
          <div className="space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-[#F3F0E8] font-editorial">
              Physical Milestone Outcomes
            </h3>
            <p className="text-[#C9C2B7]">
              Current Outcome Index: {scheme.outcomeIndex}/100. Verification via remote sensing and block agricultural extension field reporting.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
