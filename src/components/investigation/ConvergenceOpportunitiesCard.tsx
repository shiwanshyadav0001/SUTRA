'use client';

import React from 'react';
import { ConvergenceOpportunity } from '@/lib/types/data-fabric';
import {
  GitMerge,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Target,
  Sparkles,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface ConvergenceOpportunitiesCardProps {
  opportunities: ConvergenceOpportunity[];
  onSelectFinding?: (findingId: string) => void;
  onOpenWhyFlagged?: (findingId: string) => void;
}

export const ConvergenceOpportunitiesCard: React.FC<ConvergenceOpportunitiesCardProps> = ({
  opportunities,
  onSelectFinding,
  onOpenWhyFlagged,
}) => {
  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {opportunities.map((opp) => (
        <div
          key={opp.id}
          className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-zinc-900/90 to-zinc-950 p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          {/* Top Header Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <GitMerge className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {opp.id}
                  </span>
                  <span className="font-mono text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700">
                    LGD: {opp.district?.lgdCode || opp.districtLgdCode}
                  </span>
                  <span className="font-mono text-xs text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {opp.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100 tracking-tight mt-1">
                  {opp.title || `${opp.districtName} Convergence Opportunity`}
                </h3>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-700/60 rounded-xl px-4 py-2.5 shadow-inner">
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Confidence Rating
                </div>
                <div className="font-mono text-sm font-bold text-emerald-400">
                  {opp.confidenceAssessment?.rating || 'HIGH'} ({opp.confidenceScore || opp.confidence}% Score)
                </div>
              </div>
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
          </div>

          {/* District & Programmes Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Target District
              </span>
              <div className="text-base font-bold text-zinc-200 mt-1">
                {opp.district?.name || opp.districtName}, {opp.district?.state || opp.state}
              </div>
              <div className="text-xs text-zinc-400 font-mono mt-0.5">
                Census / LGD Entity #{opp.district?.lgdCode || opp.districtLgdCode}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 md:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Programmes In Scope for Convergence Review
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {opp.programmes.map((p) => (
                  <div
                    key={p.code}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/60 text-xs font-medium text-zinc-200"
                  >
                    <span className="font-mono font-bold text-emerald-400">{p.code}</span>
                    <span className="text-zinc-400 truncate max-w-[200px]">{p.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">({p.ministry})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rationale & Analytical Justification */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-emerald-400" />
              Analytical Justification & Rationale
            </h4>
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
              {opp.rationale}
            </div>
          </div>

          {/* Supporting Findings Grid */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-400" />
              Supporting Empirical Findings ({opp.supportingFindings.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {opp.supportingFindings.map((fnd, idx) => {
                const findingId = typeof fnd === 'string' ? fnd : fnd.findingId;
                const findingType = typeof fnd === 'string' ? 'CONVERGENCE_FINDING' : fnd.findingType;
                const title = typeof fnd === 'string' ? `Finding ${fnd}` : fnd.title;
                const contribution = typeof fnd === 'string' ? 'Key empirical evidence support' : fnd.contribution;
                return (
                  <div
                    key={`${findingId}-${idx}`}
                    className="group p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {findingId}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {findingType.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-200 group-hover:text-emerald-300 transition-colors">
                        {title}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono mt-1">
                        Contribution: {contribution}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 mt-3 border-t border-zinc-800/60">
                      {onOpenWhyFlagged && (
                        <button
                          onClick={() => onOpenWhyFlagged(findingId)}
                          className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                        >
                          <Sparkles className="h-3 w-3" />
                          Why Flagged?
                        </button>
                      )}
                      {onSelectFinding && (
                        <button
                          onClick={() => onSelectFinding(findingId)}
                          className="text-xs font-medium text-zinc-400 hover:text-zinc-200 ml-auto flex items-center gap-1 transition-colors"
                        >
                          Inspect Finding
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Policy Recommendations */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />
              Actionable Policy Recommendations
            </h4>
            <div className="space-y-2">
              {opp.actionableRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations & Institutional Disclaimers */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300/90 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Institutional & Analytical Safeguards
            </div>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              {opp.limitations.map((lim, idx) => (
                <li key={idx}>
                  <span className="text-zinc-300">{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
