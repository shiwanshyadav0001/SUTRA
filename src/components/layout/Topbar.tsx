'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { useIntelligence } from '@/context/IntelligenceContext';

export function Topbar() {
  const pathname = usePathname();
  const { openEngineSpec } = useIntelligence();

  return (
    <header className="h-16 border-b border-[#D8D6CE] bg-[#FFFFFF] px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Governance Command Center */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-sm font-bold tracking-tight text-[#18201C] font-editorial uppercase">
            GOVERNANCE COMMAND CENTER
          </h1>
          <p className="text-[10px] uppercase font-mono tracking-[0.12em] text-[#66706A] font-medium">
            National Programme Intelligence
          </p>
        </div>
      </div>

      {/* Right Tools: Search, Notifications, Data status, Officer profile */}
      <div className="flex items-center space-x-4 text-xs">
        {/* Search */}
        <Link
          href="/query"
          className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-xs text-[#66706A] hover:border-[#164A3A] hover:text-[#18201C] transition-all w-56 md:w-64"
        >
          <Search className="w-3.5 h-3.5 text-[#164A3A]" />
          <span className="truncate text-xs font-normal">Search programmes or queries...</span>
          <kbd className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FFFFFF] text-[#898E89] border border-[#D8D6CE]">
            ⌘K
          </kbd>
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 rounded hover:bg-[#F4F2EC] text-[#66706A] hover:text-[#18201C] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B56B32]" />
        </button>

        {/* Data Status */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
          <span className="w-2 h-2 rounded-full bg-[#28704D]" />
          <span className="font-mono text-[10px] tracking-wider text-[#18201C] font-bold">
            DATA LIVE
          </span>
        </div>

        {/* Officer Profile */}
        <div className="flex items-center space-x-2.5 pl-3 border-l border-[#D8D6CE]">
          <div className="w-7 h-7 rounded bg-[#164A3A] flex items-center justify-center text-white font-mono text-xs font-bold">
            P
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#18201C] leading-tight">
              Officer Profile
            </p>
            <p className="text-[10px] text-[#66706A] font-mono">
              PMO Apex Desk
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
