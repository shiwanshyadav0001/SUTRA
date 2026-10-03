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
      <div className="space-y-6 pb-20">
        {/* Top Sovereign Bar */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    SUTRA APEX WORKSPACE
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Governance Intelligence Workspace
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-editorial mt-0.5">
                  Forensic Multi-Programme Investigation Engine
                </h1>
              </div>
            </div>

            {hasStarted && (
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setHasStarted(false)}
                  className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  New Query
                </button>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="font-bold text-emerald-800">
                    {investigationResult.investigation.status}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-700 font-semibold">
                    {investigationResult.investigation.confidence}% Confidence
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LAUNCH WORKSPACE (QUERY, DISTRICT & DATASETS) - Deep Midnight Console */}
        <div className="rounded-lg border border-[#1E293B] bg-[#0B132B] p-5 md:p-6 shadow-xl space-y-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1E293B]">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-editorial">
                <Search className="h-4 w-4 text-cyan-400" />
                Initiate Sovereign Governance Investigation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Query the deterministic multi-dataset pipeline across 36 Maharashtra LGD districts and central schemes.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero-PII • LGD-Deterministic • Cryptographically Sealed</span>
            </div>
          </div>

          {/* Input Row */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter governance investigation question (e.g. Find convergence opportunities in Nandurbar)..."
                  className="w-full pl-3.5 pr-4 py-2.5 rounded-md bg-[#080E21] border border-[#233560] text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all shadow-inner"
                />
              </div>

              {/* District Selector */}
              <div className="w-full md:w-64">
                <select
                  value={selectedLgd}
                  onChange={(e) => setSelectedLgd(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-md bg-[#080E21] border border-[#233560] text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono cursor-pointer"
                >
                  {maharashtraDistricts.map((d) => (
                    <option key={d.lgdCode} value={d.lgdCode} className="bg-[#0B132B] text-white">
                      {d.name} (LGD: {d.lgdCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Investigation Button */}
              <button
                onClick={() => handleStartInvestigation(query, selectedLgd)}
                disabled={isExecuting}
                className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/40 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                    Start Investigation
                  </>
                )}
              </button>
            </div>

            {/* Dataset Selectors */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                Active Central Dataset Connectors (Data Fabric v1.6)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {AVAILABLE_DATASETS.map((ds) => {
                  const isSelected = selectedDatasets.includes(ds.id);
                  return (
                    <div
                      key={ds.id}
                      onClick={() => toggleDataset(ds.id)}
                      className={`cursor-pointer p-3 rounded-md border transition-all flex items-start justify-between shadow-sm ${
                        isSelected
                          ? 'bg-[#101F42] border-cyan-400 text-white'
                          : 'bg-[#080E21] border-[#1E293B] text-slate-400 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-cyan-300">
                            {ds.id}
                          </span>
                          <span className="text-[10px] font-mono text-blue-200 bg-blue-950 px-1.5 rounded font-semibold border border-blue-800">
                            {ds.frequency}
                          </span>
                        </div>
                        <div className="text-xs text-white font-semibold">{ds.name}</div>
                        <div className="text-[10px] text-slate-400">{ds.ministry}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-1 accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suggested Investigations */}
            <div className="pt-2 border-t border-[#1E293B]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                Preset Governance Investigations
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {SUGGESTED_INVESTIGATIONS.map((preset) => (
                  <button
                    key={preset.title}
                    onClick={() => handleStartInvestigation(preset.query, preset.districtLgd)}
                    className="text-left p-3 rounded-md bg-[#080E21] border border-[#1E293B] hover:border-cyan-400 hover:bg-[#101F42] transition-all flex flex-col justify-between group shadow-sm cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                          {preset.title}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          LGD: {preset.districtLgd}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {preset.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 mt-2 pt-1.5 border-t border-[#1E293B]">
                      Launch <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* INVESTIGATION WORKSPACE CONTENT */}
        {hasStarted && (
          <div className="space-y-8">
            {/* INVESTIGATION HEADER - Deep Midnight Banner */}
            <div className="rounded-lg border border-[#1E293B] bg-[#0B132B] p-5 md:p-6 shadow-xl relative overflow-hidden text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                      {investigationResult.investigation.id}
                    </span>
                    <span className="font-mono text-xs text-slate-300 bg-[#080E21] px-2 py-0.5 rounded border border-[#1E293B]">
                      LGD: {investigationResult.interpretation.targetDistrictLgd}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-cyan-400" /> FY 2025-26 Q2
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight font-editorial">
                    {investigationResult.investigation.title}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {investigationResult.investigation.question}
                  </p>
                </div>

                {/* Multi-Component Confidence Widget */}
                <div className="p-3.5 rounded-md bg-[#080E21] border border-[#233560] flex flex-col items-end gap-0.5 shadow-inner font-mono">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Evidence-Backed Audit Confidence
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-cyan-300">
                      {investigationResult.finding.confidenceAssessment?.overallScore || 93.5}%
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {investigationResult.finding.confidenceAssessment?.rating || 'HIGH'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Triangulated across 3 Ministerial Registers
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: INVESTIGATION PIPELINE (8-STAGE INSPECTOR) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
                  <Layers className="h-4 w-4 text-blue-600" />
                  Section 1: 8-Stage Deterministic Pipeline Inspector
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Step-by-step cryptographic audit trail
                </span>
              </div>
              <InvestigationPipelineInspector data={investigationResult} />
            </div>

            {/* SECTION 2: RELEVANT DATASETS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
                  <Database className="h-4 w-4 text-indigo-600" />
                  Section 2: Triangulated Canonical Datasets
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Official ministerial source repositories
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {investigationResult.datasets.map((ds) => (
                  <div
                    key={ds.id}
                    className="p-4 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {ds.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {ds.recordCount} Records Ingested
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{ds.name}</h4>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {ds.publisher}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>Frequency: {ds.reportingFrequency}</span>
                      <span className="text-emerald-700 font-semibold">STATUS: VERIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: GOVERNANCE RELATIONSHIPS GRAPH */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
                  <GitMerge className="h-4 w-4 text-blue-600" />
                  Section 3: Governance Relationships & Entity Graph
                </h3>
                <span className="text-xs font-mono text-slate-500">
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
            <div id="section-findings" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
                    <Target className="h-4 w-4 text-rose-600" />
                    Section 4: Multi-Finding Intelligence Portfolio ({investigationResult.findings.length} Findings)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Empirically derived findings produced from cross-dataset LGD joins.
                  </p>
                </div>

                {/* Finding Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {investigationResult.findings.map((fnd) => (
                    <button
                      key={fnd.id}
                      onClick={() => setActiveFindingTab(fnd.id)}
                      className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer ${
                        activeFindingTab === fnd.id
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                      }`}
                    >
                      {fnd.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Finding Card */}
              {currentFinding && (
                <div className="rounded-lg border border-rose-200 bg-white p-5 md:p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                          {currentFinding.id}
                        </span>
                        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {currentFinding.findingType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight font-editorial">
                        {currentFinding.title}
                      </h4>
                    </div>

                    {/* Why Flagged Action */}
                    <button
                      onClick={() => handleOpenWhyFlagged(currentFinding.id)}
                      className="px-3.5 py-2 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <span>Why is this Flagged? (Forensic Chain)</span>
                    </button>
                  </div>

                  {/* Summary & Detailed Analysis */}
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {currentFinding.summary}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {currentFinding.detailedAnalysis}
                    </p>
                  </div>

                  {/* Mathematical Formulation & Output */}
                  <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold uppercase text-slate-600">
                        {currentFinding.calculation.formulaName}
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Result: {currentFinding.calculation.outputValue}
                      </span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-blue-800 overflow-x-auto">
                      {currentFinding.calculation.formulaText}
                    </div>
                    <div className="text-xs text-slate-500 italic">
                      {currentFinding.calculation.interpretation}
                    </div>
                  </div>

                  {/* Source Facts vs Derived Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Source Facts (Directly Ingested)
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4 font-mono">
                        {currentFinding.factBreakdown.sourceFacts.map((fact, idx) => (
                          <li key={idx}>{fact}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                        <TrendingDown className="h-3.5 w-3.5 text-blue-600" />
                        Derived Metrics (Calculated)
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4 font-mono">
                        {currentFinding.factBreakdown.derivedMetrics.map((met, idx) => (
                          <li key={idx}>{met}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Policy Recommendations */}
                  {currentFinding.policyRecommendations && (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Actionable Policy Interventions
                      </span>
                      <div className="space-y-1.5">
                        {currentFinding.policyRecommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                          >
                            <span className="font-mono text-blue-700 font-bold">{idx + 1}.</span>
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
                  <GitMerge className="h-4 w-4 text-emerald-600" />
                  Section 5: Derived Intelligence — Convergence Opportunities
                </h3>
                <span className="text-xs font-mono text-slate-500">
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  Section 6: Source Facts & Metric Lineage Audit
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  End-to-end provenance traceability
                </span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="p-3">Metric Label</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Display Value</th>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Source Dataset / Field</th>
                        <th className="p-3">Period</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentFinding.metricLineage.map((m) => (
                        <tr key={m.metricId} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3 font-semibold text-slate-900">{m.uiLabel}</td>
                          <td className="p-3 font-mono">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.classification === 'SOURCE_FACT'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-blue-50 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {m.classification}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {m.displayValue}
                          </td>
                          <td className="p-3 text-slate-500 font-mono">{m.unit}</td>
                          <td className="p-3 font-mono text-slate-700">
                            {m.sourceDatasetId ? (
                              <span>
                                {m.sourceDatasetId} / <span className="text-slate-500">{m.sourceField}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">{m.formula}</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500 font-mono">{m.reportingPeriod || 'FY 2025-26'}</td>
                          <td className="p-3 text-right">
                            {m.sourceRecordNumber && (
                              <button
                                onClick={() => openEvidence(m.sourceRecordNumber ? `EV-${m.sourceRecordNumber}` : '')}
                                className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
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
            <div className="p-5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider font-mono">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Section 7: Analytical Limitations & Institutional Safeguards
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-5 font-sans">
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
    </AppShell>
  );
}
