'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SutraOfficialAnimatedLogo } from '@/components/brand/SutraOfficialAnimatedLogo';
import {
  LayoutDashboard,
  Layers,
  MapPin,
  FolderKanban,
  Network,
  AlertTriangle,
  Search,
  Database,
  ArrowRightLeft,
  Settings,
  ChevronRight,
  ShieldAlert,
  Compass,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  symbol: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Command', href: '/command', icon: LayoutDashboard, symbol: '⌂' },
  { name: 'Investigate', href: '/investigate', icon: Compass, badge: 'V2', symbol: '✦' },
  { name: 'Intelligence', href: '/overlaps', icon: Layers, symbol: '◎' },
  { name: 'Geography', href: '/map', icon: MapPin, symbol: '⌖' },
  { name: 'Schemes', href: '/schemes', icon: FolderKanban, symbol: '◇' },
  { name: 'Relationships', href: '/relationships', icon: Network, symbol: '⌁' },
  { name: 'Signals', href: '/signals', icon: AlertTriangle, badge: '3', symbol: '△' },
  { name: 'Ask SUTRA', href: '/query', icon: Search, symbol: '⌕' },
  { name: 'Evidence', href: '/evidence', icon: Database, symbol: '▣' },
  { name: 'Data', href: '/data', icon: ArrowRightLeft, symbol: '⇄' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#121210] border-r border-[#2C2A26] flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#2C2A26] flex items-center justify-between">
          <Link href="/command" className="group flex items-center space-x-2">
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
              <SutraOfficialAnimatedLogo size="sm" emblemOnly={true} interactiveMagnet={true} className="w-9 h-9" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-wider text-white font-editorial flex items-center gap-1.5">
                SUTRA
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFB88B] shadow-sm shadow-[#DFB88B]/50" />
              </div>
              <p className="text-[9px] tracking-widest uppercase text-[#A39D92] font-medium">
                Unified Governance
              </p>
            </div>
          </Link>
          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-[#1F1E1B] text-[#DFB88B] border border-[#3A3832] font-semibold">
            v2.6
          </span>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-widest text-[#A39D92] font-semibold">
            Operations
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/command' && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#20201D] text-white border-l-2 border-[#DFB88B] pl-2.5 font-bold shadow-sm'
                      : 'text-[#DDD7CD] hover:bg-[#1A1A18] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs w-4 text-center font-mono ${
                        isActive ? 'text-[#DFB88B] font-bold' : 'text-[#A39D92] group-hover:text-white'
                      }`}
                    >
                      {item.symbol}
                    </span>
                    <span className="tracking-wide">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sub Intelligence Direct Link */}
          <div className="mt-6 pt-4 border-t border-[#2C2A26]">
            <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-widest text-[#A39D92] font-semibold">
              Specialist Insights
            </div>
            <Link
              href="/intelligence/gaps"
              className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-colors ${
                pathname === '/intelligence/gaps'
                  ? 'bg-[#20201D] text-[#DFB88B] font-bold border-l-2 border-[#DFB88B] pl-2.5'
                  : 'text-[#DDD7CD] hover:bg-[#1A1A18] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFB88B]" />
                Geographic Gaps
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#2C2A26] bg-[#10100E]">
        <div className="p-2.5 rounded bg-[#181816] border border-[#2E2C28]">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#A39D92] uppercase tracking-wider text-[9px] font-semibold">Data Provenance</span>
            <span className="text-[#7DC09C] font-mono text-[9px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6DAA8A] animate-pulse" />
              VERIFIED
            </span>
          </div>
          <p className="text-[10px] text-[#DDD7CD] leading-relaxed font-mono">
            data.gov.in + PFMS Ledger + LGD Spatial Core
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#A39D92] px-1">
          <Link href="/" className="hover:text-white transition-colors">
            National Portal
          </Link>
          <span className="font-mono text-[10px] text-[#A39D92]">IN-NIC-2026</span>
        </div>
      </div>
    </aside>
  );
}
