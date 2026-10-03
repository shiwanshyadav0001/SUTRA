'use client';

import React from 'react';
import { EvidenceRecord } from '@/lib/types';
import { X, ExternalLink, Database, FileText, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: EvidenceRecord | null;
}

export function EvidenceDrawer({ isOpen, onClose, record }: EvidenceDrawerProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-xl bg-[#141412] border-l border-[#2A2926] h-full flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#2A2926] flex items-center justify-between bg-[#0D0D0C]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#B78A5A]/15 text-[#B78A5A] border border-[#B78A5A]/30">
                AUDITABLE EVIDENCE RECORD
              </span>
              <span className="text-xs font-mono text-[#8E887E]">
                {record.recordNumber}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#F3F0E8] mt-1 font-editorial">
              {record.datasetName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-sm text-[#8E887E] hover:text-[#F3F0E8] hover:bg-[#191917] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 text-xs">
          {/* Provenance Badge with Institutional Audit Stamp Animation */}
          <div className="p-4 rounded bg-[#191917] border border-[#5E8B72]/40 flex items-start space-x-3 animate-stamp-in shadow-xl">
            <ShieldCheck className="w-5 h-5 text-[#5E8B72] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-[#F3F0E8] flex items-center gap-2">
                <span>TREASURY AUDIT VERIFIED</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#5E8B72]/20 text-[#5E8B72] border border-[#5E8B72]/30">
                  SEAL MATCHED
                </span>
              </div>
              <p className="text-[#C9C2B7] text-xs mt-0.5">
                Source Provenance: <strong className="text-[#F3F0E8]">{record.sourceType}</strong>
              </p>
              <p className="text-[#8E887E] text-[11px] mt-1 leading-relaxed">
                {record.sourceType === 'Union Budget / PFMS'
                  ? 'Sanction order verified against Public Financial Management System expenditure feed.'
                  : record.sourceType === 'Government Open Data'
                  ? 'Extracted directly from Open Government Data Platform India (data.gov.in catalogue).'
                  : 'Official state administrative register entry cross-referenced against LGD spatial boundary and Treasury ledger.'}
              </p>
            </div>
          </div>

          {/* Record Details Grid */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E]">
              Extracted Telemetry Fields
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">SCHEME IDENTIFIER</span>
                <span className="font-mono font-semibold text-[#F3F0E8] text-xs">{record.schemeId}</span>
                <span className="text-[#C9C2B7] block text-[11px] mt-0.5 truncate">{record.schemeName}</span>
              </div>

              <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">GEOGRAPHIC UNIT</span>
                <span className="font-mono font-semibold text-[#F3F0E8] text-xs">{record.district}</span>
                <span className="text-[#C9C2B7] block text-[11px] mt-0.5">{record.state}</span>
              </div>

              <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">ALLOCATED CAPITAL</span>
                <span className="font-mono font-semibold text-[#B78A5A] text-sm">
                  ₹{record.allocatedCr} Cr
                </span>
              </div>

              <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">ACTUAL EXPENDITURE</span>
                <span className="font-mono font-semibold text-[#F3F0E8] text-sm">
                  ₹{record.utilizedCr} Cr
                </span>
                <span className="text-[#8E887E] text-[10px] block mt-0.5">
                  Utilization: {((record.utilizedCr / record.allocatedCr) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">VERIFIED BENEFICIARIES</span>
                <span className="font-mono font-semibold text-[#F3F0E8] text-sm">
                  {record.beneficiaries.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded bg-[#191917] border border-[#2A2926]">
                <span className="text-[#8E887E] text-[10px] block">PHYSICAL OUTCOME SCORE</span>
                <span className="font-mono font-semibold text-[#B59A63] text-sm">
                  {record.outcomeScore} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Used In Cross-Reference */}
          <div className="p-3.5 rounded bg-[#191917] border border-[#B78A5A]/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A] block mb-1">
              USED IN INTELLIGENCE SIGNAL:
            </span>
            <p className="font-semibold text-sm text-[#F3F0E8]">{record.usedIn}</p>
            <p className="text-[11px] text-[#8E887E] mt-1">
              This record was consumed by the SUTRA Gap & Overlap detection algorithms to ground recommendations in verifiable financial and physical evidence.
            </p>
          </div>

          {/* Source Link */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block mb-1.5">
              OFFICIAL VERIFICATION REPOSITORY
            </span>
            <a
              href={record.primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs text-[#B78A5A] hover:underline"
            >
              <span>{record.primarySourceUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2926] bg-[#0D0D0C] flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#8E887E]">
            VERIFIED AT: {record.lastUpdated}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-[#191917] border border-[#2A2926] text-xs text-[#F3F0E8] hover:border-[#B78A5A] transition-colors"
          >
            Dismiss Record
          </button>
        </div>
      </div>
    </div>
  );
}
