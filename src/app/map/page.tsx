'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { MAHARASHTRA_DISTRICTS, EVIDENCE_RECORDS } from '@/lib/data/governance-data';
import { District } from '@/lib/types';
import {
  MapPin,
  Layers,
  ChevronRight,
  Activity,
  Network,
  Sparkles,
} from 'lucide-react';

type MetricFilter = 'Coverage' | 'Utilization' | 'Beneficiaries' | 'Outcomes' | 'Gaps' | 'Signals';

function resolveDistrictParam(param: string | null): District {
  const fallback =
    MAHARASHTRA_DISTRICTS.find((d) => d.name === 'Nandurbar') || MAHARASHTRA_DISTRICTS[0];
  if (!param) return fallback;
  const q = param.trim().toLowerCase();
  return (
    MAHARASHTRA_DISTRICTS.find(
      (d) =>
        d.id.toLowerCase() === q ||
        d.code.toLowerCase() === q ||
        d.name.toLowerCase() === q ||
        (d.lgdCode || '').toLowerCase() === q
    ) || fallback
  );
}

function formatLakh(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

function GeographicIntelligenceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    openEvidence,
    openExecutiveBrief,
    openWhyFlagged,
  } = useIntelligence();

  const [viewLevel, setViewLevel] = useState<'INDIA' | 'MAHARASHTRA'>('MAHARASHTRA');
  const [activeFilter, setActiveFilter] = useState<MetricFilter>('Gaps');
  const [selectedDistrict, setSelectedDistrict] = useState<District>(() =>
    resolveDistrictParam(searchParams.get('district'))
  );
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [hoveredState, setHoveredState] = useState<typeof indiaStates[0] | null>(null);
  // Tooltip anchor stored as container fractions (0–1) so positioning never
  // depends on pixel widths that break on small viewports.
  const [mapTooltipAnchor, setMapTooltipAnchor] = useState<{ fx: number; fy: number } | null>(null);

  // Honor ?district=<id|code|name|lgd> deep links from Command Center,
  // Governance Graph, and Gap pages so cross-page context is preserved.
  useEffect(() => {
    setSelectedDistrict(resolveDistrictParam(searchParams.get('district')));
  }, [searchParams]);

  const indiaStates = [
    { name: 'Maharashtra', code: 'MH', coverage: 71, util: 73, alloc: '₹28,400 Cr', focus: true, x: 260, y: 310 },
    { name: 'Uttar Pradesh', code: 'UP', coverage: 68, util: 69, alloc: '₹34,200 Cr', focus: false, x: 340, y: 190 },
    { name: 'Madhya Pradesh', code: 'MP', coverage: 66, util: 65, alloc: '₹21,800 Cr', focus: false, x: 300, y: 250 },
    { name: 'Gujarat', code: 'GJ', coverage: 78, util: 81, alloc: '₹19,500 Cr', focus: false, x: 190, y: 250 },
    { name: 'Karnataka', code: 'KA', coverage: 76, util: 78, alloc: '₹22,100 Cr', focus: false, x: 260, y: 400 },
    { name: 'Bihar', code: 'BR', coverage: 61, util: 59, alloc: '₹24,600 Cr', focus: false, x: 440, y: 210 },
  ];

  const getFillColor = (d: District) => {
    if (activeFilter === 'Gaps') {
      if (d.isGapFlagged) {
        if (d.gapPercentagePoints >= 30) return '#F43F5E'; // rose-500
        return '#F59E0B'; // amber-500
      }
      return '#E2E8F0'; // slate-200
    }

    if (activeFilter === 'Coverage') {
      if (d.coverageRate >= 75) return '#10B981';
      if (d.coverageRate >= 60) return '#3B82F6';
      return '#F43F5E';
    }

    if (activeFilter === 'Utilization') {
      if (d.fundUtilizationRate >= 75) return '#10B981';
      if (d.fundUtilizationRate >= 55) return '#3B82F6';
      return '#F43F5E';
    }

    if (activeFilter === 'Signals') {
      return d.isGapFlagged ? '#F43F5E' : '#334155';
    }

    if (activeFilter === 'Beneficiaries') {
      if (d.beneficiariesCount >= 500000) return '#10B981';
      if (d.beneficiariesCount >= 250000) return '#3B82F6';
      return '#F43F5E';
    }

    if (activeFilter === 'Outcomes') {
      // Outcome scores live on evidence records, not districts — fall back
      // to the coverage scale and surface an explanatory notice instead of
      // inventing a per-district outcome metric.
      if (d.coverageRate >= 75) return '#10B981';
      if (d.coverageRate >= 60) return '#3B82F6';
      return '#F43F5E';
    }

    return '#3B82F6';
  };

  const districtMetricLabel = (d: District): string => {
    if (activeFilter === 'Coverage' || activeFilter === 'Outcomes') return `${d.coverageRate}%`;
    if (activeFilter === 'Utilization') return `${d.fundUtilizationRate}%`;
    if (activeFilter === 'Beneficiaries') return formatLakh(d.beneficiariesCount);
    return `${d.projectsCount} proj`;
  };

  const legendItems =
    activeFilter === 'Beneficiaries'
      ? [
          { color: 'bg-rose-500', label: 'Under 2.5L reached' },
          { color: 'bg-blue-500', label: '2.5L – 5L reached' },
          { color: 'bg-emerald-400', label: 'Above 5L reached' },
        ]
      : activeFilter === 'Coverage' || activeFilter === 'Outcomes'
      ? [
          { color: 'bg-rose-500', label: 'Below 60% coverage' },
          { color: 'bg-blue-500', label: '60 – 75% coverage' },
          { color: 'bg-emerald-400', label: 'Above 75% coverage' },
        ]
      : activeFilter === 'Utilization'
      ? [
          { color: 'bg-rose-500', label: 'Below 55% utilization' },
          { color: 'bg-blue-500', label: '55 – 75% utilization' },
          { color: 'bg-emerald-400', label: 'Above 75% utilization' },
        ]
      : [
          { color: 'bg-rose-500', label: 'Severe Gap (>30 pp)' },
          { color: 'bg-amber-500', label: 'Moderate Gap' },
          { color: 'bg-emerald-400', label: 'Benchmark Met' },
        ];

  const resolveDistrictEvidence = (d: District): string => {
    if (d.evidenceRecordId) {
      const known = EVIDENCE_RECORDS.find(
        (r) => r.id === d.evidenceRecordId || r.recordNumber === d.evidenceRecordId
      );
      if (known) return known.id;
    }
    const byDistrict = EVIDENCE_RECORDS.find(
      (r) => r.district.toLowerCase() === d.name.toLowerCase()
    );
    return byDistrict ? byDistrict.id : EVIDENCE_RECORDS[0].id;
  };

  // Modeled sub-district coverage bands for hierarchy illustration. These are
  // derived from the district coverage rate — not LGD taluka records — and
  // are labeled as modeled so they are never mistaken for official data.
  // Curated band names exist for the three deep-dive districts only.
  const districtBandNames: Record<string, string[]> = {
    Nandurbar: ['Akkalkuwa', 'Akrani (Dhadgaon)', 'Taloda', 'Shahada', 'Nandurbar (Hq)', 'Navapur'],
    Gadchiroli: ['Bhamragad', 'Etapalli', 'Aheri', 'Sironcha'],
    Washim: ['Malegaon', 'Mangrulpir', 'Manora', 'Washim (Hq)'],
  };

  const buildModeledBands = (d: District) => {
    const names = districtBandNames[d.name] || [
      `${d.name} North`,
      `${d.name} Central`,
      `${d.name} South`,
    ];
    const offsets = [-6, 0, -9, 3, -3, 5];
    return names.map((name, i) => {
      const coverage = Math.max(0, d.coverageRate + (offsets[i % offsets.length] || 0));
      return {
        name,
        band: `BAND ${i + 1} • MODELED`,
        coverage,
        status: (coverage < d.coverageRate - 4 ? 'CRITICAL' : coverage < d.coverageRate + 2 ? 'MODERATE' : 'NORMAL') as 'CRITICAL' | 'MODERATE' | 'NORMAL',
      };
    });
  };

  const activeBlocks = buildModeledBands(selectedDistrict);

  return (
    <AppShell>
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>TERRITORIAL GOVERNANCE LAYER • GIS CARTOGRAPHIC MESH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
            GEOGRAPHIC INTELLIGENCE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {viewLevel === 'INDIA'
              ? 'National Atlas View: Inspect inter-state allocations. Select Maharashtra State to drill down into 36 districts.'
              : 'Cartographic GIS analysis across 36 districts and administrative blocks of Maharashtra State.'}
          </p>
        </div>

        {/* View Zoom & Metric Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Toggle */}
          <div className="flex items-center p-1 bg-[#0B132B] border border-[#1E293B] rounded-md text-xs font-mono">
            <button
              onClick={() => setViewLevel('INDIA')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewLevel === 'INDIA'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              INDIA VIEW
            </button>
            <button
              onClick={() => setViewLevel('MAHARASHTRA')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewLevel === 'MAHARASHTRA'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MAHARASHTRA (36 DISTS)
            </button>
          </div>

          {/* Metric Layer Controls */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-md text-xs font-mono shadow-2xs">
            {(['Coverage', 'Utilization', 'Beneficiaries', 'Outcomes', 'Gaps', 'Signals'] as MetricFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Map & Intelligence Contextual Split */}
      <div className="grid lg:grid-cols-12 gap-6 items-start my-6">
        {/* Left 8 Cols: Custom Cartographic Visualizer on Deep GIS Command Surface */}
        <div className="lg:col-span-8 surface-dark-intel rounded-lg p-5 space-y-4 relative shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {viewLevel === 'INDIA'
                  ? 'NATIONAL ATLAS MESH • CLICK MAHARASHTRA TO DRILL DOWN'
                  : 'REGION: MAHARASHTRA STATE (36 DISTRICT BOUNDARIES ACTIVE)'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-300 flex flex-wrap items-center gap-3">
              {legendItems.map((item) => (
                <span key={item.label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} /> {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive SVG Cartographic Grid with Satellite Coordinate Matrix */}
          <div
            className="relative w-full h-[520px] bg-[#080E21] border border-[#1E293B] rounded-md overflow-hidden flex items-center justify-center p-4 shadow-inner"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                setMapTooltipAnchor({
                  fx: (e.clientX - rect.left) / rect.width,
                  fy: (e.clientY - rect.top) / rect.height,
                });
              }
            }}
            onMouseLeave={() => {
              setHoveredDistrict(null);
              setHoveredState(null);
              setMapTooltipAnchor(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setHoveredDistrict(null);
                setHoveredState(null);
                setMapTooltipAnchor(null);
              }
            }}
          >
            {/* Latitude / Longitude Coordinate Ticks */}
            <div className="absolute top-2 left-3 font-mono text-[9px] text-cyan-500/60 pointer-events-none">
              LAT: 15°45&apos;N — 22°02&apos;N
            </div>
            <div className="absolute top-2 right-3 font-mono text-[9px] text-cyan-500/60 pointer-events-none">
              LNG: 72°36&apos;E — 80°54&apos;E
            </div>

            {viewLevel === 'INDIA' ? (
              /* All-India National Map View */
              <svg className="w-full h-full" viewBox="0 0 600 500">
                <defs>
                  <pattern id="gridPatternDarkIndia" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="600" height="500" fill="url(#gridPatternDarkIndia)" />

                {/* Simplified India silhouette outline */}
                <path
                  d="M 230 60 L 290 80 L 330 130 L 400 170 L 480 200 L 520 220 L 460 270 L 410 260 L 370 330 L 320 440 L 280 470 L 260 410 L 210 330 L 160 260 L 190 190 L 180 130 Z"
                  fill="#0B132B"
                  stroke="#233560"
                  strokeWidth="1.5"
                />

                {/* State Clusters — Maharashtra is the instrumented state;
                    neighbours are illustrative context, not live telemetry. */}
                {indiaStates.map((state) => (
                  <g
                    key={state.code}
                    className={state.focus ? 'cursor-pointer transition-transform duration-200' : 'cursor-not-allowed'}
                    onClick={() => {
                      if (state.name === 'Maharashtra') {
                        setViewLevel('MAHARASHTRA');
                      }
                    }}
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    <rect
                      x={state.x - 35}
                      y={state.y - 20}
                      width="70"
                      height="40"
                      rx="4"
                      fill={state.focus ? '#1D4ED8' : '#101F42'}
                      fillOpacity={state.focus ? 0.95 : 0.85}
                      stroke={state.focus ? '#38BDF8' : '#233560'}
                      strokeWidth={state.focus ? 2 : 1}
                    />
                    <text
                      x={state.x}
                      y={state.y - 4}
                      textAnchor="middle"
                      fill={state.focus ? '#FFFFFF' : '#CBD5E1'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {state.code}
                    </text>
                    <text
                      x={state.x}
                      y={state.y + 10}
                      textAnchor="middle"
                      fill={state.focus ? '#BAE6FD' : '#64748B'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {state.coverage}% cov
                    </text>
                    {state.focus && (
                      <circle
                        cx={state.x + 30}
                        cy={state.y - 15}
                        r="4"
                        fill="#38BDF8"
                        className="animate-ping"
                      />
                    )}
                  </g>
                ))}
              </svg>
            ) : (
              /* Maharashtra 36 Districts Detailed Choropleth */
              <svg
                className="w-full h-full animate-in zoom-in-95 duration-300"
                viewBox="0 0 800 500"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <pattern id="gridPatternDarkMh" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#172554" strokeWidth="0.5" />
                  </pattern>
                  {/* Subtle topo-contour rings pattern */}
                  <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0B132B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <rect width="800" height="500" fill="url(#gridPatternDarkMh)" />

                {/* State boundary background outline with topographic silhouette */}
                <path
                  d="M 160 80 L 320 60 L 520 70 L 680 120 L 760 210 L 740 330 L 610 420 L 440 440 L 320 460 L 220 420 L 140 280 L 130 180 Z"
                  fill="#0B1E3B"
                  fillOpacity="0.75"
                  stroke="#1E3A8A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Major River Basins (Godavari, Krishna, Tapi topological conduits) */}
                <path
                  d="M 170 120 Q 320 180 520 220 T 730 300"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  strokeDasharray="2 3"
                />
                <path
                  d="M 220 280 Q 360 340 540 380"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeDasharray="2 3"
                />

                {/* Render 36 District Polygons / Nodes mapped to geo coordinates */}
                {MAHARASHTRA_DISTRICTS.map((district) => {
                  const minLng = 72.5;
                  const maxLng = 80.5;
                  const minLat = 15.5;
                  const maxLat = 22.0;

                  const x = ((district.coordinates[1] - minLng) / (maxLng - minLng)) * 620 + 80;
                  const y = (1 - (district.coordinates[0] - minLat) / (maxLat - minLat)) * 360 + 70;

                  const isSelected = selectedDistrict.id === district.id;
                  const isHovered = hoveredDistrict?.id === district.id;
                  const fillColor = getFillColor(district);

                  return (
                    <g
                      key={district.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${district.name} district, coverage ${district.coverageRate} percent${district.isGapFlagged ? `, gap flagged ${district.gapPercentagePoints} points` : ''}. Press Enter to inspect.`}
                      className="cursor-pointer transition-transform duration-200"
                      onClick={() => setSelectedDistrict(district)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedDistrict(district);
                        }
                      }}
                      onMouseEnter={() => setHoveredDistrict(district)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      onFocus={() => setHoveredDistrict(district)}
                      onBlur={() => setHoveredDistrict(null)}
                    >
                      {/* Pulsing ring if selected */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r="32"
                          fill="none"
                          stroke="#38BDF8"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="animate-spin"
                          style={{ transformOrigin: `${x}px ${y}px`, animationDuration: '9s' }}
                        />
                      )}

                      {/* Sonar Radar Pulse Ring on Priority Flagged Districts */}
                      {district.isGapFlagged && (
                        <circle
                          cx={x}
                          cy={y}
                          r="22"
                          fill="none"
                          stroke="#F43F5E"
                          className="animate-ping opacity-40 pointer-events-none"
                        />
                      )}

                      {/* District Area Polygon representation */}
                      <rect
                        x={x - 22}
                        y={y - 18}
                        width="44"
                        height="36"
                        rx="4"
                        fill={isSelected ? '#1D4ED8' : fillColor}
                        fillOpacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
                        stroke={isSelected ? '#38BDF8' : isHovered ? '#60A5FA' : '#334155'}
                        strokeWidth={isSelected || isHovered ? 2 : 1}
                      />

                      {/* District Code Label */}
                      <text
                        x={x}
                        y={y - 2}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        letterSpacing="0.05em"
                      >
                        {district.code}
                      </text>

                      {/* Metric indicator */}
                      <text
                        x={x}
                        y={y + 10}
                        textAnchor="middle"
                        fill={isSelected ? '#BAE6FD' : '#CBD5E1'}
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {districtMetricLabel(district)}
                      </text>

                      {/* Priority Warning Dot on flagged districts */}
                      {district.isGapFlagged && (
                        <circle cx={x + 18} cy={y - 14} r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Floating Tooltip for India State Hover */}
            {hoveredState && mapTooltipAnchor && viewLevel === 'INDIA' && (
              <div
                className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-md bg-[#0B132B] border border-[#233560] text-white font-mono text-xs shadow-2xl transition-opacity duration-150 max-w-[70%]"
                style={{
                  left: `${Math.min(Math.max(mapTooltipAnchor.fx * 100, 18), 82)}%`,
                  top: `${Math.max(mapTooltipAnchor.fy * 100 - 3, 8)}%`,
                }}
              >
                <div className="font-bold text-sm text-cyan-300">{hoveredState.name}</div>
                {hoveredState.focus ? (
                  <>
                    <div className="text-[10px] text-slate-300 mt-0.5">Allocation: {hoveredState.alloc}</div>
                    <div className="flex gap-3 text-[10px] mt-1 pt-1 border-t border-[#1E293B]">
                      <span>Coverage: <strong className="text-emerald-400">{hoveredState.coverage}%</strong></span>
                      <span>Utilization: <strong className="text-cyan-400">{hoveredState.util}%</strong></span>
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Illustrative context — SUTRA currently instruments Maharashtra (LGD state 27) only.
                  </div>
                )}
              </div>
            )}

            {/* Floating Tooltip for Maharashtra District Hover */}
            {hoveredDistrict && mapTooltipAnchor && viewLevel === 'MAHARASHTRA' && (
              <DistrictHoverTooltip
                district={hoveredDistrict}
                fx={mapTooltipAnchor.fx}
                fy={mapTooltipAnchor.fy}
              />
            )}

            {/* Floating Map Watermark */}
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-500">
              LGD CODE MAPPED • SCHEMATIC DISTRICT CARTOGRAM (NOT SURVEY BOUNDARIES)
            </div>
          </div>

          {activeFilter === 'Outcomes' && (
            <div className="p-3 rounded-md bg-amber-950/60 border border-amber-800/60 text-amber-200 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2">
              <span>
                Outcome scores are recorded per evidence record — not per district — so this layer reuses the
                coverage scale. Open the Evidence Hub for record-level outcome scores.
              </span>
              <button
                onClick={() => router.push('/evidence')}
                className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-100 text-[11px] font-semibold cursor-pointer"
              >
                Open Evidence Hub →
              </button>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <span>
              {viewLevel === 'INDIA'
                ? 'Click Maharashtra card to zoom into district choropleth'
                : 'Click any district marker to inspect cross-ministry telemetry'}
            </span>
            <span>
              Target Selected: <strong className="text-cyan-400">{selectedDistrict.name} (LGD: {selectedDistrict.lgdCode})</strong>
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Contextual Intelligence Panel with Deliberate Surfaces */}
        <div className="lg:col-span-4 space-y-5">
          {/* Blue Geographic Panel Header */}
          <div className="surface-geo-blue rounded-lg p-5 shadow-lg space-y-4 text-white">
            <div className="border-b border-[#1E3A8A] pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  DISTRICT LIVE INTELLIGENCE
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#080E21] text-cyan-300 border border-[#1E3A8A] font-semibold">
                  LGD {selectedDistrict.lgdCode}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white font-editorial mt-1">
                {selectedDistrict.name.toUpperCase()}
              </h2>
              <p className="text-xs text-blue-200">{selectedDistrict.zone}, Maharashtra State</p>
            </div>

            {/* Key Metrics on Deliberate Surfaces */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-md bg-[#080E21] border border-[#1E3A8A]">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">PROGRAMME COVERAGE</span>
                <div className="text-xl font-bold text-white mt-0.5">{selectedDistrict.coverageRate}%</div>
                <span className="text-[10px] text-slate-400">Benchmark: {selectedDistrict.regionalBenchmarkRate}%</span>
              </div>

              <div className="p-3 rounded-md bg-[#080E21] border border-[#1E3A8A]">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">FUND UTILIZATION</span>
                <div className="text-xl font-bold text-white mt-0.5">{selectedDistrict.fundUtilizationRate}%</div>
                <span className="text-[10px] text-slate-400">Pace Target: 80%</span>
              </div>

              <div className="p-3 rounded-md bg-[#080E21] border border-[#1E3A8A]">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">BUDGET ALLOCATED</span>
                <div className="text-base font-bold text-cyan-300 mt-0.5">₹{selectedDistrict.budgetAllocatedCr} Cr</div>
                <span className="text-[10px] text-slate-400">Across {selectedDistrict.activeSchemesCount} schemes</span>
              </div>

              <div className={`p-3 rounded-md border ${selectedDistrict.isGapFlagged ? 'bg-rose-950/80 border-rose-800' : 'bg-emerald-950/80 border-emerald-800'}`}>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">DRAWDOWN DEFICIT</span>
                <div className={`text-base font-bold mt-0.5 ${selectedDistrict.isGapFlagged ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {selectedDistrict.gapPercentagePoints} pp
                </div>
                <span className="text-[10px] text-slate-400">Variance Index</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#1E3A8A]">
              <button
                onClick={() => openWhyFlagged('SUTRA-FND-0001', selectedDistrict.name)}
                className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>WHY FLAGGED? EXPLAIN INSIGHT</span>
              </button>

              <button
                onClick={() => router.push('/investigation/SUTRA-INV-2026-0001')}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>OPEN INVESTIGATION WORKSPACE</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => openEvidence(resolveDistrictEvidence(selectedDistrict))}
                  className="py-1.5 px-2.5 bg-[#080E21] hover:bg-[#101F42] border border-[#233560] text-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer text-center truncate"
                >
                  View Evidence
                </button>
                <button
                  onClick={() => openExecutiveBrief(selectedDistrict)}
                  className="py-1.5 px-2.5 bg-[#080E21] hover:bg-[#101F42] border border-[#233560] text-slate-200 rounded-md text-xs font-medium transition-colors cursor-pointer text-center truncate"
                >
                  Executive Brief
                </button>
              </div>
            </div>
          </div>

          {/* Sub-District Administrative Hierarchy (District -> Block -> GP) */}
          <div className="surface-neutral-analytical rounded-lg p-4 space-y-3 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-blue-600" />
                ADMINISTRATIVE HIERARCHY DRILL-DOWN
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Modeled bands (not LGD records)
              </span>
            </div>

            <div className="font-mono text-xs text-slate-600 flex items-center gap-1.5">
              <span className="font-bold text-slate-900">MH</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-bold text-blue-700">{selectedDistrict.name}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-500">Sub-District Blocks</span>
            </div>

            <div className="space-y-2 pt-1">
              {activeBlocks.map((block) => (
                <div
                  key={block.name}
                  className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs font-mono"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">{block.name}</span>
                    <span className="text-[10px] text-slate-400">{block.band}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{block.coverage}% cov</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1 rounded ${
                        block.status === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : block.status === 'MODERATE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {block.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>Zone: {selectedDistrict.zone}</span>
              <span>Benchmark: {selectedDistrict.regionalBenchmarkRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DistrictHoverTooltip({
  district,
  fx,
  fy,
}: {
  district: District;
  fx: number;
  fy: number;
}) {
  const leftPct = Math.min(Math.max(fx * 100, 20), 80);
  return (
    <div
      className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-md bg-[#0B132B] border border-cyan-500/50 text-white font-mono text-xs shadow-2xl w-[260px] max-w-[70%] transition-opacity duration-150"
      style={{
        left: `${leftPct}%`,
        top: `${Math.max(fy * 100 - 3, 10)}%`,
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#1E293B] pb-1.5 mb-1.5">
        <span className="font-bold text-sm text-white truncate">{district.name}</span>
        <span
          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
            district.isGapFlagged
              ? 'bg-rose-950 text-rose-300 border border-rose-800'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}
        >
          {district.isGapFlagged ? `GAP ${district.gapPercentagePoints} pp` : 'BENCHMARK MET'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
        <div>Coverage: <strong className="text-cyan-300">{district.coverageRate}%</strong></div>
        <div>Utilization: <strong className="text-white">{district.fundUtilizationRate}%</strong></div>
        <div>Projects: <strong className="text-slate-300">{district.projectsCount}</strong></div>
        <div>Allocation: <strong className="text-emerald-400">₹{district.budgetAllocatedCr} Cr</strong></div>
      </div>
      <div className="mt-1.5 pt-1 border-t border-[#1E293B] text-[9px] text-cyan-400">
        Click district to inspect cross-ministry telemetry
      </div>
    </div>
  );
}

export default function GeographicIntelligencePage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="p-8 text-sm font-mono text-slate-500">Loading geographic intelligence…</div>
        </AppShell>
      }
    >
      <GeographicIntelligenceInner />
    </Suspense>
  );
}
