'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { ArrowRight, Sparkles, Layers, MapPin } from 'lucide-react';
import { EVIDENCE_RECORDS } from '@/lib/data/governance-data';
import { formatIndianNumber } from '@/lib/formatters';

export default function GeographicGapsPage() {
  const router = useRouter();
  const { openEvidence, openExplain, openWhyFlagged } = useIntelligence();
  const gapDistricts = MAHARASHTRA_DISTRICTS.filter((d) => d.isGapFlagged).sort(
    (a, b) => b.gapPercentagePoints - a.gapPercentagePoints
  );

  if (gapDistricts.length === 0) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-lg shadow-sm text-center space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
            No territorial gaps detected
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-editorial">
            All districts meet the regional benchmark
          </h1>
          <p className="text-xs text-slate-600">
            The gap radar currently flags no district below its regional coverage benchmark.
          </p>
        </div>
      </AppShell>
    );
  }

  const nandurbar = gapDistricts[0];

  const resolveDistrictEvidence = (districtName: string): string | null => {
    const rec = EVIDENCE_RECORDS.find(
      (r) => r.district.toLowerCase() === districtName.toLowerCase()
    );
    return rec ? rec.id : null;
  };

  const explainFactors = (flagFactors: string[]) => {
    const n = Math.max(flagFactors.length, 1);
    const base = Math.floor(100 / n);
    return flagFactors.map((f, i) => ({
      title: f.toUpperCase(),
      weight: i === 0 ? 100 - base * (n - 1) : base,
    }));
  };

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

      {/* Featured Primary Gap Spotlight: NANDURBAR on Amber Alert Surface */}
      <div className="p-6 sm:p-8 rounded-lg surface-amber-alert border border-amber-300 shadow-sm relative overflow-hidden space-y-6 my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
              PRIORITY #01 TERRITORIAL GAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-editorial mt-2">
              {nandurbar.name.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-600">
              {nandurbar.zone}, Maharashtra • LGD Code: {nandurbar.lgdCode || 'Not mapped'}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">CRITICAL GAP MARGIN</span>
            <div className="text-3xl sm:text-4xl font-bold text-rose-700">
              {nandurbar.gapPercentagePoints} pp
            </div>
            <span className="text-[10px] text-slate-500">Deficit below {nandurbar.regionalBenchmarkRate}% benchmark</span>
          </div>
        </div>

        {/* Comparison Bars on White Cards with crisp borders */}
        <div className="grid md:grid-cols-3 gap-4 font-mono text-xs border-y border-amber-200/60 py-5">
          <div className="p-3.5 rounded-md bg-white border border-rose-200 shadow-2xs">
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

          <div className="p-3.5 rounded-md bg-white border border-slate-200 shadow-2xs">
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

          <div className="p-3.5 rounded-md bg-white border border-amber-200 shadow-2xs">
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
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 block font-semibold">
              WHY FLAGGED? ATTRIBUTION BREAKDOWN
            </span>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>High eligible population ({formatIndianNumber(nandurbar.population)} total pop, demand index {nandurbar.eligibleDemandIndex}/100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Low programme coverage ({nandurbar.coverageRate}% vs {nandurbar.regionalBenchmarkRate}% regional average)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Low intervention density (only {nandurbar.projectsCount} active work projects)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Low fund drawdown pace ({nandurbar.fundUtilizationRate}% drawn vs {nandurbar.regionalBenchmarkRate}% benchmark coverage)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-end">
            <button
              onClick={() => openWhyFlagged('SUTRA-FND-0001', nandurbar.name)}
              className="px-4 py-2 rounded-md bg-white hover:bg-slate-50 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>WHY THIS INSIGHT?</span>
            </button>

            <button
              onClick={() => router.push('/investigation/SUTRA-INV-2026-0001')}
              className="px-4 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>INVESTIGATE WORKSPACE</span>
            </button>

            <button
              onClick={() => openEvidence('#9281')}
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
              className="p-5 rounded-lg surface-neutral-analytical border border-slate-200 hover:border-blue-400 transition-all space-y-3.5 shadow-2xs"
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
                      subtitle: `Coverage ${dist.coverageRate}% vs benchmark ${dist.regionalBenchmarkRate}% (gap ${dist.gapPercentagePoints} pp)`,
                      confidence: 84,
                      factors: explainFactors(dist.flagFactors),
                      evidenceRecordNumber: resolveDistrictEvidence(dist.name)
                        ? EVIDENCE_RECORDS.find(
                            (r) => r.district.toLowerCase() === dist.name.toLowerCase()
                          )?.recordNumber
                        : undefined,
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
                  {resolveDistrictEvidence(dist.name) ? (
                    <button
                      onClick={() => {
                        const recId = resolveDistrictEvidence(dist.name);
                        if (recId) openEvidence(recId);
                      }}
                      className="text-blue-700 hover:underline flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                    >
                      <span>Supporting Record</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-slate-400 font-mono text-[11px]">
                      No district record yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
