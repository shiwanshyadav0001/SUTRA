'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
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
    <div className="rounded-sm border border-[#33312D] bg-[#161614] p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Radiant Ambient Light */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C89B65]/10 via-[#6DAA8A]/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2E2C28]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-[#6DAA8A]/15 border border-[#6DAA8A]/30 text-[#6DAA8A]">
            <Radio className={`h-5 w-5 ${playbackMode === 'LIVE' ? 'animate-pulse text-[#7DC09C]' : ''}`} />
            {playbackMode === 'LIVE' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6DAA8A] opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6DAA8A]" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7DC09C] bg-[#6DAA8A]/15 px-2.5 py-0.5 rounded-sm border border-[#6DAA8A]/30 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full bg-[#6DAA8A] ${playbackMode === 'LIVE' ? 'animate-pulse' : ''}`} />
                LIVE GOVERNANCE PULSE
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${
                  liveMode === 'VERIFIED_SOURCE'
                    ? 'bg-[#22221F] text-[#DDD7CD] border-[#383632]'
                    : 'bg-[#C89B65]/15 text-[#DFB88B] border-[#C89B65]/40 font-semibold'
                }`}
              >
                {liveMode === 'VERIFIED_SOURCE' ? 'MODE A: STATUTORY VERIFIED' : 'MODE B: LIVE DEMO STREAM'}
              </span>
              {playbackMode === 'REPLAY' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold">
                  REPLAY MODE ({replayIndex + 1}/{events.length})
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#FAF8F5] tracking-tight mt-0.5 font-editorial">
              Continuous Governance Event Stream & Ingestion Telemetry
            </h3>
          </div>
        </div>

        {/* Time Machine & Live Stream Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-[#10100F] border border-[#33312D] rounded-sm p-0.5">
            <button
              onClick={() => handleTogglePlayback('LIVE')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all flex items-center gap-1 ${
                playbackMode === 'LIVE'
                  ? 'bg-[#6DAA8A]/25 text-[#7DC09C] font-bold border border-[#6DAA8A]/50 shadow-sm'
                  : 'text-[#A39D92] hover:text-[#FAF8F5]'
              }`}
            >
              <Zap className="h-3 w-3" />
              LIVE
            </button>
            <button
              onClick={() => handleTogglePlayback('PAUSED')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all flex items-center gap-1 ${
                playbackMode === 'PAUSED'
                  ? 'bg-[#C89B65]/25 text-[#DFB88B] font-bold border border-[#C89B65]/50 shadow-sm'
                  : 'text-[#A39D92] hover:text-[#FAF8F5]'
              }`}
            >
              <Pause className="h-3 w-3" />
              PAUSE
            </button>
            <button
              onClick={() => handleTogglePlayback('REPLAY')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-sm transition-all flex items-center gap-1 ${
                playbackMode === 'REPLAY'
                  ? 'bg-blue-500/25 text-blue-200 font-bold border border-blue-500/50 shadow-sm'
                  : 'text-[#A39D92] hover:text-[#FAF8F5]'
              }`}
            >
              <Clock className="h-3 w-3" />
              REPLAY
            </button>
          </div>

          {/* Replay Step Controls (visible when in replay mode) */}
          {playbackMode === 'REPLAY' && (
            <div className="flex items-center gap-1 bg-[#10100F] border border-[#33312D] rounded-sm p-0.5">
              <button
                onClick={() => handleStepReplay(1)}
                disabled={replayIndex >= events.length - 1}
                title="Previous event in history"
                className="p-1.5 rounded-sm text-[#A39D92] hover:text-[#FAF8F5] disabled:opacity-30"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono text-[#DDD7CD] px-1">
                {replayIndex + 1}/{events.length}
              </span>
              <button
                onClick={() => handleStepReplay(-1)}
                disabled={replayIndex <= 0}
                title="Next event in history"
                className="p-1.5 rounded-sm text-[#A39D92] hover:text-[#FAF8F5] disabled:opacity-30"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Multi-Scenario Live Simulators */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-[#A39D92] uppercase hidden xl:inline">Simulate:</span>
            <button
              onClick={() => handleTriggerDemo('nandurbar_drawdown')}
              disabled={isProcessingDemo}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEvent?.districtName === 'Nandurbar' && liveMode === 'DEMO_STREAM'
                  ? 'bg-[#C89B65] text-[#0E0E0D] font-bold shadow-md shadow-[#C89B65]/30'
                  : 'bg-[#22211D] hover:bg-[#2C2A25] text-[#DFB88B] border border-[#C89B65]/30'
              }`}
            >
              <Zap className="h-3 w-3" />
              Nandurbar (JJM +11.8%)
            </button>

            <button
              onClick={() => handleTriggerDemo('gadchiroli_pmayg')}
              disabled={isProcessingDemo}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEvent?.districtName === 'Gadchiroli' && liveMode === 'DEMO_STREAM'
                  ? 'bg-[#7DC09C] text-[#0E0E0D] font-bold shadow-md shadow-[#6DAA8A]/30'
                  : 'bg-[#22211D] hover:bg-[#2C2A25] text-[#7DC09C] border border-[#6DAA8A]/30'
              }`}
            >
              <Zap className="h-3 w-3" />
              Gadchiroli (PMAY-G +17.4%)
            </button>

            <button
              onClick={() => handleTriggerDemo('washim_pace')}
              disabled={isProcessingDemo}
              className={`px-3 py-1.5 rounded-sm font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEvent?.districtName === 'Washim' && liveMode === 'DEMO_STREAM'
                  ? 'bg-[#7EB0C7] text-[#0E0E0D] font-bold shadow-md shadow-[#7EB0C7]/30'
                  : 'bg-[#22211D] hover:bg-[#2C2A25] text-[#7EB0C7] border border-[#7EB0C7]/30'
              }`}
            >
              <Zap className="h-3 w-3" />
              Washim (Lag 15.2 pp)
            </button>

            <button
              onClick={resetLiveEvents}
              title="Reset to statutory baseline"
              className="p-1.5 rounded-sm bg-[#1E1E1B] hover:bg-[#2A2925] text-[#DDD7CD] hover:text-white border border-[#33312D] transition-all flex items-center gap-1 text-xs font-mono"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Baseline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Stats Row with Latency Observability */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3.5 rounded-sm bg-[#1A1A18] border border-[#302E2A] hover:border-[#42403A] transition-colors">
          <div className="text-[10px] font-mono uppercase text-[#A39D92] font-semibold tracking-wider">Stream Status</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`h-2.5 w-2.5 rounded-full ${playbackMode === 'LIVE' ? 'bg-[#6DAA8A] animate-pulse' : playbackMode === 'REPLAY' ? 'bg-blue-400' : 'bg-[#C89B65]'}`} />
            <span className="font-mono text-sm font-bold text-[#7DC09C]">
              {playbackMode}
            </span>
          </div>
          <div className="text-[10px] text-[#A39D92] font-mono mt-0.5">
            {telemetrySummary.eventsPerMinute} events/min telemetry
          </div>
        </div>

        <div className="p-3.5 rounded-sm bg-[#1A1A18] border border-[#302E2A] hover:border-[#42403A] transition-colors">
          <div className="text-[10px] font-mono uppercase text-[#A39D92] font-semibold tracking-wider">Pipeline Latency</div>
          <div className="font-mono text-base font-bold text-[#FAF8F5] mt-1 flex items-center gap-1.5">
            <span>32.7 ms</span>
            <span className="text-[10px] text-[#A39D92] font-normal font-sans">total</span>
          </div>
          <div className="text-[10px] text-[#A39D92] font-mono mt-0.5">
            Source → Event: 11.5ms
          </div>
        </div>

        <div className="p-3.5 rounded-sm bg-[#1A1A18] border border-[#302E2A] hover:border-[#42403A] transition-colors">
          <div className="text-[10px] font-mono uppercase text-[#A39D92] font-semibold tracking-wider">Monitored Districts</div>
          <div className="font-mono text-base font-bold text-white mt-1">
            36 Districts
          </div>
          <div className="text-[10px] text-[#7DC09C] font-mono mt-0.5 font-medium">100% LGD Match Quality</div>
        </div>

        <div className="p-3.5 rounded-sm bg-[#1A1A18] border border-[#302E2A] hover:border-[#42403A] transition-colors">
          <div className="text-[10px] font-mono uppercase text-[#A39D92] font-semibold tracking-wider">Active Investigation</div>
          <Link
            href={`/investigation/${activeEvent?.investigationId || telemetrySummary.latestInvestigationId || 'INV-NDB-CONV-001'}`}
            className="font-mono text-xs font-bold text-[#DFB88B] hover:text-[#FAF8F5] hover:underline mt-1 truncate flex items-center gap-1"
          >
            <span>{activeEvent?.investigationId || telemetrySummary.latestInvestigationId}</span>
            <ExternalLink className="h-3 w-3 inline" />
          </Link>
          <div className="text-[10px] text-[#7DC09C] font-mono mt-0.5 font-semibold">93.5% Confidence Score</div>
        </div>
      </div>

      {/* Active Event Banner & Pipeline Stage Progression */}
      {activeEvent && (
        <div className="p-4 md:p-5 rounded-sm border border-[#38352F] bg-[#1A1916] shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-sm border ${
                  activeEvent.severity === 'CRITICAL' || activeEvent.severity === 'HIGH'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                    : 'bg-[#C89B65]/15 text-[#DFB88B] border-[#C89B65]/40'
                }`}
              >
                {activeEvent.severity} EVENT: {activeEvent.eventType.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs text-[#FAF8F5] bg-[#22211D] px-2.5 py-0.5 rounded-sm border border-[#38352F]">
                {activeEvent.districtName} (LGD: {activeEvent.lgdCode})
              </span>
              <span className="font-mono text-xs text-[#7DC09C] bg-[#6DAA8A]/15 px-2.5 py-0.5 rounded-sm border border-[#6DAA8A]/30 font-semibold">
                {activeEvent.schemeId}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#A39D92]">
              <span className="text-[#A39D92]">Shift:</span>
              <span className="line-through text-[#8E887E]">
                {activeEvent.previousValue} {activeEvent.unit}
              </span>
              <ArrowRight className="h-3 w-3 text-[#DFB88B]" />
              <span className="font-bold text-white text-sm">
                {activeEvent.currentValue} {activeEvent.unit}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-sm font-bold text-xs ${
                  activeEvent.delta > 0
                    ? 'bg-[#6DAA8A]/20 text-[#7DC09C]'
                    : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {activeEvent.delta > 0 ? '+' : ''}
                {activeEvent.deltaPercent}%
              </span>
            </div>
          </div>

          <p className="text-sm text-[#DDD7CD] leading-relaxed font-normal">
            {activeEvent.explanation}
          </p>

          {/* Step-by-Step Pipeline Progress Visualizer */}
          <div className="pt-2 border-t border-[#302E2A]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#A39D92] mb-2 font-semibold">
              <span>Event Processing Pipeline</span>
              <span className="text-[#DFB88B]">Latencies: 4.2ms → 1.8ms → 2.1ms → 3.4ms → 6.9ms → 14.3ms</span>
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
                        ? 'bg-[#C89B65]/20 border-[#DFB88B] text-[#DFB88B] font-bold shadow-md shadow-[#C89B65]/10'
                        : isPassed
                        ? 'bg-[#22211D] border-[#38352F] text-[#FAF8F5]'
                        : 'bg-[#141412] border-[#2A2926] text-[#7A756D]'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-medium">{s.label}</div>
                    <div className="text-[8px] font-mono text-[#A39D92] truncate">{s.desc}</div>
                    <div className="text-[7px] font-mono text-[#A39D92]">{s.latency}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#302E2A]">
            {/* Why Flagged */}
            <button
              onClick={() => {
                if (onOpenWhyFlagged) {
                  onOpenWhyFlagged(activeEvent.findingId || 'SUTRA-FND-0001');
                } else {
                  openExplain({
                    title: `Why was ${activeEvent.districtName} flagged for ${activeEvent.schemeId}?`,
                    subtitle: `Deterministic LGD join against verified datasets detected ${activeEvent.deltaPercent}% shift in ${activeEvent.districtName} (LGD: ${activeEvent.lgdCode})`,
                    confidence: 0.94,
                    factors: [
                      { title: `${activeEvent.schemeId} Disbursed Rate Shift (${activeEvent.delta > 0 ? '+' : ''}${activeEvent.deltaPercent}%)`, weight: 0.40 },
                      { title: `${activeEvent.districtName} LGD:${activeEvent.lgdCode} Cluster Delivery Velocity`, weight: 0.35 },
                      { title: 'Cross-Programme Convergence Gap vs State Median', weight: 0.25 },
                    ],
                    evidenceRecordNumber: activeEvent.evidenceIds[0] || '#7201',
                  });
                }
              }}
              className="px-3.5 py-1.5 rounded-sm bg-[#C89B65]/15 hover:bg-[#C89B65]/25 text-[#DFB88B] border border-[#C89B65]/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#DFB88B]" />
              Why Flagged?
            </button>

            {/* Show on Map */}
            <button
              onClick={() => router.push('/map')}
              className="px-3.5 py-1.5 rounded-sm bg-[#22211D] hover:bg-[#2C2A25] text-[#FAF8F5] border border-[#38352F] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-[#DFB88B]" />
              Show on Map
            </button>

            {/* Trace Relationship */}
            <button
              onClick={() => router.push('/relationships')}
              className="px-3.5 py-1.5 rounded-sm bg-[#22211D] hover:bg-[#2C2A25] text-[#FAF8F5] border border-[#38352F] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Network className="h-3.5 w-3.5 text-[#7EB0C7]" />
              Trace Graph
            </button>

            {/* Inspect Investigation */}
            <Link
              href={`/investigation/${activeEvent.investigationId || 'INV-NDB-CONV-001'}`}
              className="px-3.5 py-1.5 rounded-sm bg-[#6DAA8A]/15 hover:bg-[#6DAA8A]/25 text-[#7DC09C] border border-[#6DAA8A]/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="h-3.5 w-3.5" />
              Open Investigation Workspace
            </Link>

            {/* Executive Brief */}
            <button
              onClick={() => {
                const targetDist = MAHARASHTRA_DISTRICTS.find(d => d.name.toLowerCase() === activeEvent.districtName?.toLowerCase()) || nandurbarDistrict;
                openExecutiveBrief(targetDist);
              }}
              className="px-3.5 py-1.5 rounded-sm bg-[#22211D] hover:bg-[#2C2A25] text-[#FAF8F5] border border-[#38352F] text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-[#DFB88B]" />
              Executive Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

