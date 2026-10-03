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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E3EDE7] text-[#28704D] border border-[#28704D]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#28704D]" />
            ONLINE
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F9F4EB] text-[#B58A45] border border-[#B58A45]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B58A45]" />
            SIMULATED
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FAF1EB] text-[#B56B32] border border-[#B56B32]/30">
            <AlertCircle className="w-3 h-3 text-[#B56B32]" />
            STALE
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBF0F0] text-[#A54848] border border-[#A54848]/30">
            <AlertCircle className="w-3 h-3 text-[#A54848]" />
            DEGRADED
          </span>
        );
      case 'UNAVAILABLE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F4F2EC] text-[#898E89] border border-[#D8D6CE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#898E89]" />
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <div className={`bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg p-5 shadow-sm relative overflow-hidden select-none ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E1] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-[#164A3A]">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#18201C] font-editorial tracking-tight flex items-center gap-2">
              Official Source Health & Provenance Telemetry
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#F4F2EC] text-[#66706A] border border-[#D8D6CE]">
                AUDITED CONNECTORS
              </span>
            </h3>
            <p className="text-xs text-[#66706A]">
              Live connector availability, baseline reporting cadence, and data freshness metrics.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#28704D] font-semibold bg-[#E3EDE7] px-2.5 py-1 rounded border border-[#28704D]/30">
          <Activity className="w-3.5 h-3.5 text-[#28704D]" />
          <span>3/3 Active Pipelines</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sourceHealth.map((source) => (
          <div
            key={source.id || source.datasetId}
            className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] hover:border-[#164A3A] transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#18201C] group-hover:text-[#164A3A] transition-colors">
                {source.schemeName || source.name}
              </span>
              {getStatusBadge(source.status)}
            </div>

            <div className="text-[10px] font-mono text-[#66706A] mb-2.5 truncate" title={source.name}>
              {source.name}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#D8D6CE] text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#66706A]">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-[#66706A]" />
                  Records Ingested:
                </span>
                <span className="text-[#18201C] font-semibold">{source.recordCount}</span>
              </div>
              <div className="flex items-center justify-between text-[#66706A]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#66706A]" />
                  Cadence:
                </span>
                <span className="text-[#18201C]">{source.updateFrequency || source.reportingFrequency || 'Monthly'}</span>
              </div>
              <div className="flex items-center justify-between text-[#66706A]">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-[#66706A]" />
                  Freshness:
                </span>
                <span className="text-[#18201C]">{source.freshness}</span>
              </div>
              <div className="flex items-center justify-between text-[#66706A]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#28704D]" />
                  Verification:
                </span>
                <span className="text-[#28704D] font-bold">{source.verificationLevel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
