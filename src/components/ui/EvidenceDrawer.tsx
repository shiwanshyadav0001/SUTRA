'use client';

import React from 'react';
import { EvidenceRecord } from '@/lib/types';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: EvidenceRecord | null;
}

export function EvidenceDrawer({ isOpen, onClose, record }: EvidenceDrawerProps) {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity select-none">
      <div className="w-full max-w-xl bg-[#FFFFFF] border-l border-[#D8D6CE] h-full flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-6 border-b border-[#EAE8E1] flex items-center justify-between bg-[#F4F2EC]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FFFFFF] text-[#164A3A] border border-[#D8D6CE] font-bold">
                AUDITABLE EVIDENCE RECORD
              </span>
              <span className="text-xs font-mono text-[#66706A] font-semibold">
                {record.recordNumber}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#18201C] mt-1 font-editorial">
              {record.datasetName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#66706A] hover:text-[#18201C] hover:bg-[#EAE8E1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1 text-xs">
          {/* Provenance Badge */}
          <div className="p-4 rounded bg-[#E3EDE7] border border-[#28704D]/30 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#28704D] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-[#18201C] flex items-center gap-2">
                <span>TREASURY AUDIT VERIFIED</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FFFFFF] text-[#28704D] border border-[#28704D]/40 font-bold">
                  SEAL VALID
                </span>
              </div>
              <p className="text-[#18201C] text-xs mt-0.5">
                Source Provenance: <strong className="text-[#164A3A]">{record.sourceType}</strong>
              </p>
              <p className="text-[#66706A] text-[11px] mt-1 leading-relaxed">
                {record.sourceType === 'Union Budget / PFMS'
                  ? 'Sanction order verified against Public Financial Management System expenditure feed.'
                  : record.sourceType === 'Government Open Data'
                  ? 'Extracted directly from Open Government Data Platform India (data.gov.in catalogue).'
                  : 'Official state administrative register entry cross-referenced against LGD spatial boundary and Treasury ledger.'}
              </p>
            </div>
          </div>

          {/* Record Details Grid */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold">
              Extracted Telemetry Fields
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">SCHEME IDENTIFIER</span>
                <span className="font-mono font-bold text-[#18201C] text-xs">{record.schemeId}</span>
                <span className="text-[#66706A] block text-[11px] mt-0.5 truncate">{record.schemeName}</span>
              </div>

              <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">GEOGRAPHIC UNIT</span>
                <span className="font-mono font-bold text-[#18201C] text-xs">{record.district}</span>
                <span className="text-[#66706A] block text-[11px] mt-0.5">{record.state}</span>
              </div>

              <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">ALLOCATED CAPITAL</span>
                <span className="font-mono font-bold text-[#18201C] text-sm">
                  ₹{record.allocatedCr} Cr
                </span>
              </div>

              <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">ACTUAL EXPENDITURE</span>
                <span className="font-mono font-bold text-[#164A3A] text-sm">
                  ₹{record.utilizedCr} Cr
                </span>
                <span className="text-[#66706A] text-[10px] block mt-0.5">
                  Utilization: {((record.utilizedCr / record.allocatedCr) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">VERIFIED BENEFICIARIES</span>
                <span className="font-mono font-bold text-[#18201C] text-sm">
                  {record.beneficiaries.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
                <span className="text-[#66706A] text-[10px] block font-semibold">PHYSICAL OUTCOME SCORE</span>
                <span className="font-mono font-bold text-[#28704D] text-sm">
                  {record.outcomeScore} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Used In Cross-Reference */}
          <div className="p-3.5 rounded bg-[#F9F4EB] border border-[#B58A45]/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B58A45] font-bold block mb-1">
              USED IN INTELLIGENCE SIGNAL:
            </span>
            <p className="font-bold text-xs text-[#18201C]">{record.usedIn}</p>
            <p className="text-[11px] text-[#66706A] mt-1">
              This record was consumed by the SUTRA Gap & Overlap detection algorithms to ground recommendations in verifiable financial and physical evidence.
            </p>
          </div>

          {/* Source Link */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold block mb-1.5">
              OFFICIAL VERIFICATION REPOSITORY
            </span>
            <a
              href={record.primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-[#164A3A] font-semibold hover:underline"
            >
              <span className="truncate">{record.primarySourceUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE8E1] bg-[#F4F2EC] flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#66706A]">
            VERIFIED AT: {record.lastUpdated}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#FFFFFF] border border-[#D8D6CE] text-xs font-semibold text-[#18201C] hover:bg-[#EAE8E1] transition-colors"
          >
            Dismiss Record
          </button>
        </div>
      </div>
    </div>
  );
}
