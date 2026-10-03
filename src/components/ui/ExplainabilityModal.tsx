'use client';

import React from 'react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col">
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

          {/* Statistical Confidence Score */}
          <div className="flex items-center justify-between p-4 rounded-md bg-slate-50 border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                Statistical Confidence
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
                {confidence}%
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified across 3 heterogeneous administrative datasets
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 flex items-center justify-center font-mono text-sm font-bold text-blue-700">
              {confidence}%
            </div>
          </div>

          {/* Decomposed Attribution Factors */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-semibold">
                Decomposed Attribution Factors
              </span>
              <span className="text-[10px] font-mono text-slate-500">WEIGHT</span>
            </div>

            <div className="space-y-2">
              {factors.map((factor, idx) => (
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
                          style={{ width: `${factor.weight}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {factor.weight}%
                  </span>
                </div>
              ))}
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
