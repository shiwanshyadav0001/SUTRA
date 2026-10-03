'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { SIGNALS_DATA } from '@/lib/data/governance-data';
import { GovernanceEvent } from '@/lib/types/events';
import {
  ArrowRight,
  Radio,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export default function SignalsPage() {
  const { openEvidence, openExplain, openWhyFlagged, openWorkspace, activeEvents } = useIntelligence();

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-1.5 border-b border-[#D8D6CE] pb-6 select-none">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
          <span>PROACTIVE ANOMALY RADAR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
          EARLY SIGNALS
        </h1>
        <p className="text-xs text-[#66706A] max-w-2xl leading-relaxed">
          Statistical deviation intelligence monitoring fund drawdown pacing, project milestone velocity, and beneficiary uptake using strictly neutral administrative signals.
        </p>
      </div>

      {/* Live Signals Stream Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-[#FFFFFF] border border-[#D8D6CE] shadow-xs select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#E3EDE7] border border-[#28704D]/30 text-[#28704D]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#18201C] flex items-center gap-2 font-mono">
              REAL-TIME ANOMALY & EVENT RADAR
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#E3EDE7] text-[#28704D] border border-[#28704D]/30 font-bold">
                {activeEvents.length} Active Events
              </span>
            </div>
            <p className="text-[11px] text-[#66706A]">
              Deterministic threshold crossing triggers correlated across Ministry of Jal Shakti, MoRD, and MoA&FW.
            </p>
          </div>
        </div>
      </div>

      {/* Live Stream Event Cards */}
      {activeEvents.length > 0 && (
        <div className="space-y-3.5 select-none">
          <span className="text-[10px] font-mono tracking-[0.14em] text-[#66706A] uppercase font-bold block">
            LIVE DETECTED EVENTS ({activeEvents.length})
          </span>
          {activeEvents.slice(0, 3).map((evt: GovernanceEvent) => (
            <div
              key={evt.id}
              className="p-5 rounded-lg bg-[#FFFFFF] border border-[#D8D6CE] hover:border-[#164A3A] transition-all space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE8E1] pb-3">
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#F9F4EB] text-[#B58A45] border border-[#B58A45]/30 font-bold">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-[#66706A]">{evt.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4F2EC] text-[#18201C] font-semibold border border-[#D8D6CE]">
                      {evt.mode === 'LIVE_SIMULATION' ? 'DEMO STREAM' : 'VERIFIED BASELINE'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#18201C] font-editorial mt-1">
                    {evt.schemeId} • {evt.districtId} (LGD: {evt.lgdCode})
                  </h3>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span className="text-[10px] text-[#66706A] uppercase block font-semibold">DELTA / VARIANCE</span>
                  <div className={`text-2xl font-bold ${evt.deltaPercent > 0 ? 'text-[#28704D]' : 'text-[#A54848]'}`}>
                    {evt.deltaPercent > 0 ? '+' : ''}{evt.deltaPercent.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-[#66706A]">
                    {evt.previousValue} {evt.unit || 'Cr'} → {evt.currentValue} {evt.unit || 'Cr'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="text-[#66706A] text-[11px]">
                  <span>Cross-Correlated Finding: </span>
                  <strong className="text-[#18201C]">{evt.findingId || 'SUTRA-FND-0001'}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openWhyFlagged(evt.findingId || 'SUTRA-FND-0001')}
                    className="px-3 py-1.5 rounded bg-[#F4F2EC] text-[#18201C] hover:bg-[#EAE8E1] border border-[#D8D6CE] text-xs flex items-center gap-1.5 transition-colors font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B58A45]" />
                    <span>WHY FLAGGED?</span>
                  </button>
                  <button
                    onClick={() => openWorkspace('SUTRA-INV-2026-0001')}
                    className="px-3 py-1.5 rounded bg-[#164A3A] text-white hover:bg-[#0D3026] text-xs flex items-center gap-1.5 transition-colors font-semibold"
                  >
                    <span>INVESTIGATE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Primary Signals Spotlight */}
      <div className="space-y-5 select-none">
        {SIGNALS_DATA.map((signal) => (
          <div
            key={signal.id}
            className="p-6 rounded-lg bg-[#FFFFFF] border border-[#D8D6CE] hover:border-[#164A3A] transition-all space-y-5 shadow-xs"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE8E1] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F9F4EB] border border-[#B58A45]/30 text-[#B58A45] font-bold">
                    IMPLEMENTATION SIGNAL
                  </span>
                  <span className="text-xs font-mono text-[#66706A] font-semibold">{signal.id}</span>
                </div>
                <h2 className="text-xl font-bold text-[#18201C] font-editorial mt-1">
                  {signal.schemeName}
                </h2>
                <p className="text-xs text-[#66706A]">
                  {signal.ministryName} • Focus Territory:{' '}
                  <strong className="text-[#18201C]">{signal.districtName || 'Statewide'}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-[#66706A] uppercase block font-semibold">
                  STATISTICAL CONFIDENCE
                </span>
                <div className="text-2xl font-bold text-[#164A3A]">{signal.confidence}%</div>
                <span className="text-[10px] text-[#28704D] block font-bold">Verified against PFMS</span>
              </div>
            </div>

            {/* Deviation Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">EXPECTED UTILIZATION</span>
                <span className="text-xl font-bold text-[#18201C] mt-0.5 block">
                  {signal.expectedUtilization}%
                </span>
                <span className="text-[10px] text-[#66706A]">Benchmark trajectory</span>
              </div>

              <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">CURRENT UTILIZATION</span>
                <span className="text-xl font-bold text-[#A54848] mt-0.5 block">
                  {signal.currentUtilization}%
                </span>
                <span className="text-[10px] text-[#A54848] font-bold">Actual recorded drawdown</span>
              </div>

              <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] col-span-2 md:col-span-1">
                <span className="text-[#66706A] text-[10px] block font-semibold">DEVIATION</span>
                <span className="text-xl font-bold text-[#A54848] mt-0.5 block">
                  {signal.deviation} pp
                </span>
                <span className="text-[10px] text-[#66706A]">Pacing shortfall</span>
              </div>
            </div>

            {/* Why Flagged Factors 01-04 */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#66706A] font-semibold block">
                WHY FLAGGED? ATTRIBUTION BREAKDOWN
              </span>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
                {signal.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-[#164A3A] block font-bold">
                        0{idx + 1}
                      </span>
                      <span className="text-[#18201C] font-semibold text-xs block mt-0.5">
                        {factor.title}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#18201C]">{factor.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation Note */}
            <p className="text-xs text-[#18201C] leading-relaxed p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              {signal.explanation}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2 border-t border-[#EAE8E1]">
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
                className="px-4 py-2 rounded bg-[#FFFFFF] border border-[#D8D6CE] text-xs font-semibold text-[#18201C] hover:bg-[#F4F2EC] transition-colors"
              >
                WHY THIS SIGNAL?
              </button>

              <button
                onClick={() => openEvidence(signal.evidenceRecordId)}
                className="px-4 py-2 rounded bg-[#164A3A] text-white font-semibold text-xs hover:bg-[#0D3026] transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
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
