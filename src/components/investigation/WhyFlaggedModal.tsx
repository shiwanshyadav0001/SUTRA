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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#141412] border border-[#B78A5A]/60 rounded-sm w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-xs font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-[#191917] border-b border-[#2A2926] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-[#B78A5A]/20 border border-[#B78A5A]/40 text-[#B78A5A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-[#B78A5A] uppercase tracking-widest font-bold">
                  WHY IS THIS FLAGGED? — FORENSIC EVIDENCE CHAIN
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#5E8B72]/15 text-[#5E8B72] border border-[#5E8B72]/30">
                  REAL PIPELINE DATA
                </span>
              </div>
              <h2 className="text-base font-bold text-[#F3F0E8] font-editorial mt-1">
                {chain.district} ({chain.lgdEntity.state}) • LGD Code: {chain.districtLgdCode}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#2A2926] text-[#8E887E] hover:text-[#F3F0E8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Forensic Chain Flow Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: District LGD Entity */}
          <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
            <div className="flex items-center space-x-2 text-[#8E887E]">
              <MapPin className="w-4 h-4 text-[#B78A5A]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B78A5A]">
                1. SPATIAL ANCHOR: LGD DISTRICT ENTITY
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-[#8E887E] block">District Name:</span>
                <span className="text-[#F3F0E8] font-bold">{chain.lgdEntity.name}</span>
              </div>
              <div>
                <span className="text-[#8E887E] block">LGD Code:</span>
                <span className="text-[#B78A5A] font-bold font-mono">{chain.lgdEntity.code}</span>
              </div>
              <div>
                <span className="text-[#8E887E] block">State:</span>
                <span className="text-[#C9C2B7]">{chain.lgdEntity.state}</span>
              </div>
              <div>
                <span className="text-[#8E887E] block">Census Code:</span>
                <span className="text-[#C9C2B7]">{chain.lgdEntity.censusCode || '512'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-3">
            <ArrowRight className="w-4 h-4 text-[#B78A5A] rotate-90" />
          </div>

          {/* Step 2: Involved Statutory Schemes */}
          <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
            <div className="flex items-center space-x-2 text-[#8E887E]">
              <Building2 className="w-4 h-4 text-[#5E8B72]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5E8B72]">
                2. STATUTORY PROGRAMMES OPERATING IN JURISDICTION
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 pt-1">
              {chain.programmes.map((p) => (
                <div key={p.code} className="p-2.5 bg-[#141412] border border-[#2A2926] rounded space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#F3F0E8]">{p.code}</span>
                    <span className="text-[10px] text-[#5E8B72]">{p.progressRate}%</span>
                  </div>
                  <p className="text-[10px] text-[#8E887E] truncate">{p.name}</p>
                  <div className="text-[9px] text-[#7E7A72]">
                    Sanction: ₹{p.allocationCr} Cr • Drawn: ₹{p.disbursedCr} Cr
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-3">
            <ArrowRight className="w-4 h-4 text-[#B78A5A] rotate-90" />
          </div>

          {/* Step 3: Verified Source Data Points */}
          <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
            <div className="flex items-center space-x-2 text-[#8E887E]">
              <Database className="w-4 h-4 text-[#B78A5A]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B78A5A]">
                3. VERIFIED MINISTERIAL SOURCE DATA OBSERVATIONS
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              {chain.sourceDataPoints.map((dp, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-[#141412] border border-[#2A2926] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
                >
                  <div>
                    <span className="text-[#8E887E] mr-2">[{dp.datasetId}]</span>
                    <span className="text-[#F3F0E8] font-bold">{dp.metricName}:</span>
                  </div>
                  <span className="text-[#5E8B72] font-bold">{dp.rawValue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-3">
            <ArrowRight className="w-4 h-4 text-[#B78A5A] rotate-90" />
          </div>

          {/* Step 4: Deterministic Derived Calculations */}
          <div className="p-4 bg-[#191917] border border-[#B78A5A]/40 rounded space-y-2">
            <div className="flex items-center space-x-2 text-[#B78A5A]">
              <Calculator className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                4. DETERMINISTIC ALGEBRAIC DERIVATIONS
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {chain.derivedMetrics.map((dm, idx) => (
                <div key={idx} className="p-2.5 bg-[#141412] border border-[#2A2926] rounded space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#F3F0E8] font-bold">{dm.name}</span>
                    <span className="text-[#B78A5A] font-bold">{dm.value}</span>
                  </div>
                  <code className="text-[10px] text-[#8E887E] block">{dm.formula}</code>
                  {dm.benchmarkDiff && (
                    <span className="text-[9px] text-[#A66A62] font-bold block">{dm.benchmarkDiff}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-3">
            <ArrowRight className="w-4 h-4 text-[#B78A5A] rotate-90" />
          </div>

          {/* Step 5: Implementation Signals Triggered */}
          <div className="p-4 bg-[#191917] border border-[#A66A62]/50 rounded space-y-2">
            <div className="flex items-center space-x-2 text-[#A66A62]">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                5. IMPLEMENTATION SIGNALS GENERATED
              </span>
            </div>
            <div className="space-y-2 pt-1">
              {chain.signals.map((sig) => (
                <div key={sig.id} className="p-2.5 bg-[#141412] border border-[#2A2926] rounded space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#F3F0E8] font-bold">{sig.type}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        sig.severity === 'HIGH'
                          ? 'bg-[#A66A62]/20 text-[#A66A62]'
                          : 'bg-[#B78A5A]/20 text-[#B78A5A]'
                      }`}
                    >
                      {sig.severity} SEVERITY
                    </span>
                  </div>
                  <p className="text-[10px] text-[#C9C2B7] leading-relaxed">{sig.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center -my-3">
            <ArrowRight className="w-4 h-4 text-[#B78A5A] rotate-90" />
          </div>

          {/* Step 6: Evidence Records Anchor */}
          <div className="p-4 bg-[#191917] border border-[#5E8B72]/40 rounded space-y-2">
            <div className="flex items-center space-x-2 text-[#5E8B72]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                6. AUDIT-ANCHORED EVIDENCE RECORDS
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
                  className="px-3 py-1.5 rounded bg-[#141412] border border-[#2A2926] hover:border-[#5E8B72] text-[#C9C2B7] hover:text-[#F3F0E8] text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#5E8B72]" />
                  <span>Inspect Evidence {ev.recordNumber} ({ev.datasetId})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#191917] border-t border-[#2A2926] flex justify-between items-center text-[10px] text-[#8E887E]">
          <span>Finding Ref: {chain.findingId}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#B78A5A] text-[#0D0D0C] font-bold hover:bg-[#C9A070] transition-colors"
          >
            Close Forensic Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
