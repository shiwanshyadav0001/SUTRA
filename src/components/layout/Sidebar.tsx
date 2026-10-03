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
  CheckCircle2,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
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
    badge: 'V2',
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
    badge: '3',
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
      <div className="px-3 pb-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-600">
        {title}
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
                  ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 pl-2.5 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={item.description}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    item.badge === 'V2'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
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
          className="p-2 rounded-md bg-white border border-slate-200 text-slate-700 shadow-sm"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0 fixed left-0 top-0 bottom-0 shadow-xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Header */}
        <div className="overflow-y-auto">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <Link href="/command" className="group flex items-center space-x-2.5">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                <SutraOfficialAnimatedLogo size="sm" emblemOnly={true} interactiveMagnet={true} className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide text-slate-900 font-editorial flex items-center gap-1.5">
                  SUTRA
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <p className="text-[10px] tracking-wider uppercase text-slate-500 font-mono">
                  Unified Governance
                </p>
              </div>
            </Link>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              v2.6
            </span>
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-4 space-y-5">
            {renderNavGroup('Operations', PRIMARY_OPS)}
            {renderNavGroup('Intelligence & Audit', INTEL_AUDIT)}
          </div>
        </div>

        {/* Footer Provenance Info */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50">
          <div className="p-2.5 rounded-md bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500 uppercase font-mono tracking-wider text-[9px] font-bold">
                PROVENANCE
              </span>
              <span className="text-emerald-700 font-mono text-[9px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                VERIFIED
              </span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed font-mono">
              PFMS Ledger • data.gov.in • MoPR LGD Core
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
