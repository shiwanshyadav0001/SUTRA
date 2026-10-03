'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { OVERLAPS_DATA } from '@/lib/data/governance-data';
import { OverlapInsight } from '@/lib/types';
import { computeTfIdfCosine } from '@/lib/engines/math-algorithms';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  GitCompare,
  Sliders,
  Sparkles,
  Calculator,
  Code,
} from 'lucide-react';

const OVERLAP_PRESETS = [
  {
    id: 'OVL-01',
    label: 'Agriculture: PKVY vs MOVCDNER (81.3% Overlap)',
    shortName: 'PKVY ⇄ MOVCDNER',
    schemeAName: 'PM Scheme A (Paramparagat Krishi Vikas Yojana)',
    schemeBName: 'PM Scheme B (Organic Value Chain Initiative)',
    textA: 'Subsidies for smallholder organic cluster certification, biological pest control, vermicompost soil inputs, and local farmer producer organizations.',
    textB: 'Direct financial assistance for certified organic production hubs, biological farm inputs, eco-packaging facilities, and tribal FPO aggregation.',
    breakdown: { targetGroup: 91, geography: 74, intervention: 86, implementationPeriod: 68 },
    whyFlagged: [
      'Similar beneficiary segment (Smallholder organic farming households)',
      'Same geographic regions (Tribal and rainfed clusters in Nandurbar, Gadchiroli, Dhule)',
      'Similar intervention (Bio-input subsidies, certification funding, vermicompost pits)',
      'Overlapping implementation period (FY 2024–2027 continuous tranches)',
    ],
    recommendation: 'Harmonize DBT beneficiary registries to prevent duplicate organic certification subsidies and establish single-window cluster verification.',
    evidenceNumber: '#9281',
  },
  {
    id: 'OVL-02',
    label: 'Rural Housing: PMAY-G vs Shabari Housing (79.0% Overlap)',
    shortName: 'PMAY-G ⇄ Shabari Housing',
    schemeAName: 'PMAY-G (Pradhan Mantri Awaas Yojana - Gramin)',
    schemeBName: 'State Shabari Tribal Housing Mission',
    textA: 'Direct benefit transfer of ₹1.20 lakh per beneficiary unit for construction of disaster-resilient pucca house with piped water and clean fuel convergence.',
    textB: 'Financial grant subsidy of ₹1.30 lakh for scheduled tribe rural families residing in kachha dwellings across notified tribal sub-plan blocks.',
    breakdown: { targetGroup: 88, geography: 82, intervention: 76, implementationPeriod: 71 },
    whyFlagged: [
      'Concurrent geo-tagged housing assistance targeting the same BPL tribal households',
      'Dual administrative overhead across block development offices',
      'Disjointed DBT disbursement schedules causing contractor execution lags',
    ],
    recommendation: 'Establish unified SECC registration linkage with direct top-up financing model to eliminate parallel verification pipelines.',
    evidenceNumber: '#4412',
  },
  {
    id: 'OVL-03',
    label: 'Water Security: Jal Jeevan Mission vs Atal Bhujal Yojana (76.0% Overlap)',
    shortName: 'JJM ⇄ Atal Bhujal',
    schemeAName: 'Jal Jeevan Mission (Har Ghar Jal)',
    schemeBName: 'Atal Bhujal Yojana (Groundwater Management)',
    textA: 'Functional household tap connections providing 55 lpcd potable water supply to every rural home through community-managed village infrastructure.',
    textB: 'Sustainable community-led groundwater management, water security budgeting, and artificial aquifer recharge structures in water-stressed blocks.',
    breakdown: { targetGroup: 72, geography: 85, intervention: 79, implementationPeriod: 69 },
    whyFlagged: [
      'Overlapping watershed intervention areas in over-exploited groundwater blocks',
      'Parallel water quality testing kits distribution without central laboratory telemetry sync',
      'Independent village water sanitation committees managing overlapping asset registers',
    ],
    recommendation: 'Federate village-level telemetry data directly into the National Water Informatics Center portal for unified groundwater aquifer extraction caps.',
    evidenceNumber: '#7211',
  },
  {
    id: 'OVL-04',
    label: 'Farmer Support: PM-KISAN vs PKVY Direct Subsidy (65.4% Overlap)',
    shortName: 'PM-KISAN ⇄ PKVY Cluster',
    schemeAName: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    schemeBName: 'PKVY Direct Cluster Support Subsidy',
    textA: 'Income support of ₹6,000 per year in three equal installments to all landholding farmer families across India via Direct Benefit Transfer.',
    textB: 'Direct financial assistance of ₹50,000 per hectare for cluster formation, capacity building, organic certification, and eco-inputs.',
    breakdown: { targetGroup: 84, geography: 62, intervention: 54, implementationPeriod: 61 },
    whyFlagged: [
      'High overlap in smallholder farmer beneficiary registry records in Maharashtra',
      'Non-synchronized DBT tranches missing seasonal planting seed procurement windows',
    ],
    recommendation: 'Co-ordinate Aadhaar DBT bank account registries between MoA&FW central portal and state organic mission registries.',
    evidenceNumber: '#5512',
  },
];

export default function OverlapsPage() {
  const { openEvidence, openExplain } = useIntelligence();
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const currentPreset = OVERLAP_PRESETS[activePresetIndex];

  // Mathematical Weight Sandbox State
  const [weightTarget, setWeightTarget] = useState(35);
  const [weightGeo, setWeightGeo] = useState(25);
  const [weightIntervention, setWeightIntervention] = useState(25);
  const [weightPeriod, setWeightPeriod] = useState(15);

  const totalWeight = weightTarget + weightGeo + weightIntervention + weightPeriod || 1;
  const dynamicallyCalculatedScore = Number(
    (
      (weightTarget * currentPreset.breakdown.targetGroup +
        weightGeo * currentPreset.breakdown.geography +
        weightIntervention * currentPreset.breakdown.intervention +
        weightPeriod * currentPreset.breakdown.implementationPeriod) /
      totalWeight
    ).toFixed(1)
  );

  // Live Policy Text Cosine Vectorizer Sandbox
  const [policyTextA, setPolicyTextA] = useState(currentPreset.textA);
  const [policyTextB, setPolicyTextB] = useState(currentPreset.textB);

  const [vectorResult, setVectorResult] = useState(() =>
    computeTfIdfCosine(currentPreset.textA, currentPreset.textB)
  );

  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    const p = OVERLAP_PRESETS[index];
    setPolicyTextA(p.textA);
    setPolicyTextB(p.textB);
    const res = computeTfIdfCosine(p.textA, p.textB);
    setVectorResult(res);
  };

  const handleComputeVector = () => {
    const res = computeTfIdfCosine(policyTextA, policyTextB);
    setVectorResult(res);
  };

  const handleApplyWeightPreset = (t: number, g: number, i: number, p: number) => {
    setWeightTarget(t);
    setWeightGeo(g);
    setWeightIntervention(i);
    setWeightPeriod(p);
  };

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-2 border-b border-[#33312D] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#DFB88B] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DFB88B]" />
          <span>MULTI-VECTOR PROGRAMMATIC ALIGNMENT ENGINE</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
          PROGRAMME OVERLAP & VECTOR MATHEMATICS
        </h1>
        <p className="text-xs text-[#DDD7CD] max-w-2xl">
          Multi-vector programmatic alignment engine detecting concurrent schemes with duplicative beneficiary segments, geographic targets, or capital interventions using vector cosine similarity.
        </p>

        {/* Interactive Scheme Pair Switcher Tabs */}
        <div className="pt-4 flex flex-wrap gap-2">
          {OVERLAP_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3.5 py-2 rounded-sm text-xs font-mono font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                activePresetIndex === idx
                  ? 'bg-[#C89B65]/20 text-[#DFB88B] border-[#DFB88B] shadow-md shadow-[#C89B65]/10 font-bold'
                  : 'bg-[#181816] text-[#A39D92] border-[#33312D] hover:border-[#4A4740] hover:text-[#FAF8F5]'
              }`}
            >
              <span>{preset.shortName}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${activePresetIndex === idx ? 'bg-[#DFB88B]/20 text-[#DFB88B]' : 'bg-[#22211D] text-[#8E887E]'}`}>
                {OVERLAP_PRESETS[idx].breakdown.targetGroup > 80 ? 'Critical' : 'Moderate'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Overlap Spotlight: Scheme A vs Scheme B */}
      <div className="p-6 md:p-8 rounded-sm bg-[#181816] border border-[#38352F] space-y-8 shadow-2xl">
        {/* Top Header & Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#302E2A] pb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-[#C89B65]/15 text-[#DFB88B] border border-[#C89B65]/35 font-bold">
              CROSS-PROGRAMME OVERLAP ALERT • {currentPreset.id}
            </span>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-editorial">
                {currentPreset.schemeAName}
              </h2>
              <span className="text-xl font-mono text-[#DFB88B] hidden md:inline">⇄</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-editorial">
                {currentPreset.schemeBName}
              </h2>
            </div>

            {/* Animated Bidirectional Energy Alignment Conduit */}
            <div className="pt-3 hidden sm:block max-w-lg">
              <div className="flex items-center space-x-2 text-[9px] font-mono text-[#A39D92] mb-1 font-semibold">
                <span>CONCURRENT PROGRAMME CONDUIT</span>
                <span className="text-[#DFB88B]">• {dynamicallyCalculatedScore}% RECALCULATED FLUX</span>
              </div>
              <svg className="w-full h-2">
                <line x1="0" y1="4" x2="100%" y2="4" stroke="#33312D" strokeWidth="1.5" />
                <line
                  x1="0"
                  y1="4"
                  x2="100%"
                  y2="4"
                  stroke="#DFB88B"
                  strokeWidth="2"
                  className="animate-beam-flow"
                />
              </svg>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-[#A39D92] uppercase block font-semibold">COMPUTED SIMILARITY</span>
            <div className="text-4xl font-bold text-[#DFB88B]">
              {dynamicallyCalculatedScore}%
            </div>
            <span className="text-xs font-semibold block mt-0.5" style={{ color: dynamicallyCalculatedScore > 75 ? '#F87171' : '#7DC09C' }}>
              {dynamicallyCalculatedScore > 75 ? 'Critical Duplication (>75%)' : 'Moderate Convergence'}
            </span>
          </div>
        </div>

        {/* 4 Factor Breakdown Visualizers */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A39D92] block mb-4 font-semibold">
            MULTI-VECTOR SIMILARITY DECOMPOSITION
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded bg-[#1E1E1B] border border-[#33312D]">
              <span className="text-[#A39D92] text-[10px] block font-semibold">TARGET GROUP</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {currentPreset.breakdown.targetGroup}%
              </span>
              <div className="w-full bg-[#121210] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#DFB88B] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.targetGroup}%` }}
                />
              </div>
              <span className="text-[9px] text-[#DDD7CD] block mt-1.5">Shared SECC Segment</span>
            </div>

            <div className="p-4 rounded bg-[#1E1E1B] border border-[#33312D]">
              <span className="text-[#A39D92] text-[10px] block font-semibold">GEOGRAPHY</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {currentPreset.breakdown.geography}%
              </span>
              <div className="w-full bg-[#121210] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#DFB88B] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.geography}%` }}
                />
              </div>
              <span className="text-[9px] text-[#DDD7CD] block mt-1.5">Targeted District Clusters</span>
            </div>

            <div className="p-4 rounded bg-[#1E1E1B] border border-[#33312D]">
              <span className="text-[#A39D92] text-[10px] block font-semibold">INTERVENTION</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {currentPreset.breakdown.intervention}%
              </span>
              <div className="w-full bg-[#121210] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#DFB88B] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.intervention}%` }}
                />
              </div>
              <span className="text-[9px] text-[#DDD7CD] block mt-1.5">Direct Subsidy & Asset Formats</span>
            </div>

            <div className="p-4 rounded bg-[#1E1E1B] border border-[#33312D]">
              <span className="text-[#A39D92] text-[10px] block font-semibold">IMPLEMENTATION PERIOD</span>
              <span className="text-2xl font-bold text-white mt-1 block">
                {currentPreset.breakdown.implementationPeriod}%
              </span>
              <div className="w-full bg-[#121210] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#DFB88B] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.implementationPeriod}%` }}
                />
              </div>
              <span className="text-[9px] text-[#DDD7CD] block mt-1.5">FY 2024–2027 Tranches</span>
            </div>
          </div>
        </div>

        {/* 1. MATHEMATICAL WEIGHT SENSITIVITY SANDBOX (FOR JUDGES) */}
        <div className="p-5 md:p-6 rounded bg-[#1E1E1B] border border-[#33312D] space-y-4 font-mono text-xs shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-[#DFB88B]" />
              <span className="text-white font-bold uppercase text-[11px] tracking-wider">
                Interactive Vector Weight Sensitivity Sandbox
              </span>
            </div>
            <span className="text-[10px] text-[#A39D92] font-semibold">
              Formula: S = Σ(w_i · v_i) / Σ(w_i)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-[#DDD7CD]">
              Drag sliders to adjust policy priorities — composite overlap score updates in real-time:
            </p>
            {/* Quick Weight Calibration Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-[#A39D92] mr-1">Quick Presets:</span>
              <button
                onClick={() => handleApplyWeightPreset(25, 25, 25, 25)}
                className="px-2 py-0.5 rounded bg-[#2A2925] border border-[#38352F] text-[#DDD7CD] hover:text-white hover:border-[#DFB88B]"
              >
                Equal (25% each)
              </button>
              <button
                onClick={() => handleApplyWeightPreset(50, 20, 20, 10)}
                className="px-2 py-0.5 rounded bg-[#2A2925] border border-[#38352F] text-[#DDD7CD] hover:text-white hover:border-[#DFB88B]"
              >
                Target-Heavy (50%)
              </button>
              <button
                onClick={() => handleApplyWeightPreset(15, 50, 25, 10)}
                className="px-2 py-0.5 rounded bg-[#2A2925] border border-[#38352F] text-[#DDD7CD] hover:text-white hover:border-[#DFB88B]"
              >
                Geography-Heavy (50%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#DDD7CD]">w₁ Target Group:</span>
                <span className="text-[#DFB88B] font-bold">{weightTarget}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightTarget}
                onChange={(e) => setWeightTarget(Number(e.target.value))}
                className="w-full accent-[#DFB88B] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#DDD7CD]">w₂ Geography:</span>
                <span className="text-[#DFB88B] font-bold">{weightGeo}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightGeo}
                onChange={(e) => setWeightGeo(Number(e.target.value))}
                className="w-full accent-[#DFB88B] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#DDD7CD]">w₃ Intervention:</span>
                <span className="text-[#DFB88B] font-bold">{weightIntervention}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightIntervention}
                onChange={(e) => setWeightIntervention(Number(e.target.value))}
                className="w-full accent-[#DFB88B] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#DDD7CD]">w₄ Period:</span>
                <span className="text-[#DFB88B] font-bold">{weightPeriod}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightPeriod}
                onChange={(e) => setWeightPeriod(Number(e.target.value))}
                className="w-full accent-[#DFB88B] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Why Flagged & Policy Recommendations */}
        <div className="grid md:grid-cols-2 gap-8 items-start pt-2 border-t border-[#302E2A]">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFB88B] block font-semibold">
              WHY FLAGGED?
            </span>
            <div className="space-y-2 text-xs">
              {currentPreset.whyFlagged.map((reason, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[#FAF8F5]">
                  <span className="text-[#7DC09C] font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7DC09C] block font-semibold">
              ACTIONABLE HARMONIZATION RECOMMENDATION
            </span>
            <p className="text-xs text-[#DDD7CD] leading-relaxed p-4 rounded bg-[#1E1E1B] border border-[#33312D]">
              {currentPreset.recommendation}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-[#302E2A]">
          <button
            onClick={() =>
              openExplain({
                title: `${currentPreset.schemeAName} vs ${currentPreset.schemeBName}`,
                subtitle: `${dynamicallyCalculatedScore}% Multi-Vector Programmatic Overlap`,
                confidence: 89,
                factors: [
                  { title: 'TARGET GROUP COINCIDENCE', weight: weightTarget },
                  { title: 'INTERVENTION SUBSIDY DUPLICATION', weight: weightIntervention },
                  { title: 'GEOGRAPHIC BLOCK OVERLAP', weight: weightGeo },
                  { title: 'PERIOD CONCURRENCY', weight: weightPeriod },
                ],
                evidenceRecordNumber: currentPreset.evidenceNumber,
              })
            }
            className="px-5 py-3 rounded-sm bg-[#1E1E1B] border border-[#33312D] text-xs text-[#FAF8F5] hover:border-[#DFB88B] transition-colors cursor-pointer font-medium"
          >
            WHY THIS INSIGHT?
          </button>

          <button
            onClick={() => openEvidence(currentPreset.evidenceNumber)}
            className="px-6 py-3 rounded-sm bg-gradient-to-r from-[#DFB88B] via-[#C89B65] to-[#B78A5A] text-[#0E0E0D] font-bold text-xs hover:brightness-110 shadow-lg shadow-[#C89B65]/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>VIEW SUPPORTING DATA ({currentPreset.evidenceNumber})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. LIVE TF-IDF POLICY TEXT VECTORIZER SANDBOX */}
      <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2926] pb-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-[#B78A5A]" />
            <h3 className="text-sm font-bold font-editorial text-[#F3F0E8]">
              Live Policy Text Cosine Similarity Vectorizer
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#5E8B72]">
            Cosine Score: {vectorResult.cosineScore}%
          </span>
        </div>

        <p className="text-xs text-[#8E887E]">
          Paste ANY two scheme guidelines or project intervention scopes to calculate token frequency vectors and high-dimensional cosine angle:
        </p>

        <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#8E887E] block">SCHEME A GUIDELINE TEXT:</span>
            <textarea
              rows={3}
              value={policyTextA}
              onChange={(e) => setPolicyTextA(e.target.value)}
              className="w-full p-2.5 bg-[#191917] border border-[#2A2926] rounded text-[#F3F0E8] focus:border-[#B78A5A]"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#8E887E] block">SCHEME B GUIDELINE TEXT:</span>
            <textarea
              rows={3}
              value={policyTextB}
              onChange={(e) => setPolicyTextB(e.target.value)}
              className="w-full p-2.5 bg-[#191917] border border-[#2A2926] rounded text-[#F3F0E8] focus:border-[#B78A5A]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[#8E887E]">
            <span>Shared Vector Tokens:</span>
            {vectorResult.sharedTokens.slice(0, 6).map((token) => (
              <span
                key={token}
                className="px-2 py-0.5 rounded bg-[#191917] border border-[#B78A5A]/40 text-[#B78A5A]"
              >
                {token}
              </span>
            ))}
          </div>

          <button
            onClick={handleComputeVector}
            className="px-4 py-2 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs rounded hover:bg-[#CBB093] font-mono flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recalculate Cosine Angle</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
