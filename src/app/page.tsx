'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SutraLogo } from '@/components/brand/SutraLogo';
import { LoadingTransition } from '@/components/ui/LoadingTransition';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Database,
  Layers,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Lock,
  Compass,
  Network,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);

  const handleEnterSutra = () => {
    setIsLoadingTransition(true);
  };

  if (isLoadingTransition) {
    return <LoadingTransition destinationRoute="/command" />;
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC] text-[#18201C] select-none flex flex-col justify-between">
      {/* Institutional Top Navbar */}
      <header className="h-20 border-b border-[#D8D6CE] bg-[#FFFFFF] px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center space-x-3">
          <SutraLogo size="sm" theme="light" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-widest text-[#18201C] font-editorial">
                SUTRA
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#F4F2EC] text-[#66706A] border border-[#D8D6CE] font-bold">
                V2.6
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.14em] text-[#66706A] font-semibold">
              UNIFIED GOVERNANCE INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono text-[#66706A]">
          <Link href="/command" className="hover:text-[#164A3A] transition-colors font-medium">
            Command Center
          </Link>
          <Link href="/map" className="hover:text-[#164A3A] transition-colors font-medium">
            Geography
          </Link>
          <Link href="/query" className="hover:text-[#164A3A] transition-colors font-medium">
            Ask SUTRA
          </Link>
          <Link href="/evidence" className="hover:text-[#164A3A] transition-colors font-medium">
            Evidence Hub
          </Link>
          <Link href="/login" className="hover:text-[#164A3A] transition-colors font-medium flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#B58A45]" />
            <span>Officer Login</span>
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEnterSutra}
            className="px-5 py-2.5 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>ENTER SUTRA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 md:py-16 space-y-12">
        {/* Eyebrow & Institutional Heading */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#FFFFFF] border border-[#D8D6CE]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
            <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#66706A] font-semibold">
              NATIONAL GOVERNANCE INTELLIGENCE WORKSTATION
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#18201C] font-editorial uppercase leading-[1.1]">
            UNIFIED GOVERNANCE INTELLIGENCE
          </h1>

          <p className="text-sm sm:text-base text-[#66706A] max-w-2xl mx-auto leading-relaxed">
            Connecting ministries, schemes, projects, budgets, beneficiaries, geography and verified public outcomes across the Indian governance continuum.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={handleEnterSutra}
              className="px-6 py-3 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>ENTER COMMAND WORKSTATION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/login"
              className="px-6 py-3 rounded bg-[#FFFFFF] hover:bg-[#EAE8E1] text-[#18201C] font-bold text-xs uppercase tracking-wider transition-colors border border-[#D8D6CE]"
            >
              OFFICER ACCESS PANEL
            </Link>
          </div>
        </div>

        {/* 6 Key Statutory Metrics Strip (Exact values from spec) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg shadow-xs">
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold block">
              TOTAL ALLOCATION
            </span>
            <div className="text-xl font-bold font-mono text-[#18201C] mt-1">₹4.82T</div>
            <span className="text-[9px] text-[#28704D] font-mono font-bold mt-0.5 block">+9.2% Outlay</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg shadow-xs">
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold block">
              FUND UTILIZATION
            </span>
            <div className="text-xl font-bold font-mono text-[#18201C] mt-1">78.4%</div>
            <span className="text-[9px] text-[#66706A] font-mono mt-0.5 block">Target: 76.0%</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg shadow-xs">
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold block">
              BENEFICIARIES
            </span>
            <div className="text-xl font-bold font-mono text-[#18201C] mt-1">84.6M</div>
            <span className="text-[9px] text-[#28704D] font-mono font-bold mt-0.5 block">Direct DBT</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg shadow-xs">
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold block">
              ACTIVE PROJECTS
            </span>
            <div className="text-xl font-bold font-mono text-[#18201C] mt-1">12,842</div>
            <span className="text-[9px] text-[#66706A] font-mono mt-0.5 block">766 Districts</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg shadow-xs">
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold block">
              COVERAGE RATE
            </span>
            <div className="text-xl font-bold font-mono text-[#18201C] mt-1">81.6%</div>
            <span className="text-[9px] text-[#B56B32] font-mono font-bold mt-0.5 block">7 Priority Gaps</span>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg shadow-xs">
            <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#66706A] font-semibold block">
              OUTCOME INDEX
            </span>
            <div className="text-xl font-bold font-mono text-[#18201C] mt-1">74.2</div>
            <span className="text-[9px] text-[#28704D] font-mono font-bold mt-0.5 block">+6.4 pts QoQ</span>
          </div>
        </div>

        {/* 5 Architectural Directives: MONITOR → INVESTIGATE → ANALYZE → EXPLAIN → VERIFY */}
        <div className="bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg p-6 md:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EAE8E1] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#164A3A] font-semibold">
                CORE OPERATIONAL ARCHITECTURE
              </span>
              <h2 className="text-lg font-bold text-[#18201C] font-editorial mt-0.5">
                The SUTRA Governance Loop
              </h2>
            </div>
            <span className="text-xs font-mono text-[#28704D] font-bold bg-[#E3EDE7] px-2.5 py-1 rounded border border-[#28704D]/30">
              AUDITED PROTOCOL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            <div className="p-4 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
              <span className="text-[10px] font-mono text-[#164A3A] font-bold block">01 / MONITOR</span>
              <h3 className="font-bold text-[#18201C]">Continuous Pulse</h3>
              <p className="text-[11px] text-[#66706A] leading-relaxed">
                Ingest live expenditure records and physical project telemetry from verified portals.
              </p>
            </div>

            <div className="p-4 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
              <span className="text-[10px] font-mono text-[#B58A45] font-bold block">02 / INVESTIGATE</span>
              <h3 className="font-bold text-[#18201C]">Spatial Resolution</h3>
              <p className="text-[11px] text-[#66706A] leading-relaxed">
                Map raw village and ward names to canonical LGD spatial codes with zero ambiguity.
              </p>
            </div>

            <div className="p-4 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
              <span className="text-[10px] font-mono text-[#164A3A] font-bold block">03 / ANALYZE</span>
              <h3 className="font-bold text-[#18201C]">Overlap Engine</h3>
              <p className="text-[11px] text-[#66706A] leading-relaxed">
                Detect redundant programmatic subsidies across ministries targeting identical cohorts.
              </p>
            </div>

            <div className="p-4 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
              <span className="text-[10px] font-mono text-[#B56B32] font-bold block">04 / EXPLAIN</span>
              <h3 className="font-bold text-[#18201C]">Attribution Logic</h3>
              <p className="text-[11px] text-[#66706A] leading-relaxed">
                Decompose statutory anomalies into weighted Shapley factors for policy officers.
              </p>
            </div>

            <div className="p-4 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
              <span className="text-[10px] font-mono text-[#28704D] font-bold block">05 / VERIFY</span>
              <h3 className="font-bold text-[#18201C]">Cryptographic Evidence</h3>
              <p className="text-[11px] text-[#66706A] leading-relaxed">
                Seal every intelligence finding with SHA-256 lineage back to data.gov.in and PFMS.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-[#D8D6CE] bg-[#EAE8E1] px-6 lg:px-12 py-6 text-xs text-[#66706A] font-mono">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#28704D]" />
            <span className="font-bold text-[#18201C]">VERIFIED SOURCES:</span>
            <span>data.gov.in • PFMS Ledger • LGD Spatial Core</span>
          </div>
          <div>
            <span>SUTRA UNIFIED GOVERNANCE INTELLIGENCE • IN-NIC-2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
