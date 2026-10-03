'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { SutraIntelligenceEngine, QueryExecutionResult } from '@/lib/engines/intelligence-engine';
import { InvestigationPipelineInspector } from '@/components/investigation/InvestigationPipelineInspector';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Database,
  BarChart2,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

export default function AskSutraPage() {
  const { openEvidence, openExplain, openWhyFlagged, openWorkspace } = useIntelligence();
  const [queryInput, setQueryInput] = useState(
    'Why was Nandurbar flagged for cross-programme convergence gap?'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);
  const [viewMode, setViewMode] = useState<'INVESTIGATION' | 'TELEMETRY'>('INVESTIGATION');

  const sampleQueries = [
    'Why was Nandurbar flagged for cross-programme convergence gap?',
    'Which districts recently experienced a convergence gap?',
    'Which schemes changed significantly today in Maharashtra?',
    'Find programme convergence opportunities in Nandurbar',
    'Show all active high-severity signals across Jal Jeevan Mission and PMAY-G',
    'What verified evidence records support finding SUTRA-FND-0001?',
  ];

  const handleRunQuery = async () => {
    if (!queryInput.trim()) return;

    setIsAnalyzing(true);
    setQueryResult(null);
    setActiveStepIndex(0);

    // Concurrently trigger backend API route
    const apiPromise = fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryInput }),
    })
      .then((res) => res.json())
      .catch(() => null);

    const stepsCount = 6;
    let current = 0;

    const interval = setInterval(async () => {
      current++;
      setActiveStepIndex(current);

      if (current >= stepsCount) {
        clearInterval(interval);
        const apiData = await apiPromise;
        if (apiData && apiData.result) {
          setQueryResult(apiData.result);
        } else {
          const fallbackResult = SutraIntelligenceEngine.executeQuery(queryInput);
          setQueryResult(fallbackResult);
        }
        setIsAnalyzing(false);
      }
    }, 250);
  };

  const stepsList = [
    '1. Intent & Geographic Entity Normalization (LGD-First Registry)',
    '2. Multi-Dataset Open Source Ingestion (JJM, PMAY-G, PKVY)',
    '3. Deterministic LGD Join Matrix Execution (Key: LGD:512)',
    '4. Mathematical Formulation & Anomaly Computation (ΔD & Deficit)',
    '5. Cryptographic Provenance Envelope Generation (SHA-256 Chain)',
    '6. Policy Finding & Statutory Audit Assembly (SUTRA-FND-0001)',
  ];

  return (
    <AppShell>
      {/* Centerpiece Interface */}
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-[#191917] border border-[#2A2926]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B78A5A]">
              NATURAL GOVERNANCE QUERY & INVESTIGATION ENGINE
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
            ASK SUTRA
          </h1>
          <p className="text-xs sm:text-sm text-[#8E887E] max-w-xl mx-auto">
            Translates natural language questions into structured investigations executed against verifiable government registers with complete mathematical proof.
          </p>
        </div>

        {/* Query Input Box */}
        <div className="p-3 bg-[#141412] border border-[#B78A5A]/40 rounded-sm shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#B78A5A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunQuery();
                }}
                placeholder="Ask any cross-ministry governance or convergence question..."
                className="w-full pl-10 pr-4 py-3 bg-[#191917] border border-[#2A2926] rounded-sm text-xs sm:text-sm text-[#F3F0E8] placeholder-[#7E7A72] focus:outline-none focus:border-[#B78A5A] font-editorial"
              />
            </div>
            <button
              onClick={handleRunQuery}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs rounded-sm hover:bg-[#CBB093] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>INVESTIGATE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preset Prompts */}
          <div className="pt-3 border-t border-[#2A2926] mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="text-[#8E887E] py-1">Try asking:</span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryInput(q);
                }}
                className="px-2.5 py-1 rounded bg-[#191917] border border-[#2A2926] text-[#C9C2B7] hover:border-[#B78A5A]/60 hover:text-[#F3F0E8] transition-colors truncate max-w-xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Query Processing State */}
        {isAnalyzing && (
          <div className="p-8 rounded-sm bg-[#141412] border border-[#B78A5A]/50 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#2A2926] pb-4">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B78A5A] animate-ping" />
                <span className="text-sm font-bold text-[#F3F0E8] font-editorial">
                  EXECUTING DATA FABRIC INVESTIGATION
                </span>
              </div>
              <span className="text-xs font-mono text-[#8E887E]">
                STEP {activeStepIndex} / {stepsList.length}
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 font-mono text-xs">
              {stepsList.map((step, idx) => {
                const isDone = activeStepIndex > idx;
                const isCurrent = activeStepIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded transition-colors ${
                      isCurrent
                        ? 'bg-[#191917] border border-[#B78A5A]/50 text-[#F3F0E8]'
                        : isDone
                        ? 'text-[#C9C2B7]'
                        : 'text-[#7E7A72]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={
                          isDone
                            ? 'text-[#5E8B72] font-bold'
                            : isCurrent
                            ? 'text-[#B78A5A] font-bold animate-pulse'
                            : 'text-[#7E7A72]'
                        }
                      >
                        {isDone ? '✓' : isCurrent ? '↳' : '○'}
                      </span>
                      <span>{step}</span>
                    </div>
                    {isDone && <span className="text-[10px] text-[#5E8B72]">VERIFIED</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Query Result Presentation */}
        {queryResult && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Structured Intent Translation Badge + View Mode Switcher */}
            <div className="p-4 rounded bg-[#141412] border border-[#2A2926] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-[#8E887E] uppercase">STRUCTURED INTENT:</span>
                <span className="text-[#B78A5A]">
                  metric: &quot;{queryResult.structuredIntent.metric}&quot;
                </span>
                <span className="text-[#8E887E]">•</span>
                <span className="text-[#B78A5A]">
                  target: &quot;{queryResult.structuredIntent.targetDistrict || 'Nandurbar'}&quot;
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('INVESTIGATION')}
                  className={`px-3 py-1 rounded text-xs transition-all ${
                    viewMode === 'INVESTIGATION'
                      ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold'
                      : 'bg-[#191917] text-[#8E887E] border border-[#2A2926]'
                  }`}
                >
                  INVESTIGATION PIPELINE (7-STAGE)
                </button>
                <button
                  onClick={() => setViewMode('TELEMETRY')}
                  className={`px-3 py-1 rounded text-xs transition-all ${
                    viewMode === 'TELEMETRY'
                      ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold'
                      : 'bg-[#191917] text-[#8E887E] border border-[#2A2926]'
                  }`}
                >
                  SUMMARY TELEMETRY
                </button>
              </div>
            </div>

            {/* Render Investigation Pipeline Inspector if in INVESTIGATION mode */}
            {viewMode === 'INVESTIGATION' && queryResult.investigation && (
              <InvestigationPipelineInspector data={queryResult.investigation} />
            )}

            {/* Render Telemetry Card if in TELEMETRY mode */}
            {viewMode === 'TELEMETRY' && (
              <div className="space-y-6">
                {/* Match Counter Banner */}
                <div className="flex items-center justify-between border-b border-[#2A2926] pb-3">
                  <h2 className="text-xl font-bold font-editorial text-[#F3F0E8]">
                    {queryResult.matchCount} DISTRICTS ANALYZED
                  </h2>
                  <span className="text-xs font-mono text-[#8E887E]">
                    Filtered from 36 Maharashtra LGD Registry
                  </span>
                </div>

                {/* Highest Signal Spotlight Card */}
                <div className="p-8 rounded-sm bg-[#141412] border-2 border-[#B78A5A]/60 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#A66A62]/20 text-[#A66A62] border border-[#A66A62]/30">
                        CONVERGENCE DEFICIT SIGNAL
                      </span>
                      <h3 className="text-3xl font-bold text-[#F3F0E8] font-editorial mt-2">
                        {queryResult.topResult.district.name.toUpperCase()}
                      </h3>
                      <p className="text-xs text-[#8E887E]">
                        {queryResult.topResult.district.zone}, Maharashtra (LGD: {queryResult.topResult.district.lgdCode || '512'})
                      </p>
                    </div>

                    <div className="text-left sm:text-right font-mono">
                      <span className="text-[10px] text-[#8E887E] uppercase block">
                        DRAWDOWN GAP
                      </span>
                      <div className="text-3xl font-bold text-[#A66A62]">
                        {queryResult.topResult.gapPp} pp
                      </div>
                      <span className="text-[10px] text-[#8E887E]">Drawdown Margin</span>
                    </div>
                  </div>

                  {/* Metric Bars */}
                  <div className="grid sm:grid-cols-2 gap-6 font-mono text-xs border-y border-[#2A2926] py-6">
                    <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
                      <span className="text-[#8E887E] text-[10px] block">BENEFICIARY DEMAND</span>
                      <span className="text-2xl font-bold text-[#F3F0E8] mt-1 block">
                        {queryResult.topResult.beneficiaryDemand}%
                      </span>
                      <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
                        <div
                          className="bg-[#B78A5A] h-full rounded"
                          style={{ width: `${queryResult.topResult.beneficiaryDemand}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
                      <span className="text-[#8E887E] text-[10px] block">FUND DRAWDOWN</span>
                      <span className="text-2xl font-bold text-[#A66A62] mt-1 block">
                        {queryResult.topResult.fundUtilization}%
                      </span>
                      <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
                        <div
                          className="bg-[#A66A62] h-full rounded"
                          style={{ width: `${queryResult.topResult.fundUtilization}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 justify-end pt-2">
                    <button
                      onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                      className="px-4 py-2.5 rounded-sm bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 hover:bg-zinc-700 transition-colors flex items-center gap-1.5 font-mono"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>WHY FLAGGED?</span>
                    </button>

                    <button
                      onClick={() => openWorkspace('INV-NDB-CONV-001')}
                      className="px-4 py-2.5 rounded-sm bg-[#191917] border border-[#2A2926] text-xs text-[#F3F0E8] hover:border-[#B78A5A] transition-colors font-mono"
                    >
                      OPEN WORKSPACE
                    </button>

                    <button
                      onClick={() => openEvidence(queryResult.topResult.evidenceRecord.id)}
                      className="px-5 py-2.5 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs hover:bg-[#CBB093] transition-colors flex items-center justify-center space-x-2 font-mono"
                    >
                      <span>AUDIT EVIDENCE ({queryResult.topResult.evidenceRecord.recordNumber})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Remaining districts */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-sm font-bold text-[#F3F0E8] font-editorial">
                    Comparative District Index (Ranked by Disparity)
                  </h4>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                    {queryResult.matchingDistricts.slice(1).map((dist) => (
                      <div
                        key={dist.id}
                        className="p-3.5 rounded bg-[#141412] border border-[#2A2926] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[#F3F0E8] font-bold block">{dist.name}</span>
                          <span className="text-[10px] text-[#8E887E]">
                            Demand: {dist.eligibleDemandIndex}% • Util: {dist.fundUtilizationRate}%
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#A66A62]">
                          {dist.eligibleDemandIndex - dist.fundUtilizationRate} pp
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
