'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, Database, Activity, AlertCircle, Clock, Server } from 'lucide-react';
import { SourceHealthStatus } from '@/lib/types/events';

interface SourceHealthCardProps {
  sourceHealth: SourceHealthStatus[];
  className?: string;
}

export function SourceHealthCard({ sourceHealth, className = '' }: SourceHealthCardProps) {
  const activeCount = sourceHealth.filter(
    (s) => s.status === 'ONLINE' || s.status === 'SIMULATED'
  ).length;
  const getStatusBadge = (status: SourceHealthStatus['status']) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            ONLINE
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            SIMULATED
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            STALE
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            DEGRADED
          </span>
        );
      case 'UNAVAILABLE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-5 shadow-sm relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              Official Source Health & Telemetry
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                AUDITED CONNECTORS
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live connector availability, baseline reporting cadence, and data freshness metrics.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>{activeCount}/{sourceHealth.length} Active Pipelines</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sourceHealth.map((source, idx) => (
          <div
            key={source.id || source.datasetId || `source-${idx}`}
            className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-white transition-all group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                {source.schemeName || source.name}
              </span>
              {getStatusBadge(source.status)}
            </div>

            <div className="text-[11px] font-mono text-slate-500 mb-3 truncate" title={source.name}>
              {source.name}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-slate-400" />
                  Records Ingested:
                </span>
                <span className="text-slate-900 font-semibold">{source.recordCount}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Reporting Cadence:
                </span>
                <span className="text-slate-700">{source.updateFrequency || source.reportingFrequency || 'Monthly'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                  Freshness:
                </span>
                <span className="text-slate-700">{source.freshness || 'Not reported'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verification:
                </span>
                <span className="text-emerald-700 font-semibold">{source.verificationLevel || 'Pending'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
