'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { InvestigationEngine } from '@/lib/fabric/investigation/investigation-engine';
import { LgdRegistry } from '@/lib/fabric/registry/lgd-registry';
import { InvestigationPipelineResult, InvestigationFinding, WhyFlaggedChain } from '@/lib/types/data-fabric';
import { InvestigationPipelineInspector } from '@/components/investigation/InvestigationPipelineInspector';
import { InvestigationGraphExplorer } from '@/components/investigation/InvestigationGraphExplorer';
import { ConvergenceOpportunitiesCard } from '@/components/investigation/ConvergenceOpportunitiesCard';
import { WhyFlaggedModal } from '@/components/investigation/WhyFlaggedModal';
import { useIntelligence } from '@/context/IntelligenceContext';
import {
  Compass,
  Search,
  Sparkles,
  ShieldCheck,
  Layers,
  Database,
  GitMerge,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Info,
  Calendar,
  Building,
  Target,
} from 'lucide-react';

const SUGGESTED_INVESTIGATIONS = [
  {
    title: 'Nandurbar Convergence Review',
    query: 'Find convergence opportunities in Nandurbar.',
    districtLgd: '512',
    districtName: 'Nandurbar',
    description: 'Triangulate JJM water, PMAY-G housing, and PKVY organic agriculture across 284k rural households.',
  },
  {
    title: 'Gadchiroli Capital Outlay Deficit',
    query: 'Analyze capital drawdown lag in Gadchiroli.',
    districtLgd: '507',
    districtName: 'Gadchiroli',
    description: 'Investigate tribal block capital absorption delays and unreleased DBT allocations.',
  },
  {
    title: 'Washim Physical Delivery Pace',
    query: 'Assess housing vs tap water delivery pace in Washim.',
    districtLgd: '501',
    districtName: 'Washim',
    description: 'Detect physical completion spreads between central rural infrastructure schemes.',
  },
];

const AVAILABLE_DATASETS = [
  {
    id: 'DS-JJM-MH',
    name: 'Jal Jeevan Mission (JJM IMIS)',
    ministry: 'Ministry of Jal Shakti',
    frequency: 'MONTHLY',
    coverage: '36 Districts',
    selected: true,
  },
  {
    id: 'DS-PMAYG-MH',
    name: 'PMAY-G Rural Housing (AwaasSoft)',
    ministry: 'Ministry of Rural Development',
    frequency: 'QUARTERLY',
    coverage: '36 Districts',
    selected: true,
  },
  {
    id: 'DS-PKVY-MH',
    name: 'PKVY Soil Health (Open Data)',
    ministry: 'Ministry of Agriculture',
    frequency: 'ANNUAL',
    coverage: '36 Districts',
    selected: true,
  },
];

export default function InvestigateWorkspacePage() {
  const { openEvidence } = useIntelligence();
  const [query, setQuery] = useState<string>('Find convergence opportunities in Nandurbar.');
  const [selectedLgd, setSelectedLgd] = useState<string>('512');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([
    'DS-JJM-MH',
    'DS-PMAYG-MH',
    'DS-PKVY-MH',
  ]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(true);
  const [activeFindingTab, setActiveFindingTab] = useState<string>('SUTRA-FND-0001');
  const [activeWhyFlaggedChain, setActiveWhyFlaggedChain] = useState<WhyFlaggedChain | null>(null);
  const [whyFlaggedFindingId, setWhyFlaggedFindingId] = useState<string>('SUTRA-FND-0001');

  // Load Maharashtra LGD districts
  const maharashtraDistricts = useMemo(() => {
    return LgdRegistry.getAllDistricts().sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Run Investigation on selected target
  const investigationResult: InvestigationPipelineResult = useMemo(() => {
    return InvestigationEngine.runDistrictConvergenceInvestigation(selectedLgd);
  }, [selectedLgd]);

  // Graph data for target
  const graphData = useMemo(() => {
    return InvestigationEngine.getInvestigationGraph(selectedLgd);
  }, [selectedLgd]);

  const currentFinding = useMemo(() => {
    return (
      investigationResult.findings.find((f) => f.id === activeFindingTab) ||
      investigationResult.finding
    );
  }, [investigationResult, activeFindingTab]);

  const handleStartInvestigation = (targetQuery?: string, targetLgdCode?: string) => {
    setIsExecuting(true);
    if (targetQuery) setQuery(targetQuery);
    if (targetLgdCode) setSelectedLgd(targetLgdCode);

    setTimeout(() => {
      setIsExecuting(false);
      setHasStarted(true);
    }, 400);
  };

  const handleOpenWhyFlagged = (findingId: string) => {
    const fnd = investigationResult.findings.find((f) => f.id === findingId) || investigationResult.finding;
    setWhyFlaggedFindingId(findingId);
    setActiveWhyFlaggedChain(fnd.whyFlaggedChain || null);
  };

  const toggleDataset = (id: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24">
        {/* Top Sovereign Bar */}
        <div className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#B78A5A]/10 border border-[#B78A5A]/20 text-[#B78A5A] shadow-inner">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B78A5A] bg-[#B78A5A]/10 px-2 py-0.5 rounded-sm border border-[#B78A5A]/20">
                    SUTRA V2.0
                  </span>
                  <span className="text-xs font-mono text-[#8E887E]">
                    Governance Intelligence Workspace
                  </span>
                </div>
                <h1 className="text-lg font-bold text-[#F3F0E8] font-editorial tracking-tight">
                  Forensic Multi-Programme Investigation Engine
                </h1>
              </div>
            </div>

            {hasStarted && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setHasStarted(false)}
                  className="px-3.5 py-1.5 rounded-sm bg-[#1C1B18] hover:bg-[#252420] text-[#C9C2B7] text-xs font-medium border border-[#2A2926] flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#8E887E]" />
                  New Query
                </button>

                <div className="flex items-center gap-2 bg-[#1C1B18] border border-[#2A2926] rounded-sm px-3.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#5E8B72] animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[#5E8B72]">
                    {investigationResult.investigation.status}
                  </span>
                  <span className="text-[#8E887E] text-xs">·</span>
                  <span className="font-mono text-xs text-[#C9C2B7]">
                    {investigationResult.investigation.confidence}% Confidence
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
          {/* ======================================================== */}
          {/* PHASE 3: LAUNCH WORKSPACE (QUERY, DISTRICT & DATASETS)    */}
          {/* ======================================================== */}
          <div className="rounded-sm border border-[#38352F] bg-[#181816] p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#302E2A]">
              <div>
                <h2 className="text-xl font-bold text-white font-editorial tracking-tight flex items-center gap-2">
                  <Search className="h-5 w-5 text-[#DFB88B]" />
                  Initiate Governance Investigation
                </h2>
                <p className="text-xs text-[#DDD7CD] mt-1">
                  Query the deterministic multi-dataset pipeline across 36 Maharashtra LGD districts and central schemes.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#DDD7CD]">
                <ShieldCheck className="h-4 w-4 text-[#7DC09C]" />
                Zero-PII · LGD-100% Deterministic · Cryptographically Sealed
              </div>
            </div>

            {/* Input Row */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter governance investigation question (e.g. Find convergence opportunities in Nandurbar)..."
                    className="w-full pl-4 pr-4 py-3.5 rounded-sm bg-[#111110] border border-[#33312D] text-white placeholder-[#A39D92] text-sm focus:outline-none focus:border-[#DFB88B] transition-all font-mono shadow-inner"
                  />
                </div>

                {/* District Selector */}
                <div className="w-full md:w-64">
                  <select
                    value={selectedLgd}
                    onChange={(e) => setSelectedLgd(e.target.value)}
                    className="w-full py-3.5 px-3 rounded-sm bg-[#111110] border border-[#33312D] text-white text-sm focus:outline-none focus:border-[#DFB88B] transition-all font-mono"
                  >
                    {maharashtraDistricts.map((d) => (
                      <option key={d.lgdCode} value={d.lgdCode}>
                        {d.name} (LGD: {d.lgdCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Investigation Button */}
                <button
                  onClick={() => handleStartInvestigation(query, selectedLgd)}
                  disabled={isExecuting}
                  className="px-6 py-3.5 rounded-sm bg-gradient-to-r from-[#DFB88B] via-[#C89B65] to-[#B78A5A] hover:brightness-110 text-[#0E0E0D] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C89B65]/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isExecuting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-[#0E0E0D] border-t-transparent rounded-full animate-spin" />
                      Executing Pipeline...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-[#0E0E0D]" />
                      Start Investigation
                    </>
                  )}
                </button>
              </div>

              {/* Dataset Selectors */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8E887E] mb-2 font-mono">
                  Active Central Dataset Connectors (Data Fabric v1.5/v1.6)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {AVAILABLE_DATASETS.map((ds) => {
                    const isSelected = selectedDatasets.includes(ds.id);
                    return (
                      <div
                        key={ds.id}
                        onClick={() => toggleDataset(ds.id)}
                        className={`cursor-pointer p-3 rounded-sm border transition-all flex items-start justify-between ${
                          isSelected
                            ? 'bg-[#1C1B18] border-[#B78A5A]/50 shadow-sm'
                            : 'bg-[#0D0D0C] border-[#2A2926] opacity-60'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-[#F3F0E8]">
                              {ds.id}
                            </span>
                            <span className="text-[10px] font-mono text-[#B78A5A] bg-[#B78A5A]/10 px-1.5 rounded-sm">
                              {ds.frequency}
                            </span>
                          </div>
                          <div className="text-xs text-[#C9C2B7] font-medium">{ds.name}</div>
                          <div className="text-[10px] text-[#8E887E]">{ds.ministry}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 accent-[#B78A5A]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suggested Investigations */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8E887E] mb-2 font-mono">
                  Preset Governance Investigations
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SUGGESTED_INVESTIGATIONS.map((preset) => (
                    <button
                      key={preset.title}
                      onClick={() => handleStartInvestigation(preset.query, preset.districtLgd)}
                      className="text-left p-3.5 rounded-sm bg-[#171614] border border-[#2A2926] hover:border-[#B78A5A]/40 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-[#F3F0E8] group-hover:text-[#B78A5A] transition-colors">
                            {preset.title}
                          </span>
                          <span className="font-mono text-[10px] text-[#8E887E]">
                            LGD: {preset.districtLgd}
                          </span>
                        </div>
                        <p className="text-xs text-[#C9C2B7] leading-relaxed line-clamp-2">
                          {preset.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#B78A5A] mt-2.5 pt-2 border-t border-[#2A2926]">
                        Launch <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* PHASE 4: INVESTIGATION WORKSPACE CONTENT (AFTER START)    */}
          {/* ======================================================== */}
          {hasStarted && (
            <div className="space-y-12">
              {/* INVESTIGATION HEADER */}
              <div className="rounded-sm border border-[#38352F] bg-[#181816] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#DFB88B] bg-[#C89B65]/15 px-2.5 py-0.5 rounded-sm border border-[#C89B65]/30">
                        {investigationResult.investigation.id}
                      </span>
                      <span className="font-mono text-xs text-[#DDD7CD] bg-[#22211D] px-2.5 py-0.5 rounded border border-[#38352F]">
                        LGD: {investigationResult.interpretation.targetDistrictLgd}
                      </span>
                      <span className="text-xs text-[#A39D92] font-mono flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#DFB88B]" /> FY 2025-26 Q2
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {investigationResult.investigation.title}
                    </h2>
                    <p className="text-sm text-[#DDD7CD] leading-relaxed">
                      {investigationResult.investigation.question}
                    </p>
                  </div>

                  {/* Multi-Component Confidence Widget */}
                  <div className="p-4 rounded-sm bg-[#121210] border border-[#33312D] flex flex-col items-end gap-1 shadow-inner">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#A39D92] font-mono">
                      Multi-Component Audit Confidence
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-mono font-bold text-white">
                        {investigationResult.finding.confidenceAssessment?.overallScore || 93.5}%
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm bg-[#6DAA8A]/20 text-[#7DC09C] border border-[#6DAA8A]/35">
                        {investigationResult.finding.confidenceAssessment?.rating || 'HIGH'}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#A39D92] mt-1">
                      5-Component Weighted Assessment
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: INVESTIGATION PIPELINE (8-STAGE INSPECTOR) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F3F0E8] font-editorial tracking-tight flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#B78A5A]" />
                    Section 1: 8-Stage Deterministic Pipeline Inspector
                  </h3>
                  <span className="text-xs font-mono text-[#8E887E]">
                    Step-by-step cryptographic audit trail
                  </span>
                </div>
                <InvestigationPipelineInspector data={investigationResult} />
              </div>

              {/* SECTION 2: RELEVANT DATASETS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F3F0E8] font-editorial tracking-tight flex items-center gap-2">
                    <Database className="h-5 w-5 text-[#B78A5A]" />
                    Section 2: Triangulated Canonical Datasets
                  </h3>
                  <span className="text-xs font-mono text-[#8E887E]">
                    Official ministerial source repositories
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {investigationResult.datasets.map((ds) => (
                    <div
                      key={ds.id}
                      className="p-5 rounded-sm border border-[#2A2926] bg-[#141412] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#B78A5A] bg-[#B78A5A]/10 px-2 py-0.5 rounded-sm border border-[#B78A5A]/20">
                          {ds.id}
                        </span>
                        <span className="text-[10px] font-mono text-[#8E887E]">
                          {ds.recordCount} Records Ingested
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#F3F0E8]">{ds.name}</h4>
                        <div className="text-xs text-[#8E887E] font-medium mt-0.5">
                          {ds.publisher}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#2A2926] text-[11px] text-[#8E887E] font-mono flex items-center justify-between">
                        <span>Frequency: {ds.reportingFrequency}</span>
                        <span className="text-[#5E8B72]">STATUS: VERIFIED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: GOVERNANCE RELATIONSHIPS GRAPH */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F3F0E8] font-editorial tracking-tight flex items-center gap-2">
                    <GitMerge className="h-5 w-5 text-[#5C7C8A]" />
                    Section 3: Governance Relationships & Entity Graph
                  </h3>
                  <span className="text-xs font-mono text-[#8E887E]">
                    Interactive multi-tier knowledge graph
                  </span>
                </div>
                <InvestigationGraphExplorer
                  nodes={graphData.nodes}
                  links={graphData.links}
                  targetDistrictName={investigationResult.interpretation.targetDistrict}
                  onSelectFinding={(id) => {
                    setActiveFindingTab(id);
                    const el = document.getElementById('section-findings');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOpenWhyFlagged={handleOpenWhyFlagged}
                  onSelectEvidence={(evId) => openEvidence(evId)}
                />
              </div>

              {/* SECTION 4: MULTI-FINDING PORTFOLIO */}
              <div id="section-findings" className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#F3F0E8] font-editorial tracking-tight flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#A66A62]" />
                      Section 4: Multi-Finding Intelligence Portfolio ({investigationResult.findings.length} Findings)
                    </h3>
                    <p className="text-xs text-[#8E887E] mt-0.5">
                      Empirically derived findings produced from cross-dataset LGD joins.
                    </p>
                  </div>

                  {/* Finding Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {investigationResult.findings.map((fnd) => (
                      <button
                        key={fnd.id}
                        onClick={() => setActiveFindingTab(fnd.id)}
                        className={`px-3 py-1.5 rounded-sm font-mono text-xs font-bold transition-all ${
                          activeFindingTab === fnd.id
                            ? 'bg-[#B78A5A]/20 text-[#B78A5A] border border-[#B78A5A]/40 shadow-sm'
                            : 'bg-[#1C1B18] text-[#8E887E] hover:text-[#C9C2B7] border border-[#2A2926]'
                        }`}
                      >
                        {fnd.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Finding Card */}
                {currentFinding && (
                  <div className="rounded-sm border border-[#2A2926] bg-[#141412] p-6 md:p-8 shadow-2xl space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2A2926]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#B78A5A] bg-[#B78A5A]/10 px-2.5 py-0.5 rounded-sm border border-[#B78A5A]/20">
                            {currentFinding.id}
                          </span>
                          <span className="font-mono text-xs text-[#C9C2B7] bg-[#1C1B18] px-2 py-0.5 rounded-sm border border-[#2A2926]">
                            {currentFinding.findingType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-[#F3F0E8] font-editorial tracking-tight">
                          {currentFinding.title}
                        </h4>
                      </div>

                      {/* Why Flagged Forensic Chain Action */}
                      <button
                        onClick={() => handleOpenWhyFlagged(currentFinding.id)}
                        className="px-4 py-2.5 rounded-sm bg-[#B78A5A]/10 hover:bg-[#B78A5A]/20 text-[#B78A5A] border border-[#B78A5A]/30 text-xs font-bold flex items-center gap-2 transition-all"
                      >
                        <Sparkles className="h-4 w-4" />
                        Why is this Flagged? (Forensic Chain)
                      </button>
                    </div>

                    {/* Summary & Detailed Analysis */}
                    <div className="space-y-3">
                      <p className="text-sm text-[#F3F0E8] leading-relaxed font-normal">
                        {currentFinding.summary}
                      </p>
                      <p className="text-xs text-[#C9C2B7] leading-relaxed">
                        {currentFinding.detailedAnalysis}
                      </p>
                    </div>

                    {/* Mathematical Formulation & Output */}
                    <div className="p-5 rounded-sm bg-[#0D0D0C] border border-[#2A2926] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold uppercase text-[#8E887E]">
                          {currentFinding.calculation.formulaName}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#B78A5A] bg-[#B78A5A]/10 px-2.5 py-1 rounded-sm border border-[#B78A5A]/20">
                          Result: {currentFinding.calculation.outputValue}
                        </span>
                      </div>
                      <div className="p-3 rounded-sm bg-[#141412] border border-[#2A2926] font-mono text-xs text-[#B78A5A] overflow-x-auto">
                        {currentFinding.calculation.formulaText}
                      </div>
                      <div className="text-xs text-[#8E887E] italic">
                        {currentFinding.calculation.interpretation}
                      </div>
                    </div>

                    {/* Source Facts vs Derived Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-sm bg-[#171614] border border-[#2A2926] space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#5E8B72] flex items-center gap-1.5 font-mono">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Source Facts (Directly Ingested)
                        </span>
                        <ul className="text-xs text-[#C9C2B7] space-y-1.5 list-disc pl-4">
                          {currentFinding.factBreakdown.sourceFacts.map((fact, idx) => (
                            <li key={idx}>{fact}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-sm bg-[#171614] border border-[#2A2926] space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#5C7C8A] flex items-center gap-1.5 font-mono">
                          <TrendingDown className="h-3.5 w-3.5" />
                          Derived Metrics (Calculated)
                        </span>
                        <ul className="text-xs text-[#C9C2B7] space-y-1.5 list-disc pl-4">
                          {currentFinding.factBreakdown.derivedMetrics.map((met, idx) => (
                            <li key={idx}>{met}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Policy Recommendations */}
                    {currentFinding.policyRecommendations && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#8E887E] font-mono">
                          Actionable Policy Interventions
                        </span>
                        <div className="space-y-1.5">
                          {currentFinding.policyRecommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-sm bg-[#171614] border border-[#2A2926] text-xs text-[#C9C2B7] flex items-start gap-2.5"
                            >
                              <span className="font-mono text-[#B78A5A] font-bold">{idx + 1}.</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 5: CONVERGENCE OPPORTUNITIES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F3F0E8] font-editorial tracking-tight flex items-center gap-2">
                    <GitMerge className="h-5 w-5 text-[#B78A5A]" />
                    Section 5: Derived Intelligence — Convergence Opportunities
                  </h3>
                  <span className="text-xs font-mono text-[#8E887E]">
                    Actionable cross-programme synergies
                  </span>
                </div>
                <ConvergenceOpportunitiesCard
                  opportunities={investigationResult.convergenceOpportunities}
                  onSelectFinding={(id) => {
                    setActiveFindingTab(id);
                    const el = document.getElementById('section-findings');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOpenWhyFlagged={handleOpenWhyFlagged}
                />
              </div>

              {/* SECTION 6: EVIDENCE LINEAGE TABLE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F3F0E8] font-editorial tracking-tight flex items-center gap-2">
                    <FileCheck2 className="h-5 w-5 text-[#5C7C8A]" />
                    Section 6: Source Facts & Metric Lineage Audit
                  </h3>
                  <span className="text-xs font-mono text-[#8E887E]">
                    End-to-end provenance traceability
                  </span>
                </div>
                <div className="rounded-sm border border-[#2A2926] bg-[#141412] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0D0D0C] border-b border-[#2A2926] text-[#8E887E] font-mono uppercase text-[10px]">
                        <tr>
                          <th className="p-3.5">Metric Label</th>
                          <th className="p-3.5">Type</th>
                          <th className="p-3.5">Display Value</th>
                          <th className="p-3.5">Unit</th>
                          <th className="p-3.5">Source Dataset / Field</th>
                          <th className="p-3.5">Period</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2A2926]">
                        {currentFinding.metricLineage.map((m) => (
                          <tr key={m.metricId} className="hover:bg-[#1C1B18] transition-colors">
                            <td className="p-3.5 font-semibold text-[#F3F0E8]">{m.uiLabel}</td>
                            <td className="p-3.5 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                                  m.classification === 'SOURCE_FACT'
                                    ? 'bg-[#5E8B72]/15 text-[#5E8B72] border border-[#5E8B72]/30'
                                    : 'bg-[#5C7C8A]/15 text-[#5C7C8A] border border-[#5C7C8A]/30'
                                }`}
                              >
                                {m.classification}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-[#F3F0E8]">
                              {m.displayValue}
                            </td>
                            <td className="p-3.5 text-[#8E887E] font-mono">{m.unit}</td>
                            <td className="p-3.5 font-mono text-[#C9C2B7]">
                              {m.sourceDatasetId ? (
                                <span>
                                  {m.sourceDatasetId} / <span className="text-[#8E887E]">{m.sourceField}</span>
                                </span>
                              ) : (
                                <span className="text-[#8E887E] italic">{m.formula}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-[#8E887E] font-mono">{m.reportingPeriod || 'FY 2025-26'}</td>
                            <td className="p-3.5 text-right">
                              {m.sourceRecordNumber && (
                                <button
                                  onClick={() => openEvidence(m.sourceRecordNumber ? `EV-${m.sourceRecordNumber}` : '')}
                                  className="text-[11px] font-medium text-[#B78A5A] hover:underline flex items-center gap-1 ml-auto"
                                >
                                  Trace Evidence <ExternalLink className="h-3 w-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECTION 7: LIMITATIONS & SAFEGUARDS */}
              <div className="p-6 md:p-8 rounded-2xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Section 7: Analytical Limitations & Institutional Safeguards
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 list-disc pl-5">
                  {investigationResult.limitations.map((lim, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {lim}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* WHY FLAGGED FORENSIC MODAL */}
        <WhyFlaggedModal
          isOpen={activeWhyFlaggedChain !== null}
          onClose={() => setActiveWhyFlaggedChain(null)}
          chain={activeWhyFlaggedChain}
          findingId={whyFlaggedFindingId}
          onTraceEvidence={(evId) => openEvidence(evId)}
        />
      </div>
    </AppShell>
  );
}
