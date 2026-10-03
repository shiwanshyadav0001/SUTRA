'use client';

import React from 'react';
import { X, Printer, Shield, CheckCircle2 } from 'lucide-react';
import { District } from '@/lib/types';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District;
}

export function ExecutiveBriefModal({ isOpen, onClose, district }: ExecutiveBriefModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
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
              <strong className="text-slate-900 text-xs font-semibold">{district.code}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Generation Date</span>
              <strong className="text-slate-900 text-xs font-semibold">October 2026</strong>
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
              {district.name} district exhibits a <strong className="text-rose-700">{district.gapPercentagePoints} percentage point deficit</strong> in statutory programme coverage relative to the 64% regional administrative benchmark. While eligible smallholder demand stands at {district.eligibleDemandIndex}/100, capital fund drawdown has lagged at {district.fundUtilizationRate}%.
            </p>
          </div>

          {/* Root Factors */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-1.5">
              2. Decomposed Attribution Factors
            </h3>
            <div className="space-y-1.5 font-mono text-[11px] bg-slate-50 p-3.5 rounded-md border border-slate-200 text-slate-700">
              <div className="flex justify-between items-center py-0.5">
                <span>01. Low Fund Drawdown Velocity</span>
                <strong className="text-slate-900 font-semibold">31% Weight</strong>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>02. Milestone Geo-Tagging Approval Delays</span>
                <strong className="text-slate-900 font-semibold">27% Weight</strong>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>03. Smallholder Direct Banking Validation Lags</span>
                <strong className="text-slate-900 font-semibold">23% Weight</strong>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>04. Inter-District Logistics Overhead</span>
                <strong className="text-slate-900 font-semibold">19% Weight</strong>
              </div>
            </div>
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
                <strong className="text-slate-900">Expedited Second Tranche Release:</strong> Mandate district treasury release of ₹8.3 Cr capital under Record #9281 upon mobile plinth verification.
              </li>
              <li>
                <strong className="text-slate-900">Telemetry Sync:</strong> Connect rural water flow sensors in 42 habitations to the central Jal Jeevan Mission national dashboard.
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
