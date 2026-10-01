'use client';

import React from 'react';
import { X, Cpu, CheckCircle2, Code, ShieldCheck, Zap, Database } from 'lucide-react';

interface EngineSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EngineSpecModal({ isOpen, onClose }: EngineSpecModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-[#141412] border-2 border-[#B78A5A] rounded-sm max-w-3xl w-full max-h-[85vh] overflow-y-auto text-xs text-[#F3F0E8] shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2926] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-sm bg-[#191917] border border-[#B78A5A] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#B78A5A]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-[#B78A5A] uppercase tracking-wider font-bold">
                  SUTRA COMPUTATIONAL SPECIFICATION
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#5E8B72]/20 text-[#5E8B72]">
                  ZERO GENERATIVE HALLUCINATION
                </span>
              </div>
              <h2 className="text-xl font-bold font-editorial text-[#F3F0E8] mt-0.5">
                Mathematical Foundations & Algorithmic Rigor
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-[#191917] text-[#8E887E] hover:text-[#F3F0E8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Mathematical Formulations */}
        <div className="space-y-4">
          <span className="text-[10px] text-[#B78A5A] uppercase tracking-widest block">
            CORE MATHEMATICAL MODELS
          </span>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Model 1: Levenshtein DP */}
            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-[#F3F0E8]">1. Entity String Normalization</span>
                <span className="text-[#5E8B72]">O(N × M) DP</span>
              </div>
              <p className="text-[11px] text-[#8E887E] leading-relaxed">
                Levenshtein edit-distance matrix combined with phonetics to resolve corrupted district and scheme strings against canonical LGD codes.
              </p>
              <div className="p-2 bg-[#0D0D0C] rounded text-[10px] text-[#B78A5A]">
                <code>Sim(s₁, s₂) = 1 - [dist(s₁, s₂) / max(|s₁|, |s₂|)]</code>
              </div>
            </div>

            {/* Model 2: Cosine Vector Overlap */}
            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-[#F3F0E8]">2. Cross-Scheme Overlap</span>
                <span className="text-[#5E8B72]">Vector Space Model</span>
              </div>
              <p className="text-[11px] text-[#8E887E] leading-relaxed">
                High-dimensional TF-IDF policy text cosine angle combined with 4-vector domain weighting (Target, Geo, Intervention, Period).
              </p>
              <div className="p-2 bg-[#0D0D0C] rounded text-[10px] text-[#B78A5A]">
                <code>S = Σ(w_i · v_i) / Σ(w_i) where v_i = (A · B) / (‖A‖ ‖B‖)</code>
              </div>
            </div>

            {/* Model 3: Z-Score Outlier */}
            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-[#F3F0E8]">3. Anomaly & Drawdown Deviation</span>
                <span className="text-[#A66A62]">Z &le; -1.6σ Filter</span>
              </div>
              <p className="text-[11px] text-[#8E887E] leading-relaxed">
                Statistical population variance benchmark detecting districts with disbursement velocity lagging significantly behind statutory mean.
              </p>
              <div className="p-2 bg-[#0D0D0C] rounded text-[10px] text-[#A66A62]">
                <code>Z = (X_drawdown - μ_regional) / σ_variance</code>
              </div>
            </div>

            {/* Model 4: Delivery Gap Index */}
            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-[#F3F0E8]">4. Territorial Delivery Gap Index</span>
                <span className="text-[#B59A63]">Priority Weighting</span>
              </div>
              <p className="text-[11px] text-[#8E887E] leading-relaxed">
                Composite allocation deficiency formula prioritizing districts with high eligible demand index and low physical coverage percentage.
              </p>
              <div className="p-2 bg-[#0D0D0C] rounded text-[10px] text-[#B59A63]">
                <code>Gap = Benchmark% - ActualCoverage% (Nandurbar = 36 pp)</code>
              </div>
            </div>
          </div>
        </div>

        {/* Why Zero Hallucination? */}
        <div className="p-4 bg-[#191917] border border-[#5E8B72]/40 rounded space-y-2">
          <div className="flex items-center space-x-2 text-[#5E8B72] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Why Deterministic AST Instead of Generative LLM Hallucinations?</span>
          </div>
          <p className="text-[11px] text-[#C9C2B7] leading-relaxed">
            In national governance and treasury intelligence, an ungrounded LLM that invents or approximates financial disbursement figures is a critical liability. SUTRA parses natural language queries into an <strong>Abstract Syntax Tree (AST)</strong> that queries deterministic spatial registers with full audit trail provenance back to Treasury Record #9281.
          </p>
        </div>

        {/* System Benchmarks */}
        <div className="grid grid-cols-3 gap-3 text-center border-t border-[#2A2926] pt-4">
          <div className="p-2.5 rounded bg-[#191917]">
            <span className="text-[9px] text-[#8E887E] block">QUERY LATENCY</span>
            <span className="text-base font-bold text-[#5E8B72]">18 ms</span>
          </div>
          <div className="p-2.5 rounded bg-[#191917]">
            <span className="text-[9px] text-[#8E887E] block">STRING NORMALIZATION</span>
            <span className="text-base font-bold text-[#B78A5A]">4.2 ms / token</span>
          </div>
          <div className="p-2.5 rounded bg-[#191917]">
            <span className="text-[9px] text-[#8E887E] block">STANDARDS ALIGNMENT</span>
            <span className="text-base font-bold text-[#F3F0E8]">LGD / PFMS / SECC</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#B78A5A] text-[#0D0D0C] font-bold text-xs rounded hover:bg-[#CBB093]"
          >
            DISMISS SPECIFICATION
          </button>
        </div>
      </div>
    </div>
  );
}
