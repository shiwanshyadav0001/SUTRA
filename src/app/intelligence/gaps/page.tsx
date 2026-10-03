'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { ShieldAlert, ArrowRight, CheckCircle2, ChevronRight, BarChart2, Sparkles, Layers, MapPin } from 'lucide-react';

export default function GeographicGapsPage() {
  const router = useRouter();
  const { openEvidence, openExplain, openWhyFlagged } = useIntelligence();
  const gapDistricts = MAHARASHTRA_DISTRICTS.filter((d) => d.isGapFlagged).sort(
    (a, b) => b.gapPercentagePoints - a.gapPercentagePoints
  );

  const nandurbar = gapDistricts[0];

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>STATISTICAL DEFICIT RADAR • REGIONAL EQUITY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
          GEOGRAPHIC GAPS
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Algorithmic identification of regions exhibiting disproportionately high eligible beneficiary demand coupled with severely lagging programme delivery and capital drawdown.
        </p>
      </div>

      {/* Featured Primary Gap Spotlight: NANDURBAR */}
      <div className="p-6 sm:p-8 rounded-lg bg-white border border-rose-200 shadow-sm relative overflow-hidden space-y-6 my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
              PRIORITY #01 TERRITORIAL GAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial mt-2">
              {nandurbar.name.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-500">
              {nandurbar.zone}, Maharashtra • LGD Code: {nandurbar.code}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">CRITICAL GAP MARGIN</span>
            <div className="text-3xl sm:text-4xl font-bold text-rose-700">
              {nandurbar.gapPercentagePoints} pp
            </div>
            <span className="text-[10px] text-slate-500">Deficit below 64% benchmark</span>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="grid md:grid-cols-3 gap-4 font-mono text-xs border-y border-slate-100 py-5">
          <div className="p-3.5 rounded-md bg-rose-50/50 border border-rose-200">
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">PROGRAMME COVERAGE</span>
            <span className="text-2xl font-bold text-rose-700 mt-0.5 block">
              {nandurbar.coverageRate}%
            </span>
            <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
              <div
                className="bg-rose-600 h-full rounded"
                style={{ width: `${nandurbar.coverageRate}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">REGIONAL BENCHMARK</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5 block">
              {nandurbar.regionalBenchmarkRate}%
            </span>
            <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
              <div
                className="bg-slate-400 h-full rounded"
                style={{ width: `${nandurbar.regionalBenchmarkRate}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-amber-50/50 border border-amber-200">
            <span className="text-slate-500 text-[10px] block uppercase font-semibold">FUND UTILIZATION RATE</span>
            <span className="text-2xl font-bold text-amber-800 mt-0.5 block">
              {nandurbar.fundUtilizationRate}%
            </span>
            <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
              <div
                className="bg-amber-600 h-full rounded"
                style={{ width: `${nandurbar.fundUtilizationRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Why Flagged & CTAs */}
        <div className="grid md:grid-cols-2 gap-6 items-center pt-1">
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-semibold">
              WHY FLAGGED? ATTRIBUTION BREAKDOWN
            </span>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>High eligible population (1.6M total pop, high smallholder ratio)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Low programme coverage (28% vs 64% regional average)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Low intervention density (only 14 active work projects)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Low fund drawdown pace (42% drawn vs 73% national pace)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-end">
            <button
              onClick={() => openWhyFlagged('SUTRA-FND-0001')}
              className="px-4 py-2 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>WHY THIS INSIGHT?</span>
            </button>

            <button
              onClick={() => router.push('/investigation/SUTRA-INV-2026-0001')}
              className="px-4 py-2 rounded-md bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>INVESTIGATE WORKSPACE</span>
            </button>

            <button
              onClick={() => openEvidence('SUTRA-EVD-9281')}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <span>VIEW EVIDENCE →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Flagged Geographic Deficits */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold font-editorial text-slate-900">
          All Active Territorial Deficits (Maharashtra)
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {gapDistricts.slice(1).map((dist) => (
            <div
              key={dist.id}
              className="p-5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 transition-all space-y-3.5 shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                    {dist.code} • {dist.zone}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 font-editorial mt-0.5">
                    {dist.name}
                  </h4>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-rose-700 block font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    GAP: {dist.gapPercentagePoints} pp
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Coverage: {dist.coverageRate}%
                  </span>
                </div>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Utilization Pace: {dist.fundUtilizationRate}%</span>
                  <span>Active Projects: {dist.projectsCount}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded">
                  <div
                    className="bg-amber-500 h-full rounded"
                    style={{ width: `${dist.coverageRate}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() =>
                    openExplain({
                      title: `${dist.name} Coverage Gap Analysis`,
                      confidence: 84,
                      factors: [
                        { title: 'TERRAIN LOGISTICS OVERHEAD', weight: 32 },
                        { title: 'MILESTONE GEO-TAG RECONCILIATION', weight: 28 },
                        { title: 'LOCAL TENDER LIQUIDATION', weight: 24 },
                        { title: 'SEASONAL RAINFED STOPPAGE', weight: 16 },
                      ],
                      evidenceRecordNumber: dist.name === 'Gadchiroli' ? '#4412' : '#7211',
                    })
                  }
                  className="text-slate-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Decompose Factors
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/map?district=${dist.id}`}
                    className="text-blue-700 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <span>View Map</span>
                  </Link>
                  <button
                    onClick={() => openEvidence(dist.name === 'Gadchiroli' ? '#4412' : '#7211')}
                    className="text-blue-700 hover:underline flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                  >
                    <span>Supporting Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
