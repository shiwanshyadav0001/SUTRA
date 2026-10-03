'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { SIGNALS_DATA } from '@/lib/data/governance-data';
import { GovernanceEvent } from '@/lib/types/events';
import {
  ArrowRight,
  Radio,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Layers,
  Check,
  Send,
  Filter,
} from 'lucide-react';

type FilterTab = 'ALL' | 'CRITICAL_HIGH' | 'MEDIUM' | 'LIVE_EVENTS' | 'ACKNOWLEDGED';

export default function SignalsPage() {
  const router = useRouter();
  const {
    openEvidence,
    openExplain,
    openWhyFlagged,
    openWorkspace,
    activeEvents,
    signalStatuses,
    updateSignalStatus,
  } = useIntelligence();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const filteredSignals = SIGNALS_DATA.filter((sig) => {
    const status = signalStatuses[sig.id] || 'DETECTED';
    if (activeTab === 'CRITICAL_HIGH') {
      return sig.deviation > 10;
    }
    if (activeTab === 'MEDIUM') {
      return sig.deviation <= 10;
    }
    if (activeTab === 'ACKNOWLEDGED') {
      return status === 'ACKNOWLEDGED' || status === 'ESCALATED_PMO' || status === 'RESOLVED';
    }
    return true;
  });

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>PROACTIVE ANOMALY RADAR • STATUTORY THRESHOLD MONITOR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
          EARLY SIGNALS
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Statistical deviation intelligence monitoring fund drawdown pacing, project milestone velocity, and beneficiary uptake using strictly neutral administrative signals.
        </p>
      </div>

      {/* Filter Tabs & Telemetry Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ALL SIGNALS ({SIGNALS_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('CRITICAL_HIGH')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'CRITICAL_HIGH'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            HIGH SEVERITY ({SIGNALS_DATA.filter((s) => s.deviation > 10).length})
          </button>
          <button
            onClick={() => setActiveTab('MEDIUM')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'MEDIUM'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            MEDIUM ({SIGNALS_DATA.filter((s) => s.deviation <= 10).length})
          </button>
          <button
            onClick={() => setActiveTab('LIVE_EVENTS')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'LIVE_EVENTS'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            LIVE STREAM ({activeEvents.length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Realtime Ingestion: 24.3 events/min</span>
        </div>
      </div>

      {/* Live Stream Event Cards */}
      {(activeTab === 'ALL' || activeTab === 'LIVE_EVENTS') && activeEvents.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-[11px] font-mono tracking-wider text-emerald-800 font-bold uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              LIVE DETECTED STREAM EVENTS ({activeEvents.length})
            </span>
            <span className="text-xs font-mono text-slate-500">Continuous telemetry</span>
          </div>

          {activeEvents.slice(0, 2).map((evt: GovernanceEvent) => (
            <div
              key={evt.id}
              className="p-5 rounded-lg bg-white border border-emerald-300 hover:border-emerald-500 transition-all space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{evt.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {evt.mode === 'LIVE_SIMULATION' ? 'DEMO STREAM' : 'VERIFIED BASELINE'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-editorial mt-1">
                    {evt.schemeId} • {evt.districtId.toUpperCase()} (LGD: {evt.lgdCode})
                  </h3>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">DELTA / VARIANCE</span>
                  <div className={`text-2xl font-bold ${evt.deltaPercent > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {evt.deltaPercent > 0 ? '+' : ''}{evt.deltaPercent.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {evt.previousValue} {evt.unit || 'Cr'} → {evt.currentValue} {evt.unit || 'Cr'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="text-slate-600 text-[11px]">
                  <span>Cross-Correlated Finding: </span>
                  <strong className="text-slate-900 font-bold">{evt.findingId || 'SUTRA-FND-0001'}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openWhyFlagged(evt.findingId || 'SUTRA-FND-0001')}
                    className="px-3 py-1.5 rounded-md bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 text-xs flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>WHY FLAGGED?</span>
                  </button>
                  <button
                    onClick={() => openWorkspace('SUTRA-INV-2026-0001')}
                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs flex items-center gap-1.5 transition-colors font-semibold shadow-2xs cursor-pointer"
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

      {/* Primary Signals List */}
      {activeTab !== 'LIVE_EVENTS' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-[11px] font-mono tracking-wider text-slate-700 font-bold uppercase">
              STATUTORY IMPLEMENTATION SIGNALS ({filteredSignals.length})
            </span>
            <span className="text-xs font-mono text-slate-500">Verified against PFMS & MIS</span>
          </div>

          {filteredSignals.map((signal) => {
            const currentStatus = signalStatuses[signal.id] || 'DETECTED';
            const isHighDeviation = signal.deviation > 10;

            return (
              <div
                key={signal.id}
                className={`p-6 rounded-lg transition-all space-y-5 shadow-sm border ${
                  isHighDeviation
                    ? 'surface-amber-alert border-amber-300 ring-1 ring-amber-400/20'
                    : 'surface-neutral-analytical border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                        isHighDeviation
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}>
                        {isHighDeviation ? 'CRITICAL SEVERITY ANOMALY' : 'IMPLEMENTATION SIGNAL'}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">{signal.id}</span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          currentStatus === 'ESCALATED_PMO'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : currentStatus === 'ACKNOWLEDGED'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : currentStatus === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-200 text-slate-800 border border-slate-300'
                        }`}
                      >
                        STATUS: {currentStatus}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 font-editorial mt-1.5">
                      {signal.schemeName}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {signal.ministryName} • Territory:{' '}
                      <strong className="text-slate-900 font-semibold">{signal.districtName || 'Maharashtra Statewide'}</strong>
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      EVIDENCE CONFIDENCE
                    </span>
                    <div className="text-3xl font-bold text-blue-700">{signal.confidence}%</div>
                    <span className="text-[10px] text-emerald-700 block font-semibold">Triangulated against PFMS</span>
                  </div>
                </div>

                {/* Deviation Metrics Bar with Temporal Trend Trajectory */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 text-[10px] block font-semibold uppercase">EXPECTED UTILIZATION</span>
                    <span className="text-2xl font-bold text-slate-800 mt-1 block">
                      {signal.expectedUtilization}%
                    </span>
                    <span className="text-[10px] text-slate-500">Benchmark trajectory</span>
                  </div>

                  <div className="p-3.5 rounded-md bg-rose-50/80 border border-rose-200 shadow-2xs">
                    <span className="text-slate-500 text-[10px] block font-semibold uppercase">CURRENT UTILIZATION</span>
                    <span className="text-2xl font-bold text-rose-700 mt-1 block">
                      {signal.currentUtilization}%
                    </span>
                    <span className="text-[10px] text-rose-700 font-medium">Recorded drawdown</span>
                  </div>

                  <div className="p-3.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 text-[10px] block font-semibold uppercase">DEFICIT SPREAD</span>
                    <span className="text-2xl font-bold text-rose-700 mt-1 block">
                      {signal.deviation} pp
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Pacing shortfall</span>
                  </div>

                  {/* Temporal Trendline Mini Visualizer */}
                  <div className="p-3.5 rounded-md bg-slate-900 text-white border border-slate-800 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>QUARTERLY PACING</span>
                      <span className="text-amber-400 font-bold">LAGGING</span>
                    </div>
                    {/* SVG Trendline Sparkline */}
                    <div className="h-6 w-full my-1">
                      <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                        {/* Target line */}
                        <line x1="0" y1="6" x2="100" y2="6" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
                        {/* Actual trendline downward divergence */}
                        <path d="M 0 10 Q 30 12 60 16 T 100 22" fill="none" stroke="#F43F5E" strokeWidth="2" />
                        <circle cx="100" cy="22" r="2.5" fill="#F43F5E" />
                      </svg>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>Q1: 18%</span>
                      <span>Q2: 24%</span>
                      <span className="text-rose-400 font-bold">Q3: {signal.currentUtilization}%</span>
                    </div>
                  </div>
                </div>

                {/* Why Flagged Factors 01-04 */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
                    WHY FLAGGED? ATTRIBUTION BREAKDOWN
                  </span>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
                    {signal.factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-md bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                      >
                        <div>
                          <span className="text-[10px] text-blue-700 block font-bold">
                            0{idx + 1}
                          </span>
                          <span className="text-slate-800 font-medium text-xs block mt-0.5">
                            {factor.title}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{factor.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation Note */}
                <p className="text-xs text-slate-700 leading-relaxed p-3.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                  {signal.explanation}
                </p>

                {/* Operational Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200">
                  {/* Status Management */}
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-slate-500 text-[11px] font-medium mr-1">ACTION:</span>
                    <button
                      onClick={() => updateSignalStatus(signal.id, 'ACKNOWLEDGED')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'ACKNOWLEDGED'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Check className="w-3 h-3 text-amber-600" />
                      <span>Acknowledge</span>
                    </button>

                    <button
                      onClick={() => updateSignalStatus(signal.id, 'ESCALATED_PMO')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'ESCALATED_PMO'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300 font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Send className="w-3 h-3 text-rose-600" />
                      <span>Escalate PMO</span>
                    </button>

                    <button
                      onClick={() => updateSignalStatus(signal.id, 'RESOLVED')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Resolve</span>
                    </button>
                  </div>

                  {/* Navigation and Investigation Links */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openWhyFlagged(signal.id)}
                      className="px-3.5 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>WHY FLAGGED?</span>
                    </button>

                    <Link
                      href="/investigation/SUTRA-INV-2026-0001"
                      className="px-3.5 py-1.5 rounded-md bg-white border border-slate-300 text-xs text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 font-medium cursor-pointer shadow-2xs"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>INVESTIGATE</span>
                    </Link>

                    <button
                      onClick={() => openEvidence(signal.evidenceRecordId)}
                      className="px-4 py-1.5 rounded-md bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>AUDIT EVIDENCE RECORD</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
