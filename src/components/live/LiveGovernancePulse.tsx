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
    <div className="rounded-sm border border-[#2A2926] bg-[#141412] p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Subtle Ambient Pulse Light */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#B78A5A]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2A2926]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-[#5E8B72]/10 border border-[#5E8B72]/20 text-[#5E8B72]">
            <Radio className={`h-5 w-5 ${playbackMode === 'LIVE' ? 'animate-pulse' : ''}`} />
            {playbackMode === 'LIVE' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5E8B72] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5E8B72]" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5E8B72] bg-[#5E8B72]/10 px-2 py-0.5 rounded-sm border border-[#5E8B72]/20 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full bg-[#5E8B72] ${playbackMode === 'LIVE' ? 'animate-pulse' : ''}`} />
                LIVE GOVERNANCE PULSE
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${
                  liveMode === 'VERIFIED_SOURCE'
                    ? 'bg-[#1C1B18] text-[#C9C2B7] border-[#2A2926]'
                    : 'bg-[#B78A5A]/10 text-[#B78A5A] border-[#B78A5A]/30 font-semibold'
                }`}
              >
                {liveMode === 'VERIFIED_SOURCE' ? 'MODE A: STATUTORY VERIFIED' : 'MODE B: LIVE DEMO STREAM'}
              </span>
              {playbackMode === 'REPLAY' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold">
                  REPLAY MODE ({replayIndex + 1}/{events.length})
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#F3F0E8] tracking-tight mt-0.5 font-editorial">
              Continuous Governance Event Stream & Ingestion Telemetry
            </h3>
          </div>
        </div>

        {/* Time Machine & Live Stream Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-[#0D0D0C] border border-[#2A2926] rounded-sm p-0.5">
            <button
              onClick={() => handleTogglePlayback('LIVE')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all flex items-center gap-1 ${
                playbackMode === 'LIVE'
                  ? 'bg-[#5E8B72]/20 text-[#5E8B72] font-bold border border-[#5E8B72]/40 shadow-sm'
                  : 'text-[#8E887E] hover:text-[#C9C2B7]'
              }`}
            >
              <Zap className="h-3 w-3" />
              LIVE
            </button>
            <button
              onClick={() => handleTogglePlayback('PAUSED')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all flex items-center gap-1 ${
                playbackMode === 'PAUSED'
                  ? 'bg-[#B78A5A]/20 text-[#B78A5A] font-bold border border-[#B78A5A]/40 shadow-sm'
                  : 'text-[#8E887E] hover:text-[#C9C2B7]'
              }`}
            >
              <Pause className="h-3 w-3" />
              PAUSE
            </button>
            <button
              onClick={() => handleTogglePlayback('REPLAY')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all flex items-center gap-1 ${
                playbackMode === 'REPLAY'
                  ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 shadow-sm'
                  : 'text-[#8E887E] hover:text-[#C9C2B7]'
              }`}
            >
              <Clock className="h-3 w-3" />
              REPLAY
            </button>
          </div>

          {/* Replay Step Controls (visible when in replay mode) */}
          {playbackMode === 'REPLAY' && (
            <div className="flex items-center gap-1 bg-[#0D0D0C] border border-[#2A2926] rounded-sm p-0.5">
              <button
                onClick={() => handleStepReplay(1)}
                disabled={replayIndex >= events.length - 1}
                title="Previous event in history"
                className="p-1.5 rounded-sm text-[#8E887E] hover:text-[#C9C2B7] disabled:opacity-30"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono text-[#C9C2B7] px-1">
                {replayIndex + 1}/{events.length}
              </span>
              <button
                onClick={() => handleStepReplay(-1)}
                disabled={replayIndex <= 0}
                title="Next event in history"
                className="p-1.5 rounded-sm text-[#8E887E] hover:text-[#C9C2B7] disabled:opacity-30"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => handleTriggerDemo('nandurbar_drawdown')}
            disabled={isProcessingDemo}
            className="px-3.5 py-1.5 rounded-sm bg-[#B78A5A] hover:bg-[#C99A6A] text-[#0D0D0C] font-bold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
          >
            {isProcessingDemo ? (
              <>
                <div className="h-3 w-3 border-2 border-[#0D0D0C] border-t-transparent rounded-full animate-spin" />
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
            className="p-2 rounded-sm bg-[#1C1B18] hover:bg-[#252420] text-[#C9C2B7] hover:text-[#F3F0E8] border border-[#2A2926] transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry Stats Row with Latency Observability */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-sm bg-[#1C1B18] border border-[#2A2926]">
          <div className="text-[10px] font-mono uppercase text-[#8E887E]">Stream Status</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`h-2 w-2 rounded-full ${playbackMode === 'LIVE' ? 'bg-[#5E8B72] animate-pulse' : playbackMode === 'REPLAY' ? 'bg-blue-400' : 'bg-[#B78A5A]'}`} />
            <span className="font-mono text-xs font-bold text-[#5E8B72]">
              {playbackMode}
            </span>
          </div>
          <div className="text-[10px] text-[#8E887E] font-mono mt-0.5">
            {telemetrySummary.eventsPerMinute} events/min telemetry
          </div>
        </div>

        <div className="p-3 rounded-sm bg-[#1C1B18] border border-[#2A2926]">
          <div className="text-[10px] font-mono uppercase text-[#8E887E]">Pipeline Latency</div>
          <div className="font-mono text-sm font-bold text-[#5E8B72] mt-0.5 flex items-center gap-1.5">
            <span>32.7 ms</span>
            <span className="text-[10px] text-[#8E887E] font-normal">total</span>
          </div>
          <div className="text-[10px] text-[#8E887E] font-mono mt-0.5">
            Source → Event: 11.5ms
          </div>
        </div>

        <div className="p-3 rounded-sm bg-[#1C1B18] border border-[#2A2926]">
          <div className="text-[10px] font-mono uppercase text-[#8E887E]">Monitored Districts</div>
          <div className="font-mono text-base font-bold text-[#F3F0E8] mt-0.5">
            36 Districts
          </div>
          <div className="text-[10px] text-[#8E887E] font-mono mt-0.5">100% LGD Match Quality</div>
        </div>

        <div className="p-3 rounded-sm bg-[#1C1B18] border border-[#2A2926]">
          <div className="text-[10px] font-mono uppercase text-[#8E887E]">Active Investigation</div>
          <Link
            href="/investigation/INV-NDB-CONV-001"
            className="font-mono text-xs font-bold text-[#B78A5A] hover:underline mt-0.5 truncate flex items-center gap-1"
          >
            <span>{telemetrySummary.latestInvestigationId}</span>
            <ExternalLink className="h-3 w-3 inline" />
          </Link>
          <div className="text-[10px] text-[#5E8B72] font-mono mt-0.5">93.5% Confidence Score</div>
        </div>
      </div>

      {/* Active Event Banner & Pipeline Stage Progression */}
      {activeEvent && (
        <div className="p-4 md:p-5 rounded-sm border border-[#2A2926] bg-[#171614] shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded-sm border ${
                  activeEvent.severity === 'CRITICAL' || activeEvent.severity === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-[#B78A5A]/10 text-[#B78A5A] border-[#B78A5A]/30'
                }`}
              >
                {activeEvent.severity} EVENT: {activeEvent.eventType.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs text-[#C9C2B7] bg-[#1C1B18] px-2 py-0.5 rounded-sm border border-[#2A2926]">
                {activeEvent.districtName} (LGD: {activeEvent.lgdCode})
              </span>
              <span className="font-mono text-xs text-[#5E8B72] bg-[#5E8B72]/10 px-2 py-0.5 rounded-sm border border-[#5E8B72]/20">
                {activeEvent.schemeId}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#8E887E]">
              <span>Shift:</span>
              <span className="line-through text-[#8E887E]">
                {activeEvent.previousValue} {activeEvent.unit}
              </span>
              <ArrowRight className="h-3 w-3 text-[#8E887E]" />
              <span className="font-bold text-[#F3F0E8]">
                {activeEvent.currentValue} {activeEvent.unit}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-sm font-bold text-[11px] ${
                  activeEvent.delta > 0
                    ? 'bg-[#5E8B72]/15 text-[#5E8B72]'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {activeEvent.delta > 0 ? '+' : ''}
                {activeEvent.deltaPercent}%
              </span>
            </div>
          </div>

          <p className="text-xs text-[#C9C2B7] leading-relaxed font-normal">
            {activeEvent.explanation}
          </p>

          {/* Step-by-Step Pipeline Progress Visualizer */}
          <div className="pt-2 border-t border-[#2A2926]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#8E887E] mb-2">
              <span>Event Processing Pipeline</span>
              <span className="text-[#B78A5A]">Latencies: 4.2ms → 1.8ms → 2.1ms → 3.4ms → 6.9ms → 14.3ms</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {pipelineSteps.map((s, idx) => {
                const isPassed = idx <= activePipelineStep;
                const isCurrent = idx === activePipelineStep;
                return (
                  <div
                    key={s.label}
                    className={`p-2 rounded-sm border text-center transition-all ${
                      isCurrent
                        ? 'bg-[#B78A5A]/15 border-[#B78A5A] text-[#B78A5A] font-bold shadow-sm'
                        : isPassed
                        ? 'bg-[#1C1B18] border-[#2A2926] text-[#C9C2B7]'
                        : 'bg-[#0D0D0C] border-[#2A2926]/50 text-[#8E887E]'
                    }`}
                  >
                    <div className="text-[10px] font-mono">{s.label}</div>
                    <div className="text-[8px] font-mono text-[#8E887E] truncate">{s.desc}</div>
                    <div className="text-[7px] font-mono text-[#8E887E]">{s.latency}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2A2926]">
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
              className="px-3 py-1.5 rounded-sm bg-[#B78A5A]/10 hover:bg-[#B78A5A]/20 text-[#B78A5A] border border-[#B78A5A]/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Why Flagged?
            </button>

            {/* Show on Map */}
            <button
              onClick={() => router.push('/map')}
              className="px-3 py-1.5 rounded-sm bg-[#1C1B18] hover:bg-[#252420] text-[#C9C2B7] border border-[#2A2926] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-[#B78A5A]" />
              Show on Map
            </button>

            {/* Trace Relationship */}
            <button
              onClick={() => router.push('/relationships')}
              className="px-3 py-1.5 rounded-sm bg-[#1C1B18] hover:bg-[#252420] text-[#C9C2B7] border border-[#2A2926] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Network className="h-3.5 w-3.5 text-[#5C7C8A]" />
              Trace Graph
            </button>

            {/* Inspect Investigation */}
            <Link
              href={`/investigation/${activeEvent.investigationId || 'INV-NDB-CONV-001'}`}
              className="px-3 py-1.5 rounded-sm bg-[#5E8B72]/10 hover:bg-[#5E8B72]/20 text-[#5E8B72] border border-[#5E8B72]/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="h-3.5 w-3.5" />
              Open Investigation Workspace
            </Link>

            {/* Executive Brief */}
            <button
              onClick={() => openExecutiveBrief(nandurbarDistrict)}
              className="px-3 py-1.5 rounded-sm bg-[#1C1B18] hover:bg-[#252420] text-[#C9C2B7] border border-[#2A2926] text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-[#B78A5A]" />
              Executive Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

