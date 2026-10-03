'use client';

import React from 'react';
import { WhyFlaggedChain } from '@/lib/types/data-fabric';
import { useIntelligence } from '@/context/IntelligenceContext';
import {
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Database,
  Calculator,
  FileSpreadsheet,
  X,
  MapPin,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  chain: WhyFlaggedChain | null;
  findingId?: string;
  isOpen: boolean;
  onClose: () => void;
  onTraceEvidence?: (evidenceId: string) => void;
}

export function WhyFlaggedModal({ chain, isOpen, onClose, onTraceEvidence }: Props) {
  const { openEvidence } = useIntelligence();

  if (!isOpen || !chain) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white border border-slate-200 rounded-lg w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-blue-100 border border-blue-200 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider font-bold">
                  Why is this Flagged? &bull; Forensic Evidence Chain
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Real Pipeline Data
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {chain.district} ({chain.lgdEntity.state}) &bull; LGD Code: {chain.districtLgdCode}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Forensic Chain Flow Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Step 1: District LGD Entity */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-900">
                1. Spatial Anchor: LGD District Entity
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">District Name:</span>
                <span className="text-slate-900 font-semibold">{chain.lgdEntity.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">LGD Code:</span>
                <span className="text-blue-700 font-bold font-mono">{chain.lgdEntity.code}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">State:</span>
                <span className="text-slate-800">{chain.lgdEntity.state}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Census Code:</span>
                <span className="text-slate-800 font-mono">{chain.lgdEntity.censusCode || '512'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2.5">
            <ArrowRight className="w-4 h-4 text-blue-500 rotate-90" />
          </div>

          {/* Step 2: Involved Statutory Schemes */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-900">
                2. Statutory Programmes Operating in Jurisdiction
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
              {chain.programmes.map((p) => (
                <div key={p.code} className="p-3 bg-white border border-slate-200 rounded space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 font-mono text-xs">{p.code}</span>
                    <span className="text-[11px] font-bold text-emerald-700 font-mono">{p.progressRate}%</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{p.name}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Sanction: ₹{p.allocationCr} Cr &bull; Drawn: ₹{p.disbursedCr} Cr
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-2.5">
            <ArrowRight className="w-4 h-4 text-blue-500 rotate-90" />
          </div>

          {/* Step 3: Verified Source Data Points */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-900">
                3. Verified Ministerial Source Data Observations
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              {chain.sourceDataPoints.map((dp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                >
                  <div>
                    <span className="text-slate-400 font-mono mr-2">[{dp.datasetId}]</span>
                    <span className="text-slate-900 font-medium">{dp.metricName}:</span>
                  </div>
                  <span className="text-emerald-700 font-mono font-bold">{dp.rawValue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-2.5">
            <ArrowRight className="w-4 h-4 text-blue-500 rotate-90" />
          </div>

          {/* Step 4: Deterministic Derived Calculations */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-900">
                4. Deterministic Algebraic Derivations
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {chain.derivedMetrics.map((dm, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-900 font-semibold">{dm.name}</span>
                    <span className="text-blue-700 font-mono font-bold">{dm.value}</span>
                  </div>
                  <code className="text-[11px] text-slate-500 block font-mono bg-slate-50 p-1.5 rounded">{dm.formula}</code>
                  {dm.benchmarkDiff && (
                    <span className="text-[11px] text-rose-700 font-bold block">{dm.benchmarkDiff}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-2.5">
            <ArrowRight className="w-4 h-4 text-blue-500 rotate-90" />
          </div>

          {/* Step 5: Implementation Signals Triggered */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-900">
                5. Implementation Signals Generated
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {chain.signals.map((sig) => (
                <div key={sig.id} className="p-3 bg-white border border-slate-200 rounded space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-900 font-bold">{sig.type}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                        sig.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sig.severity} SEVERITY
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sig.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-2.5">
            <ArrowRight className="w-4 h-4 text-blue-500 rotate-90" />
          </div>

          {/* Step 6: Evidence Records Anchor */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs uppercase font-bold tracking-wider text-slate-900">
                6. Audit-Anchored Evidence Records
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {chain.evidenceLinks.map((ev, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onTraceEvidence) {
                      onTraceEvidence(ev.recordNumber);
                    } else {
                      openEvidence(ev.recordNumber);
                    }
                  }}
                  className="px-3 py-1.5 rounded bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-700 text-xs flex items-center space-x-1.5 transition-colors shadow-2xs font-medium"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Inspect Evidence {ev.recordNumber} ({ev.datasetId})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>Finding Ref: {chain.findingId}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-blue-600 text-white font-sans font-medium text-xs hover:bg-blue-700 transition-colors shadow-sm"
          >
            Close Forensic Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
