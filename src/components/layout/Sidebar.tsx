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
    <aside className="w-64 flex-shrink-0 bg-[#0D0D0C] border-r border-[#2A2926] flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-[#2A2926]/70 flex items-center justify-between">
          <Link href="/command" className="group flex items-center space-x-2">
            <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
              <SutraOfficialAnimatedLogo size="sm" emblemOnly={true} interactiveMagnet={true} className="w-9 h-9" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-wider text-[#F3F0E8] font-editorial flex items-center gap-1.5">
                SUTRA
                <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
              </div>
              <p className="text-[9px] tracking-widest uppercase text-[#8E887E]">
                Unified Governance
              </p>
            </div>
          </Link>
          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#191917] text-[#B78A5A] border border-[#2A2926]">
            v2.6
          </span>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-widest text-[#7E7A72]">
            Operations
          </div>
          <nav className="space-y-0.5">
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
                      ? 'bg-[#191917] text-[#F3F0E8] border-l-2 border-[#B78A5A] pl-2.5 font-semibold'
                      : 'text-[#C9C2B7] hover:bg-[#141412] hover:text-[#F3F0E8]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs w-4 text-center font-mono ${
                        isActive ? 'text-[#B78A5A]' : 'text-[#8E887E] group-hover:text-[#C9C2B7]'
                      }`}
                    >
                      {item.symbol}
                    </span>
                    <span className="tracking-wide">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#A66A62]/20 text-[#A66A62] border border-[#A66A62]/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sub Intelligence Direct Link */}
          <div className="mt-6 pt-4 border-t border-[#2A2926]/50">
            <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-widest text-[#7E7A72]">
              Specialist Insights
            </div>
            <Link
              href="/intelligence/gaps"
              className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs transition-colors ${
                pathname === '/intelligence/gaps'
                  ? 'bg-[#191917] text-[#B78A5A] font-semibold'
                  : 'text-[#8E887E] hover:text-[#C9C2B7]'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B59A63]" />
                Geographic Gaps
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#2A2926]/70 bg-[#0D0D0C]">
        <div className="p-2.5 rounded bg-[#141412] border border-[#2A2926]">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#8E887E] uppercase tracking-wider text-[9px]">Data Provenance</span>
            <span className="text-[#5E8B72] font-mono text-[9px] flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#5E8B72] animate-pulse" />
              VERIFIED
            </span>
          </div>
          <p className="text-[10px] text-[#C9C2B7] leading-relaxed font-mono">
            data.gov.in + PFMS Ledger + LGD Spatial Core
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#8E887E] px-1">
          <Link href="/" className="hover:text-[#F3F0E8] transition-colors">
            National Portal
          </Link>
          <span className="font-mono text-[10px]">IN-NIC-2026</span>
        </div>
      </div>
    </aside>
  );
}
