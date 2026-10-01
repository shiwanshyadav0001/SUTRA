'use client';

import React from 'react';
import { X, Printer, Download, Shield, CheckCircle2 } from 'lucide-react';
import { District } from '@/lib/types';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District;
}

export function ExecutiveBriefModal({ isOpen, onClose, district }: ExecutiveBriefModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#F3F0E8] text-[#0D0D0C] rounded-sm shadow-2xl overflow-hidden flex flex-col font-editorial max-h-[90vh]">
        {/* Institutional Memo Header */}
        <div className="p-6 bg-[#0D0D0C] text-[#F3F0E8] border-b border-[#2A2926] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#191917] border border-[#B78A5A] flex items-center justify-center text-[#B78A5A] font-bold text-xs">
              GOI
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase block">
                PRIME MINISTER&apos;S OFFICE • NITI AAYOG APEX DESK
              </span>
              <h2 className="text-base font-bold tracking-tight text-[#F3F0E8]">
                STRATEGIC GOVERNANCE BRIEFING MEMORANDUM
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#8E887E] hover:text-[#F3F0E8] hover:bg-[#191917]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Memo Body */}
        <div className="p-8 space-y-6 overflow-y-auto text-xs leading-relaxed">
          {/* Metadata Grid */}
          <div className="border-b border-[#0D0D0C]/20 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
            <div>
              <span className="text-[#8E887E] block text-[9px] uppercase">SUBJECT TERRITORY</span>
              <strong className="text-[#0D0D0C] text-xs">{district.name}, MH</strong>
            </div>
            <div>
              <span className="text-[#8E887E] block text-[9px] uppercase">LGD CODE</span>
              <strong className="text-[#0D0D0C] text-xs">{district.code}</strong>
            </div>
            <div>
              <span className="text-[#8E887E] block text-[9px] uppercase">DATE OF GENERATION</span>
              <strong className="text-[#0D0D0C] text-xs">02 OCT 2026</strong>
            </div>
            <div>
              <span className="text-[#8E887E] block text-[9px] uppercase">SECURITY TIER</span>
              <strong className="text-[#A66A62] text-xs">OFFICIAL USE ONLY</strong>
            </div>
          </div>

          {/* Finding */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-[#0D0D0C] mb-1">
              1. EXECUTIVE FINDING: TERRITORIAL COVERAGE DEFICIT
            </h3>
            <p className="text-[#2A2926]">
              {district.name} district exhibits a <strong>{district.gapPercentagePoints} percentage point deficit</strong> in statutory programme coverage relative to the 64% regional administrative benchmark. While eligible smallholder demand stands at {district.eligibleDemandIndex}/100, capital fund drawdown has lagged at {district.fundUtilizationRate}%.
            </p>
          </div>

          {/* Root Factors */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-[#0D0D0C] mb-2">
              2. DECOMPOSED ATTRIBUTION FACTORS
            </h3>
            <div className="space-y-1.5 font-mono text-[11px] bg-white p-4 rounded border border-[#0D0D0C]/10">
              <div className="flex justify-between">
                <span>01. Low Fund Drawdown Velocity</span>
                <strong>31% Weight</strong>
              </div>
              <div className="flex justify-between">
                <span>02. Milestone Geo-Tagging Approval Delays</span>
                <strong>27% Weight</strong>
              </div>
              <div className="flex justify-between">
                <span>03. Smallholder Direct Banking Validation Lags</span>
                <strong>23% Weight</strong>
              </div>
              <div className="flex justify-between">
                <span>04. Inter-District Logistics Overhead</span>
                <strong>19% Weight</strong>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-[#0D0D0C] mb-1">
              3. IMMEDIATE ACTION DIRECTIVES
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-[#2A2926]">
              <li>
                <strong>Single-Window Cluster Verification:</strong> Harmonize PKVY and MOVCDNER organic farmer registries to eliminate duplicate sanction orders.
              </li>
              <li>
                <strong>Expedited Second Tranche Release:</strong> Mandate district treasury release of ₹8.3 Cr capital under Record #9281 upon mobile plinth verification.
              </li>
              <li>
                <strong>Telemetry Sync:</strong> Connect rural water flow sensors in 42 habitations to the central Jal Jeevan Mission national dashboard.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#0D0D0C]/10 flex items-center justify-between font-mono text-[11px]">
          <span className="text-[#8E887E]">VERIFIED BY SUTRA GOVERNANCE INTELLIGENCE</span>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-[#0D0D0C] text-[#F3F0E8] font-bold hover:bg-[#2A2926] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
