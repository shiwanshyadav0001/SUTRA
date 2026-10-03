'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, Database, Activity, AlertCircle, Clock, Server } from 'lucide-react';
import { SourceHealthStatus } from '@/lib/types/events';

interface SourceHealthCardProps {
  sourceHealth: SourceHealthStatus[];
  className?: string;
}

export function SourceHealthCard({ sourceHealth, className = '' }: SourceHealthCardProps) {
  const getStatusBadge = (status: SourceHealthStatus['status']) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            SIMULATED
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            STALE
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            DEGRADED
          </span>
        );
      case 'UNAVAILABLE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <div className={`bg-black/60 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-md shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-inner">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
              Official Source Health & Telemetry
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                AUDITED CONNECTORS
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live connector availability, baseline reporting cadence, and data freshness metrics.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>3/3 Active Pipelines</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sourceHealth.map((source) => (
          <div
            key={source.id || source.datasetId}
            className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700/80 transition-all group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                {source.schemeName || source.name}
              </span>
              {getStatusBadge(source.status)}
            </div>

            <div className="text-[11px] font-mono text-zinc-400 mb-3 truncate" title={source.name}>
              {source.name}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800/50 text-[11px] font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-zinc-500" />
                  Records Ingested:
                </span>
                <span className="text-zinc-200 font-semibold">{source.recordCount}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  Reporting Cadence:
                </span>
                <span className="text-zinc-300">{source.updateFrequency || source.reportingFrequency || 'Monthly'}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-zinc-500" />
                  Freshness:
                </span>
                <span className="text-zinc-300">{source.freshness}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500/70" />
                  Verification:
                </span>
                <span className="text-emerald-400 font-semibold">{source.verificationLevel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
