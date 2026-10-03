'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { ShieldAlert, ArrowRight, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';

export default function GeographicGapsPage() {
  const { openEvidence, openExplain } = useIntelligence();
  const gapDistricts = MAHARASHTRA_DISTRICTS.filter((d) => d.isGapFlagged).sort(
    (a, b) => b.gapPercentagePoints - a.gapPercentagePoints
  );

  const nandurbar = gapDistricts[0];

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-1.5 border-b border-[#D8D6CE] pb-6 select-none">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
          <span>STATISTICAL DEFICIT RADAR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
          GEOGRAPHIC GAPS
        </h1>
        <p className="text-xs text-[#66706A] max-w-2xl leading-relaxed">
          Algorithmic identification of regions exhibiting disproportionately high eligible beneficiary demand coupled with severely lagging programme delivery and capital drawdown.
        </p>
      </div>

      {/* Featured Primary Gap Spotlight: NANDURBAR */}
      <div className="p-6 md:p-8 rounded-lg bg-[#FFFFFF] border-2 border-[#A54848]/40 shadow-xs space-y-6 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-0.5 rounded bg-[#FBF0F0] text-[#A54848] border border-[#A54848]/30 font-bold">
              PRIORITY #01 TERRITORIAL GAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18201C] font-editorial uppercase mt-2">
              {nandurbar.name}
            </h2>
            <p className="text-xs text-[#66706A]">
              {nandurbar.zone}, Maharashtra • LGD Code: {nandurbar.code}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-[#66706A] uppercase block font-semibold">CRITICAL GAP MARGIN</span>
            <div className="text-3xl sm:text-4xl font-bold text-[#A54848]">
              {nandurbar.gapPercentagePoints} pp
            </div>
            <span className="text-[10px] text-[#66706A]">Deficit below 64% benchmark</span>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="grid md:grid-cols-3 gap-4 font-mono text-xs border-y border-[#EAE8E1] py-5">
          <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
            <span className="text-[#66706A] text-[10px] block font-semibold">PROGRAMME COVERAGE</span>
            <span className="text-xl font-bold text-[#A54848] mt-0.5 block">
              {nandurbar.coverageRate}%
            </span>
            <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-2">
              <div
                className="bg-[#A54848] h-full rounded"
                style={{ width: `${nandurbar.coverageRate}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
            <span className="text-[#66706A] text-[10px] block font-semibold">REGIONAL BENCHMARK</span>
            <span className="text-xl font-bold text-[#18201C] mt-0.5 block">
              {nandurbar.regionalBenchmarkRate}%
            </span>
            <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-2">
              <div
                className="bg-[#164A3A] h-full rounded"
                style={{ width: `${nandurbar.regionalBenchmarkRate}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
            <span className="text-[#66706A] text-[10px] block font-semibold">FUND UTILIZATION RATE</span>
            <span className="text-xl font-bold text-[#B58A45] mt-0.5 block">
              {nandurbar.fundUtilizationRate}%
            </span>
            <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-2">
              <div
                className="bg-[#B58A45] h-full rounded"
                style={{ width: `${nandurbar.fundUtilizationRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Why Flagged & CTAs */}
        <div className="grid md:grid-cols-2 gap-6 items-center pt-1">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#B58A45] block font-semibold">
              WHY FLAGGED?
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-[#18201C]">
                <span className="text-[#28704D] font-bold">✓</span>
                <span>High eligible population (1.6M total pop, high smallholder ratio)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#18201C]">
                <span className="text-[#28704D] font-bold">✓</span>
                <span>Low programme coverage (28% vs 64% regional average)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#18201C]">
                <span className="text-[#28704D] font-bold">✓</span>
                <span>Low intervention density (only 14 active work projects)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#18201C]">
                <span className="text-[#28704D] font-bold">✓</span>
                <span>Low fund utilization (42% drawn vs 73% national pace)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() =>
                openExplain({
                  title: 'Nandurbar Territorial Gap Detection',
                  subtitle: 'Coverage: 28% vs Regional Benchmark: 64% (Gap: 36 pp)',
                  confidence: 87,
                  factors: [
                    { title: 'HIGH BENEFICIARY DEMAND', weight: 26 },
                    { title: 'LOW FUND UTILIZATION', weight: 31 },
                    { title: 'LOW PROJECT DENSITY', weight: 22 },
                    { title: 'REGIONAL DEVIATION', weight: 21 },
                  ],
                  evidenceRecordNumber: '#9281',
                })
              }
              className="px-4 py-2 rounded bg-[#FFFFFF] border border-[#D8D6CE] text-xs font-semibold text-[#18201C] hover:bg-[#F4F2EC] transition-colors"
            >
              WHY THIS INSIGHT?
            </button>

            <button
              onClick={() => openEvidence('#9281')}
              className="px-5 py-2 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <span>VIEW EVIDENCE →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Flagged Geographic Deficits */}
      <div className="space-y-3 pt-3 select-none">
        <h3 className="text-sm font-bold font-editorial text-[#18201C] uppercase tracking-wide">
          All Active Territorial Deficits (Maharashtra)
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {gapDistricts.slice(1).map((dist) => (
            <div
              key={dist.id}
              className="p-4 rounded-lg bg-[#FFFFFF] border border-[#D8D6CE] hover:border-[#164A3A] transition-all space-y-3 shadow-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#66706A] uppercase font-semibold">
                    {dist.code} • {dist.zone}
                  </span>
                  <h4 className="font-bold text-base text-[#18201C] font-editorial mt-0.5">
                    {dist.name}
                  </h4>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-[#A54848] block font-bold">
                    GAP: {dist.gapPercentagePoints} pp
                  </span>
                  <span className="text-[10px] text-[#66706A]">
                    Coverage: {dist.coverageRate}%
                  </span>
                </div>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-[10px] text-[#66706A]">
                  <span>Utilization Pace: {dist.fundUtilizationRate}%</span>
                  <span>Active Projects: {dist.projectsCount}</span>
                </div>
                <div className="w-full bg-[#EAE8E1] h-1.5 rounded overflow-hidden">
                  <div
                    className="bg-[#B58A45] h-full rounded"
                    style={{ width: `${dist.coverageRate}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EAE8E1] text-xs">
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
                  className="text-[#66706A] hover:text-[#18201C] font-medium"
                >
                  Decompose Factors
                </button>

                <button
                  onClick={() => openEvidence(dist.name === 'Gadchiroli' ? '#4412' : '#7211')}
                  className="text-[#164A3A] font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Supporting Record</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
