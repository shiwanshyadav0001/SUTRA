'use client';

import React, { useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface RoleContextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleContextModal({ isOpen, onClose }: RoleContextModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Apex desk context"
    >
      <div
        className="bg-white border border-slate-200 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                  NATIONAL OVERSIGHT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  LEVEL-1 APEX CLEARANCE
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5 font-editorial">
                PMO Apex Governance Desk
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Statutory Credential Card */}
          <div className="p-4 rounded-md bg-blue-50/60 border border-blue-200 text-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                Statutory Governance Audit Authority
              </span>
              <span className="font-mono text-[10px] text-blue-700">Desk Ref: APEX-MH-DEMO-01</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Operating under Cabinet Secretariat statutory oversight mandates for inter-ministerial capital expenditure reconciliation, delivery tracking, and programmatic convergence.
            </p>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              AUDIT CREDENTIAL DETAILS
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] text-slate-500 block">JURISDICTION</span>
                <span className="font-bold text-slate-900 mt-0.5 block">State of Maharashtra</span>
                <span className="text-[10px] text-slate-500">36 Districts (LGD Core)</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] text-slate-500 block">MINISTRY COVERAGE</span>
                <span className="font-bold text-slate-900 mt-0.5 block">5 Central Ministries</span>
                <span className="text-[10px] text-slate-500">Jal Shakti, MoRD, Agri</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] text-slate-500 block">LEDGER INTEGRATION</span>
                <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PFMS Treasury Link
                </span>
                <span className="text-[10px] text-slate-500">Expenditure Drawdown</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] text-slate-500 block">CRYPTOGRAPHIC TOKEN</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate">
                  SHA256: illustrative seal
                </span>
                <span className="text-[10px] text-slate-500">Demo Session Marker</span>
              </div>
            </div>
          </div>

          {/* Connected Sovereign Feeds */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block text-xs">Active Verification Gateways:</span>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                data.gov.in APIv2
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                MoPR LGD Census 2011
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                AwaasSoft MoRD API
              </span>
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                JJM IMIS Live Portal
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Demo console • No live government system connection</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
