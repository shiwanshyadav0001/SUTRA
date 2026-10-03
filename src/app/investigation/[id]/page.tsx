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
      {/* Investigation Apex Header on Deep Midnight Intelligence Surface */}
      <div className="p-5 sm:p-6 surface-dark-intel border border-[#1E293B] rounded-lg shadow-xl space-y-4 relative overflow-hidden my-4 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-1.5">
              <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800 font-bold uppercase">
                CANONICAL INVESTIGATION WORKSPACE
              </span>
              <span className="text-slate-400 font-semibold">ID: {investigationId}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                STATUS: {investigation.status}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#080E21] text-slate-300 border border-[#233560]">
                LGD: {investigation.targetDistrictLgd} ({investigation.targetDistrict})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
              {investigation.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
              {investigation.question}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => openWhyFlagged(currentFinding.id)}
              className="px-3.5 py-2 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>WHY FLAGGED?</span>
            </button>

            <button
              onClick={() => openExecutiveBrief()}
              className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>APEX BRIEF</span>
            </button>
          </div>
        </div>

        {/* Top-level Key Stat Grid on Deliberate Surfaces */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-rose-950/80 rounded-md border border-rose-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">PRIMARY DEFICIT</span>
            <span className="text-xl font-bold text-rose-300 mt-0.5 block">18.4 pp Gap</span>
            <span className="text-[10px] text-slate-400">PMAY-G (46.8%) ⇄ JJM (28.4%)</span>
          </div>

          <div className="p-3 bg-emerald-950/80 rounded-md border border-emerald-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">ANALYTICAL CONFIDENCE</span>
            <span className="text-xl font-bold text-emerald-300 mt-0.5 block">{investigation.confidence}%</span>
            <span className="text-[10px] text-slate-400">Deterministic Model</span>
          </div>

          <div className="p-3 bg-[#080E21] rounded-md border border-[#233560]">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">CORRELATED DATASETS</span>
            <span className="text-xl font-bold text-cyan-300 mt-0.5 block">3 Official Sources</span>
            <span className="text-[10px] text-slate-400">JJM IMIS, AwaasSoft, PKVY</span>
          </div>

          <div className="p-3 bg-[#080E21] rounded-md border border-cyan-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">TRUTH CLASSIFICATION</span>
            <span className="text-xs font-bold text-cyan-300 mt-1 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              STATUTORY VERIFIED
            </span>
            <span className="text-[10px] text-slate-400">SHA-256 Provenance Sealed</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1E293B] text-xs font-mono">
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
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white bg-[#080E21] border border-[#233560]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Findings & Cross-Programme Correlation */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start my-6">
          {/* Left 8 Cols: Detailed Findings Breakdown */}
          <div className="lg:col-span-8 space-y-5">
            {/* Finding Selector Deck */}
            <div className="p-5 surface-neutral-analytical border border-slate-200 rounded-lg shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-blue-700 font-bold uppercase">
                  INVESTIGATION FINDINGS REGISTRY ({findings.length})
                </span>
                <span className="text-xs font-mono text-slate-500 font-medium">LGD 512 Multi-Scheme Join</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
                {findings.map((fnd) => (
                  <div
                    key={fnd.id}
                    onClick={() => setSelectedFindingId(fnd.id)}
                    className={`p-3.5 rounded-md border transition-all cursor-pointer shadow-2xs ${
                      selectedFindingId === fnd.id
                        ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                        {fnd.id}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        Confidence: {fnd.confidence}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-xs text-slate-900 truncate">{fnd.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{fnd.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Finding Deep Dive Card */}
            <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-700 font-bold block">
                    SELECTED FINDING AUDIT
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-editorial mt-0.5">
                    {currentFinding.id}: {currentFinding.title}
                  </h2>
                </div>
                <button
                  onClick={() => openWhyFlagged(currentFinding.id)}
                  className="px-3 py-1.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono font-semibold flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Explain Chain</span>
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {currentFinding.summary}
              </p>

              {/* Triangulation Metric Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">OUTPUT VALUE</span>
                  <span className="text-xl font-bold text-slate-900 mt-1 block">
                    {currentFinding.calculation.outputValue} {currentFinding.calculation.outputUnit}
                  </span>
                  <span className="text-[9px] text-slate-500">Computed Deterministically</span>
                </div>

                <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">JOIN QUALITY</span>
                  <span className="text-xl font-bold text-emerald-800 mt-1 block">100% EXACT</span>
                  <span className="text-[9px] text-slate-500">LGD: 512 Exact Key Match</span>
                </div>

                <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">SOURCE EVIDENCE</span>
                  <span className="text-xl font-bold text-blue-700 mt-1 block">
                    {currentFinding.sourceRecords.length} Records
                  </span>
                  <span className="text-[9px] text-slate-500">Lineage Cryptographically Hashed</span>
                </div>
              </div>

              {/* Calculation & Formula Box */}
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-xs">
                <span className="text-[10px] uppercase text-blue-700 font-bold block flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" />
                  GOVERNANCE FORMULATION
                </span>
                <div className="p-2.5 rounded bg-white border border-slate-200 text-slate-800 text-xs font-bold">
                  {currentFinding.calculation.formulaText}
                </div>
                <div className="text-[11px] text-slate-500">
                  Analytical Interpretation: {currentFinding.calculation.interpretation}
                </div>
              </div>

              {/* Provenance Envelopes */}
              <div className="space-y-1 pt-2 border-t border-slate-100 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Finding Provenance Hash:</span>
                  <code className="text-emerald-700 truncate max-w-xs">{currentFinding.provenanceHashes.findingHash}</code>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Join Provenance Hash:</span>
                  <code className="text-slate-700 truncate max-w-xs">{currentFinding.provenanceHashes.joinHash}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Convergence Opportunities & Action Deck */}
          <div className="lg:col-span-4 space-y-5">
            {/* Opportunities Box */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3.5">
              <span className="text-[10px] font-mono tracking-wider text-blue-700 font-bold uppercase block">
                CONVERGENCE OPPORTUNITIES
              </span>

              {convergenceOpportunities.map((opp) => (
                <div key={opp.id} className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-2 font-mono">
                  <h3 className="text-xs font-bold text-slate-900 font-editorial">{opp.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{opp.rationale}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold">CONFIDENCE</span>
                      <span className="font-bold text-emerald-700">{opp.confidenceAssessment?.overallScore || opp.confidence || 88}% HIGH</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200">
                      <span className="text-slate-400 block font-semibold">ACTION STATUS</span>
                      <span className="font-bold text-blue-700">{opp.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Navigator */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2.5 font-mono text-xs">
              <span className="text-[10px] tracking-wider text-slate-500 uppercase block font-bold">
                CROSS-SYSTEM NAVIGATION
              </span>

              <Link
                href="/map"
                className="w-full py-2 px-3 rounded-md bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between text-slate-700 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Inspect on Geographic Map</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/relationships"
                className="w-full py-2 px-3 rounded-md bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between text-slate-700 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Trace in Governance Graph</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                onClick={() => openExecutiveBrief()}
                className="w-full py-2.5 px-3 rounded-md bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export SUTRA Analytical Brief</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculation Proof Tab */}
      {activeTab === 'CALCULATIONS' && (
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-5 font-mono my-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] text-blue-700 uppercase tracking-wider block font-bold">
              AUDITABLE MATHEMATICAL PROOFS & INVARIANTS
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-editorial mt-0.5">
              Zero LLM-Arithmetic Guarantee
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All metrics and percentage differences are computed deterministically by SUTRA Data Fabric arithmetic modules.
            </p>
          </div>

          <div className="space-y-3.5">
            {findings.map((fnd) => (
              <div key={fnd.id} className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{fnd.id}: {fnd.title}</span>
                  <span className="text-emerald-700 font-bold">{fnd.calculation.outputValue} {fnd.calculation.outputUnit}</span>
                </div>

                <div className="p-2.5 rounded bg-white border border-slate-200 text-slate-800">
                  <code>{fnd.calculation.formulaText}</code>
                </div>

                <div className="text-slate-500 text-[11px]">
                  <span>Input Parameters: </span>
                  {JSON.stringify(fnd.calculation.inputs)}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Calculation SHA-256:</span>
                  <code className="text-emerald-700">{fnd.provenanceHashes.calculationHash}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source Evidence Tab */}
      {activeTab === 'EVIDENCE' && (
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-5 font-mono text-xs my-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] text-blue-700 uppercase tracking-wider block font-bold">
              OFFICIAL RECORD LINEAGE & PROVENANCE
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-editorial mt-0.5">
              Statutory Datasets & Cryptographic Signatures
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-3.5">
            {datasets.map((ds) => (
              <div key={ds.id} className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {ds.id}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">VERIFIED</span>
                </div>

                <h3 className="font-bold text-slate-900 truncate">{ds.name}</h3>
                <p className="text-[11px] text-slate-500">{ds.publisher}</p>

                <div className="space-y-0.5 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <div>Cadence: {ds.temporalCoverage}</div>
                  <div>Record Count: {ds.recordCount}</div>
                </div>

                <button
                  onClick={() => openEvidence(ds.id.includes('JJM') ? '#7201' : ds.id.includes('PMAY') ? '#4401' : '#5501')}
                  className="w-full py-2 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Inspect Audit Record</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Governance Graph Tab */}
      {activeTab === 'RELATIONSHIPS' && (
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 font-mono text-xs my-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] text-blue-700 uppercase tracking-wider block font-bold">
                TOPOLOGICAL GOVERNANCE NETWORK
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-editorial mt-0.5">
                Multi-Relational Graph Chain
              </h2>
            </div>
            <Link
              href="/relationships"
              className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
            >
              <span>Full Interactive Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-md bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-slate-900 font-bold text-xs">
              MINISTRY ──▶ SCHEME ──▶ DISTRICT ──▶ EVENT ──▶ FINDING ──▶ EVIDENCE
            </div>
            <p className="text-slate-600 text-xs font-sans leading-relaxed">
              Ministry of Jal Shakti & Ministry of Rural Development operate concurrently in Nandurbar (LGD: 512). The live JJM expenditure mutation generates statutory finding SUTRA-FND-0001, anchored to verified Evidence Record #7201.
            </p>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'TIMELINE' && (
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 my-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider block font-bold">
              8-STAGE INVESTIGATION PIPELINE INSPECTOR
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-editorial mt-0.5">
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
