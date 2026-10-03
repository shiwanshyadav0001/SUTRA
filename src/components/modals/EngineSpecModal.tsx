'use client';

import React from 'react';
import { X, Cpu, ShieldCheck, Zap, Database } from 'lucide-react';

interface EngineSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EngineSpecModal({ isOpen, onClose }: EngineSpecModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto text-xs text-slate-800 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-blue-700 uppercase tracking-wider font-bold">
                  SUTRA Computational Specification
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Zero Generative Hallucination
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Mathematical Foundations & Algorithmic Rigor
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Mathematical Formulations */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
            Core Deterministic Formulations
          </span>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Model 1: Levenshtein DP */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900">1. Entity String Normalization</span>
                <span className="text-emerald-700 font-mono text-[11px]">O(N × M) DP</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Levenshtein edit-distance matrix combined with phonetics to resolve corrupted district and scheme strings against canonical LGD codes.
              </p>
              <div className="p-2 bg-white border border-slate-200 rounded font-mono text-[11px] text-blue-700">
                <code>Sim(s₁, s₂) = 1 - [dist(s₁, s₂) / max(|s₁|, |s₂|)]</code>
              </div>
            </div>

            {/* Model 2: Cosine Vector Overlap */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900">2. Cross-Scheme Overlap</span>
                <span className="text-blue-700 font-mono text-[11px]">Vector Space Model</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-dimensional TF-IDF policy text cosine angle combined with 4-vector domain weighting (Target, Geo, Intervention, Period).
              </p>
              <div className="p-2 bg-white border border-slate-200 rounded font-mono text-[11px] text-blue-700">
                <code>S = Σ(w_i · v_i) / Σ(w_i) where v_i = (A · B) / (‖A‖ ‖B‖)</code>
              </div>
            </div>

            {/* Model 3: Z-Score Outlier */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900">3. Anomaly & Drawdown Deviation</span>
                <span className="text-rose-700 font-mono text-[11px]">Z &le; -1.6σ Filter</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Statistical population variance benchmark detecting districts with disbursement velocity lagging significantly behind statutory mean.
              </p>
              <div className="p-2 bg-white border border-slate-200 rounded font-mono text-[11px] text-rose-700">
                <code>Z = (X_drawdown - μ_regional) / σ_variance</code>
              </div>
            </div>

            {/* Model 4: Delivery Gap Index */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900">4. Territorial Delivery Gap Index</span>
                <span className="text-amber-700 font-mono text-[11px]">Priority Weighting</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Composite allocation deficiency formula prioritizing districts with high eligible demand index and low physical coverage percentage.
              </p>
              <div className="p-2 bg-white border border-slate-200 rounded font-mono text-[11px] text-amber-700">
                <code>Gap = Benchmark% - ActualCoverage% (Nandurbar = 36 pp)</code>
              </div>
            </div>
          </div>
        </div>

        {/* Why Zero Hallucination? */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Deterministic AST Instead of Generative LLM Hallucinations</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            In national governance and public finance intelligence, an ungrounded LLM that invents disbursement figures is unacceptable. SUTRA parses natural language queries into an <strong>Abstract Syntax Tree (AST)</strong> that executes queries against deterministic spatial registers with full cryptographic audit trail provenance back to Treasury Record #9281.
          </p>
        </div>

        {/* System Benchmarks */}
        <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-200 pt-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Query Latency</span>
            <span className="text-base font-bold text-emerald-700 font-mono">18 ms</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">String Normalization</span>
            <span className="text-base font-bold text-blue-700 font-mono">4.2 ms / token</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Standards Alignment</span>
            <span className="text-base font-bold text-slate-900 font-mono">LGD / PFMS / SECC</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white font-medium text-xs rounded hover:bg-blue-700 transition-colors shadow-sm"
          >
            Dismiss Specification
          </button>
        </div>
      </div>
    </div>
  );
}
