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
    openExplain,
    openExecutiveBrief,
    resetLiveEvents,
    nandurbarDistrict,
  } = useIntelligence();

  const [isProcessingDemo, setIsProcessingDemo] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(5);
  
  // Replay Mode State
  const [playbackMode, setPlaybackMode] = useState<'LIVE' | 'PAUSED' | 'REPLAY'>('LIVE');
  const [replayIndex, setReplayIndex] = useState<number>(0);

  const activeEvent = activeLiveEvent || events[replayIndex] || events[0];

  const handleTriggerDemo = async (scenarioId: string = 'nandurbar_drawdown') => {
    setIsProcessingDemo(true);
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
    <div className="rounded-lg border border-[#D8D6CE] bg-[#FFFFFF] p-5 md:p-6 shadow-sm relative overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EAE8E1]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded bg-[#E3EDE7] border border-[#28704D]/30 text-[#28704D]">
            <Radio className="h-4 w-4 text-[#28704D]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#28704D] bg-[#E3EDE7] px-2.5 py-0.5 rounded border border-[#28704D]/30 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#28704D]" />
                LIVE GOVERNANCE PULSE
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  liveMode === 'VERIFIED_SOURCE'
                    ? 'bg-[#F4F2EC] text-[#66706A] border-[#D8D6CE]'
                    : 'bg-[#F9F4EB] text-[#B58A45] border-[#B58A45]/30 font-semibold'
                }`}
              >
                {liveMode === 'VERIFIED_SOURCE' ? 'MODE A: STATUTORY VERIFIED' : 'MODE B: LIVE DEMO STREAM'}
              </span>
              {playbackMode === 'REPLAY' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F2EC] text-[#164A3A] border border-[#D8D6CE] font-semibold">
                  REPLAY ({replayIndex + 1}/{events.length})
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-[#18201C] tracking-tight mt-0.5 font-editorial">
              Continuous Governance Event Stream & Ingestion Telemetry
            </h3>
          </div>
        </div>

        {/* Time Machine & Live Stream Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-[#F4F2EC] border border-[#D8D6CE] rounded p-0.5">
            <button
              onClick={() => handleTogglePlayback('LIVE')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all flex items-center gap-1 ${
                playbackMode === 'LIVE'
                  ? 'bg-[#FFFFFF] text-[#28704D] font-bold shadow-xs'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              <Zap className="h-3 w-3" />
              LIVE
            </button>
            <button
              onClick={() => handleTogglePlayback('PAUSED')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all flex items-center gap-1 ${
                playbackMode === 'PAUSED'
                  ? 'bg-[#FFFFFF] text-[#B58A45] font-bold shadow-xs'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              <Pause className="h-3 w-3" />
              PAUSE
            </button>
            <button
              onClick={() => handleTogglePlayback('REPLAY')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all flex items-center gap-1 ${
                playbackMode === 'REPLAY'
                  ? 'bg-[#FFFFFF] text-[#164A3A] font-bold shadow-xs'
                  : 'text-[#66706A] hover:text-[#18201C]'
              }`}
            >
              <Clock className="h-3 w-3" />
              REPLAY
            </button>
          </div>

          {/* Replay Step Controls */}
          {playbackMode === 'REPLAY' && (
            <div className="flex items-center gap-1 bg-[#F4F2EC] border border-[#D8D6CE] rounded p-0.5">
              <button
                onClick={() => handleStepReplay(1)}
                disabled={replayIndex >= events.length - 1}
                title="Previous event in history"
                className="p-1 rounded text-[#66706A] hover:text-[#18201C] disabled:opacity-30"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-mono text-[#18201C] px-1 font-bold">
                {replayIndex + 1}/{events.length}
              </span>
              <button
                onClick={() => handleStepReplay(-1)}
                disabled={replayIndex <= 0}
                title="Next event in history"
                className="p-1 rounded text-[#66706A] hover:text-[#18201C] disabled:opacity-30"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Multi-Scenario Live Simulators */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-[#66706A] uppercase hidden xl:inline font-semibold">Simulate:</span>
            <button
              onClick={() => handleTriggerDemo('nandurbar_drawdown')}
              disabled={isProcessingDemo}
              className={`px-2.5 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEvent?.districtName === 'Nandurbar' && liveMode === 'DEMO_STREAM'
                  ? 'bg-[#164A3A] text-white font-bold shadow-xs'
                  : 'bg-[#F4F2EC] hover:bg-[#EAE8E1] text-[#18201C] border border-[#D8D6CE]'
              }`}
            >
              <Zap className="h-3 w-3 text-[#B58A45]" />
              Nandurbar (JJM)
            </button>

            <button
              onClick={() => handleTriggerDemo('gadchiroli_pmayg')}
              disabled={isProcessingDemo}
              className={`px-2.5 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEvent?.districtName === 'Gadchiroli' && liveMode === 'DEMO_STREAM'
                  ? 'bg-[#164A3A] text-white font-bold shadow-xs'
                  : 'bg-[#F4F2EC] hover:bg-[#EAE8E1] text-[#18201C] border border-[#D8D6CE]'
              }`}
            >
              <Zap className="h-3 w-3 text-[#28704D]" />
              Gadchiroli (PMAY-G)
            </button>

            <button
              onClick={() => handleTriggerDemo('washim_pace')}
              disabled={isProcessingDemo}
              className={`px-2.5 py-1 rounded font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                activeEvent?.districtName === 'Washim' && liveMode === 'DEMO_STREAM'
                  ? 'bg-[#164A3A] text-white font-bold shadow-xs'
                  : 'bg-[#F4F2EC] hover:bg-[#EAE8E1] text-[#18201C] border border-[#D8D6CE]'
              }`}
            >
              <Zap className="h-3 w-3 text-[#B56B32]" />
              Washim (Lag)
            </button>

            <button
              onClick={resetLiveEvents}
              title="Reset to statutory baseline"
              className="p-1 rounded bg-[#F4F2EC] hover:bg-[#EAE8E1] text-[#66706A] hover:text-[#18201C] border border-[#D8D6CE] transition-all flex items-center gap-1 text-xs font-mono"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
          <div className="text-[10px] font-mono uppercase text-[#66706A] font-semibold tracking-wider">Stream Status</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`h-2 w-2 rounded-full ${playbackMode === 'LIVE' ? 'bg-[#28704D]' : playbackMode === 'REPLAY' ? 'bg-[#164A3A]' : 'bg-[#B58A45]'}`} />
            <span className="font-mono text-sm font-bold text-[#18201C]">
              {playbackMode}
            </span>
          </div>
          <div className="text-[10px] text-[#66706A] font-mono mt-0.5">
            {telemetrySummary.eventsPerMinute} events/min telemetry
          </div>
        </div>

        <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
          <div className="text-[10px] font-mono uppercase text-[#66706A] font-semibold tracking-wider">Pipeline Latency</div>
          <div className="font-mono text-sm font-bold text-[#18201C] mt-1 flex items-center gap-1.5">
            <span>32.7 ms</span>
            <span className="text-[10px] text-[#66706A] font-normal">total</span>
          </div>
          <div className="text-[10px] text-[#66706A] font-mono mt-0.5">
            Source → Event: 11.5ms
          </div>
        </div>

        <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
          <div className="text-[10px] font-mono uppercase text-[#66706A] font-semibold tracking-wider">Monitored Districts</div>
          <div className="font-mono text-sm font-bold text-[#18201C] mt-1">
            36 Districts
          </div>
          <div className="text-[10px] text-[#28704D] font-mono mt-0.5 font-bold">100% LGD Match Quality</div>
        </div>

        <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
          <div className="text-[10px] font-mono uppercase text-[#66706A] font-semibold tracking-wider">Active Investigation</div>
          <Link
            href={`/investigation/${activeEvent?.investigationId || telemetrySummary.latestInvestigationId || 'INV-NDB-CONV-001'}`}
            className="font-mono text-xs font-bold text-[#164A3A] hover:underline mt-1 truncate flex items-center gap-1"
          >
            <span>{activeEvent?.investigationId || telemetrySummary.latestInvestigationId}</span>
            <ExternalLink className="h-3 w-3 inline" />
          </Link>
          <div className="text-[10px] text-[#28704D] font-mono mt-0.5 font-semibold">93.5% Confidence Score</div>
        </div>
      </div>

      {/* Active Event Banner & Pipeline Stage Progression */}
      {activeEvent && (
        <div className="p-4 rounded border border-[#D8D6CE] bg-[#F4F2EC] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                  activeEvent.severity === 'CRITICAL' || activeEvent.severity === 'HIGH'
                    ? 'bg-[#FBF0F0] text-[#A54848] border-[#A54848]/30'
                    : 'bg-[#F9F4EB] text-[#B58A45] border-[#B58A45]/30'
                }`}
              >
                {activeEvent.severity} EVENT: {activeEvent.eventType.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs text-[#18201C] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#D8D6CE] font-semibold">
                {activeEvent.districtName} (LGD: {activeEvent.lgdCode})
              </span>
              <span className="font-mono text-xs text-[#28704D] bg-[#E3EDE7] px-2 py-0.5 rounded border border-[#28704D]/30 font-bold">
                {activeEvent.schemeId}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#66706A]">
              <span>Shift:</span>
              <span className="line-through text-[#898E89]">
                {activeEvent.previousValue} {activeEvent.unit}
              </span>
              <ArrowRight className="h-3 w-3 text-[#18201C]" />
              <span className="font-bold text-[#18201C] text-sm">
                {activeEvent.currentValue} {activeEvent.unit}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded font-bold text-xs ${
                  activeEvent.delta > 0
                    ? 'bg-[#E3EDE7] text-[#28704D]'
                    : 'bg-[#FBF0F0] text-[#A54848]'
                }`}
              >
                {activeEvent.delta > 0 ? '+' : ''}
                {activeEvent.deltaPercent}%
              </span>
            </div>
          </div>

          <p className="text-xs text-[#18201C] leading-relaxed">
            {activeEvent.explanation}
          </p>

          {/* Step-by-Step Pipeline Progress Visualizer */}
          <div className="pt-2 border-t border-[#D8D6CE]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#66706A] mb-1.5 font-semibold">
              <span>Event Processing Pipeline</span>
              <span className="text-[#164A3A]">Latencies: 4.2ms → 1.8ms → 2.1ms → 3.4ms → 6.9ms → 14.3ms</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {pipelineSteps.map((s, idx) => {
                const isPassed = idx <= activePipelineStep;
                const isCurrent = idx === activePipelineStep;
                return (
                  <div
                    key={s.label}
                    className={`p-1.5 rounded border text-center transition-all ${
                      isCurrent
                        ? 'bg-[#164A3A] border-[#164A3A] text-white font-bold'
                        : isPassed
                        ? 'bg-[#FFFFFF] border-[#D8D6CE] text-[#18201C]'
                        : 'bg-[#EAE8E1] border-[#D8D6CE] text-[#898E89]'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold">{s.label}</div>
                    <div className="text-[8px] font-mono truncate">{s.desc}</div>
                    <div className="text-[7px] font-mono opacity-80">{s.latency}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D8D6CE]">
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
              className="px-3 py-1.5 rounded bg-[#F9F4EB] hover:bg-[#F4ECD8] text-[#B58A45] border border-[#B58A45]/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#B58A45]" />
              Why Flagged?
            </button>

            <button
              onClick={() => router.push('/map')}
              className="px-3 py-1.5 rounded bg-[#FFFFFF] hover:bg-[#EAE8E1] text-[#18201C] border border-[#D8D6CE] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <MapPin className="h-3.5 w-3.5 text-[#164A3A]" />
              Show on Map
            </button>

            <button
              onClick={() => router.push('/relationships')}
              className="px-3 py-1.5 rounded bg-[#FFFFFF] hover:bg-[#EAE8E1] text-[#18201C] border border-[#D8D6CE] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Network className="h-3.5 w-3.5 text-[#66706A]" />
              Trace Graph
            </button>

            <Link
              href={`/investigation/${activeEvent.investigationId || 'INV-NDB-CONV-001'}`}
              className="px-3 py-1.5 rounded bg-[#E3EDE7] hover:bg-[#D5E5DC] text-[#28704D] border border-[#28704D]/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Layers className="h-3.5 w-3.5" />
              Open Investigation Workspace
            </Link>

            <button
              onClick={() => {
                const targetDist = MAHARASHTRA_DISTRICTS.find(d => d.name.toLowerCase() === activeEvent.districtName?.toLowerCase()) || nandurbarDistrict;
                openExecutiveBrief(targetDist);
              }}
              className="px-3 py-1.5 rounded bg-[#FFFFFF] hover:bg-[#EAE8E1] text-[#18201C] border border-[#D8D6CE] text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-[#164A3A]" />
              Executive Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
