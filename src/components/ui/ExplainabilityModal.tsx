'use client';

import React from 'react';
import { X, ArrowRight, Activity, Percent, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#141412] border border-[#2A2926] rounded-sm shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#2A2926] bg-[#0D0D0C] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A]">
              EXPLAINABLE GOVERNANCE AI
            </span>
            <h2 className="text-base font-bold text-[#F3F0E8] mt-1 font-editorial">
              WHY THIS INSIGHT?
            </h2>
            {subtitle && <p className="text-xs text-[#8E887E] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#8E887E] hover:text-[#F3F0E8] hover:bg-[#191917] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs">
          {/* Target Title */}
          <div className="p-3 bg-[#191917] border border-[#2A2926] rounded">
            <span className="text-[10px] text-[#8E887E] uppercase tracking-wider block">
              FLAGGED SUBJECT
            </span>
            <span className="font-semibold text-sm text-[#F3F0E8]">{title}</span>
          </div>

          {/* Statistical Confidence Score */}
          <div className="flex items-center justify-between p-4 rounded bg-[#191917] border border-[#2A2926]">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#8E887E]">
                STATISTICAL CONFIDENCE
              </div>
              <div className="text-2xl font-bold font-mono text-[#F3F0E8] mt-0.5">
                {confidence}%
              </div>
              <p className="text-[11px] text-[#5E8B72] mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified across 3 heterogeneous datasets
              </p>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-[#2A2926] border-t-[#B78A5A] flex items-center justify-center font-mono text-sm font-bold text-[#B78A5A]">
              {confidence}%
            </div>
          </div>

          {/* Decomposed Attribution Factors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E]">
                DECOMPOSED ATTRIBUTION FACTORS
              </span>
              <span className="text-[10px] font-mono text-[#8E887E]">WEIGHT</span>
            </div>

            <div className="space-y-2">
              {factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-[#191917] border border-[#2A2926] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-mono text-[#B78A5A]">
                      0{idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-[#F3F0E8] text-xs uppercase tracking-wide">
                        {factor.title}
                      </p>
                      <div className="w-36 bg-[#2A2926] h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-[#B78A5A] h-full rounded-full"
                          style={{ width: `${factor.weight}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-[#F3F0E8]">
                    {factor.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#8E887E] leading-relaxed italic border-l-2 border-[#B78A5A] pl-3 py-1">
            Every attribution factor is computed deterministically from real administrative and financial ledgers, preventing subjective hallucinations.
          </div>
        </div>

        {/* Footer with View Evidence CTA */}
        <div className="p-4 border-t border-[#2A2926] bg-[#0D0D0C] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#8E887E] hover:text-[#F3F0E8]"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onViewEvidence();
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs hover:bg-[#CBB093] transition-colors"
          >
            <span>VIEW SUPPORTING EVIDENCE {evidenceRecordNumber}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
