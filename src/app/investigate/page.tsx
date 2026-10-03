'use client';

import React, { useState, useMemo } from 'react';
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
  Search,
  Sparkles,
  ShieldCheck,
  Layers,
  Database,
  GitMerge,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  TrendingDown,
  Calendar,
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

  // Dataset view-scope: lineage audit rows attributable to a deselected
  // register are hidden. Derived rows (no sourceDatasetId) are always shown
  // because they are computed across all canonical registers.
  const scopedLineage = useMemo(() => {
    if (!currentFinding) return [];
    return currentFinding.metricLineage.filter(
      (m) => !m.sourceDatasetId || selectedDatasets.includes(m.sourceDatasetId)
    );
  }, [currentFinding, selectedDatasets]);

  const handleStartInvestigation = (targetQuery?: string, targetLgdCode?: string) => {
    setIsExecuting(true);
    if (targetQuery) setQuery(targetQuery);
    if (targetLgdCode) setSelectedLgd(targetLgdCode);

    setTimeout(() => {
      setIsExecuting(false);
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
        {/* TOP: Investigation Identity + Source/Status Information */}
        <div className="rounded-lg border border-[#1E293B] bg-[#0B132B] p-5 md:p-6 shadow-xl relative overflow-hidden text-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
                  SUTRA APEX WORKSPACE
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  VERIFIED DATA • OFFICIAL CADENCE
                </span>
                <span className="font-mono text-[10px] text-slate-300 bg-[#080E21] px-2 py-0.5 rounded border border-[#1E293B]">
                  Case: {investigationResult.investigation.id}
                </span>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-cyan-400" /> FY 2025-26 Q2
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-editorial">
                {investigationResult.investigation.title}
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-3xl">
                Target District: <span className="text-white font-semibold">{currentFinding.districtName}</span> &bull; 
                LGD Key: <span className="font-mono text-cyan-300 font-semibold">{investigationResult.interpretation.targetDistrictLgd}</span> &bull; 
                State: <span className="text-slate-200">{currentFinding.state}</span> &bull; 
                Objective: <span className="text-slate-300 italic">{investigationResult.investigation.question}</span>
              </p>
            </div>

            {/* Measurable Factor Badges */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-md bg-[#080E21] border border-[#233560] space-y-0.5 min-w-[140px]">
                <div className="text-[10px] uppercase font-sans font-semibold text-slate-400">Key Alignment</div>
                <div className="text-sm font-bold text-cyan-300">EXACT LGD (100%)</div>
                <div className="text-[9px] text-slate-500">Zero Interpolated PII</div>
              </div>
              <div className="p-3 rounded-md bg-[#080E21] border border-[#233560] space-y-0.5 min-w-[140px]">
                <div className="text-[10px] uppercase font-sans font-semibold text-slate-400">Source Triangulation</div>
                <div className="text-sm font-bold text-emerald-400">3 CENTRAL REGISTERS</div>
                <div className="text-[9px] text-slate-500">JJM, PMAY-G, PKVY</div>
              </div>
              <div className="p-3 rounded-md bg-[#080E21] border border-amber-900/60 space-y-0.5 min-w-[140px]">
                <div className="text-[10px] uppercase font-sans font-semibold text-amber-400">Safeguard Status</div>
                <div className="text-xs font-bold text-amber-300">HUMAN REVIEW REQUIRED</div>
                <div className="text-[9px] text-slate-500">No Automated Sanctions</div>
              </div>
            </div>
          </div>
        </div>

        {/* NEXT: Investigation Query / Target */}
        <div className="rounded-lg border border-[#1E293B] bg-[#0F172A] p-5 md:p-6 shadow-lg space-y-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 font-editorial">
                <Search className="h-4 w-4 text-cyan-400" />
                Investigation Query & Analytical Scope
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute deterministic cross-programme triangulation across Maharashtra LGD local government directories.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
              Zero-PII • Deterministic LGD Join • Cryptographically Sealed
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter governance investigation question..."
                className="w-full pl-3.5 pr-4 py-2.5 rounded-md bg-[#080E21] border border-[#233560] text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all shadow-inner font-sans"
              />
            </div>

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

            <button
              onClick={() => handleStartInvestigation(query, selectedLgd)}
              disabled={isExecuting}
              className="px-5 py-2.5 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md border border-blue-500/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExecuting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  Execute Audit
                </>
              )}
            </button>
          </div>

          {/* Preset Inquiries */}
          <div className="pt-2 border-t border-[#1E293B]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
              Pre-Configured Governance Scenarios
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {SUGGESTED_INVESTIGATIONS.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => handleStartInvestigation(preset.query, preset.districtLgd)}
                  className="text-left p-3 rounded-md bg-[#080E21] border border-[#1E293B] hover:border-cyan-400 hover:bg-[#132247] transition-all flex flex-col justify-between group shadow-sm cursor-pointer"
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
                    Select Scenario <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NEXT: Source Datasets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
              <Database className="h-4 w-4 text-indigo-600" />
              Canonical Source Datasets (Data Fabric v1.6)
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Toggles scope the lineage audit below • Pipeline totals span all registers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {AVAILABLE_DATASETS.map((ds) => {
              const isSelected = selectedDatasets.includes(ds.id);
              const matchingIngested = investigationResult.datasets.find((d) => d.id === ds.id);
              return (
                <div
                  key={ds.id}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => toggleDataset(ds.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleDataset(ds.id);
                    }
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer space-y-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isSelected
                      ? 'bg-white border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {ds.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">
                        {matchingIngested?.recordCount || '432'} Records
                      </span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleDataset(ds.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Include ${ds.name} in lineage view`}
                        className="accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ds.name}</h4>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {ds.ministry}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[10px] font-mono flex items-center justify-between">
                    <span className="text-slate-500">Frequency: {ds.frequency}</span>
                    <span className={`font-semibold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {isSelected ? 'IN LINEAGE VIEW' : 'EXCLUDED FROM VIEW'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEXT: Investigation Pipeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
              <Layers className="h-4 w-4 text-blue-600" />
              8-Stage Deterministic Pipeline Inspector
            </h3>
            <span className="text-xs font-mono text-slate-500">
              End-to-end cryptographic and formula audit trail
            </span>
          </div>
          <InvestigationPipelineInspector data={investigationResult} />
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 font-editorial">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  Section 6: Source Facts & Metric Lineage Audit
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  View scope: {selectedDatasets.length} of {AVAILABLE_DATASETS.length} registers
                  {selectedDatasets.length < AVAILABLE_DATASETS.length
                    ? ' — toggle datasets above to restore rows'
                    : ''}
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
                      {scopedLineage.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center">
                            <div className="text-xs font-semibold text-slate-700">
                              All source-attributed rows are hidden by the current dataset view scope.
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Re-select at least one canonical dataset above to restore the lineage audit.
                            </div>
                          </td>
                        </tr>
                      )}
                      {scopedLineage.map((m) => (
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
                                onClick={() => openEvidence(m.sourceRecordNumber as string)}
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

            {/* SECTION 7: HUMAN REVIEW & ACTION SAFEGUARDS */}
            <div className="p-5 rounded-lg border border-amber-300 bg-amber-50/60 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider font-mono">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  Section 7: Statutory Human Review & Administrative Action Protocol
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  HUMAN REVIEW REQUIRED
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 bg-white p-3.5 rounded border border-amber-200">
                  <span className="font-semibold text-slate-900 uppercase text-[10px] font-mono block text-amber-800">
                    Administrative Action Safeguards
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    SUTRA produces candidate investigation leads and cross-dataset divergence telemetry. Under state administrative rules, this system <strong>does not execute automated sanctions, biometric blacklisting, or algorithmic fund freezing</strong>.
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Statutory officers must independently corroborate all algorithmic leads against field inspection logs and physical completion registers before issuing formal audit notices.
                  </p>
                </div>

                <div className="space-y-1.5 bg-white p-3.5 rounded border border-amber-200">
                  <span className="font-semibold text-slate-900 uppercase text-[10px] font-mono block text-amber-800">
                    Known Dataset Constraints & Caveats
                  </span>
                  <ul className="space-y-1 text-slate-700 list-disc pl-4 text-[11px]">
                    {investigationResult.limitations.map((lim, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {lim}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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
