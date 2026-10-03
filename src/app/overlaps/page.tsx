'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { OVERLAPS_DATA } from '@/lib/data/governance-data';
import { OverlapInsight } from '@/lib/types';
import { computeTfIdfCosine } from '@/lib/engines/math-algorithms';
import {
  ArrowRight,
  GitCompare,
  Sliders,
  Sparkles,
  Calculator,
  Code,
  Network,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
} from 'lucide-react';

const PRESET_TEXTS = {
  organic: {
    a: 'Subsidies for smallholder organic cluster certification, biological pest control, vermicompost soil inputs, and local farmer producer organizations.',
    b: 'Direct financial assistance for certified organic production hubs, biological farm inputs, eco-packaging facilities, and tribal FPO aggregation.',
  },
  water: {
    a: 'Gram Panchayat decentralized functional household tap connections (FHTC), automated water quality field testing kits, and village water and sanitation committees.',
    b: 'Community-led groundwater management, water security plans, aquifer mapping, water quality surveillance, and participatory water budgeting in water-stressed blocks.',
  },
  housing: {
    a: 'Direct benefit transfer for pucca house construction with toilet and LPG connection to rural households living in kutcha and dilapidated houses as per SECC list.',
    b: 'Special financial assistance and material subsidy for durable shelter creation for vulnerable tribal beneficiaries in forested and remote habitations.',
  },
};

export default function OverlapsPage() {
  const { openEvidence, openExplain } = useIntelligence();
  const [selectedOverlap, setSelectedOverlap] = useState<OverlapInsight>(OVERLAPS_DATA[0]);

  // Mathematical Weight Sandbox State
  const [weightTarget, setWeightTarget] = useState(35);
  const [weightGeo, setWeightGeo] = useState(25);
  const [weightIntervention, setWeightIntervention] = useState(25);
  const [weightPeriod, setWeightPeriod] = useState(15);

  const resetWeights = () => {
    setWeightTarget(35);
    setWeightGeo(25);
    setWeightIntervention(25);
    setWeightPeriod(15);
  };

  const totalWeight = weightTarget + weightGeo + weightIntervention + weightPeriod || 1;
  const dynamicallyCalculatedScore = Number(
    (
      (weightTarget * selectedOverlap.breakdown.targetGroup +
        weightGeo * selectedOverlap.breakdown.geography +
        weightIntervention * selectedOverlap.breakdown.intervention +
        weightPeriod * selectedOverlap.breakdown.implementationPeriod) /
      totalWeight
    ).toFixed(1)
  );

  // Live Policy Text Cosine Vectorizer Sandbox
  const [policyTextA, setPolicyTextA] = useState(PRESET_TEXTS.organic.a);
  const [policyTextB, setPolicyTextB] = useState(PRESET_TEXTS.organic.b);

  const [vectorResult, setVectorResult] = useState(() =>
    computeTfIdfCosine(policyTextA, policyTextB)
  );

  const handleComputeVector = () => {
    const res = computeTfIdfCosine(policyTextA, policyTextB);
    setVectorResult(res);
  };

  const loadPreset = (key: keyof typeof PRESET_TEXTS) => {
    setPolicyTextA(PRESET_TEXTS[key].a);
    setPolicyTextB(PRESET_TEXTS[key].b);
    setVectorResult(computeTfIdfCosine(PRESET_TEXTS[key].a, PRESET_TEXTS[key].b));
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Title Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Multi-Vector Programmatic Alignment Engine</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Programme Overlap & Vector Mathematics
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Multi-dimensional vector engine detecting concurrent schemes with duplicative beneficiary segments, geographic targets, or capital interventions using TF-IDF cosine similarity.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Link
                href="/relationships"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors shadow-sm"
              >
                <Network className="w-3.5 h-3.5 text-blue-600" />
                <span>Knowledge Graph</span>
              </Link>
              <Link
                href="/investigate"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                <FileSearch className="w-3.5 h-3.5" />
                <span>Investigations</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Overlap Pair Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {OVERLAPS_DATA.map((overlap) => {
            const isSelected = selectedOverlap.id === overlap.id;
            return (
              <button
                key={overlap.id}
                onClick={() => setSelectedOverlap(overlap)}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {overlap.id}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      overlap.similarityScore > 80
                        ? 'bg-rose-100 text-rose-700'
                        : overlap.similarityScore > 75
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {overlap.similarityScore}% Match
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-800 line-clamp-1">
                  {overlap.schemeAName.split('(')[0].trim()}
                </div>
                <div className="text-[11px] text-slate-500 font-mono my-0.5">⇄</div>
                <div className="text-xs font-medium text-slate-800 line-clamp-1">
                  {overlap.schemeBName.split('(')[0].trim()}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Overlap Spotlight on Deliberate Analytical Surface */}
        <div className="p-6 rounded-lg surface-neutral-analytical border border-slate-200 shadow-sm space-y-6">
          {/* Header & Recalculated Score on Amber Alert Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg surface-amber-alert border border-amber-300">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                CROSS-PROGRAMME CONVERGENCE SPOTLIGHT
              </span>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-editorial">
                  {selectedOverlap.schemeAName}
                </h2>
                <span className="text-base font-mono text-amber-700 hidden md:inline">⇄</span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-editorial">
                  {selectedOverlap.schemeBName}
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Schemes flagged for redundant target beneficiary criteria, geographic scope, and capital intervention pipelines.
              </p>
            </div>

            <div className="text-left sm:text-right font-mono bg-white p-3 rounded-lg border border-amber-200 min-w-[170px] shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Composite Alignment
              </span>
              <div className="text-3xl font-bold text-blue-700 mt-0.5">
                {dynamicallyCalculatedScore}%
              </div>
              <span
                className={`text-[11px] font-semibold block ${
                  dynamicallyCalculatedScore > 80
                    ? 'text-rose-700 font-bold'
                    : dynamicallyCalculatedScore > 75
                    ? 'text-amber-800 font-bold'
                    : 'text-blue-700'
                }`}
              >
                {dynamicallyCalculatedScore > 80
                  ? 'Critical Duplication'
                  : dynamicallyCalculatedScore > 75
                  ? 'Moderate Convergence'
                  : 'Low Overlap'}
              </span>
            </div>
          </div>

          {/* Venn-Style Geometric Convergence Diagram */}
          <div className="surface-dark-intel rounded-lg p-5 border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                CONVERGENCE INTERSECTION TOPOLOGY (VENN MODEL)
              </span>
              <span className="text-slate-400 text-[10px]">
                Geometric Set Intersection • SECC Beneficiaries & Capital Interventions
              </span>
            </div>

            <div className="relative w-full h-44 bg-[#080E21] border border-[#1E293B] rounded-md overflow-hidden flex items-center justify-center p-2">
              <svg className="w-full h-full max-w-lg" viewBox="0 0 500 160">
                <defs>
                  {/* Glowing intersection gradient */}
                  <linearGradient id="vennGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Left Scheme Circle */}
                <circle cx="180" cy="80" r="68" fill="#1D4ED8" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2" />
                {/* Right Scheme Circle */}
                <circle cx="320" cy="80" r="68" fill="#0D9488" fillOpacity="0.3" stroke="#14B8A6" strokeWidth="2" />

                {/* Overlap Intersection Highlight */}
                <path
                  d="M 250 25 A 68 68 0 0 1 250 135 A 68 68 0 0 1 250 25 Z"
                  fill="url(#vennGradient)"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                {/* Labels */}
                <text x="140" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {selectedOverlap.schemeAId}
                </text>
                <text x="140" y="90" textAnchor="middle" fill="#93C5FD" fontSize="8" fontFamily="monospace">
                  {selectedOverlap.schemeAName.split('(')[0].trim()}
                </text>

                <text x="360" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {selectedOverlap.schemeBId}
                </text>
                <text x="360" y="90" textAnchor="middle" fill="#5EEAD4" fontSize="8" fontFamily="monospace">
                  {selectedOverlap.schemeBName.split('(')[0].trim()}
                </text>

                {/* Center Intersection Badge */}
                <rect x="220" y="65" width="60" height="30" rx="4" fill="#0B132B" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="250" y="80" textAnchor="middle" fill="#FBBF24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {dynamicallyCalculatedScore}%
                </text>
                <text x="250" y="91" textAnchor="middle" fill="#CBD5E1" fontSize="7" fontFamily="monospace">
                  OVERLAP
                </text>
              </svg>
            </div>
          </div>

          {/* 4 Factor Breakdown Visualizers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Multi-Vector Similarity Decomposition
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Normalized sub-indices [0-100]</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px] font-semibold">TARGET GROUP</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOverlap.breakdown.targetGroup}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
                  <div
                    className="bg-blue-600 h-full rounded transition-all duration-300"
                    style={{ width: `${selectedOverlap.breakdown.targetGroup}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1.5">Shared SECC Segment</span>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px] font-semibold">GEOGRAPHY</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOverlap.breakdown.geography}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
                  <div
                    className="bg-blue-600 h-full rounded transition-all duration-300"
                    style={{ width: `${selectedOverlap.breakdown.geography}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1.5">High-Overlap Blocks</span>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px] font-semibold">INTERVENTION</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOverlap.breakdown.intervention}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
                  <div
                    className="bg-blue-600 h-full rounded transition-all duration-300"
                    style={{ width: `${selectedOverlap.breakdown.intervention}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1.5">Input & Infrastructure Subsidies</span>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px] font-semibold">PERIOD</span>
                  <span className="font-mono font-bold text-slate-900">{selectedOverlap.breakdown.implementationPeriod}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded mt-2">
                  <div
                    className="bg-blue-600 h-full rounded transition-all duration-300"
                    style={{ width: `${selectedOverlap.breakdown.implementationPeriod}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-1.5">Active FY 2024–2027</span>
              </div>
            </div>
          </div>

          {/* Mathematical Weight Sensitivity Sandbox */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-blue-700" />
                <span className="text-slate-900 font-semibold text-xs uppercase">
                  Interactive Vector Weight Sensitivity Sandbox
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[11px] font-mono text-slate-500">
                  S = Σ(w_i · v_i) / Σ(w_i)
                </span>
                <button
                  onClick={resetWeights}
                  className="text-xs text-blue-700 hover:text-blue-800 flex items-center space-x-1 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Drag weights to see how adjusting administrative priorities recalculates the composite overlap index:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Target Group:</span>
                  <span className="text-blue-700 font-mono font-bold">{weightTarget}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightTarget}
                  onChange={(e) => setWeightTarget(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Geography:</span>
                  <span className="text-blue-700 font-mono font-bold">{weightGeo}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightGeo}
                  onChange={(e) => setWeightGeo(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Intervention:</span>
                  <span className="text-blue-700 font-mono font-bold">{weightIntervention}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightIntervention}
                  onChange={(e) => setWeightIntervention(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Period:</span>
                  <span className="text-blue-700 font-mono font-bold">{weightPeriod}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightPeriod}
                  onChange={(e) => setWeightPeriod(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Why Flagged & Policy Recommendations */}
          <div className="grid md:grid-cols-2 gap-6 items-start pt-2 border-t border-slate-200">
            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Why Flagged?
              </span>
              <div className="space-y-2 text-xs">
                {selectedOverlap.whyFlagged.map((reason, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-700 bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block">
                Harmonization Recommendation
              </span>
              <p className="text-xs text-slate-700 leading-relaxed p-3.5 rounded-lg surface-green-verified border border-emerald-300">
                {selectedOverlap.recommendation}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-end pt-3 border-t border-slate-200">
            <button
              onClick={() =>
                openExplain({
                  title: `${selectedOverlap.schemeAName} ⇄ ${selectedOverlap.schemeBName}`,
                  subtitle: `${dynamicallyCalculatedScore}% Multi-Vector Programmatic Overlap`,
                  confidence: 89,
                  factors: [
                    { title: 'TARGET GROUP COINCIDENCE', weight: weightTarget },
                    { title: 'INTERVENTION SUBSIDY DUPLICATION', weight: weightIntervention },
                    { title: 'GEOGRAPHIC BLOCK OVERLAP', weight: weightGeo },
                    { title: 'PERIOD CONCURRENCY', weight: weightPeriod },
                  ],
                  evidenceRecordNumber: selectedOverlap.evidenceRecordIds[0] || 'SUTRA-EVD-9281',
                })
              }
              className="px-4 py-2 rounded bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              Why This Insight?
            </button>

            <button
              onClick={() => openEvidence(selectedOverlap.evidenceRecordIds[0] || 'SUTRA-EVD-9281')}
              className="px-4 py-2 rounded bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <span>View Supporting Data ({selectedOverlap.evidenceRecordIds[0] || 'SUTRA-EVD-9281'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live TF-IDF Policy Text Vectorizer Sandbox on Deep Midnight Console */}
        <div className="p-6 surface-dark-intel border border-[#1E293B] rounded-lg shadow-xl space-y-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-editorial">
                Live Policy Text Cosine Similarity Vectorizer
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400 font-mono">Presets:</span>
                <button
                  onClick={() => loadPreset('organic')}
                  className="px-2 py-0.5 text-[11px] rounded bg-[#080E21] hover:bg-[#101F42] border border-[#233560] text-slate-200 font-mono cursor-pointer"
                >
                  Organic
                </button>
                <button
                  onClick={() => loadPreset('water')}
                  className="px-2 py-0.5 text-[11px] rounded bg-[#080E21] hover:bg-[#101F42] border border-[#233560] text-slate-200 font-mono cursor-pointer"
                >
                  Water
                </button>
                <button
                  onClick={() => loadPreset('housing')}
                  className="px-2 py-0.5 text-[11px] rounded bg-[#080E21] hover:bg-[#101F42] border border-[#233560] text-slate-200 font-mono cursor-pointer"
                >
                  Housing
                </button>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Cosine Score: {vectorResult.cosineScore}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Paste any two scheme guidelines or project intervention scopes to calculate token frequency vectors and high-dimensional cosine angle:
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <span className="text-[11px] font-sans font-semibold text-slate-300 block">
                SCHEME A GUIDELINE TEXT:
              </span>
              <textarea
                rows={3}
                value={policyTextA}
                onChange={(e) => setPolicyTextA(e.target.value)}
                className="w-full p-2.5 bg-[#080E21] border border-[#233560] rounded text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-xs shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-sans font-semibold text-slate-300 block">
                SCHEME B GUIDELINE TEXT:
              </span>
              <textarea
                rows={3}
                value={policyTextB}
                onChange={(e) => setPolicyTextB(e.target.value)}
                className="w-full p-2.5 bg-[#080E21] border border-[#233560] rounded text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-xs shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#1E293B]">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Shared Vector Tokens:</span>
              {vectorResult.sharedTokens.length > 0 ? (
                vectorResult.sharedTokens.slice(0, 7).map((token) => (
                  <span
                    key={token}
                    className="px-2 py-0.5 rounded bg-[#101F42] border border-cyan-500/40 text-cyan-300 font-mono text-[11px]"
                  >
                    {token}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic text-[11px]">No common tokens</span>
              )}
            </div>

            <button
              onClick={handleComputeVector}
              className="px-3.5 py-1.5 bg-blue-600 text-white font-medium text-xs rounded hover:bg-blue-500 flex items-center space-x-1.5 transition-colors shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Recalculate Cosine Angle</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
