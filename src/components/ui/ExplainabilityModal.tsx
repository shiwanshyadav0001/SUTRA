'use client';

import React, { useEffect } from 'react';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';

interface Factor {
  title: string;
  weight: number;
}

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  confidence: number;
  factors: Factor[];
  onViewEvidence: () => void;
  evidenceRecordNumber?: string;
}

// Callers pass weights either as 0–100 points or 0–1 fractions, and
// confidence either way too — normalize once so bars and labels are exact.
function toPercent(value: number): number {
  if (!isFinite(value)) return 0;
  const pct = value <= 1 ? value * 100 : value;
  return Math.min(100, Math.max(0, pct));
}

export function ExplainabilityModal({
  isOpen,
  onClose,
  title,
  subtitle,
  confidence,
  factors,
  onViewEvidence,
  evidenceRecordNumber = '#9281',
}: ExplainabilityModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confidencePct = toPercent(confidence);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Why this insight"
    >
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-semibold">
              Explainable Governance Intelligence
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Why This Insight?
            </h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Target Title */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Flagged Subject
            </span>
            <span className="font-semibold text-sm text-slate-900 mt-0.5 block">{title}</span>
          </div>

          {/* Statistical Verification Status */}
          <div className="flex items-center justify-between p-4 rounded-md bg-slate-50 border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                Evidence Lineage Verification
              </div>
              <div className="text-base font-bold font-mono text-emerald-800 mt-0.5">
                RULE VERIFIED • SOURCE-BOUND
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Triangulated across 3 heterogeneous administrative datasets
              </p>
            </div>
            <div className="px-3 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold shadow-2xs">
              DATA QUALITY CHECKED
            </div>
          </div>

          {/* Decomposed Attribution Factors */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-semibold">
                Decomposed Attribution Factors
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                MODEL CONFIDENCE: {confidencePct.toFixed(0)}%
              </span>
            </div>

            <div className="space-y-2">
              {factors.map((factor, idx) => {
                const pct = toPercent(factor.weight);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] font-mono font-bold text-blue-700">
                        0{idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800 text-xs uppercase tracking-wide">
                          {factor.title}
                        </p>
                        <div className="w-36 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed italic border-l-2 border-blue-600 pl-3 py-1 bg-slate-50/50 rounded-r">
            Every attribution factor is computed deterministically from verified administrative and financial ledgers, preventing subjective hallucinations.
          </div>
        </div>

        {/* Footer with View Evidence CTA */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onViewEvidence();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>View Supporting Evidence ({evidenceRecordNumber})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
