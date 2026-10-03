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
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-wider font-semibold bg-[#5E8B72]/15 text-[#5E8B72] border border-[#5E8B72]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E8B72] animate-pulse" />
            ONLINE
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-wider font-semibold bg-[#B78A5A]/15 text-[#B78A5A] border border-[#B78A5A]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
            SIMULATED
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-wider font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            STALE
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-wider font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            DEGRADED
          </span>
        );
      case 'UNAVAILABLE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono tracking-wider font-semibold bg-[#1C1B18] text-[#8E887E] border border-[#2A2926]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E887E]" />
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <div className={`bg-[#141412] border border-[#2A2926] rounded-sm p-5 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#B78A5A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-4 border-b border-[#2A2926] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-sm bg-[#1C1B18] border border-[#2A2926] text-[#B78A5A] shadow-inner">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F3F0E8] font-editorial tracking-tight flex items-center gap-2">
              Official Source Health & Telemetry
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-sm bg-[#1C1B18] text-[#8E887E] border border-[#2A2926]">
                AUDITED CONNECTORS
              </span>
            </h3>
            <p className="text-xs text-[#C9C2B7] mt-0.5">
              Live connector availability, baseline reporting cadence, and data freshness metrics.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#8E887E]">
          <Activity className="w-3.5 h-3.5 text-[#5E8B72]" />
          <span>3/3 Active Pipelines</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sourceHealth.map((source) => (
          <div
            key={source.id || source.datasetId}
            className="p-4 rounded-sm bg-[#171614] border border-[#2A2926] hover:border-[#B78A5A]/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#F3F0E8] group-hover:text-white transition-colors">
                {source.schemeName || source.name}
              </span>
              {getStatusBadge(source.status)}
            </div>

            <div className="text-[11px] font-mono text-[#8E887E] mb-3 truncate" title={source.name}>
              {source.name}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#2A2926] text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#8E887E]">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-[#8E887E]" />
                  Records Ingested:
                </span>
                <span className="text-[#F3F0E8] font-semibold">{source.recordCount}</span>
              </div>
              <div className="flex items-center justify-between text-[#8E887E]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#8E887E]" />
                  Reporting Cadence:
                </span>
                <span className="text-[#C9C2B7]">{source.updateFrequency || source.reportingFrequency || 'Monthly'}</span>
              </div>
              <div className="flex items-center justify-between text-[#8E887E]">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-[#8E887E]" />
                  Freshness:
                </span>
                <span className="text-[#C9C2B7]">{source.freshness}</span>
              </div>
              <div className="flex items-center justify-between text-[#8E887E]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#5E8B72]" />
                  Verification:
                </span>
                <span className="text-[#5E8B72] font-semibold">{source.verificationLevel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
