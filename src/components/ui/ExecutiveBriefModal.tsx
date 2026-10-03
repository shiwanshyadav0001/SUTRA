'use client';

import React, { useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { District } from '@/lib/types';
import { SIGNALS_DATA } from '@/lib/data/governance-data';
import { formatDeterministicDate } from '@/lib/formatters';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District;
}

export function ExecutiveBriefModal({ isOpen, onClose, district }: ExecutiveBriefModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unabsorbedCr = Math.max(
    0,
    district.budgetAllocatedCr - district.fundUtilizedCr
  ).toFixed(1);
  const districtSignal = SIGNALS_DATA.find(
    (s) => s.districtName?.toLowerCase() === district.name.toLowerCase()
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Governance briefing for ${district.name}`}
    >
      <div
        className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Institutional Memo Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs font-mono">
              GOI
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-300 uppercase block font-semibold">
                Cabinet Secretariat &bull; PMO Apex Governance Desk
              </span>
              <h2 className="text-base font-bold tracking-tight text-white">
                Strategic Governance Briefing Memorandum
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Memo Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs leading-relaxed">
          {/* Metadata Grid */}
          <div className="border-b border-slate-200 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Territory</span>
              <strong className="text-slate-900 text-xs font-semibold">{district.name}, MH</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">LGD Code</span>
              <strong className="text-slate-900 text-xs font-semibold">{district.lgdCode || 'Not mapped'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Generation Date</span>
              <strong className="text-slate-900 text-xs font-semibold">{formatDeterministicDate(new Date())}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Security Tier</span>
              <strong className="text-amber-700 text-xs font-semibold">OFFICIAL APEX DESK</strong>
            </div>
          </div>

          {/* Finding */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5">
              1. Executive Finding: Territorial Coverage Deficit
            </h3>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200 leading-normal">
              {district.name} district exhibits a <strong className="text-rose-700">{district.gapPercentagePoints} percentage point deficit</strong> in statutory programme coverage relative to the {district.regionalBenchmarkRate}% regional administrative benchmark. While eligible demand stands at {district.eligibleDemandIndex}/100, capital fund drawdown is recorded at {district.fundUtilizationRate}%.
            </p>
          </div>

          {/* Root Factors — district's live early-signal attribution when one
              exists, otherwise the district's own recorded gap factors. */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5">
              2. Decomposed Attribution Factors
            </h3>
            {districtSignal ? (
              <div className="space-y-1.5 font-mono text-[11px] bg-slate-50 p-3.5 rounded-md border border-slate-200 text-slate-700">
                {districtSignal.factors.map((f, i) => (
                  <div key={i} className="flex justify-between items-center py-0.5">
                    <span>0{i + 1}. {f.title}</span>
                    <strong className="text-slate-900 font-semibold">{f.value}% Weight</strong>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700 bg-slate-50 p-3.5 rounded-md border border-slate-200">
                {district.flagFactors.length > 0 ? (
                  district.flagFactors.map((f, i) => <li key={i}>{f}</li>)
                ) : (
                  <li>No gap factors recorded for this district — coverage meets the regional benchmark.</li>
                )}
              </ul>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5">
              3. Immediate Action Directives
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                <strong className="text-slate-900">Single-Window Cluster Verification:</strong> Harmonize PKVY and MOVCDNER organic farmer registries to eliminate duplicate sanction orders.
              </li>
              <li>
                <strong className="text-slate-900">Expedited Tranche Release:</strong> Mandate district treasury review of ₹{unabsorbedCr} Cr in unabsorbed capital (allocated ₹{district.budgetAllocatedCr} Cr, utilized ₹{district.fundUtilizedCr} Cr) upon field verification.
              </li>
              <li>
                <strong className="text-slate-900">Telemetry Sync:</strong> Connect rural water flow sensors to the central Jal Jeevan Mission dashboard for auditable completion telemetry.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-500 text-[11px]">VERIFIED BY SUTRA GOVERNANCE INTELLIGENCE</span>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
