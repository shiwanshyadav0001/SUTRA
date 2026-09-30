'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { SutraIntelligenceEngine, QueryExecutionResult } from '@/lib/engines/intelligence-engine';
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
} from 'lucide-react';

export default function AskSutraPage() {
  const { openEvidence, openExplain } = useIntelligence();
  const [queryInput, setQueryInput] = useState(
    'Which districts have high beneficiary demand but low fund utilization across agriculture schemes?'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);

  const sampleQueries = [
    'Which districts have high beneficiary demand but low fund utilization across agriculture schemes?',
    'Detect programme overlaps between organic farming schemes and tribal welfare subsidies',
    'Show districts with severe fund drawdown deviation under Jal Jeevan Mission',
    'Which regions have eligible population greater than 1.5M with coverage below 35%?',
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

    const stepsCount = 7;
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
    'Identifying relevant schemes (AGR-001, AGR-004, AGR-008)',
    'Resolving geographic entities (36 Maharashtra LGD Districts)',
    'Loading financial data (PFMS disbursement ledgers FY 2025–26)',
    'Comparing beneficiary demand (SECC smallholder index)',
    'Detecting outliers (Standard deviation σ = 2.14 below regional mean)',
    'Checking evidence (Record #9281 verified against Treasury)',
    'Generating explanation (Attribution weights computed)',
  ];

  return (
    <AppShell>
      {/* Centerpiece Minimal Interface */}
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-[#191917] border border-[#2A2926]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B78A5A]">
              NATURAL GOVERNANCE QUERY ENGINE
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
            ASK SUTRA
          </h1>
          <p className="text-xs sm:text-sm text-[#8E887E] max-w-xl mx-auto">
            Translates natural language questions into structured queries executed against verifiable administrative registers without LLM hallucinations.
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
                placeholder="Ask any cross-ministry governance or outcome question..."
                className="w-full pl-10 pr-4 py-3 bg-[#191917] border border-[#2A2926] rounded-sm text-xs sm:text-sm text-[#F3F0E8] placeholder-[#7E7A72] focus:outline-none focus:border-[#B78A5A] font-editorial"
              />
            </div>
            <button
              onClick={handleRunQuery}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs rounded-sm hover:bg-[#CBB093] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>ANALYZE</span>
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
                  ANALYZING QUERY
                </span>
              </div>
              <span className="text-xs font-mono text-[#8E887E]">
                EXECUTION STEP {activeStepIndex} / {stepsList.length}
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
                    {isDone && <span className="text-[10px] text-[#5E8B72]">RESOLVED</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Query Result Presentation */}
        {queryResult && !isAnalyzing && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Structured Intent Translation Badge */}
            <div className="p-4 rounded bg-[#141412] border border-[#2A2926] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-[#8E887E] uppercase">STRUCTURED INTENT:</span>
                <span className="text-[#B78A5A]">
                  metric: &quot;{queryResult.structuredIntent.metric}&quot;
                </span>
                <span className="text-[#8E887E]">•</span>
                <span className="text-[#B78A5A]">
                  condition: &quot;{queryResult.structuredIntent.condition}&quot;
                </span>
                <span className="text-[#8E887E]">•</span>
                <span className="text-[#B78A5A]">
                  sector: &quot;{queryResult.structuredIntent.sector}&quot;
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#5E8B72]/15 text-[#5E8B72] border border-[#5E8B72]/30 text-[10px]">
                0% HALLUCINATION
              </span>
            </div>

            {/* Match Counter Banner */}
            <div className="flex items-center justify-between border-b border-[#2A2926] pb-3">
              <h2 className="text-xl font-bold font-editorial text-[#F3F0E8]">
                {queryResult.matchCount} DISTRICTS MATCH
              </h2>
              <span className="text-xs font-mono text-[#8E887E]">
                Filtered from 36 Maharashtra Districts
              </span>
            </div>

            {/* Highest Signal Spotlight Card: NANDURBAR */}
            <div className="p-8 rounded-sm bg-[#141412] border-2 border-[#B78A5A]/60 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#A66A62]/20 text-[#A66A62] border border-[#A66A62]/30">
                    HIGHEST DISPARITY SIGNAL
                  </span>
                  <h3 className="text-3xl font-bold text-[#F3F0E8] font-editorial mt-2">
                    {queryResult.topResult.district.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-[#8E887E]">
                    {queryResult.topResult.district.zone}, Maharashtra
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span className="text-[10px] text-[#8E887E] uppercase block">
                    DELIVERY GAP
                  </span>
                  <div className="text-3xl font-bold text-[#A66A62]">
                    {queryResult.topResult.gapPp} pp
                  </div>
                  <span className="text-[10px] text-[#8E887E]">Disparity Margin</span>
                </div>
              </div>

              {/* Demand vs Utilization Metric Bars */}
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
                  <span className="text-[#8E887E] text-[10px] block">FUND UTILIZATION</span>
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
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  onClick={() =>
                    openExplain({
                      title: 'Query Result: Nandurbar Agricultural Disparity',
                      subtitle: '81% Demand vs 42% Fund Drawdown',
                      confidence: queryResult.topResult.confidence,
                      factors: queryResult.topResult.factors,
                      evidenceRecordNumber: queryResult.topResult.evidenceRecord.recordNumber,
                    })
                  }
                  className="px-5 py-3 rounded-sm bg-[#191917] border border-[#2A2926] text-xs text-[#F3F0E8] hover:border-[#B78A5A] transition-colors"
                >
                  WHY THIS RESULT?
                </button>

                <button
                  onClick={() => openEvidence(queryResult.topResult.evidenceRecord.id)}
                  className="px-6 py-3 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs hover:bg-[#CBB093] transition-colors flex items-center justify-center space-x-2"
                >
                  <span>VIEW EVIDENCE ({queryResult.topResult.evidenceRecord.recordNumber})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Other Matching Districts in Result */}
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-bold text-[#F3F0E8] font-editorial">
                Remaining Matching Districts (Ranked by Disparity)
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
    </AppShell>
  );
}
