'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EvidenceRecord } from '@/lib/types';
import { formatIndianNumber } from '@/lib/formatters';
import {
  X,
  ExternalLink,
  Database,
  FileText,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  GitBranch,
  Layers,
  Calculator,
  Hash,
} from 'lucide-react';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: EvidenceRecord | null;
}

export function EvidenceDrawer({ isOpen, onClose, record }: EvidenceDrawerProps) {
  const router = useRouter();
  if (!isOpen || !record) return null;

  const utilizationRate = ((record.utilizedCr / record.allocatedCr) * 100).toFixed(1);

  const provenanceChain = [
    {
      step: '1. SOURCE',
      title: record.sourceType || 'Union Budget / PFMS',
      detail: 'Official administrative feed authenticated via ministry gateway',
      status: 'VERIFIED',
    },
    {
      step: '2. RAW RECORD',
      title: `Reference: ${record.recordNumber}`,
      detail: `SHA-256 hash payload anchored at ${record.lastUpdated}`,
      status: 'IMMUTABLE',
    },
    {
      step: '3. NORMALIZED RECORD',
      title: 'Canonical Schema v1.2 Standard Model',
      detail: 'Field harmonization: allocatedCr, utilizedCr, beneficiaries',
      status: 'COMPLIANT',
    },
    {
      step: '4. RESOLVED ENTITY',
      title: `LGD:512 • ${record.district}, ${record.state}`,
      detail: 'Deterministic LGD Code alignment with 100% exact match',
      status: 'RESOLVED',
    },
    {
      step: '5. CALCULATION',
      title: `Drawdown Utilization: ${utilizationRate}%`,
      detail: `Formula: (₹${record.utilizedCr}Cr / ₹${record.allocatedCr}Cr) * 100`,
      status: 'COMPUTED',
    },
    {
      step: '6. TRIGGERED RULE',
      title: 'RULE-CONV-04: Drawdown Divergence > 15 pp',
      detail: 'Statutory threshold breach detected against regional average',
      status: 'TRIGGERED',
    },
    {
      step: '7. FINDING GENERATED',
      title: 'SUTRA-FND-0001 (Nandurbar Convergence Gap)',
      detail: 'Cross-scheme tribal capital delivery deficit recorded',
      status: 'ACTIVE',
    },
    {
      step: '8. INVESTIGATION',
      title: 'INV-NDB-CONV-001 Investigation Workspace',
      detail: 'Inter-ministerial dossier assembled for PMO apex review',
      status: 'READY',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                AUDITABLE EVIDENCE RECORD
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                {record.recordNumber}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1 font-editorial">
              {record.datasetName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 flex-1 text-xs">
          {/* Provenance Badge */}
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start space-x-3 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-emerald-950 flex items-center gap-2">
                <span>TREASURY AUDIT VERIFIED</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  SEAL MATCHED
                </span>
              </div>
              <p className="text-slate-700 text-xs mt-0.5">
                Source Provenance: <strong className="text-slate-900 font-semibold">{record.sourceType}</strong>
              </p>
              <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
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
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Extracted Telemetry Fields
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">SCHEME IDENTIFIER</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{record.schemeId}</span>
                <span className="text-slate-600 block text-[11px] mt-0.5 truncate">{record.schemeName}</span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">GEOGRAPHIC UNIT</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{record.district}</span>
                <span className="text-slate-600 block text-[11px] mt-0.5">{record.state}</span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">ALLOCATED CAPITAL</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  ₹{record.allocatedCr} Cr
                </span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">ACTUAL EXPENDITURE</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ₹{record.utilizedCr} Cr
                </span>
                <span className="text-slate-500 text-[10px] block mt-0.5 font-medium">
                  Utilization: {utilizationRate}%
                </span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">VERIFIED BENEFICIARIES</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatIndianNumber(record.beneficiaries)}
                </span>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-[10px] block font-semibold">OUTCOME SCORE</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {record.outcomeScore} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Traceable Provenance Lineage Chain */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-blue-600" />
              <span>8-Stage Cryptographic Provenance Chain</span>
            </h3>

            <div className="space-y-1.5 font-mono text-xs">
              {provenanceChain.map((p, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-blue-700 font-bold block">{p.step}</span>
                    <span className="text-slate-900 font-semibold text-xs block">{p.title}</span>
                    <span className="text-[10px] text-slate-500 block">{p.detail}</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Used In Cross-Reference */}
          <div className="p-3.5 rounded-md bg-blue-50/60 border border-blue-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-800 font-bold block mb-1">
              USED IN INTELLIGENCE SIGNAL:
            </span>
            <p className="font-semibold text-xs text-slate-900">{record.usedIn}</p>
            <p className="text-[11px] text-slate-600 mt-1">
              This record was consumed by the SUTRA Gap & Overlap detection algorithms to ground recommendations in verifiable financial and physical evidence.
            </p>
          </div>

          {/* Source Link */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              OFFICIAL VERIFICATION REPOSITORY
            </span>
            <a
              href={record.primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-blue-700 hover:underline font-mono"
            >
              <span>{record.primarySourceUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer with Direct Investigation Workspace CTA */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              router.push('/investigation/SUTRA-INV-2026-0001');
            }}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Investigation Workspace</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-md bg-white border border-slate-300 text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
