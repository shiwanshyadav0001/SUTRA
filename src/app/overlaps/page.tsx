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

export default function OverlapsPage() {
  const { openEvidence, openExplain } = useIntelligence();
  const [selectedOverlap, setSelectedOverlap] = useState<OverlapInsight>(OVERLAPS_DATA[0]);

  // Mathematical Weight Sandbox State
  const [weightTarget, setWeightTarget] = useState(35);
  const [weightGeo, setWeightGeo] = useState(25);
  const [weightIntervention, setWeightIntervention] = useState(25);
  const [weightPeriod, setWeightPeriod] = useState(15);

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
  const [policyTextA, setPolicyTextA] = useState(
    'Subsidies for smallholder organic cluster certification, biological pest control, vermicompost soil inputs, and local farmer producer organizations.'
  );
  const [policyTextB, setPolicyTextB] = useState(
    'Direct financial assistance for certified organic production hubs, biological farm inputs, eco-packaging facilities, and tribal FPO aggregation.'
  );

  const [vectorResult, setVectorResult] = useState(() =>
    computeTfIdfCosine(policyTextA, policyTextB)
  );

  const handleComputeVector = () => {
    const res = computeTfIdfCosine(policyTextA, policyTextB);
    setVectorResult(res);
  };

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-2 border-b border-[#2A2926] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
          <span>MULTI-VECTOR PROGRAMMATIC ALIGNMENT ENGINE</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
          PROGRAMME OVERLAP & VECTOR MATHEMATICS
        </h1>
        <p className="text-xs text-[#8E887E] max-w-2xl">
          Multi-vector programmatic alignment engine detecting concurrent schemes with duplicative beneficiary segments, geographic targets, or capital interventions using vector cosine similarity.
        </p>
      </div>

      {/* Main Overlap Spotlight: Scheme A vs Scheme B */}
      <div className="p-8 rounded-sm bg-[#141412] border-2 border-[#B78A5A]/50 space-y-8 shadow-2xl">
        {/* Top Header & Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2926] pb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-[#B78A5A]/15 text-[#B78A5A] border border-[#B78A5A]/30">
              CROSS-PROGRAMME OVERLAP ALERT
            </span>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F3F0E8] font-editorial">
                {selectedOverlap.schemeAName}
              </h2>
              <span className="text-xl font-mono text-[#B78A5A] hidden md:inline">⇄</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F3F0E8] font-editorial">
                {selectedOverlap.schemeBName}
              </h2>
            </div>

            {/* Animated Bidirectional Energy Alignment Conduit */}
            <div className="pt-3 hidden sm:block max-w-lg">
              <div className="flex items-center space-x-2 text-[9px] font-mono text-[#8E887E] mb-1">
                <span>CONCURRENT PROGRAMME CONDUIT</span>
                <span className="text-[#B78A5A]">• {dynamicallyCalculatedScore}% RECALCULATED FLUX</span>
              </div>
              <svg className="w-full h-2">
                <line x1="0" y1="4" x2="100%" y2="4" stroke="#2A2926" strokeWidth="1.5" />
                <line
                  x1="0"
                  y1="4"
                  x2="100%"
                  y2="4"
                  stroke="#B78A5A"
                  strokeWidth="1.5"
                  className="animate-beam-flow"
                />
              </svg>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-[#8E887E] uppercase block">COMPUTED SIMILARITY</span>
            <div className="text-4xl font-bold text-[#B78A5A]">
              {dynamicallyCalculatedScore}%
            </div>
            <span className="text-[10px] text-[#5E8B72] block">
              {dynamicallyCalculatedScore > 75 ? 'Critical Duplication' : 'Moderate Convergence'}
            </span>
          </div>
        </div>

        {/* 4 Factor Breakdown Visualizers */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E887E] block mb-4">
            MULTI-VECTOR SIMILARITY DECOMPOSITION
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
              <span className="text-[#8E887E] text-[10px] block">TARGET GROUP</span>
              <span className="text-2xl font-bold text-[#F3F0E8] mt-1 block">
                {selectedOverlap.breakdown.targetGroup}%
              </span>
              <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
                <div
                  className="bg-[#B78A5A] h-full rounded"
                  style={{ width: `${selectedOverlap.breakdown.targetGroup}%` }}
                />
              </div>
              <span className="text-[9px] text-[#7E7A72] block mt-1.5">Shared SECC Segment</span>
            </div>

            <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
              <span className="text-[#8E887E] text-[10px] block">GEOGRAPHY</span>
              <span className="text-2xl font-bold text-[#F3F0E8] mt-1 block">
                {selectedOverlap.breakdown.geography}%
              </span>
              <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
                <div
                  className="bg-[#B78A5A] h-full rounded"
                  style={{ width: `${selectedOverlap.breakdown.geography}%` }}
                />
              </div>
              <span className="text-[9px] text-[#7E7A72] block mt-1.5">Nandurbar & Dhule</span>
            </div>

            <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
              <span className="text-[#8E887E] text-[10px] block">INTERVENTION</span>
              <span className="text-2xl font-bold text-[#F3F0E8] mt-1 block">
                {selectedOverlap.breakdown.intervention}%
              </span>
              <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
                <div
                  className="bg-[#B78A5A] h-full rounded"
                  style={{ width: `${selectedOverlap.breakdown.intervention}%` }}
                />
              </div>
              <span className="text-[9px] text-[#7E7A72] block mt-1.5">Bio-input & Certification</span>
            </div>

            <div className="p-4 rounded bg-[#191917] border border-[#2A2926]">
              <span className="text-[#8E887E] text-[10px] block">IMPLEMENTATION PERIOD</span>
              <span className="text-2xl font-bold text-[#F3F0E8] mt-1 block">
                {selectedOverlap.breakdown.implementationPeriod}%
              </span>
              <div className="w-full bg-[#2A2926] h-1.5 rounded mt-2">
                <div
                  className="bg-[#B78A5A] h-full rounded"
                  style={{ width: `${selectedOverlap.breakdown.implementationPeriod}%` }}
                />
              </div>
              <span className="text-[9px] text-[#7E7A72] block mt-1.5">FY 2024–2027</span>
            </div>
          </div>
        </div>

        {/* 1. MATHEMATICAL WEIGHT SENSITIVITY SANDBOX (FOR JUDGES) */}
        <div className="p-5 rounded bg-[#191917] border border-[#2A2926] space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-[#B78A5A]" />
              <span className="text-[#F3F0E8] font-bold uppercase text-[11px]">
                Interactive Vector Weight Sensitivity Sandbox
              </span>
            </div>
            <span className="text-[10px] text-[#8E887E]">
              Formula: S = Σ(w_i · v_i) / Σ(w_i)
            </span>
          </div>

          <p className="text-[11px] text-[#8E887E]">
            Drag any weight slider below to see how adjusting ministry policy priorities recalculates the composite overlap score in real-time:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#C9C2B7]">w₁ Target Group:</span>
                <span className="text-[#B78A5A] font-bold">{weightTarget}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightTarget}
                onChange={(e) => setWeightTarget(Number(e.target.value))}
                className="w-full accent-[#B78A5A]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#C9C2B7]">w₂ Geography:</span>
                <span className="text-[#B78A5A] font-bold">{weightGeo}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightGeo}
                onChange={(e) => setWeightGeo(Number(e.target.value))}
                className="w-full accent-[#B78A5A]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#C9C2B7]">w₃ Intervention:</span>
                <span className="text-[#B78A5A] font-bold">{weightIntervention}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightIntervention}
                onChange={(e) => setWeightIntervention(Number(e.target.value))}
                className="w-full accent-[#B78A5A]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#C9C2B7]">w₄ Period:</span>
                <span className="text-[#B78A5A] font-bold">{weightPeriod}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weightPeriod}
                onChange={(e) => setWeightPeriod(Number(e.target.value))}
                className="w-full accent-[#B78A5A]"
              />
            </div>
          </div>
        </div>

        {/* Why Flagged & Policy Recommendations */}
        <div className="grid md:grid-cols-2 gap-8 items-start pt-2 border-t border-[#2A2926]">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B78A5A] block">
              WHY FLAGGED?
            </span>
            <div className="space-y-2 text-xs">
              {selectedOverlap.whyFlagged.map((reason, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-[#F3F0E8]">
                  <span className="text-[#5E8B72] font-bold">✓</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5E8B72] block">
              ACTIONABLE HARMONIZATION RECOMMENDATION
            </span>
            <p className="text-xs text-[#C9C2B7] leading-relaxed p-3.5 rounded bg-[#191917] border border-[#2A2926]">
              {selectedOverlap.recommendation}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-[#2A2926]">
          <button
            onClick={() =>
              openExplain({
                title: 'PKVY & MOVCDNER Cross-Programme Overlap',
                subtitle: `${dynamicallyCalculatedScore}% Multi-Vector Programmatic Overlap`,
                confidence: 89,
                factors: [
                  { title: 'TARGET GROUP COINCIDENCE', weight: weightTarget },
                  { title: 'INTERVENTION SUBSIDY DUPLICATION', weight: weightIntervention },
                  { title: 'GEOGRAPHIC BLOCK OVERLAP', weight: weightGeo },
                  { title: 'PERIOD CONCURRENCY', weight: weightPeriod },
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
            <span>VIEW SUPPORTING DATA (#9281)</span>
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
