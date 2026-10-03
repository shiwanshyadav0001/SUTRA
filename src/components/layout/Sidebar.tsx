'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SutraOfficialAnimatedLogo } from '@/components/brand/SutraOfficialAnimatedLogo';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  FolderKanban,
  Network,
  AlertTriangle,
  Layers,
  ShieldAlert,
  Search,
  Database,
  ArrowRightLeft,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'blue' | 'amber' | 'emerald';
  description: string;
}

const PRIMARY_OPS: NavItem[] = [
  {
    name: 'Command Center',
    href: '/command',
    icon: LayoutDashboard,
    description: 'Executive drawdown telemetry & national oversight',
  },
  {
    name: 'Investigate',
    href: '/investigate',
    icon: Compass,
    badge: 'CORE',
    badgeType: 'blue',
    description: 'Deep cross-programme convergence workspace',
  },
  {
    name: 'Geographic Intel',
    href: '/map',
    icon: MapPin,
    description: '36 Maharashtra district GIS spatial radar',
  },
  {
    name: 'Scheme Explorer',
    href: '/schemes',
    icon: FolderKanban,
    description: 'Central ministry programme dossiers & outlays',
  },
  {
    name: 'Governance Graph',
    href: '/relationships',
    icon: Network,
    description: 'Inter-entity relationship & policy network',
  },
  {
    name: 'Early Signals',
    href: '/signals',
    icon: AlertTriangle,
    badge: '3 LIVE',
    badgeType: 'amber',
    description: 'Proactive anomaly radar & variance signals',
  },
];

const INTEL_AUDIT: NavItem[] = [
  {
    name: 'Programme Overlaps',
    href: '/overlaps',
    icon: Layers,
    description: 'Redundancy & concurrent subsidy detection',
  },
  {
    name: 'Geographic Gaps',
    href: '/intelligence/gaps',
    icon: ShieldAlert,
    badge: 'ALERT',
    badgeType: 'amber',
    description: 'High beneficiary demand vs capital lag',
  },
  {
    name: 'Ask SUTRA',
    href: '/query',
    icon: Search,
    description: 'Natural governance intelligence processor',
  },
  {
    name: 'Evidence Hub',
    href: '/evidence',
    icon: Database,
    badge: 'SHA-256',
    badgeType: 'emerald',
    description: 'Cryptographic SHA-256 audit lineage',
  },
  {
    name: 'Data & Sources',
    href: '/data',
    icon: ArrowRightLeft,
    description: 'LGD entity resolution & statutory ingestion',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <div className="px-3 pb-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400/90 flex items-center justify-between">
        <span>{title}</span>
        <span className="h-[1px] flex-1 bg-slate-800 ml-2" />
      </div>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/command' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold border-l-4 border-cyan-400 pl-2 shadow-md shadow-blue-900/40'
                  : 'text-slate-300 hover:bg-[#132042] hover:text-white border-l-4 border-transparent'
              }`}
              title={item.description}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-cyan-200' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold tracking-wider ${
                    item.badgeType === 'emerald'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                      : item.badgeType === 'amber'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                      : 'bg-blue-950/80 text-blue-200 border border-blue-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-[#0B132B] border border-slate-700 text-white shadow-lg"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container - Deep Midnight Governance Command System */}
      <aside
        className={`w-64 flex-shrink-0 bg-[#0B132B] text-slate-200 border-r border-[#1E293B] flex flex-col justify-between h-screen sticky top-0 z-30 select-none transition-transform duration-200 shadow-2xl ${
          isMobileOpen ? 'translate-x-0 fixed left-0 top-0 bottom-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div className="overflow-y-auto">
          <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#080E21]">
            <Link href="/command" className="group flex items-center space-x-2.5">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                <SutraOfficialAnimatedLogo size="sm" emblemOnly={true} interactiveMagnet={true} className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-widest text-white font-editorial flex items-center gap-1.5">
                  SUTRA
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <p className="text-[9px] tracking-wider uppercase text-cyan-300 font-mono">
                  Governance Intel
                </p>
              </div>
            </Link>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/60">
              APEX v2.6
            </span>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-4 space-y-5">
            {renderNavGroup('Operations', PRIMARY_OPS)}
            {renderNavGroup('Intelligence & Audit', INTEL_AUDIT)}
          </div>
        </div>

        {/* Footer Provenance Info */}
        <div className="p-3 border-t border-[#1E293B] bg-[#080E21]">
          <div className="p-2.5 rounded bg-[#0B132B] border border-[#1E293B] shadow-inner">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400 uppercase font-mono tracking-wider text-[9px] font-bold">
                DATA PROVENANCE
              </span>
              <span className="text-emerald-400 font-mono text-[9px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                PFMS VALIDATED
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
              MoPR LGD • data.gov.in • PFMS Ledgers
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
