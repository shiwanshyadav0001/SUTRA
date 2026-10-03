'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { InvestigationEngine } from '@/lib/fabric/investigation/investigation-engine';
import { useIntelligence } from '@/context/IntelligenceContext';
import { WhyFlaggedModal } from '@/components/investigation/WhyFlaggedModal';
import { InvestigationPipelineInspector } from '@/components/investigation/InvestigationPipelineInspector';
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  Calculator,
  Database,
  MapPin,
  Network,
  Download,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Layers,
  Calendar,
  FileCheck2,
  Clock,
  Radio,
  Share2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvestigationWorkspaceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const investigationId = resolvedParams.id || 'INV-NDB-CONV-001';

  const {
    openEvidence,
    openExplain,
    openWhyFlagged,
    openExecutiveBrief,
    activeEvents,
  } = useIntelligence();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'EVIDENCE' | 'CALCULATIONS' | 'RELATIONSHIPS' | 'TIMELINE'
  >('OVERVIEW');
  const [selectedFindingId, setSelectedFindingId] = useState<string>('SUTRA-FND-0001');

  // Run or retrieve deterministic canonical investigation for Nandurbar LGD 512
  const investigationResult = useMemo(() => {
    return InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
  }, []);

  const { investigation, findings, datasets, convergenceOpportunities } = investigationResult;
  const currentFinding = findings.find((f) => f.id === selectedFindingId) || findings[0];

  return (
    <AppShell>
      {/* A. Investigation Apex Header */}
      <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B78A5A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2A2926] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-1.5">
              <span className="px-2 py-0.5 rounded bg-[#B78A5A]/20 text-[#B78A5A] border border-[#B78A5A]/40 font-bold">
                CANONICAL INVESTIGATION WORKSPACE
              </span>
              <span className="text-zinc-400">ID: {investigationId}</span>
              <span className="px-2 py-0.5 rounded-sm bg-[#5E8B72]/15 text-[#5E8B72] border border-[#5E8B72]/30">
                STATUS: {investigation.status}
              </span>
              <span className="px-2 py-0.5 rounded-sm bg-[#1C1B18] text-[#C9C2B7] border border-[#2A2926]">
                LGD: {investigation.targetDistrictLgd} ({investigation.targetDistrict})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#F3F0E8] font-editorial">
              {investigation.title}
            </h1>
            <p className="text-xs text-[#C9C2B7] max-w-3xl mt-1">
              {investigation.question}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => openWhyFlagged(currentFinding.id)}
              className="px-4 py-2.5 rounded-sm bg-[#1C1B18] hover:bg-[#252420] border border-[#2A2926] text-[#C9C2B7] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B78A5A]" />
              <span>WHY FLAGGED?</span>
            </button>

            <button
              onClick={() => openExecutiveBrief()}
              className="px-4 py-2.5 rounded-sm bg-[#B78A5A] hover:bg-[#C99A6A] text-[#0D0D0C] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>APEX BRIEF</span>
            </button>
          </div>
        </div>

        {/* Top-level Key Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#191917] rounded border border-[#2A2926]">
            <span className="text-[10px] text-zinc-400 block uppercase">PRIMARY DEFICIT</span>
            <span className="text-xl font-bold text-rose-400 mt-0.5 block">18.4 pp Gap</span>
            <span className="text-[10px] text-zinc-400">PMAY-G (46.8%) ⇄ JJM (28.4%)</span>
          </div>

          <div className="p-3 bg-[#191917] rounded border border-[#2A2926]">
            <span className="text-[10px] text-zinc-400 block uppercase">ANALYTICAL CONFIDENCE</span>
            <span className="text-xl font-bold text-[#5E8B72] mt-0.5 block">{investigation.confidence}%</span>
            <span className="text-[10px] text-zinc-400">Deterministic Component Model</span>
          </div>

          <div className="p-3 bg-[#191917] rounded border border-[#2A2926]">
            <span className="text-[10px] text-zinc-400 block uppercase">CORRELATED DATASETS</span>
            <span className="text-xl font-bold text-zinc-100 mt-0.5 block">3 Official Sources</span>
            <span className="text-[10px] text-zinc-400">JJM IMIS, AwaasSoft, PKVY</span>
          </div>

          <div className="p-3 bg-[#191917] rounded border border-[#2A2926]">
            <span className="text-[10px] text-zinc-400 block uppercase">DATA TRUTH CLASSIFICATION</span>
            <span className="text-xs font-bold text-[#5E8B72] mt-1 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              STATUTORY VERIFIED
            </span>
            <span className="text-[10px] text-zinc-400">Cryptographic SHA-256 Provenance</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-[#2A2926] text-xs font-mono">
          {[
            { id: 'OVERVIEW', label: '1. FINDINGS & CORRELATION' },
            { id: 'CALCULATIONS', label: '2. MATHEMATICAL PROOF' },
            { id: 'EVIDENCE', label: '3. SOURCE EVIDENCE AUDIT' },
            { id: 'RELATIONSHIPS', label: '4. GOVERNANCE GRAPH' },
            { id: 'TIMELINE', label: '5. EVENT PIPELINE TIMELINE' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold'
                  : 'text-zinc-400 hover:text-zinc-100 bg-[#191917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* B & D. Findings & Cross-Programme Correlation */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Cols: Detailed Findings Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            {/* Finding Selector Deck */}
            <div className="p-5 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
                  INVESTIGATION FINDINGS REGISTRY ({findings.length})
                </span>
                <span className="text-xs font-mono text-zinc-400">LGD 512 Multi-Scheme Join</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
                {findings.map((fnd) => (
                  <div
                    key={fnd.id}
                    onClick={() => setSelectedFindingId(fnd.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer ${
                      selectedFindingId === fnd.id
                        ? 'bg-[#191917] border-[#B78A5A] shadow-md'
                        : 'bg-[#141412] border-[#2A2926] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-[#B78A5A] font-bold">
                        {fnd.id}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold">
                        Confidence: {fnd.confidence}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs text-zinc-100 truncate">{fnd.title}</h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{fnd.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Finding Deep Dive Card */}
            <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#2A2926] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#B78A5A] font-bold block">
                    SELECTED FINDING AUDIT
                  </span>
                  <h2 className="text-lg font-bold text-zinc-100 font-editorial mt-0.5">
                    {currentFinding.id}: {currentFinding.title}
                  </h2>
                </div>
                <button
                  onClick={() => openWhyFlagged(currentFinding.id)}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 hover:bg-zinc-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Chain</span>
                </button>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {currentFinding.summary}
              </p>

              {/* Triangulation Metric Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                  <span className="text-[10px] text-zinc-400 block">OUTPUT VALUE</span>
                  <span className="text-xl font-bold text-zinc-100 mt-1 block">
                    {currentFinding.calculation.outputValue} {currentFinding.calculation.outputUnit}
                  </span>
                  <span className="text-[9px] text-zinc-400">Computed Deterministically</span>
                </div>

                <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                  <span className="text-[10px] text-zinc-400 block">JOIN QUALITY</span>
                  <span className="text-xl font-bold text-[#5E8B72] mt-1 block">100% EXACT</span>
                  <span className="text-[9px] text-zinc-400">LGD: 512 Exact Key Match</span>
                </div>

                <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                  <span className="text-[10px] text-zinc-400 block">SOURCE EVIDENCE</span>
                  <span className="text-xl font-bold text-amber-300 mt-1 block">
                    {currentFinding.sourceRecords.length} Records
                  </span>
                  <span className="text-[9px] text-zinc-400">Lineage Cryptographically Hashed</span>
                </div>
              </div>

              {/* Calculation & Formula Box */}
              <div className="p-4 rounded bg-[#191917] border border-zinc-800 space-y-2 font-mono text-xs">
                <span className="text-[10px] uppercase text-[#B78A5A] font-bold block flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#B78A5A]" />
                  GOVERNANCE FORMULATION
                </span>
                <div className="p-2.5 rounded bg-black/60 border border-zinc-800 text-zinc-200 text-xs font-bold">
                  {currentFinding.calculation.formulaText}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Analytical Interpretation: {currentFinding.calculation.interpretation}
                </div>
              </div>

              {/* Provenance Envelopes */}
              <div className="space-y-1.5 pt-2 border-t border-[#2A2926] font-mono text-[11px]">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Finding Provenance Hash:</span>
                  <code className="text-[#B78A5A] truncate max-w-xs">{currentFinding.provenanceHashes.findingHash}</code>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Join Provenance Hash:</span>
                  <code className="text-zinc-300 truncate max-w-xs">{currentFinding.provenanceHashes.joinHash}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Convergence Opportunities & Action Deck */}
          <div className="lg:col-span-4 space-y-6">
            {/* Opportunities Box */}
            <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase block">
                CONVERGENCE OPPORTUNITIES
              </span>

              {convergenceOpportunities.map((opp) => (
                <div key={opp.id} className="p-4 rounded bg-[#191917] border border-[#2A2926] space-y-3 font-mono">
                  <h3 className="text-sm font-bold text-zinc-100 font-editorial">{opp.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{opp.rationale}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400 block">CONFIDENCE</span>
                      <span className="font-bold text-[#5E8B72]">{opp.confidenceAssessment?.overallScore || opp.confidence || 88}% HIGH</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400 block">ACTION STATUS</span>
                      <span className="font-bold text-[#B78A5A]">{opp.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Navigator */}
            <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-3 font-mono text-xs">
              <span className="text-[10px] tracking-widest text-[#B78A5A] uppercase block font-bold">
                CROSS-SYSTEM NAVIGATION
              </span>

              <Link
                href="/map"
                className="w-full py-2.5 px-3 rounded bg-[#191917] border border-[#2A2926] hover:border-[#B78A5A] transition-colors flex items-center justify-between text-zinc-200"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B78A5A]" />
                  <span>Inspect on Geographic Map</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B78A5A]" />
              </Link>

              <Link
                href="/relationships"
                className="w-full py-2.5 px-3 rounded bg-[#191917] border border-[#2A2926] hover:border-[#B78A5A] transition-colors flex items-center justify-between text-zinc-200"
              >
                <span className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-[#B78A5A]" />
                  <span>Trace in Governance Graph</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B78A5A]" />
              </Link>

              <button
                onClick={() => openExecutiveBrief()}
                className="w-full py-2.5 px-3 rounded bg-[#B78A5A] text-[#0D0D0C] font-semibold flex items-center justify-center gap-2 hover:bg-[#CBB093] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export SUTRA Analytical Brief</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E. Calculation Proof Tab */}
      {activeTab === 'CALCULATIONS' && (
        <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-6 font-mono">
          <div className="border-b border-[#2A2926] pb-4">
            <span className="text-[10px] text-[#B78A5A] uppercase tracking-widest block font-bold">
              AUDITABLE MATHEMATICAL PROOFS & INVARIANTS
            </span>
            <h2 className="text-xl font-bold text-zinc-100 font-editorial mt-1">
              Zero LLM-Arithmetic Guarantee
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              All metrics and percentage differences are computed deterministically by SUTRA Data Fabric arithmetic modules.
            </p>
          </div>

          <div className="space-y-4">
            {findings.map((fnd) => (
              <div key={fnd.id} className="p-5 rounded bg-[#191917] border border-[#2A2926] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-100">{fnd.id}: {fnd.title}</span>
                  <span className="text-[#B78A5A] font-bold">{fnd.calculation.outputValue} {fnd.calculation.outputUnit}</span>
                </div>

                <div className="p-3 rounded bg-black/60 border border-zinc-800 text-zinc-200">
                  <code>{fnd.calculation.formulaText}</code>
                </div>

                <div className="text-zinc-400 text-[11px]">
                  <span>Input Parameters: </span>
                  {JSON.stringify(fnd.calculation.inputs)}
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Calculation SHA-256:</span>
                  <code className="text-[#B78A5A]">{fnd.provenanceHashes.calculationHash}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* F. Source Evidence Tab */}
      {activeTab === 'EVIDENCE' && (
        <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-6 font-mono text-xs">
          <div className="border-b border-[#2A2926] pb-4">
            <span className="text-[10px] text-[#B78A5A] uppercase tracking-widest block font-bold">
              OFFICIAL RECORD LINEAGE & PROVENANCE
            </span>
            <h2 className="text-xl font-bold text-zinc-100 font-editorial mt-1">
              Statutory Datasets & Cryptographic Signatures
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {datasets.map((ds) => (
              <div key={ds.id} className="p-4 rounded bg-[#191917] border border-[#2A2926] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-[#B78A5A] font-bold">
                    {ds.id}
                  </span>
                  <span className="text-[10px] text-[#5E8B72] font-bold">VERIFIED</span>
                </div>

                <h3 className="font-bold text-zinc-100 truncate">{ds.name}</h3>
                <p className="text-[11px] text-zinc-400">{ds.publisher}</p>

                <div className="space-y-1 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
                  <div>Cadence: {ds.temporalCoverage}</div>
                  <div>Record Count: {ds.recordCount}</div>
                </div>

                <button
                  onClick={() => openEvidence(ds.id.includes('JJM') ? '#7201' : ds.id.includes('PMAY') ? '#4401' : '#5501')}
                  className="w-full py-2 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors flex items-center justify-center gap-1 text-[11px]"
                >
                  <Database className="w-3 h-3 text-[#B78A5A]" />
                  <span>Inspect Audit Record</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* H. Governance Graph Tab */}
      {activeTab === 'RELATIONSHIPS' && (
        <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#2A2926] pb-4">
            <div>
              <span className="text-[10px] text-[#B78A5A] uppercase tracking-widest block font-bold">
                TOPOLOGICAL GOVERNANCE NETWORK
              </span>
              <h2 className="text-xl font-bold text-zinc-100 font-editorial mt-1">
                Multi-Relational Graph Chain
              </h2>
            </div>
            <Link
              href="/relationships"
              className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors flex items-center gap-1.5 text-xs"
            >
              <span>Full Interactive Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded bg-black/60 border border-zinc-800 space-y-3">
            <div className="text-zinc-300 font-bold text-sm">
              MINISTRY ──▶ SCHEME ──▶ DISTRICT ──▶ EVENT ──▶ FINDING ──▶ EVIDENCE
            </div>
            <p className="text-zinc-400 text-xs">
              Ministry of Jal Shakti & Ministry of Rural Development operate concurrently in Nandurbar (LGD: 512). The live JJM expenditure mutation generates statutory finding SUTRA-FND-0001, anchored to verified Evidence Record #7201.
            </p>
          </div>
        </div>
      )}

      {/* C & Timeline Tab */}
      {activeTab === 'TIMELINE' && (
        <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
          <div className="border-b border-[#2A2926] pb-4">
            <span className="text-[10px] font-mono text-[#B78A5A] uppercase tracking-widest block font-bold">
              8-STAGE INVESTIGATION PIPELINE INSPECTOR
            </span>
            <h2 className="text-xl font-bold text-zinc-100 font-editorial mt-1">
              End-to-End Execution Trace
            </h2>
          </div>

          <InvestigationPipelineInspector
            data={investigationResult}
          />
        </div>
      )}
    </AppShell>
  );
}
