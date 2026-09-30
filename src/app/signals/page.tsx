'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { SIGNALS_DATA } from '@/lib/data/governance-data';
import { ImplementationSignal } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function SignalsPage() {
  const { openEvidence, openExplain } = useIntelligence();

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-2 border-b border-[#2A2926] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
          <span>PROACTIVE ANOMALY RADAR</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
          EARLY SIGNALS
        </h1>
        <p className="text-xs text-[#8E887E] max-w-2xl">
          Statistical deviation intelligence monitoring fund drawdown pacing, project milestone velocity, and beneficiary uptake using strictly neutral administrative signals.
        </p>
      </div>

      {/* Primary Signal Spotlight: Scheme A in Nandurbar */}
      <div className="space-y-6">
        {SIGNALS_DATA.map((signal) => (
          <div
            key={signal.id}
            className="p-8 rounded-sm bg-[#141412] border border-[#2A2926] hover:border-[#B78A5A]/50 transition-all space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2926] pb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#191917] border border-[#B78A5A]/40 text-[#B78A5A]">
                    IMPLEMENTATION SIGNAL
                  </span>
                  <span className="text-xs font-mono text-[#8E887E]">{signal.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#F3F0E8] font-editorial mt-2">
                  {signal.schemeName}
                </h2>
                <p className="text-xs text-[#8E887E]">
                  {signal.ministryName} • Focus Territory:{' '}
                  <strong className="text-[#F3F0E8]">{signal.districtName || 'Statewide'}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-[#8E887E] uppercase block">
                  STATISTICAL CONFIDENCE
                </span>
                <div className="text-3xl font-bold text-[#B78A5A]">{signal.confidence}%</div>
                <span className="text-[10px] text-[#5E8B72] block">Verified against PFMS</span>
              </div>
            </div>

            {/* Deviation Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">EXPECTED UTILIZATION</span>
                <span className="text-2xl font-bold text-[#C9C2B7] mt-1 block">
                  {signal.expectedUtilization}%
                </span>
                <span className="text-[10px] text-[#7E7A72]">Benchmark trajectory</span>
              </div>

              <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">CURRENT UTILIZATION</span>
                <span className="text-2xl font-bold text-[#A66A62] mt-1 block">
                  {signal.currentUtilization}%
                </span>
                <span className="text-[10px] text-[#A66A62]">Actual recorded drawdown</span>
              </div>

              <div className="p-4 rounded bg-[#191917] border border-[#2A2926] col-span-2 md:col-span-1">
                <span className="text-[#8E887E] text-[10px] block">DEVIATION</span>
                <span className="text-2xl font-bold text-[#A66A62] mt-1 block">
                  {signal.deviation} pp
                </span>
                <span className="text-[10px] text-[#8E887E]">Pacing shortfall</span>
              </div>
            </div>

            {/* Why Flagged Factors 01-04 */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A] block">
                WHY FLAGGED? ATTRIBUTION BREAKDOWN
              </span>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                {signal.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded bg-[#191917] border border-[#2A2926] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-[#B78A5A] block font-bold">
                        0{idx + 1}
                      </span>
                      <span className="text-[#F3F0E8] font-medium text-xs block mt-0.5">
                        {factor.title}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#F3F0E8]">{factor.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation Note */}
            <p className="text-xs text-[#C9C2B7] leading-relaxed p-3.5 rounded bg-[#191917] border border-[#2A2926]/70">
              {signal.explanation}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2 border-t border-[#2A2926]">
              <button
                onClick={() =>
                  openExplain({
                    title: `${signal.schemeName} (${signal.districtName})`,
                    subtitle: `Deviation: ${signal.deviation} pp from benchmark trajectory`,
                    confidence: signal.confidence,
                    factors: signal.factors.map((f) => ({ title: f.title, weight: f.value })),
                    evidenceRecordNumber: signal.evidenceRecordId,
                  })
                }
                className="px-5 py-2.5 rounded-sm bg-[#191917] border border-[#2A2926] text-xs text-[#F3F0E8] hover:border-[#B78A5A] transition-colors"
              >
                WHY THIS SIGNAL?
              </button>

              <button
                onClick={() => openEvidence(signal.evidenceRecordId)}
                className="px-5 py-2.5 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs hover:bg-[#CBB093] transition-colors flex items-center justify-center space-x-2"
              >
                <span>AUDIT EVIDENCE RECORD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
