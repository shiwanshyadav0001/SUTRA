'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Shield,
  Cpu,
  Radio,
  ChevronDown,
  Globe2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    openEngineSpec,
    setIsTelemetryModalOpen,
    setIsCommandPaletteOpen,
    setIsRoleModalOpen,
    regionalScope,
    setRegionalScope,
    setSelectedDistrict,
    liveMode,
    isLiveStreaming,
  } = useIntelligence();

  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Live dynamic clock updating every 30s
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      setCurrentDateTime(`${day} • ${time} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSectionTitle = () => {
    if (!pathname || pathname === '/command') return 'Command Center';
    if (pathname.startsWith('/investigate')) return 'Investigation Workspace';
    if (pathname.startsWith('/investigation')) return 'Investigation Detail';
    if (pathname.startsWith('/map')) return 'Geographic Intelligence';
    if (pathname.startsWith('/schemes') || pathname.startsWith('/scheme')) return 'Scheme Explorer';
    if (pathname.startsWith('/overlaps')) return 'Programme Overlap Engine';
    if (pathname.startsWith('/relationships')) return 'Governance Relationship Graph';
    if (pathname.startsWith('/signals')) return 'Early Signals & Anomaly Detection';
    if (pathname.startsWith('/query')) return 'Ask SUTRA Natural Intelligence';
    if (pathname.startsWith('/evidence')) return 'Evidence Hub & Audit Trail';
    if (pathname.startsWith('/data')) return 'Data Ingestion & Entity Resolution';
    if (pathname.startsWith('/intelligence/gaps')) return 'Geographic Gap Detection';
    return 'Governance Intelligence';
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      router.push(`/query?q=${encodeURIComponent(headerSearchQuery.trim())}`);
    } else {
      setIsCommandPaletteOpen(true);
    }
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRegionalScope(val);
    if (val === 'ALL_MH') {
      // keep current or default
    } else {
      const matched = MAHARASHTRA_DISTRICTS.find((d) => d.name === val || d.id === val);
      if (matched) setSelectedDistrict(matched);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="truncate">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-wider text-slate-500">
            <span>SUTRA</span>
            <span>/</span>
            <span className="text-blue-700 font-semibold truncate">SOVEREIGN CORE</span>
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 font-editorial truncate">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      {/* Center Ask SUTRA Quick Input (Submits on Enter or Opens ⌘K) */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <form onSubmit={handleHeaderSearchSubmit} className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ask SUTRA natural query..."
            value={headerSearchQuery}
            onChange={(e) => setHeaderSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-xs"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 hover:text-slate-800 hover:border-slate-300 transition-colors"
            title="Open Command Palette"
          >
            ⌘K
          </button>
        </form>
      </div>

      {/* Right Telemetry, Scope, and Profile Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
        {/* Math & Algorithm Proof Modal Button */}
        <button
          onClick={openEngineSpec}
          className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 font-mono text-[11px] font-semibold transition-all shadow-xs group"
          title="Inspect Mathematical Formulations & Zero-Hallucination Guarantees"
        >
          <Cpu className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-45 transition-transform" />
          <span className="hidden xl:inline">MATH PROOF</span>
        </button>

        {/* Live Event Stream Indicator Button */}
        <button
          onClick={() => setIsTelemetryModalOpen(true)}
          className="inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-mono shadow-xs transition-colors"
          title="Click to view Live Event Mesh and Source Health"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveStreaming ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveStreaming ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </span>
          <span className="text-[11px] font-bold text-slate-800 hidden sm:inline">DATA LIVE</span>
          <span
            className={`text-[9px] px-1 py-0.2 rounded font-semibold hidden lg:inline ${
              liveMode === 'VERIFIED_SOURCE'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {liveMode === 'VERIFIED_SOURCE' ? 'VERIFIED' : 'SIM'}
          </span>
        </button>

        {/* Region Scope Dropdown Selector */}
        <div className="relative inline-flex items-center">
          <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-blue-50/70 border border-blue-200 text-blue-900 text-xs font-mono">
            <Globe2 className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
            <select
              value={regionalScope}
              onChange={handleScopeChange}
              className="bg-transparent text-xs font-semibold text-blue-900 border-none focus:outline-none cursor-pointer pr-1"
              title="Filter territorial scope across SUTRA"
            >
              <option value="ALL_MH">Maharashtra (All 36 Districts)</option>
              <option value="Nandurbar">Nandurbar (LGD 512)</option>
              <option value="Gadchiroli">Gadchiroli (LGD 501)</option>
              <option value="Washim">Washim (LGD 525)</option>
              <option value="Pune">Pune (LGD 521)</option>
              <option value="Dhule">Dhule (LGD 498)</option>
              <option value="Yavatmal">Yavatmal (LGD 526)</option>
            </select>
          </div>
        </div>

        {/* Dynamic IST Timestamp */}
        <div className="hidden 2xl:flex items-center space-x-1.5 text-right font-mono text-[11px] text-slate-500">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{currentDateTime || '03 OCT 2026 • 19:45 IST'}</span>
        </div>

        {/* PMO Apex Desk Role Indicator (Clickable to view audit clearance) */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center space-x-2 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity text-left cursor-pointer"
          title="Click to view PMO Apex clearance and audit credentials"
        >
          <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center font-mono text-xs shadow-xs">
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">PMO Apex Desk</p>
            <p className="text-[10px] text-slate-500 font-mono">National Oversight</p>
          </div>
        </button>
      </div>
    </header>
  );
}
