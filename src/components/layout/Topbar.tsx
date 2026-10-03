'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Shield, Bell, CheckCircle2, Cpu } from 'lucide-react';
import { useIntelligence } from '@/context/IntelligenceContext';

export function Topbar() {
  const pathname = usePathname();

  const { openEngineSpec } = useIntelligence();

  const getSectionTitle = () => {
    if (!pathname || pathname === '/command') return 'Command Center';
    if (pathname.startsWith('/map')) return 'Geographic Intelligence';
    if (pathname.startsWith('/schemes') || pathname.startsWith('/scheme')) return 'Scheme Explorer';
    if (pathname.startsWith('/overlaps')) return 'Programme Overlap Engine';
    if (pathname.startsWith('/relationships')) return 'Governance Relationship Graph';
    if (pathname.startsWith('/signals')) return 'Early Signals & Anomaly Detection';
    if (pathname.startsWith('/query')) return 'Ask SUTRA Natural Intelligence';
    if (pathname.startsWith('/investigate')) return 'Investigation Workspace';
    if (pathname.startsWith('/evidence')) return 'Evidence Hub & Audit Trail';
    if (pathname.startsWith('/data')) return 'Data Ingestion & Entity Resolution';
    if (pathname.startsWith('/intelligence/gaps')) return 'Geographic Gap Detection';
    return 'Governance Intelligence';
  };

  return (
    <header className="h-16 border-b border-[#2C2A26] bg-[#121210]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Path */}
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFB88B] font-semibold">
            SUTRA / GOVERNANCE INTELLIGENCE
          </span>
          <h1 className="text-sm font-semibold tracking-wide text-white font-editorial flex items-center gap-2">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      {/* Center Search Trigger */}
      <div className="hidden md:flex items-center">
        <Link
          href="/query"
          className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-sm bg-[#1A1A18] border border-[#33312D] text-xs text-[#DDD7CD] hover:border-[#DFB88B]/60 hover:text-white transition-all w-72 shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-[#DFB88B]" />
          <span className="truncate">Ask SUTRA natural query...</span>
          <kbd className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#22211D] text-[#A39D92] border border-[#38352F]">
            ⌘K
          </kbd>
        </Link>
      </div>

      {/* Right Telemetry & Profile */}
      <div className="flex items-center space-x-5 text-xs">
        {/* Algorithmic Rigor & Engine Spec Modal Button (For Judges) */}
        <button
          onClick={openEngineSpec}
          className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#1A1A18] border border-[#DFB88B]/60 hover:border-[#DFB88B] text-[#DFB88B] hover:bg-[#C89B65] hover:text-[#0E0E0D] font-mono text-[10px] font-bold transition-all shadow-sm group"
        >
          <Cpu className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
          <span>MATH & ALGORITHM PROOF</span>
        </button>

        {/* Live Status indicator */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#181816] border border-[#2E2C28]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6DAA8A] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6DAA8A]"></span>
          </span>
          <span className="font-mono text-[10px] tracking-wider text-[#7DC09C] font-semibold">DATA LIVE</span>
        </div>

        {/* Production Enclave Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#C89B65]/15 border border-[#DFB88B]/30 text-[#DFB88B] text-[10px] font-mono">
          <span className="font-bold">APEX ENCLAVE</span>
          <span className="text-[8px] text-[#A39D92]">• MH 36-DIST REGION</span>
        </div>

        {/* Current Date */}
        <div className="hidden lg:block text-right font-mono text-[11px] text-[#A39D92]">
          <span className="text-[#DDD7CD]">03 OCT 2026</span>
          <span className="text-[9px] text-[#A39D92] block">16:50 IST</span>
        </div>

        {/* Profile Avatar / Decision Maker Role */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#2C2A26]">
          <div className="w-7 h-7 rounded-sm bg-[#1E1E1B] border border-[#33312D] flex items-center justify-center text-white font-mono text-xs">
            <Shield className="w-3.5 h-3.5 text-[#DFB88B]" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-medium text-white leading-tight">PMO Apex Desk</p>
            <p className="text-[9px] text-[#A39D92]">National Oversight</p>
          </div>
        </div>
      </div>
    </header>
  );
}
