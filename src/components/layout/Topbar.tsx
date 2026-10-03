'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Shield,
  Cpu,
  Radio,
  Globe2,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { formatDeterministicIST } from '@/lib/formatters';

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
      setCurrentDateTime(formatDeterministicIST(new Date()));
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
    <header className="h-16 border-b border-[#1E293B] bg-[#0B132B] pl-14 pr-3 sm:px-6 md:pl-6 flex items-center justify-between sticky top-0 z-20 shadow-md">
      {/* Group 1: Title & Operational Scope Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="truncate">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-mono tracking-wider text-slate-400">
            <span>SUTRA</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold truncate">SOVEREIGN CORE</span>
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white font-editorial truncate">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      {/* Group 2: Center Ask SUTRA Quick Query Bar */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <form onSubmit={handleHeaderSearchSubmit} className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ask SUTRA natural query..."
            value={headerSearchQuery}
            onChange={(e) => setHeaderSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-1.5 bg-[#080E21] border border-[#233560] rounded-md text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#132247] text-slate-300 border border-[#233560] hover:text-white hover:border-cyan-400 transition-colors"
            title="Open Command Palette (⌘K)"
          >
            ⌘K
          </button>
        </form>
      </div>

      {/* Group 3: Visually Separated Status Clusters */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
        {/* Sub-cluster A: Audit & Mathematical Proof */}
        <button
          onClick={openEngineSpec}
          className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-[#0D1C3D] border border-[#1E3A8A] hover:border-cyan-400 text-blue-200 hover:text-white font-mono text-[11px] font-semibold transition-all shadow-xs group"
          title="Inspect Mathematical Formulations & Zero-Hallucination Guarantees"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span className="hidden xl:inline">MATH PROOF</span>
        </button>

        {/* Sub-cluster B: Live Telemetry & Event Pulse */}
        <button
          onClick={() => setIsTelemetryModalOpen(true)}
          className="inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-[#082235] border border-[#0E4968] hover:border-cyan-400 text-cyan-200 text-xs font-mono shadow-xs transition-colors"
          title="Click to view Live Event Mesh and Source Health"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveStreaming ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveStreaming ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
          </span>
          <span className="text-[11px] font-bold text-white hidden sm:inline">
            {liveMode === 'VERIFIED_SOURCE' ? 'VERIFIED DATA' : 'LIVE SIMULATION'}
          </span>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold hidden lg:inline ${
              liveMode === 'VERIFIED_SOURCE'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            {liveMode === 'VERIFIED_SOURCE' ? 'OFFICIAL CADENCE' : 'SYNTHETIC STREAM'}
          </span>
        </button>

        {/* Sub-cluster C: Geographic Scope Filter */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2 py-1 rounded-md bg-[#080E21] border border-[#233560] text-slate-200">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={regionalScope}
            onChange={handleScopeChange}
            className="bg-transparent text-xs text-white focus:outline-none font-mono cursor-pointer pr-1"
          >
            <option value="ALL_MH" className="bg-[#0B132B] text-white">All Maharashtra (State)</option>
            {MAHARASHTRA_DISTRICTS.map((d) => (
              <option key={d.code} value={d.name} className="bg-[#0B132B] text-white">
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {/* Sub-cluster D: Dynamic Clock */}
        <div className="hidden xl:flex items-center space-x-1.5 text-[11px] font-mono text-slate-400 px-2 py-1 bg-[#080E21] rounded-md border border-[#1E293B]">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{currentDateTime || 'LIVE IST'}</span>
        </div>

        {/* Sub-cluster E: PMO Apex Oversight Context */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center space-x-2 pl-2 pr-2.5 py-1 rounded-md bg-[#1E293B] border border-[#334155] hover:border-amber-400 text-amber-200 hover:text-white transition-all shadow-xs"
          title="Apex Desk Authority & Audit Certificate"
        >
          <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
            GOI
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-bold block text-white leading-none">PMO Apex Desk</span>
            <span className="text-[9px] text-amber-300 font-mono leading-none">Level 1 Clearance</span>
          </div>
        </button>
      </div>
    </header>
  );
}
