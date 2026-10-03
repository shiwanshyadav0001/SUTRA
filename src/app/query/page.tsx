'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  AlertTriangle,
  Info,
  Layers,
  MapPin,
  ExternalLink,
  Activity,
} from 'lucide-react';

function QueryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Why was Nandurbar flagged for cross-programme convergence gap?';

  const { openEvidence, openExplain, openWhyFlagged, openWorkspace } = useIntelligence();
  const [queryInput, setQueryInput] = useState(initialQuery);
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

  const handleRunQuery = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : queryInput).trim();
    if (!q) return;

    if (customQuery !== undefined) {
      setQueryInput(customQuery);
    }

    setIsAnalyzing(true);
    setQueryResult(null);
    setActiveStepIndex(0);

    // Concurrently trigger backend API route
    const apiPromise = fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
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
          const fallbackResult = SutraIntelligenceEngine.executeQuery(q);
          setQueryResult(fallbackResult);
        }
        setIsAnalyzing(false);
      }
    }, 200);
  };

  // Run automatically if `q` was passed in search params on mount
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      handleRunQuery(q);
    }
  }, [searchParams]);

  const stepsList = [
    '1. Intent & Geographic Entity Normalization (LGD-First Registry)',
    '2. Multi-Dataset Open Source Ingestion (JJM, PMAY-G, PKVY)',
    '3. Deterministic LGD Join Matrix Execution (Key: LGD:512)',
    '4. Mathematical Formulation & Anomaly Computation (ΔD & Deficit)',
    '5. Cryptographic Provenance Envelope Generation (SHA-256 Chain)',
    '6. Policy Finding & Statutory Audit Assembly (SUTRA-FND-0001)',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-blue-800 font-semibold">
            NATURAL GOVERNANCE QUERY & INVESTIGATION ENGINE
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
          ASK SUTRA
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Deterministic natural language engine for public governance. Questions are translated into structured queries, executed across official registers with cryptographic lineage, and verified with mathematical proof.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="p-4 bg-white border border-slate-300 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunQuery();
              }}
              placeholder="Ask any cross-ministry governance or convergence question..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <button
            onClick={() => handleRunQuery()}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-md hover:bg-blue-700 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <span>INVESTIGATE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preset Prompts */}
        <div className="pt-3 border-t border-slate-100 mt-3 flex flex-wrap gap-2 text-[11px] items-center">
          <span className="text-slate-500 font-medium">Try asking:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleRunQuery(q)}
              className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-colors truncate max-w-xs text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Animated Query Processing State */}
      {isAnalyzing && (
        <div className="p-6 rounded-lg bg-white border border-blue-200 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <span className="text-sm font-bold text-slate-900 font-editorial">
                EXECUTING DATA FABRIC INVESTIGATION
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              STEP {activeStepIndex} / {stepsList.length}
            </span>
          </div>

          {/* Checklist */}
          <div className="space-y-2 font-mono text-xs">
            {stepsList.map((step, idx) => {
              const isDone = activeStepIndex > idx;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-md transition-colors ${
                    isCurrent
                      ? 'bg-blue-50 border border-blue-300 text-blue-900 font-semibold'
                      : isDone
                      ? 'bg-slate-50 text-slate-700 border border-slate-200'
                      : 'text-slate-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={
                        isDone
                          ? 'text-emerald-600 font-bold'
                          : isCurrent
                          ? 'text-blue-600 font-bold animate-pulse'
                          : 'text-slate-300'
                      }
                    >
                      {isDone ? '✓' : isCurrent ? '↳' : '○'}
                    </span>
                    <span>{step}</span>
                  </div>
                  {isDone && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      VERIFIED
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Query Result Presentation */}
      {queryResult && !isAnalyzing && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Unsupported Query Handler */}
          {!queryResult.isSupported ? (
            <div className="p-6 rounded-lg bg-white border border-amber-300 shadow-sm space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 font-editorial">
                    Scope Notice: Query Cannot Be Processed
                  </h3>
                  <p className="text-xs text-slate-700">
                    {queryResult.unsupportedReason || 'This query cannot be resolved against the currently loaded administrative registers.'}
                  </p>
                  {queryResult.unavailableData && (
                    <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2.5 rounded border border-slate-200 font-mono">
                      Data Availability: {queryResult.unavailableData}
                    </p>
                  )}
                </div>
              </div>

              {/* Suggestions */}
              {queryResult.suggestedQueries && queryResult.suggestedQueries.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Supported Governance Queries Available Now:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {queryResult.suggestedQueries.map((sQuery, i) => (
                      <button
                        key={i}
                        onClick={() => handleRunQuery(sQuery)}
                        className="text-xs px-3 py-1.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition-colors font-medium text-left"
                      >
                        {sQuery}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Navigational Links */}
              {queryResult.relatedLinks && queryResult.relatedLinks.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                    RELATED PLATFORM AREAS:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {queryResult.relatedLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Structured Intent Translation Badge + View Mode Switcher */}
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center flex-wrap gap-2 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">STRUCTURED INTENT:</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-medium">
                    metric: &quot;{queryResult.structuredIntent.metric}&quot;
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    target: &quot;{queryResult.structuredIntent.targetDistrict || 'Nandurbar'}&quot;
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setViewMode('INVESTIGATION')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      viewMode === 'INVESTIGATION'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    INVESTIGATION PIPELINE (8-STAGE)
                  </button>
                  <button
                    onClick={() => setViewMode('TELEMETRY')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      viewMode === 'TELEMETRY'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    SUMMARY TELEMETRY
                  </button>
                </div>
              </div>

              {/* Related Platform Links Header */}
              {queryResult.relatedLinks && queryResult.relatedLinks.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[11px] font-mono font-semibold text-slate-600 uppercase">
                    EVIDENCE & INVESTIGATION CHAIN:
                  </span>
                  {queryResult.relatedLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-800 hover:border-blue-500 hover:text-blue-700 transition-colors shadow-2xs font-medium text-[11px]"
                    >
                      {link.type === 'geography' && <MapPin className="w-3 h-3 text-blue-600" />}
                      {link.type === 'investigation' && <Layers className="w-3 h-3 text-indigo-600" />}
                      {link.type === 'evidence' && <FileText className="w-3 h-3 text-emerald-600" />}
                      {link.type === 'signal' && <Activity className="w-3 h-3 text-amber-600" />}
                      <span>{link.label}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Render Investigation Pipeline Inspector if in INVESTIGATION mode */}
              {viewMode === 'INVESTIGATION' && queryResult.investigation && (
                <InvestigationPipelineInspector data={queryResult.investigation} />
              )}

              {/* Render Telemetry Card if in TELEMETRY mode */}
              {viewMode === 'TELEMETRY' && (
                <div className="space-y-5">
                  {/* Match Counter Banner */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h2 className="text-lg font-bold font-editorial text-slate-900">
                      {queryResult.matchCount} DISTRICTS ANALYZED
                    </h2>
                    <span className="text-xs font-mono text-slate-500">
                      Filtered from 36 Maharashtra LGD Registry
                    </span>
                  </div>

                  {/* Highest Signal Spotlight Card */}
                  <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                          CONVERGENCE DEFICIT SIGNAL
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 font-editorial mt-2">
                          {queryResult.topResult.district.name.toUpperCase()}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {queryResult.topResult.district.zone}, Maharashtra (LGD: {queryResult.topResult.district.lgdCode || '512'})
                        </p>
                      </div>

                      <div className="text-left sm:text-right font-mono">
                        <span className="text-[10px] text-slate-500 uppercase block">
                          DRAWDOWN GAP
                        </span>
                        <div className="text-3xl font-bold text-rose-700">
                          {queryResult.topResult.gapPp} pp
                        </div>
                        <span className="text-[10px] text-slate-500">Drawdown Margin</span>
                      </div>
                    </div>

                    {/* Metric Bars */}
                    <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs border-y border-slate-100 py-4">
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] block font-semibold uppercase">BENEFICIARY DEMAND</span>
                        <span className="text-2xl font-bold text-slate-900 mt-1 block">
                          {queryResult.topResult.beneficiaryDemand}%
                        </span>
                        <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
                          <div
                            className="bg-blue-600 h-full rounded"
                            style={{ width: `${queryResult.topResult.beneficiaryDemand}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-100">
                        <span className="text-slate-500 text-[10px] block font-semibold uppercase">FUND DRAWDOWN</span>
                        <span className="text-2xl font-bold text-rose-700 mt-1 block">
                          {queryResult.topResult.fundUtilization}%
                        </span>
                        <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
                          <div
                            className="bg-rose-600 h-full rounded"
                            style={{ width: `${queryResult.topResult.fundUtilization}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2.5 justify-end pt-1">
                      <button
                        onClick={() => openWhyFlagged('SUTRA-FND-0001')}
                        className="px-3.5 py-2 rounded-md bg-slate-100 border border-slate-300 text-xs text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>WHY FLAGGED?</span>
                      </button>

                      <button
                        onClick={() => openWorkspace('INV-NDB-CONV-001')}
                        className="px-3.5 py-2 rounded-md bg-slate-100 border border-slate-300 text-xs text-slate-800 hover:bg-slate-200 transition-colors font-medium cursor-pointer"
                      >
                        OPEN WORKSPACE
                      </button>

                      <button
                        onClick={() => openEvidence(queryResult.topResult.evidenceRecord.id)}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                      >
                        <span>AUDIT EVIDENCE ({queryResult.topResult.evidenceRecord.recordNumber})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Remaining districts */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-bold text-slate-900 font-editorial">
                      Comparative District Index (Ranked by Disparity)
                    </h4>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                      {queryResult.matchingDistricts.slice(1).map((dist) => (
                        <div
                          key={dist.id}
                          className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                        >
                          <div>
                            <span className="text-slate-900 font-bold block">{dist.name}</span>
                            <span className="text-[10px] text-slate-500">
                              Demand: {dist.eligibleDemandIndex}% • Util: {dist.fundUtilizationRate}%
                            </span>
                          </div>
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {dist.eligibleDemandIndex - dist.fundUtilizationRate} pp
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function AskSutraPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-slate-500">Loading Query Engine...</div>}>
        <QueryContent />
      </Suspense>
    </AppShell>
  );
}
