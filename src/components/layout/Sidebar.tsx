'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SutraLogo } from '@/components/brand/SutraLogo';
import {
  LayoutDashboard,
  Compass,
  Layers,
  AlertTriangle,
  Search,
  FolderKanban,
  Network,
  MapPin,
  Database,
  ArrowRightLeft,
  ChevronRight,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { name: 'Command', href: '/command', icon: LayoutDashboard },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { name: 'Investigate', href: '/investigate', icon: Compass },
      { name: 'Intelligence', href: '/overlaps', icon: Layers },
      { name: 'Signals', href: '/signals', icon: AlertTriangle, badge: '3' },
      { name: 'Ask SUTRA', href: '/query', icon: Search },
    ],
  },
  {
    title: 'PROGRAMMES',
    items: [
      { name: 'Schemes', href: '/schemes', icon: FolderKanban },
      { name: 'Relationships', href: '/relationships', icon: Network },
      { name: 'Geography', href: '/map', icon: MapPin },
    ],
  },
  {
    title: 'EVIDENCE',
    items: [
      { name: 'Evidence', href: '/evidence', icon: Database },
      { name: 'Data', href: '/data', icon: ArrowRightLeft },
    ],
  },
];

const SPECIALIST_INSIGHTS = [
  {
    title: 'Geographic Gaps',
    count: '07',
    href: '/gaps',
    dotColor: 'bg-[#B56B32]', // Saffron attention
  },
  {
    title: 'Programme Overlap',
    count: '04',
    href: '/overlaps',
    dotColor: 'bg-[#B58A45]', // Gold brand identity
  },
  {
    title: 'Resource Anomalies',
    count: '03',
    href: '/signals',
    dotColor: 'bg-[#A54848]', // Alert red
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-[#EAE8E1] border-r border-[#D8D6CE] flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Scrollable Upper Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header Branding */}
        <div className="p-5 border-b border-[#D8D6CE]">
          <Link href="/command" className="group flex items-start gap-3">
            <SutraLogo size="sm" theme="light" />
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-bold text-sm tracking-wider text-[#18201C] font-editorial">
                  SUTRA
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FFFFFF] text-[#66706A] border border-[#D8D6CE] font-semibold">
                  V2.6
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.14em] text-[#66706A] font-semibold mt-0.5">
                UNIFIED GOVERNANCE INTELLIGENCE
              </p>
            </div>
          </Link>
        </div>

        {/* Structured Navigation Hierarchy */}
        <div className="p-3 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] uppercase font-mono tracking-[0.14em] text-[#66706A] font-semibold">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/command' && pathname?.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center justify-between px-3 py-1.5 rounded-sm text-xs transition-all duration-150 ${
                        isActive
                          ? 'bg-[#E3EDE7] text-[#18201C] font-semibold border-l-2 border-[#B58A45] pl-2.5 shadow-none'
                          : 'text-[#18201C] hover:bg-[#E2DFD7] hover:text-[#0D3026]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon
                          className={`w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 ${
                            isActive
                              ? 'text-[#164A3A]'
                              : 'text-[#66706A] group-hover:text-[#164A3A]'
                          }`}
                        />
                        <span className="tracking-wide text-xs">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#A54848]/15 text-[#A54848] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Specialist Insights Section */}
          <div className="pt-2 border-t border-[#D8D6CE]">
            <div className="px-3 pb-1.5 text-[10px] uppercase font-mono tracking-[0.14em] text-[#66706A] font-semibold">
              SPECIALIST INSIGHTS
            </div>
            <div className="space-y-1">
              {SPECIALIST_INSIGHTS.map((insight) => (
                <Link
                  key={insight.title}
                  href={insight.href}
                  className="flex items-center justify-between px-3 py-1.5 rounded-sm text-xs text-[#18201C] hover:bg-[#E2DFD7] transition-all group"
                >
                  <span className="flex items-center gap-2 text-xs font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${insight.dotColor}`} />
                    <span className="text-[#18201C] group-hover:text-[#0D3026]">{insight.title}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#66706A] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#D8D6CE]">
                      {insight.count}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#898E89] group-hover:text-[#18201C] transition-transform duration-150 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info: DATA PROVENANCE */}
      <div className="p-3.5 border-t border-[#D8D6CE] bg-[#E5E3DC]">
        <div className="p-2.5 rounded bg-[#FFFFFF] border border-[#D8D6CE]">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold">
              DATA PROVENANCE
            </span>
            <span className="text-[#28704D] font-mono text-[9px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28704D]" />
              VERIFIED
            </span>
          </div>
          <p className="text-[10px] text-[#18201C] leading-snug font-mono">
            data.gov.in + PFMS Ledger + LGD Spatial Core
          </p>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#66706A] px-1">
          <Link href="/" className="hover:text-[#18201C] transition-colors font-medium">
            National Portal
          </Link>
          <span className="font-mono text-[9px] text-[#898E89]">IN-NIC-2026</span>
        </div>
      </div>
    </aside>
  );
}
