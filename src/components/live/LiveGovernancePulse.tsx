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
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 p-5 md:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Subtle Ambient Pulse Light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Radio className={`h-5 w-5 ${playbackMode === 'LIVE' ? 'animate-pulse' : ''}`} />
            {playbackMode === 'LIVE' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${playbackMode === 'LIVE' ? 'animate-pulse' : ''}`} />
                LIVE GOVERNANCE PULSE
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  liveMode === 'VERIFIED_SOURCE'
                    ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-semibold'
                }`}
              >
                {liveMode === 'VERIFIED_SOURCE' ? 'MODE A: STATUTORY VERIFIED' : 'MODE B: LIVE DEMO STREAM'}
              </span>
              {playbackMode === 'REPLAY' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold">
                  REPLAY MODE ({replayIndex + 1}/{events.length})
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-zinc-100 tracking-tight mt-0.5">
              Continuous Governance Event Stream & Ingestion Telemetry
            </h3>
          </div>
        </div>

        {/* Time Machine & Live Stream Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
            <button
              onClick={() => handleTogglePlayback('LIVE')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all flex items-center gap-1 ${
                playbackMode === 'LIVE'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Zap className="h-3 w-3" />
              LIVE
            </button>
            <button
              onClick={() => handleTogglePlayback('PAUSED')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all flex items-center gap-1 ${
                playbackMode === 'PAUSED'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Pause className="h-3 w-3" />
              PAUSE
            </button>
            <button
              onClick={() => handleTogglePlayback('REPLAY')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all flex items-center gap-1 ${
                playbackMode === 'REPLAY'
                  ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clock className="h-3 w-3" />
              REPLAY
            </button>
          </div>

          {/* Replay Step Controls (visible when in replay mode) */}
          {playbackMode === 'REPLAY' && (
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
              <button
                onClick={() => handleStepReplay(1)}
                disabled={replayIndex >= events.length - 1}
                title="Previous event in history"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono text-zinc-300 px-1">
                {replayIndex + 1}/{events.length}
              </span>
              <button
                onClick={() => handleStepReplay(-1)}
                disabled={replayIndex <= 0}
                title="Next event in history"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => handleTriggerDemo('nandurbar_drawdown')}
            disabled={isProcessingDemo}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all disabled:opacity-50"
          >
            {isProcessingDemo ? (
              <>
                <div className="h-3 w-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Running Pipeline...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Trigger Nandurbar JJM Event (+11.8%)
              </>
            )}
          </button>

          <button
            onClick={resetLiveEvents}
            title="Reset to statutory baseline"
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry Stats Row with Latency Observability */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Stream Status</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`h-2 w-2 rounded-full ${playbackMode === 'LIVE' ? 'bg-emerald-400 animate-pulse' : playbackMode === 'REPLAY' ? 'bg-blue-400' : 'bg-amber-400'}`} />
            <span className="font-mono text-xs font-bold text-emerald-400">
              {playbackMode}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
            {telemetrySummary.eventsPerMinute} events/min telemetry
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Pipeline Latency</div>
          <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
            <span>32.7 ms</span>
            <span className="text-[10px] text-zinc-400 font-normal">total</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
            Source → Event: 11.5ms
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Monitored Districts</div>
          <div className="font-mono text-base font-bold text-zinc-200 mt-0.5">
            36 Districts
          </div>
          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">100% LGD Match Quality</div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase text-zinc-400">Active Investigation</div>
          <Link
            href="/investigation/INV-NDB-CONV-001"
            className="font-mono text-xs font-bold text-blue-400 hover:text-blue-300 mt-0.5 truncate flex items-center gap-1"
          >
            <span>{telemetrySummary.latestInvestigationId}</span>
            <ExternalLink className="h-3 w-3 inline" />
          </Link>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">93.5% Confidence Score</div>
        </div>
      </div>

      {/* Active Event Banner & Pipeline Stage Progression */}
      {activeEvent && (
        <div className="p-4 md:p-5 rounded-xl border border-zinc-700/80 bg-zinc-900/90 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                  activeEvent.severity === 'CRITICAL' || activeEvent.severity === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}
              >
                {activeEvent.severity} EVENT: {activeEvent.eventType.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                {activeEvent.districtName} (LGD: {activeEvent.lgdCode})
              </span>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {activeEvent.schemeId}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Shift:</span>
              <span className="line-through text-zinc-400">
                {activeEvent.previousValue} {activeEvent.unit}
              </span>
              <ArrowRight className="h-3 w-3 text-zinc-400" />
              <span className="font-bold text-emerald-400">
                {activeEvent.currentValue} {activeEvent.unit}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded font-bold text-[11px] ${
                  activeEvent.delta > 0
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {activeEvent.delta > 0 ? '+' : ''}
                {activeEvent.deltaPercent}%
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-200 leading-relaxed font-medium">
            {activeEvent.explanation}
          </p>

          {/* Step-by-Step Pipeline Progress Visualizer */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
              <span>Event Processing Pipeline</span>
              <span className="text-emerald-400">Latencies: 4.2ms → 1.8ms → 2.1ms → 3.4ms → 6.9ms → 14.3ms</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {pipelineSteps.map((s, idx) => {
                const isPassed = idx <= activePipelineStep;
                const isCurrent = idx === activePipelineStep;
                return (
                  <div
                    key={s.label}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-sm'
                        : isPassed
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200'
                        : 'bg-zinc-950/40 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono">{s.label}</div>
                    <div className="text-[8px] font-mono text-zinc-400 truncate">{s.desc}</div>
                    <div className="text-[7px] font-mono text-emerald-400/80">{s.latency}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800">
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
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Why Flagged?
            </button>

            {/* Show on Map */}
            <button
              onClick={() => router.push('/map')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              Show on Map
            </button>

            {/* Trace Relationship */}
            <button
              onClick={() => router.push('/relationships')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Network className="h-3.5 w-3.5 text-blue-400" />
              Trace Graph
            </button>

            {/* Inspect Investigation */}
            <Link
              href={`/investigation/${activeEvent.investigationId || 'INV-NDB-CONV-001'}`}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="h-3.5 w-3.5" />
              Open Investigation Workspace
            </Link>

            {/* Executive Brief */}
            <button
              onClick={() => openExecutiveBrief(nandurbarDistrict)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-emerald-400" />
              Executive Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

