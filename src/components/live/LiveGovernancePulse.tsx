'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import {
  Radio,
  Sparkles,
  ArrowRight,
  Layers,
  MapPin,
  Network,
  FileText,
  RotateCcw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ExternalLink,
  Clock,
  Zap,
} from 'lucide-react';

interface LiveGovernancePulseProps {
  compact?: boolean;
  onOpenWhyFlagged?: (findingId: string) => void;
}

export function LiveGovernancePulse({ compact = false, onOpenWhyFlagged }: LiveGovernancePulseProps) {
  const router = useRouter();
  const {
    events,
    activeLiveEvent,
    setActiveLiveEvent,
    liveMode,
    isLiveStreaming,
    setIsLiveStreaming,
    triggerScenario,
    telemetrySummary,
    openEvidence,
    openExplain,
    openExecutiveBrief,
    resetLiveEvents,
    nandurbarDistrict,
  } = useIntelligence();

  const [isProcessingDemo, setIsProcessingDemo] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(5); // 0 to 5
  
  // Replay Mode State
  const [playbackMode, setPlaybackMode] = useState<'LIVE' | 'PAUSED' | 'REPLAY'>('LIVE');
  const [replayIndex, setReplayIndex] = useState<number>(0);

  const activeEvent = activeLiveEvent || events[replayIndex] || events[0];

  const handleTriggerDemo = async (scenarioId: string = 'nandurbar_drawdown') => {
    setIsProcessingDemo(true);
    // Animate through pipeline steps visibly
    for (let step = 0; step <= 5; step++) {
      setActivePipelineStep(step);
      await new Promise((r) => setTimeout(r, 100));
    }
    const triggered = await triggerScenario(scenarioId);
    setIsProcessingDemo(false);
    if (triggered) {
      setActiveLiveEvent(triggered);
    }
  };

  const handleTogglePlayback = (mode: 'LIVE' | 'PAUSED' | 'REPLAY') => {
    setPlaybackMode(mode);
    if (mode === 'PAUSED') {
      setIsLiveStreaming(false);
    } else if (mode === 'LIVE') {
      setIsLiveStreaming(true);
      if (events.length > 0) {
        setActiveLiveEvent(events[0]);
      }
    } else if (mode === 'REPLAY') {
      setIsLiveStreaming(false);
      setReplayIndex(0);
      if (events.length > 0) {
        setActiveLiveEvent(events[0]);
      }
    }
  };

  const handleStepReplay = (delta: number) => {
    const nextIdx = Math.max(0, Math.min(events.length - 1, replayIndex + delta));
    setReplayIndex(nextIdx);
    setActiveLiveEvent(events[nextIdx]);
  };

  const pipelineSteps = [
    { label: 'INGEST', desc: 'Raw MIS', latency: '4.2ms' },
    { label: 'NORMALIZE', desc: 'Schema v1', latency: '1.8ms' },
    { label: 'RESOLVE', desc: 'LGD Code', latency: '2.1ms' },
    { label: 'COMPARE', desc: 'Delta Calc', latency: '3.4ms' },
    { label: 'CORRELATE', desc: 'Cross-Prog', latency: '6.9ms' },
    { label: 'INVESTIGATE', desc: 'SUTRA-FND', latency: '14.3ms' },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6 shadow-sm relative overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Radio className={`h-5 w-5 ${playbackMode === 'LIVE' ? 'animate-pulse' : ''}`} />
            {playbackMode === 'LIVE' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full bg-emerald-600 ${playbackMode === 'LIVE' ? 'animate-pulse' : ''}`} />
                LIVE GOVERNANCE PULSE
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  liveMode === 'VERIFIED_SOURCE'
                    ? 'bg-slate-100 text-slate-700 border-slate-300 font-medium'
                    : 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                }`}
              >
                {liveMode === 'VERIFIED_SOURCE' ? 'VERIFIED DATA • OFFICIAL CADENCE' : 'LIVE SIMULATION • SYNTHETIC STREAM'}
              </span>
              {playbackMode === 'REPLAY' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  REPLAY MODE ({replayIndex + 1}/{events.length})
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5 font-editorial">
              Continuous Governance Event Stream & Ingestion Telemetry
            </h3>
          </div>
        </div>

        {/* Time Machine & Live Stream Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => handleTogglePlayback('LIVE')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                playbackMode === 'LIVE'
                  ? 'bg-white text-emerald-700 font-bold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="h-3 w-3 text-emerald-600" />
              LIVE
            </button>
            <button
              onClick={() => handleTogglePlayback('PAUSED')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                playbackMode === 'PAUSED'
                  ? 'bg-white text-amber-700 font-bold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pause className="h-3 w-3 text-amber-600" />
              PAUSE
            </button>
            <button
              onClick={() => handleTogglePlayback('REPLAY')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                playbackMode === 'REPLAY'
                  ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="h-3 w-3 text-blue-600" />
              REPLAY
            </button>
          </div>

          {/* Replay Step Controls (visible when in replay mode) */}
          {playbackMode === 'REPLAY' && (
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => handleStepReplay(1)}
                disabled={replayIndex >= events.length - 1}
                title="Previous event in history"
                className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-700 px-1 font-semibold">
                {replayIndex + 1}/{events.length}
              </span>
              <button
                onClick={() => handleStepReplay(-1)}
                disabled={replayIndex <= 0}
                title="Next event in history"
                className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => handleTriggerDemo('nandurbar_drawdown')}
            disabled={isProcessingDemo}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isProcessingDemo ? (
              <>
                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Pipeline...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Trigger Nandurbar Event (+11.8%)
              </>
            )}
          </button>

          <button
            onClick={resetLiveEvents}
            title="Reset to statutory baseline"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry Stats Row with Latency Observability */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Stream Status</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`h-2 w-2 rounded-full ${playbackMode === 'LIVE' ? 'bg-emerald-600 animate-pulse' : playbackMode === 'REPLAY' ? 'bg-blue-600' : 'bg-amber-600'}`} />
            <span className="font-mono text-xs font-bold text-slate-900">
              {playbackMode}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {telemetrySummary.eventsPerMinute} events/min telemetry
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Pipeline Latency</div>
          <div className="font-mono text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
            <span>32.7 ms</span>
            <span className="text-[10px] text-slate-400 font-normal">total</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Source → Event: 11.5ms
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Monitored Districts</div>
          <div className="font-mono text-base font-bold text-slate-900 mt-0.5">
            36 Districts
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">100% LGD Match Quality</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Active Investigation</div>
          <Link
            href="/investigation/INV-NDB-CONV-001"
            className="font-mono text-xs font-bold text-blue-700 hover:underline mt-0.5 truncate flex items-center gap-1"
          >
            <span>{telemetrySummary.latestInvestigationId}</span>
            <ExternalLink className="h-3 w-3 inline" />
          </Link>
          <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-medium">EVIDENCE TRACEABLE • RULE VERIFIED</div>
        </div>
      </div>

      {/* Active Event Banner & Pipeline Stage Progression */}
      {activeEvent && (
        <div className="p-4 md:p-5 rounded-lg border border-slate-200 bg-slate-50 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                  activeEvent.severity === 'CRITICAL' || activeEvent.severity === 'HIGH'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {activeEvent.severity} EVENT: {activeEvent.eventType.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                {activeEvent.districtName} (LGD: {activeEvent.lgdCode})
              </span>
              <span className="font-mono text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                {activeEvent.schemeId}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <span>Shift:</span>
              <span className="line-through text-slate-400">
                {activeEvent.previousValue} {activeEvent.unit}
              </span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="font-bold text-slate-900">
                {activeEvent.currentValue} {activeEvent.unit}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded font-bold text-[11px] ${
                  activeEvent.delta > 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {activeEvent.delta > 0 ? '+' : ''}
                {activeEvent.deltaPercent}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {activeEvent.explanation}
          </p>

          {/* Step-by-Step Pipeline Progress Visualizer */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
              <span className="font-semibold">Event Processing Pipeline</span>
              <span className="text-emerald-700 font-medium">Latencies: 4.2ms → 1.8ms → 2.1ms → 3.4ms → 6.9ms → 14.3ms</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {pipelineSteps.map((s, idx) => {
                const isPassed = idx <= activePipelineStep;
                const isCurrent = idx === activePipelineStep;
                return (
                  <div
                    key={s.label}
                    className={`p-2 rounded-md border text-center transition-all ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-2xs'
                        : isPassed
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-slate-100/60 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono">{s.label}</div>
                    <div className="text-[8px] font-mono text-slate-500 truncate">{s.desc}</div>
                    <div className="text-[7px] font-mono text-emerald-700">{s.latency}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
            {/* Why Flagged */}
            <button
              onClick={() => {
                if (onOpenWhyFlagged) {
                  onOpenWhyFlagged(activeEvent.findingId || 'SUTRA-FND-0001');
                } else {
                  openExplain({
                    title: `Why was ${activeEvent.districtName} flagged for ${activeEvent.schemeId}?`,
                    subtitle: `Deterministic LGD join against verified datasets detected ${activeEvent.deltaPercent}% shift`,
                    confidence: 0.94,
                    factors: [
                      { title: 'JJM IMIS Telemetry Drawdown Rate', weight: 0.35 },
                      { title: 'PMAY-G Housing Completion Physical Progress', weight: 0.35 },
                      { title: 'Cross-Programme Pace Divergence (18.4 pp)', weight: 0.30 },
                    ],
                    evidenceRecordNumber: activeEvent.evidenceIds[0] || '#7201',
                  });
                }
              }}
              className="px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Why Flagged?
            </button>

            {/* Show on Map */}
            <button
              onClick={() => router.push(`/map?district=${activeEvent.districtId || 'nandurbar'}`)}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              Show on Map
            </button>

            {/* Trace Relationship */}
            <button
              onClick={() => router.push('/relationships')}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Network className="h-3.5 w-3.5 text-indigo-600" />
              Trace Graph
            </button>

            {/* Inspect Investigation */}
            <Link
              href={`/investigation/${activeEvent.investigationId || 'INV-NDB-CONV-001'}`}
              className="px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              Open Investigation Workspace
            </Link>

            {/* Executive Brief */}
            <button
              onClick={() => openExecutiveBrief(nandurbarDistrict)}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-600" />
              Executive Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
