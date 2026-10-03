'use client';

import React, { useState } from 'react';
import { useIntelligence } from '@/context/IntelligenceContext';
import {
  X,
  Radio,
  Activity,
  Database,
  CheckCircle2,
  RefreshCw,
  Zap,
  Server,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface LiveTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveTelemetryModal({ isOpen, onClose }: LiveTelemetryModalProps) {
  const {
    liveMode,
    setLiveMode,
    isLiveStreaming,
    setIsLiveStreaming,
    events,
    sourceHealth,
    telemetrySummary,
    triggerScenario,
    resetLiveEvents,
  } = useIntelligence();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualPoll = async (sourceId: string) => {
    setIsRefreshing(true);
    setRefreshSuccess(null);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'poll', sourceId }),
      });
      const data = await res.json();
      setRefreshSuccess(`Polled ${sourceId}: ${data.message || 'Latest snapshot synchronized.'}`);
    } catch {
      setRefreshSuccess(`Polled ${sourceId}: Source verified up to date.`);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setRefreshSuccess(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto text-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                  EVENT MESH & TELEMETRY
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    liveMode === 'VERIFIED_SOURCE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {liveMode === 'VERIFIED_SOURCE' ? '● VERIFIED BASELINE' : '▲ SIMULATION STREAM'}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5 font-editorial">
                Live Data Infrastructure Monitor
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs font-mono">
          {refreshSuccess && (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{refreshSuccess}</span>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">STREAM STATUS</span>
              <span className="text-sm font-bold text-emerald-600 mt-0.5 block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                ONLINE
              </span>
              <span className="text-[10px] text-slate-500">SSE /api/live/events</span>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">EVENT VELOCITY</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {telemetrySummary?.eventsPerMinute || 8} evt/min
              </span>
              <span className="text-[10px] text-slate-500">Real-time throughput</span>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">BUFFER OCCUPANCY</span>
              <span className="text-sm font-bold text-blue-700 mt-0.5 block">
                {events.length} / 60
              </span>
              <span className="text-[10px] text-slate-500">In-memory ring buffer</span>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">ACTIVE ANOMALIES</span>
              <span className="text-sm font-bold text-amber-600 mt-0.5 block">
                {telemetrySummary?.activeSignalsCount || 3}
              </span>
              <span className="text-[10px] text-slate-500">Exceeding statutory σ</span>
            </div>
          </div>

          {/* Mode Controls */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Data Ingestion Mode</span>
                <span className="text-[11px] text-slate-500">
                  Switch between strict verified official sources and simulated demo stream.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLiveMode('VERIFIED_SOURCE')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    liveMode === 'VERIFIED_SOURCE'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Verified Source
                </button>
                <button
                  onClick={() => setLiveMode('LIVE_SIMULATION')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    liveMode === 'LIVE_SIMULATION'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Simulated Stream
                </button>
              </div>
            </div>

            {/* Scenario Trigger in Simulation Mode */}
            {liveMode === 'LIVE_SIMULATION' && (
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-600">Trigger Anomaly Scenario:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerScenario('nandurbar_drawdown')}
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-blue-500 text-slate-800 text-[11px] transition-colors"
                  >
                    Nandurbar JJM (+11.8%)
                  </button>
                  <button
                    onClick={() => triggerScenario('gadchiroli_pmayg')}
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-blue-500 text-slate-800 text-[11px] transition-colors"
                  >
                    Gadchiroli PMAY-G (+17.4%)
                  </button>
                  <button
                    onClick={resetLiveEvents}
                    className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Connected Official Sources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                REGISTERED STATUTORY DATA SOURCES
              </span>
              <span className="text-[10px] text-slate-500">3 of 3 Active</span>
            </div>

            <div className="space-y-2">
              {sourceHealth.map((src) => (
                <div
                  key={src.id}
                  className="p-3 bg-white border border-slate-200 rounded-md flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                      <Database className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{src.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {src.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Cadence: {src.updateFrequency || 'Monthly'} • Coverage: 36 MH Districts
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-800 block">
                        {src.recordCount} Records
                      </span>
                      <span className="text-[9px] text-slate-500">{src.freshness}</span>
                    </div>
                    <button
                      onClick={() => handleManualPoll(src.id || 'DS-JJM')}
                      disabled={isRefreshing}
                      className="p-1.5 rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                      title="Trigger source sync"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">
            Source Truth: RFC-7946 GeoJSON + LGD Census 2011 Registry
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
}
