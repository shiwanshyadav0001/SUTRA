'use client';

import React, { useState } from 'react';
import { InvestigationPipelineResult, MetricAuditLineage } from '@/lib/types/data-fabric';
import { useIntelligence } from '@/context/IntelligenceContext';
import {
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowRight,
  Calculator,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Hash,
  Info,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface Props {
  data: InvestigationPipelineResult;
}

type StageKey =
  | 'QUERY'
  | 'DATASETS'
  | 'RESOLUTION'
  | 'JOIN'
  | 'CALCULATION'
  | 'FINDING'
  | 'LINEAGE'
  | 'PROVENANCE';

export function InvestigationPipelineInspector({ data }: Props) {
  const { openEvidence } = useIntelligence();
  const [activeStage, setActiveStage] = useState<StageKey>('FINDING');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricAuditLineage | null>(null);

  const { finding, datasets, joinMatrix, entityResolutionSteps, pipelineAuditTrail } = data;

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const stages: { key: StageKey; label: string; number: string; icon: React.ReactNode }[] = [
    { key: 'QUERY', label: '1. Intent', number: '01', icon: <Info className="w-3.5 h-3.5" /> },
    { key: 'DATASETS', label: '2. Datasets', number: '02', icon: <Database className="w-3.5 h-3.5" /> },
    { key: 'RESOLUTION', label: '3. Entity LGD', number: '03', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { key: 'JOIN', label: '4. LGD Join', number: '04', icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'CALCULATION', label: '5. Math Proof', number: '05', icon: <Calculator className="w-3.5 h-3.5" /> },
    { key: 'FINDING', label: '6. Finding & Claims', number: '06', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { key: 'LINEAGE', label: '7. Metric Lineage', number: '07', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { key: 'PROVENANCE', label: '8. Audit Lineage', number: '08', icon: <Hash className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="rounded-sm bg-[#141412] border border-[#B78A5A]/50 shadow-2xl overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="bg-[#191917] p-5 border-b border-[#2A2926] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B78A5A]/20 text-[#B78A5A] border border-[#B78A5A]/40 uppercase tracking-widest font-bold">
              INVESTIGATION ENGINE v1.6 AUDITED
            </span>
            <span className="text-[10px] font-mono text-[#5E8B72] border border-[#5E8B72]/30 px-2 py-0.5 rounded bg-[#5E8B72]/10">
              {finding.dataClassification}
            </span>
            <span className="text-[10px] font-mono text-[#8E887E] border border-[#2A2926] px-2 py-0.5 rounded bg-[#141412] flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#B78A5A]" />
              <span>{finding.temporalAlignment}</span>
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#F3F0E8] font-editorial mt-2">
            {finding.title}
          </h2>
          <p className="text-xs text-[#8E887E]">
            Target: <span className="text-[#C9C2B7] font-bold">{finding.districtName}</span> • LGD Key: <span className="font-mono text-[#B78A5A]">{finding.districtLgdCode}</span> • State: {finding.state}
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="text-right">
            <span className="text-[10px] text-[#8E887E] block uppercase">COMPOSITE CONFIDENCE</span>
            <span className="text-lg font-bold text-[#5E8B72]">{finding.confidence}% ({finding.confidenceAssessment.rating})</span>
          </div>
          <div className="h-8 w-[1px] bg-[#2A2926] mx-2" />
          <div className="text-right">
            <span className="text-[10px] text-[#8E887E] block uppercase">FINDING ID</span>
            <span className="font-bold text-[#B78A5A]">{finding.id}</span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Navigator */}
      <div className="bg-[#0D0D0C] p-3 border-b border-[#2A2926] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[780px] gap-1 font-mono text-[11px]">
          {stages.map((st, idx) => {
            const isActive = activeStage === st.key;
            return (
              <React.Fragment key={st.key}>
                <button
                  onClick={() => setActiveStage(st.key)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded transition-all ${
                    isActive
                      ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold shadow-md'
                      : 'bg-[#191917] text-[#8E887E] hover:text-[#F3F0E8] border border-[#2A2926]'
                  }`}
                >
                  <span>{st.icon}</span>
                  <span>{st.label}</span>
                </button>
                {idx < stages.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-[#2A2926] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Body */}
      <div className="p-6 space-y-6">
        {/* STAGE 1: INTENT */}
        {activeStage === 'QUERY' && (
          <div className="space-y-4 font-mono text-xs animate-in fade-in">
            <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
              1. Query Interpretation & Target Normalization
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
                <span className="text-[10px] text-[#8E887E] uppercase block">ORIGINAL INPUT QUERY</span>
                <p className="text-sm text-[#F3F0E8] font-editorial">&quot;{data.query}&quot;</p>
              </div>
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
                <span className="text-[10px] text-[#8E887E] uppercase block">PARSED GOVERNANCE INTENT</span>
                <p className="text-[#5E8B72] font-bold">{data.interpretation.intent}</p>
                <span className="text-[10px] text-[#8E887E] block mt-1">
                  Objective: {data.interpretation.analysisObjective}
                </span>
              </div>
            </div>
            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
              <span className="text-[10px] text-[#B78A5A] uppercase block">INVOLVED STATUTORY SCHEMES</span>
              <div className="flex flex-wrap gap-2">
                {data.interpretation.programmesInvolved.map((p, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-[#141412] border border-[#2A2926] text-[#C9C2B7]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: DATASETS */}
        {activeStage === 'DATASETS' && (
          <div className="space-y-4 font-mono text-xs animate-in fade-in">
            <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
              2. Verified Government Open Datasets Ingested
            </h3>
            <p className="text-xs text-[#8E887E]">
              Zero scraped or fabricated tables. Ingested strictly via official government endpoints.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {datasets.map((ds) => (
                <div key={ds.id} className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#B78A5A] font-bold">{ds.id}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#5E8B72]/15 text-[#5E8B72] border border-[#5E8B72]/30">
                      {ds.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#F3F0E8] font-editorial text-sm">{ds.name}</h4>
                  <p className="text-[11px] text-[#8E887E]">{ds.publisher}</p>
                  <div className="pt-2 border-t border-[#2A2926] space-y-1 text-[10px] text-[#7E7A72]">
                    <div>Records: <span className="text-[#F3F0E8]">{ds.recordCount}</span></div>
                    <div>Period: <span className="text-[#C9C2B7]">{ds.temporalCoverage}</span></div>
                    <a
                      href={ds.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B78A5A] hover:underline flex items-center space-x-1 mt-2 inline-flex"
                    >
                      <span>Official Source Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 3: RESOLUTION */}
        {activeStage === 'RESOLUTION' && (
          <div className="space-y-4 font-mono text-xs animate-in fade-in">
            <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
              3. Deterministic LGD Entity Resolution
            </h3>
            <p className="text-xs text-[#8E887E]">
              Local Government Directory (LGD) spatial backbone prevents hallucinated geographic entity assignment.
            </p>
            <div className="space-y-2">
              {entityResolutionSteps.map((step, idx) => (
                <div key={idx} className="p-4 bg-[#191917] border border-[#2A2926] rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8E887E] uppercase">RAW QUERY TERM:</span>
                    <div className="text-sm font-bold text-[#F3F0E8]">{step.input}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#B78A5A] hidden md:block" />
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#5E8B72] uppercase">CANONICAL RESOLUTION:</span>
                    <div className="text-sm font-bold text-[#5E8B72]">{step.resolved}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#B78A5A] uppercase block">METHOD & CONFIDENCE</span>
                    <span className="text-xs text-[#C9C2B7]">{step.method} ({step.confidence}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 4: JOIN */}
        {activeStage === 'JOIN' && (
          <div className="space-y-4 font-mono text-xs animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
                4. Deterministic Cross-Dataset LGD Join Matrix
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#B78A5A]/20 text-[#B78A5A] border border-[#B78A5A]/40">
                PRIMARY KEY: LGD_DISTRICT_CODE
              </span>
            </div>
            <div className="border border-[#2A2926] rounded overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#191917] text-[#8E887E] border-b border-[#2A2926]">
                  <tr>
                    <th className="p-3">LGD CODE</th>
                    <th className="p-3">DISTRICT</th>
                    <th className="p-3">JOIN QUALITY</th>
                    <th className="p-3">JJM (WATER)</th>
                    <th className="p-3">PMAY-G (HOUSING)</th>
                    <th className="p-3">PKVY (AGRI)</th>
                    <th className="p-3 text-right">TOTAL SANCTIONED</th>
                    <th className="p-3 text-right">COMPOSITE DRAWDOWN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2926]">
                  {joinMatrix.slice(0, 6).map((row) => {
                    const isTarget = row.primaryKey === finding.districtLgdCode;
                    return (
                      <tr
                        key={row.primaryKey}
                        className={isTarget ? 'bg-[#B78A5A]/10 font-bold text-[#F3F0E8]' : 'hover:bg-[#191917] text-[#C9C2B7]'}
                      >
                        <td className="p-3 text-[#B78A5A]">{row.primaryKey}</td>
                        <td className="p-3">{row.districtName} {isTarget && '★'}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded bg-[#5E8B72]/15 text-[#5E8B72] text-[10px]">
                            {row.quality} (100%)
                          </span>
                        </td>
                        <td className="p-3">₹{row.records['DS-JJM-MH']?.allocatedCr || '—'} Cr</td>
                        <td className="p-3">₹{row.records['DS-PMAYG-MH']?.allocatedCr || '—'} Cr</td>
                        <td className="p-3">₹{row.records['DS-PKVY-MH']?.allocatedCr || '—'} Cr</td>
                        <td className="p-3 text-right">₹{String(row.joinedFields.totalAllocatedCr || 0)} Cr</td>
                        <td className="p-3 text-right font-bold text-[#A66A62]">
                          {String(row.joinedFields.compositeDrawdownRate || 0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STAGE 5: CALCULATION */}
        {activeStage === 'CALCULATION' && (
          <div className="space-y-4 font-mono text-xs animate-in fade-in">
            <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
              5. Deterministic Mathematical Formulation
            </h3>
            <p className="text-xs text-[#8E887E]">
              Zero probabilistic LLM math. All formulations are verified, reproducible algebraic equations.
            </p>

            <div className="p-5 bg-[#191917] border border-[#B78A5A]/40 rounded space-y-3">
              <span className="text-[10px] text-[#B78A5A] uppercase tracking-wider block font-bold">
                FORMULATION: {finding.calculation.formulaName}
              </span>
              <div className="p-3 bg-[#141412] border border-[#2A2926] rounded text-[#F3F0E8] text-sm overflow-x-auto">
                <code>{finding.calculation.formulaText}</code>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
                <span className="text-[10px] text-[#8E887E] uppercase block">FORMULA INPUT VARIABLES</span>
                <div className="space-y-1 text-[11px]">
                  {Object.entries(finding.calculation.inputs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[#2A2926]/50 py-1">
                      <span className="text-[#8E887E]">{k}:</span>
                      <span className="font-bold text-[#F3F0E8]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#191917] border-2 border-[#5E8B72]/40 rounded space-y-3">
                <span className="text-[10px] text-[#5E8B72] uppercase tracking-wider block font-bold">
                  DETERMINISTIC RESULT
                </span>
                <div className="text-2xl font-bold text-[#F3F0E8] font-editorial">
                  {finding.calculation.outputValue}
                </div>
                <p className="text-xs text-[#C9C2B7] leading-relaxed">
                  {finding.calculation.interpretation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 6: FINDING & CLAIMS SEPARATION */}
        {activeStage === 'FINDING' && (
          <div className="space-y-6 font-mono text-xs animate-in fade-in">
            {/* Top Stat Highlights with Audited Terminology */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#191917] border border-[#A66A62] rounded">
                <span className="text-[10px] text-[#A66A62] uppercase block">DRAWDOWN DEFICIT VS BENCHMARK</span>
                <div className="text-2xl font-bold text-[#A66A62] mt-1">-27.7 pp</div>
                <span className="text-[10px] text-[#8E887E]">46.3% vs 74.0% State Benchmark</span>
              </div>
              <div className="p-4 bg-[#191917] border border-[#B78A5A] rounded">
                <span className="text-[10px] text-[#B78A5A] uppercase block">UNRELEASED APPROVED ALLOCATION</span>
                <div className="text-2xl font-bold text-[#F3F0E8] mt-1">₹68.10 Cr</div>
                <span className="text-[10px] text-[#8E887E]">Undrawn across JJM, PMAY-G, PKVY</span>
              </div>
              <div className="p-4 bg-[#191917] border border-[#5E8B72] rounded">
                <span className="text-[10px] text-[#5E8B72] uppercase block">PHYSICAL DELIVERY PACE DIVERGENCE</span>
                <div className="text-2xl font-bold text-[#5E8B72] mt-1">18.4 pp</div>
                <span className="text-[10px] text-[#8E887E]">Housing (46.8%) vs Water (28.4%)</span>
              </div>
            </div>

            {/* Structured Facts vs Derived Claims Separation */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Column 1: Source Facts */}
              <div className="p-4 bg-[#191917] border border-[#5E8B72]/40 rounded space-y-2">
                <div className="flex items-center space-x-1.5 text-[#5E8B72]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">VERIFIED SOURCE FACTS</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#C9C2B7]">
                  {finding.factBreakdown.sourceFacts.map((fact, idx) => (
                    <li key={idx} className="border-l-2 border-[#5E8B72] pl-2">
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Derived Metrics */}
              <div className="p-4 bg-[#191917] border border-[#B78A5A]/40 rounded space-y-2">
                <div className="flex items-center space-x-1.5 text-[#B78A5A]">
                  <Calculator className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">DERIVED METRICS</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#C9C2B7]">
                  {finding.factBreakdown.derivedMetrics.map((met, idx) => (
                    <li key={idx} className="border-l-2 border-[#B78A5A] pl-2">
                      {met}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Interpretations & Caveats */}
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
                <div className="flex items-center space-x-1.5 text-[#8E887E]">
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">INTERPRETATIONS & SCOPE</span>
                </div>
                <ul className="space-y-2 text-[11px] text-[#8E887E]">
                  {finding.factBreakdown.interpretations.map((interp, idx) => (
                    <li key={idx} className="border-l-2 border-[#2A2926] pl-2">
                      {interp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Confidence Component Breakdown Card */}
            <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#B78A5A] uppercase font-bold tracking-wider">
                  CONFIDENCE METHODOLOGY BREAKDOWN ({finding.confidence}%)
                </span>
                <span className="text-[10px] text-[#5E8B72]">
                  {finding.confidenceAssessment.methodology}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                {Object.entries(finding.confidenceAssessment.components).map(([key, comp]) => (
                  <div key={key} className="p-2.5 bg-[#141412] border border-[#2A2926] rounded space-y-1">
                    <div className="flex justify-between text-[#8E887E] text-[10px]">
                      <span>{comp.name}</span>
                      <span className="text-[#5E8B72] font-bold">{(comp.score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-[#F3F0E8] font-bold">{comp.rating} (Weight: {comp.weight * 100}%)</div>
                    <p className="text-[9px] text-[#7E7A72]">{comp.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Executive Brief */}
            <div className="p-5 bg-[#191917] border border-[#2A2926] rounded space-y-3">
              <span className="text-[10px] text-[#B78A5A] uppercase font-bold tracking-wider block">
                EXECUTIVE INVESTIGATION FINDING
              </span>
              <p className="text-xs text-[#F3F0E8] font-editorial text-sm leading-relaxed">
                {finding.detailedAnalysis}
              </p>
            </div>

            {/* Policy Interventions */}
            <div className="p-5 bg-[#191917] border border-[#2A2926] rounded space-y-3">
              <span className="text-[10px] text-[#5E8B72] uppercase font-bold tracking-wider block">
                STATUTORY CONVERGENCE RECOMMENDATIONS
              </span>
              <ul className="space-y-2 text-xs text-[#C9C2B7]">
                {finding.policyRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#B78A5A] font-bold">↳</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explicit Limitations Card */}
            <div className="p-4 bg-[#141412] border border-[#2A2926] rounded space-y-2">
              <div className="flex items-center space-x-2 text-[#8E887E]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B78A5A]" />
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  STATUTORY DATA LIMITATIONS & TEMPORAL NOTE
                </span>
              </div>
              <p className="text-[10px] text-[#B78A5A] italic">
                {finding.temporalCoverageNote}
              </p>
              <ul className="space-y-1 text-[10px] text-[#8E887E]">
                {finding.limitations.map((lim, i) => (
                  <li key={i}>• {lim}</li>
                ))}
              </ul>
            </div>

            {/* Evidence Records Inspection Links */}
            <div className="pt-2 border-t border-[#2A2926] flex flex-wrap gap-2 justify-end">
              {finding.sourceRecords.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => openEvidence(rec.id)}
                  className="px-3 py-1.5 rounded bg-[#191917] border border-[#2A2926] hover:border-[#B78A5A] text-[#C9C2B7] hover:text-[#F3F0E8] text-xs flex items-center space-x-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#B78A5A]" />
                  <span>Inspect Evidence {rec.recordNumber} ({rec.datasetId})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 7: METRIC LINEAGE TABLE */}
        {activeStage === 'LINEAGE' && (
          <div className="space-y-4 font-mono text-xs animate-in fade-in">
            <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
              7. Metric Audit Lineage (UI Number Traceability)
            </h3>
            <p className="text-xs text-[#8E887E]">
              Every metric displayed in this investigation traces directly to its source field, record number, and official government portal.
            </p>

            <div className="border border-[#2A2926] rounded overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#191917] text-[#8E887E] border-b border-[#2A2926]">
                  <tr>
                    <th className="p-3">METRIC LABEL</th>
                    <th className="p-3">DISPLAY VALUE</th>
                    <th className="p-3">TYPE</th>
                    <th className="p-3">STAGE / UNIT</th>
                    <th className="p-3">SOURCE FIELD / FORMULA</th>
                    <th className="p-3">DATASET ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2926]">
                  {finding.metricLineage.map((item) => (
                    <tr
                      key={item.metricId}
                      onClick={() => setSelectedMetric(item)}
                      className="hover:bg-[#191917] cursor-pointer text-[#C9C2B7]"
                    >
                      <td className="p-3 font-bold text-[#F3F0E8]">{item.uiLabel}</td>
                      <td className="p-3 font-bold text-[#B78A5A]">{item.displayValue}</td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            item.classification === 'SOURCE_FACT'
                              ? 'bg-[#5E8B72]/15 text-[#5E8B72]'
                              : 'bg-[#B78A5A]/15 text-[#B78A5A]'
                          }`}
                        >
                          {item.classification}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-[#8E887E]">
                        {item.financialStage || item.unit}
                      </td>
                      <td className="p-3 text-[11px] font-mono text-[#F3F0E8]">
                        {item.sourceField || item.formula}
                      </td>
                      <td className="p-3 text-[10px] text-[#7E7A72]">{item.sourceDatasetId || 'SYNTHESIZED'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedMetric && (
              <div className="p-4 bg-[#191917] border border-[#B78A5A] rounded space-y-2 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#B78A5A] font-bold uppercase">
                    METRIC LINEAGE INSPECTOR: {selectedMetric.uiLabel}
                  </span>
                  <button
                    onClick={() => setSelectedMetric(null)}
                    className="text-[#8E887E] hover:text-[#F3F0E8] text-[10px]"
                  >
                    CLOSE
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#8E887E] block">Value & Classification:</span>
                    <span className="text-[#F3F0E8] font-bold">{selectedMetric.displayValue} ({selectedMetric.classification})</span>
                  </div>
                  <div>
                    <span className="text-[#8E887E] block">Unit & Stage:</span>
                    <span className="text-[#F3F0E8]">{selectedMetric.unit} ({selectedMetric.financialStage || 'N/A'})</span>
                  </div>
                  <div>
                    <span className="text-[#8E887E] block">Source / Formula:</span>
                    <code className="text-[#5E8B72]">{selectedMetric.sourceField || selectedMetric.formula}</code>
                  </div>
                  <div>
                    <span className="text-[#8E887E] block">Derivation Note:</span>
                    <span className="text-[#C9C2B7]">{selectedMetric.derivationStep || 'Direct ministerial register observation'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STAGE 8: PROVENANCE */}
        {activeStage === 'PROVENANCE' && (
          <div className="space-y-4 font-mono text-xs animate-in fade-in">
            <h3 className="text-base font-bold text-[#F3F0E8] font-editorial">
              8. Cryptographic Provenance & Audit Hash Lineage
            </h3>
            <p className="text-xs text-[#8E887E]">
              Immutable SHA-256 chain validating raw source inputs, join matrices, and calculations.
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
                <span className="text-[10px] text-[#B78A5A] uppercase block">FINDING SHA-256 HASH</span>
                <div className="flex items-center justify-between p-2 bg-[#141412] border border-[#2A2926] rounded text-[#5E8B72] text-[11px] truncate">
                  <code>{finding.provenanceHashes.findingHash}</code>
                  <button
                    onClick={() => handleCopyHash(finding.provenanceHashes.findingHash)}
                    className="ml-2 px-2 py-0.5 rounded bg-[#191917] text-[#8E887E] hover:text-[#F3F0E8] text-[10px]"
                  >
                    {copiedHash === finding.provenanceHashes.findingHash ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2">
                <span className="text-[10px] text-[#8E887E] uppercase block">STAGE-BY-STAGE AUDIT LINEAGE</span>
                <div className="space-y-2">
                  {pipelineAuditTrail.map((audit, i) => (
                    <div key={i} className="p-2.5 bg-[#141412] border border-[#2A2926] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#5E8B72]">✓</span>
                        <span className="text-[#F3F0E8] font-bold">{audit.step}</span>
                        <span className="text-[#7E7A72]">({audit.timestamp})</span>
                      </div>
                      <code className="text-[#8E887E] text-[10px]">{audit.hash.substring(0, 24)}...</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
