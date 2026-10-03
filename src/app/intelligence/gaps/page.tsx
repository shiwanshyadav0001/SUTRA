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
      <div className="space-y-2 border-b border-[#2A2926] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
          <span>STATISTICAL DEFICIT RADAR</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
          GEOGRAPHIC GAPS
        </h1>
        <p className="text-xs text-[#8E887E] max-w-2xl">
          Algorithmic identification of regions exhibiting disproportionately high eligible beneficiary demand coupled with severely lagging programme delivery and capital drawdown.
        </p>
      </div>

      {/* Featured Primary Gap Spotlight: NANDURBAR */}
      <div className="p-8 rounded-sm bg-[#141412] border-2 border-[#A66A62]/40 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-[#A66A62]/20 text-[#A66A62] border border-[#A66A62]/30">
              PRIORITY #01 TERRITORIAL GAP
            </span>
            <h2 className="text-3xl font-bold text-[#F3F0E8] font-editorial mt-2">
              {nandurbar.name.toUpperCase()}
            </h2>
            <p className="text-xs text-[#8E887E]">
              {nandurbar.zone}, Maharashtra • LGD Code: {nandurbar.code}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-[#8E887E] uppercase block">CRITICAL GAP MARGIN</span>
            <div className="text-3xl sm:text-4xl font-bold text-[#A66A62]">
              {nandurbar.gapPercentagePoints} pp
            </div>
            <span className="text-[10px] text-[#8E887E]">Deficit below 64% benchmark</span>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="grid md:grid-cols-3 gap-6 font-mono text-xs border-y border-[#2A2926] py-6">
          <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
            <span className="text-[#8E887E] text-[10px] block">PROGRAMME COVERAGE</span>
            <span className="text-2xl font-bold text-[#A66A62] mt-1 block">
              {nandurbar.coverageRate}%
            </span>
            <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
              <div
                className="bg-[#A66A62] h-full rounded"
                style={{ width: `${nandurbar.coverageRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
            <span className="text-[#8E887E] text-[10px] block">REGIONAL BENCHMARK</span>
            <span className="text-2xl font-bold text-[#C9C2B7] mt-1 block">
              {nandurbar.regionalBenchmarkRate}%
            </span>
            <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
              <div
                className="bg-[#8E887E] h-full rounded"
                style={{ width: `${nandurbar.regionalBenchmarkRate}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
            <span className="text-[#8E887E] text-[10px] block">FUND UTILIZATION RATE</span>
            <span className="text-2xl font-bold text-[#B59A63] mt-1 block">
              {nandurbar.fundUtilizationRate}%
            </span>
            <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
              <div
                className="bg-[#B59A63] h-full rounded"
                style={{ width: `${nandurbar.fundUtilizationRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Why Flagged & CTAs */}
        <div className="grid md:grid-cols-2 gap-8 items-center pt-2">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A] block">
              WHY FLAGGED?
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-[#F3F0E8]">
                <span className="text-[#5E8B72] font-bold">✓</span>
                <span>High eligible population (1.6M total pop, high smallholder ratio)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#F3F0E8]">
                <span className="text-[#5E8B72] font-bold">✓</span>
                <span>Low programme coverage (28% vs 64% regional average)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#F3F0E8]">
                <span className="text-[#5E8B72] font-bold">✓</span>
                <span>Low intervention density (only 14 active work projects)</span>
              </div>
              <div className="flex items-center space-x-2 text-[#F3F0E8]">
                <span className="text-[#5E8B72] font-bold">✓</span>
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
              className="px-5 py-3 rounded-sm bg-[#191917] border border-[#2A2926] text-xs text-[#F3F0E8] hover:border-[#B78A5A] transition-colors"
            >
              WHY THIS INSIGHT?
            </button>

            <button
              onClick={() => openEvidence('#9281')}
              className="px-6 py-3 rounded-sm bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs hover:bg-[#CBB093] transition-colors flex items-center justify-center space-x-2"
            >
              <span>VIEW EVIDENCE →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Flagged Geographic Deficits */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold font-editorial text-[#F3F0E8]">
          All Active Territorial Deficits (Maharashtra)
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {gapDistricts.slice(1).map((dist) => (
            <div
              key={dist.id}
              className="p-5 rounded-sm bg-[#141412] border border-[#2A2926] hover:border-[#B78A5A]/50 transition-all space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#8E887E] uppercase">
                    {dist.code} • {dist.zone}
                  </span>
                  <h4 className="font-bold text-lg text-[#F3F0E8] font-editorial">
                    {dist.name}
                  </h4>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-[#A66A62] block font-bold">
                    GAP: {dist.gapPercentagePoints} pp
                  </span>
                  <span className="text-[10px] text-[#8E887E]">
                    Coverage: {dist.coverageRate}%
                  </span>
                </div>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-[#8E887E]">
                  <span>Utilization Pace: {dist.fundUtilizationRate}%</span>
                  <span>Active Projects: {dist.projectsCount}</span>
                </div>
                <div className="w-full bg-[#191917] h-1.5 rounded">
                  <div
                    className="bg-[#B59A63] h-full rounded"
                    style={{ width: `${dist.coverageRate}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#2A2926] text-xs">
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
                  className="text-[#8E887E] hover:text-[#F3F0E8]"
                >
                  Decompose Factors
                </button>

                <button
                  onClick={() => openEvidence(dist.name === 'Gadchiroli' ? '#4412' : '#7211')}
                  className="text-[#B78A5A] hover:underline flex items-center gap-1 font-mono text-[11px]"
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
