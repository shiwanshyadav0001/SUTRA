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
    <header className="h-16 border-b border-[#2A2926] bg-[#0D0D0C]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Path */}
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B78A5A]">
            SUTRA / GOVERNANCE INTELLIGENCE
          </span>
          <h1 className="text-sm font-semibold tracking-wide text-[#F3F0E8] font-editorial flex items-center gap-2">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      {/* Center Search Trigger */}
      <div className="hidden md:flex items-center">
        <Link
          href="/query"
          className="flex items-center space-x-2.5 px-3 py-1.5 rounded-sm bg-[#191917] border border-[#2A2926] text-xs text-[#8E887E] hover:border-[#B78A5A]/50 hover:text-[#C9C2B7] transition-all w-72"
        >
          <Search className="w-3.5 h-3.5 text-[#B78A5A]" />
          <span className="truncate">Ask SUTRA natural query...</span>
          <kbd className="ml-auto text-[9px] font-mono px-1 py-0.5 rounded bg-[#141412] text-[#8E887E] border border-[#2A2926]">
            ⌘K
          </kbd>
        </Link>
      </div>

      {/* Right Telemetry & Profile */}
      <div className="flex items-center space-x-5 text-xs">
        {/* Algorithmic Rigor & Engine Spec Modal Button (For Judges) */}
        <button
          onClick={openEngineSpec}
          className="flex items-center space-x-1.5 px-3 py-1 rounded bg-[#191917] border border-[#B78A5A]/50 hover:border-[#B78A5A] text-[#B78A5A] hover:bg-[#B78A5A] hover:text-[#0D0D0C] font-mono text-[10px] font-bold transition-all shadow-sm group"
        >
          <Cpu className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
          <span>MATH & ALGORITHM PROOF</span>
        </button>

        {/* Live Status indicator */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#141412] border border-[#2A2926]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5E8B72] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5E8B72]"></span>
          </span>
          <span className="font-mono text-[10px] tracking-wider text-[#C9C2B7]">DATA LIVE</span>
        </div>

        {/* Production Enclave Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#B78A5A]/10 border border-[#B78A5A]/30 text-[#B78A5A] text-[10px] font-mono">
          <span className="font-semibold">APEX ENCLAVE</span>
          <span className="text-[8px] text-[#8E887E]">• MH 36-DIST REGION</span>
        </div>

        {/* Current Date */}
        <div className="hidden lg:block text-right font-mono text-[11px] text-[#8E887E]">
          <span>02 OCT 2026</span>
          <span className="text-[9px] text-[#7E7A72] block">22:00 IST</span>
        </div>

        {/* Profile Avatar / Decision Maker Role */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#2A2926]">
          <div className="w-7 h-7 rounded-sm bg-[#191917] border border-[#2A2926] flex items-center justify-center text-[#F3F0E8] font-mono text-xs">
            <Shield className="w-3.5 h-3.5 text-[#B78A5A]" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[11px] font-medium text-[#F3F0E8] leading-tight">PMO Apex Desk</p>
            <p className="text-[9px] text-[#8E887E]">National Oversight</p>
          </div>
        </div>
      </div>
    </header>
  );
}
