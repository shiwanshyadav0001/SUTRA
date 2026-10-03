'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { computeTfIdfCosine } from '@/lib/engines/math-algorithms';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Calculator,
  Code,
  Sparkles,
} from 'lucide-react';

const OVERLAP_PRESETS = [
  {
    id: 'OVL-01',
    label: 'Agriculture: PKVY vs MOVCDNER (81.3% Overlap)',
    shortName: 'PKVY ⇄ MOVCDNER',
    schemeAName: 'PKVY (Paramparagat Krishi Vikas Yojana)',
    schemeBName: 'MOVCDNER (Organic Mission for NER)',
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
      <div className="space-y-1.5 border-b border-[#D8D6CE] pb-6 select-none">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
          <span>MULTI-VECTOR PROGRAMMATIC ALIGNMENT ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
          PROGRAMME OVERLAP & VECTOR MATHEMATICS
        </h1>
        <p className="text-xs text-[#66706A] max-w-2xl leading-relaxed">
          Detecting concurrent central and state schemes with duplicative beneficiary cohorts, geographic targets, or capital interventions using vector cosine similarity.
        </p>

        {/* Interactive Scheme Pair Switcher Tabs */}
        <div className="pt-3 flex flex-wrap gap-2">
          {OVERLAP_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all flex items-center gap-2 border cursor-pointer ${
                activePresetIndex === idx
                  ? 'bg-[#FFFFFF] text-[#18201C] border-[#164A3A] font-bold shadow-xs'
                  : 'bg-[#F4F2EC] text-[#66706A] border-[#D8D6CE] hover:text-[#18201C]'
              }`}
            >
              <span>{preset.shortName}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activePresetIndex === idx ? 'bg-[#E3EDE7] text-[#164A3A]' : 'bg-[#FFFFFF] text-[#66706A]'}`}>
                {OVERLAP_PRESETS[idx].breakdown.targetGroup > 80 ? 'Critical' : 'Moderate'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Overlap Spotlight */}
      <div className="p-6 md:p-8 rounded-lg bg-[#FFFFFF] border border-[#D8D6CE] space-y-6 shadow-xs select-none">
        {/* Top Header & Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE8E1] pb-5">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-0.5 rounded bg-[#F9F4EB] text-[#B58A45] border border-[#B58A45]/30 font-bold">
              CROSS-PROGRAMME OVERLAP ALERT • {currentPreset.id}
            </span>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#18201C] font-editorial">
                {currentPreset.schemeAName}
              </h2>
              <span className="text-lg font-mono text-[#B58A45] hidden md:inline">⇄</span>
              <h2 className="text-lg sm:text-xl font-bold text-[#18201C] font-editorial">
                {currentPreset.schemeBName}
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-[#66706A] uppercase block font-semibold">COMPUTED SIMILARITY</span>
            <div className="text-3xl font-bold text-[#B58A45]">
              {dynamicallyCalculatedScore}%
            </div>
            <span className="text-xs font-bold block mt-0.5" style={{ color: dynamicallyCalculatedScore > 75 ? '#A54848' : '#28704D' }}>
              {dynamicallyCalculatedScore > 75 ? 'Critical Duplication (>75%)' : 'Moderate Convergence'}
            </span>
          </div>
        </div>

        {/* 4 Factor Breakdown Visualizers */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#66706A] block mb-3 font-semibold">
            MULTI-VECTOR SIMILARITY DECOMPOSITION
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              <span className="text-[#66706A] text-[10px] block font-semibold">TARGET GROUP</span>
              <span className="text-xl font-bold text-[#18201C] mt-0.5 block">
                {currentPreset.breakdown.targetGroup}%
              </span>
              <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#164A3A] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.targetGroup}%` }}
                />
              </div>
              <span className="text-[9px] text-[#66706A] block mt-1">Shared SECC Segment</span>
            </div>

            <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              <span className="text-[#66706A] text-[10px] block font-semibold">GEOGRAPHY</span>
              <span className="text-xl font-bold text-[#18201C] mt-0.5 block">
                {currentPreset.breakdown.geography}%
              </span>
              <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#164A3A] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.geography}%` }}
                />
              </div>
              <span className="text-[9px] text-[#66706A] block mt-1">Targeted District Clusters</span>
            </div>

            <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              <span className="text-[#66706A] text-[10px] block font-semibold">INTERVENTION</span>
              <span className="text-xl font-bold text-[#18201C] mt-0.5 block">
                {currentPreset.breakdown.intervention}%
              </span>
              <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#164A3A] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.intervention}%` }}
                />
              </div>
              <span className="text-[9px] text-[#66706A] block mt-1">Direct Subsidy Formats</span>
            </div>

            <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              <span className="text-[#66706A] text-[10px] block font-semibold">PERIOD CONCURRENCY</span>
              <span className="text-xl font-bold text-[#18201C] mt-0.5 block">
                {currentPreset.breakdown.implementationPeriod}%
              </span>
              <div className="w-full bg-[#EAE8E1] h-1.5 rounded mt-2 overflow-hidden">
                <div
                  className="bg-[#164A3A] h-full rounded transition-all duration-300"
                  style={{ width: `${currentPreset.breakdown.implementationPeriod}%` }}
                />
              </div>
              <span className="text-[9px] text-[#66706A] block mt-1">FY 2024–2027 Tranches</span>
            </div>
          </div>
        </div>

        {/* Sensitivity Sandbox */}
        <div className="p-5 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D6CE] pb-2">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-[#164A3A]" />
              <span className="text-[#18201C] font-bold uppercase text-[11px] tracking-wider">
                Vector Weight Sensitivity Sandbox
              </span>
            </div>
            <span className="text-[10px] text-[#66706A] font-semibold">
              Formula: S = Σ(w_i · v_i) / Σ(w_i)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#66706A]">w₁ Target Group:</span>
                <span className="text-[#18201C] font-bold">{weightTarget}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightTarget}
                onChange={(e) => setWeightTarget(Number(e.target.value))}
                className="w-full accent-[#164A3A] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#66706A]">w₂ Geography:</span>
                <span className="text-[#18201C] font-bold">{weightGeo}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightGeo}
                onChange={(e) => setWeightGeo(Number(e.target.value))}
                className="w-full accent-[#164A3A] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#66706A]">w₃ Intervention:</span>
                <span className="text-[#18201C] font-bold">{weightIntervention}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightIntervention}
                onChange={(e) => setWeightIntervention(Number(e.target.value))}
                className="w-full accent-[#164A3A] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#66706A]">w₄ Period:</span>
                <span className="text-[#18201C] font-bold">{weightPeriod}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightPeriod}
                onChange={(e) => setWeightPeriod(Number(e.target.value))}
                className="w-full accent-[#164A3A] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Why Flagged & Policy Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 items-start pt-2 border-t border-[#EAE8E1]">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#B58A45] block font-semibold">
              WHY FLAGGED?
            </span>
            <div className="space-y-1.5 text-xs">
              {currentPreset.whyFlagged.map((reason, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[#18201C]">
                  <span className="text-[#28704D] font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#28704D] block font-semibold">
              ACTIONABLE HARMONIZATION RECOMMENDATION
            </span>
            <p className="text-xs text-[#18201C] leading-relaxed p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE]">
              {currentPreset.recommendation}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-3 border-t border-[#EAE8E1]">
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
            className="px-4 py-2 rounded bg-[#FFFFFF] border border-[#D8D6CE] text-xs font-semibold text-[#18201C] hover:bg-[#F4F2EC] transition-colors"
          >
            WHY THIS INSIGHT?
          </button>

          <button
            onClick={() => openEvidence(currentPreset.evidenceNumber)}
            className="px-4 py-2 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <span>VIEW SUPPORTING DATA ({currentPreset.evidenceNumber})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
