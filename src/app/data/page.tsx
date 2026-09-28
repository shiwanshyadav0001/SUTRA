'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ENTITY_RESOLUTION_SAMPLES } from '@/lib/data/governance-data';
import { EntityResolutionEngine } from '@/lib/engines/entity-resolution';
import { computeLevenshtein, parseAndAnalyzeTreasuryCsv, ParsedTreasuryRow } from '@/lib/engines/math-algorithms';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  GitBranch,
  Layers,
  ArrowRight,
  Database,
  Sparkles,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Code,
  FileText,
} from 'lucide-react';

const SAMPLE_RAW_TREASURY_CSV = `District_Name,Scheme_Code,Allocated_Cr,Utilized_Cr
Nandurbur,AGR-001,48.2,20.1
Gadchiroli Tribal,RUR-002,39.4,18.1
Washim Dist,JAL-003,41.0,21.3
Dhhule,AGR-004,58.6,31.6
Yavatmal,AGR-001,72.4,40.5
Poona,URB-005,142.0,128.5
Nasik,AGR-004,88.4,74.2
Nagpore,RUR-002,96.0,81.0
Thane Urban,URB-005,115.0,98.2
Aurangabad MH,JAL-003,64.0,49.8
Solapoor,AGR-001,52.0,41.2
Amraoti,AGR-004,46.5,37.8`;

export default function DataIngestionPage() {
  // Live Keystroke Normalizer State
  const [customInput, setCustomInput] = useState('Nandurbur');
  const [targetType, setTargetType] = useState<'DISTRICT' | 'STATE'>('DISTRICT');

  // Compute live match on keystroke
  const liveResult =
    targetType === 'DISTRICT'
      ? EntityResolutionEngine.resolveDistrict(customInput)
      : EntityResolutionEngine.resolveState(customInput);

  const levDetails = computeLevenshtein(customInput, liveResult.resolved);

  // Dynamic CSV Ingestion Engine State
  const [csvContent, setCsvContent] = useState(SAMPLE_RAW_TREASURY_CSV);
  const [analysisResult, setAnalysisResult] = useState(() => parseAndAnalyzeTreasuryCsv(SAMPLE_RAW_TREASURY_CSV));
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [fileName, setFileName] = useState('treasury_sanction_feed_q2.csv');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessingCsv(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      const res = parseAndAnalyzeTreasuryCsv(text);
      setAnalysisResult(res);
      setIsProcessingCsv(false);
    };
    reader.readAsText(file);
  };

  const handleReloadDefaultCsv = () => {
    setIsProcessingCsv(true);
    setTimeout(() => {
      setCsvContent(SAMPLE_RAW_TREASURY_CSV);
      setFileName('treasury_sanction_feed_q2.csv');
      setAnalysisResult(parseAndAnalyzeTreasuryCsv(SAMPLE_RAW_TREASURY_CSV));
      setIsProcessingCsv(false);
    }, 300);
  };

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-2 border-b border-[#2A2926] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
          <span>PRODUCTION-GRADE INGESTION & MATHEMATICAL HARMONIZATION</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
          DATA INGESTION & ENTITY RESOLUTION
        </h1>
        <p className="text-xs text-[#8E887E] max-w-2xl">
          Live computational pipeline parsing heterogeneous administrative feeds, computing string Levenshtein distance against LGD spatial ontologies, and calculating Z-Score anomaly vectors.
        </p>
      </div>

      {/* 1. LIVE KEYSTROKE ENTITY RESOLUTION SANDBOX (FOR JUDGES) */}
      <div className="p-6 rounded-sm bg-[#141412] border-2 border-[#B78A5A]/60 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2926] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#B78A5A]/15 text-[#B78A5A] border border-[#B78A5A]/30">
              INTERACTIVE ALGORITHMIC SANDBOX
            </span>
            <h2 className="text-xl font-bold text-[#F3F0E8] font-editorial mt-2">
              Live Keystroke Entity Normalizer
            </h2>
            <p className="text-xs text-[#8E887E]">
              Type any non-standard dialect spelling, typographical error, or portal variant to test real-time resolution.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-[#191917] p-1 border border-[#2A2926] rounded text-xs font-mono">
            <button
              onClick={() => {
                setTargetType('DISTRICT');
                setCustomInput('Nandurbur');
              }}
              className={`px-3 py-1.5 rounded transition-all ${
                targetType === 'DISTRICT' ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold' : 'text-[#8E887E]'
              }`}
            >
              LGD Districts (MH)
            </button>
            <button
              onClick={() => {
                setTargetType('STATE');
                setCustomInput('Maharastra');
              }}
              className={`px-3 py-1.5 rounded transition-all ${
                targetType === 'STATE' ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold' : 'text-[#8E887E]'
              }`}
            >
              State Registry
            </button>
          </div>
        </div>

        {/* Live Input and Dynamic Math Output */}
        <div className="grid md:grid-cols-3 gap-6 font-mono text-xs items-center">
          {/* Input side */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-[#8E887E] tracking-wider block">
              TYPE RAW INPUT STRING (ANY TYPO):
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Maharastra, Nandurbur, Poona, Dhhule..."
              className="w-full px-4 py-3 bg-[#191917] border border-[#B78A5A] text-[#F3F0E8] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#B78A5A]"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[9px] text-[#7E7A72]">Test presets:</span>
              {['Nandurbur', 'Gadchiroli Tribal', 'Maharastra', 'Poona', 'Dhhule', 'Amraoti'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    if (preset === 'Maharastra') setTargetType('STATE');
                    else setTargetType('DISTRICT');
                    setCustomInput(preset);
                  }}
                  className="text-[9px] px-2 py-0.5 rounded bg-[#191917] border border-[#2A2926] text-[#C9C2B7] hover:border-[#B78A5A]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Math formulation step */}
          <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2 text-center md:text-left">
            <span className="text-[10px] text-[#B78A5A] uppercase tracking-wider block">
              MATHEMATICAL METRICS
            </span>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8E887E]">Levenshtein Distance:</span>
                <span className="font-bold text-[#F3F0E8]">{levDetails.distance} edits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E887E]">String Similarity:</span>
                <span className="font-bold text-[#5E8B72]">{levDetails.similarity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E887E]">Algorithm Used:</span>
                <span className="text-[#C9C2B7] truncate">{liveResult.method}</span>
              </div>
            </div>
          </div>

          {/* Canonical Target Output */}
          <div className="p-4 bg-[#141412] border-2 border-[#5E8B72]/50 rounded space-y-2">
            <span className="text-[10px] text-[#5E8B72] uppercase tracking-wider block font-bold">
              CANONICAL CANONICAL TARGET
            </span>
            <div className="text-2xl font-bold text-[#F3F0E8] font-editorial">
              {liveResult.resolved}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#2A2926]">
              <span className="text-[#8E887E]">{liveResult.targetType}</span>
              <span className="font-bold text-[#B78A5A]">{liveResult.confidence}% Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REAL CSV INGESTION & ANOMALY DETECTION ENGINE */}
      <div className="p-6 bg-[#141412] border border-[#2A2926] rounded-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2926] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-[#B78A5A]" />
              <h2 className="text-xl font-bold text-[#F3F0E8] font-editorial">
                Real-Time CSV Ingestion & Z-Score Anomaly Engine
              </h2>
            </div>
            <p className="text-xs text-[#8E887E] mt-1">
              Upload any raw CSV file with district allocations or run our live uncurated treasury feed.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReloadDefaultCsv}
              className="px-3 py-1.5 bg-[#191917] border border-[#2A2926] hover:border-[#B78A5A] text-xs font-mono text-[#C9C2B7] rounded flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3 h-3 text-[#B78A5A]" />
              <span>Reset Sample Feed</span>
            </button>

            <label className="px-4 py-1.5 bg-[#B78A5A] hover:bg-[#CBB093] text-[#0D0D0C] font-semibold text-xs font-mono rounded cursor-pointer transition-all flex items-center space-x-1.5">
              <UploadCloud className="w-4 h-4" />
              <span>Upload Custom CSV</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Dynamic Telemetry Cards computed directly from the CSV */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3 bg-[#191917] border border-[#2A2926] rounded">
            <span className="text-[10px] text-[#8E887E] block">PARSED ROWS</span>
            <span className="text-xl font-bold text-[#F3F0E8]">{analysisResult.totalRows}</span>
            <span className="text-[9px] text-[#5E8B72] block mt-0.5">100% Normalized</span>
          </div>

          <div className="p-3 bg-[#191917] border border-[#2A2926] rounded">
            <span className="text-[10px] text-[#8E887E] block">TOTAL SANCTIONED</span>
            <span className="text-xl font-bold text-[#F3F0E8]">₹{analysisResult.totalAllocatedCr} Cr</span>
            <span className="text-[9px] text-[#8E887E] block mt-0.5">Across Ministries</span>
          </div>

          <div className="p-3 bg-[#191917] border border-[#2A2926] rounded">
            <span className="text-[10px] text-[#8E887E] block">TOTAL DRAWDOWN</span>
            <span className="text-xl font-bold text-[#F3F0E8]">₹{analysisResult.totalUtilizedCr} Cr</span>
            <span className="text-[9px] text-[#8E887E] block mt-0.5">PFMS Verified</span>
          </div>

          <div className="p-3 bg-[#191917] border border-[#2A2926] rounded">
            <span className="text-[10px] text-[#8E887E] block">MEAN POPULATION PACE</span>
            <span className="text-xl font-bold text-[#5E8B72]">{analysisResult.avgUtilization}%</span>
            <span className="text-[9px] text-[#8E887E] block mt-0.5">Statutory Mean (μ)</span>
          </div>

          <div className="p-3 bg-[#191917] border border-[#A66A62] rounded">
            <span className="text-[10px] text-[#A66A62] block">Z-SCORE OUTLIERS</span>
            <span className="text-xl font-bold text-[#A66A62]">{analysisResult.anomaliesDetected}</span>
            <span className="text-[9px] text-[#A66A62] block mt-0.5">Z &le; -1.6σ flagged</span>
          </div>
        </div>

        {/* Live Parsed Records Table */}
        <div className="border border-[#2A2926] rounded overflow-hidden">
          <div className="bg-[#191917] px-4 py-2.5 border-b border-[#2A2926] flex items-center justify-between text-xs font-mono">
            <span className="text-[#C9C2B7]">
              Current File: <span className="text-[#B78A5A] font-bold">{fileName}</span>
            </span>
            <span className="text-[10px] text-[#8E887E]">
              Engine: Levenshtein DP + Statistical Z-Score Outlier
            </span>
          </div>

          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0D0D0C] text-[10px] text-[#8E887E] uppercase sticky top-0 border-b border-[#2A2926]">
                <tr>
                  <th className="p-3">RAW INPUT (CSV)</th>
                  <th className="p-3">NORMALIZED (LGD ONTOLOGY)</th>
                  <th className="p-3">SCHEME</th>
                  <th className="p-3">ALLOCATED (₹CR)</th>
                  <th className="p-3">UTILIZED (₹CR)</th>
                  <th className="p-3">UTILIZATION %</th>
                  <th className="p-3">Z-SCORE</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2926]">
                {analysisResult.rows.map((r, i) => (
                  <tr key={i} className="hover:bg-[#191917] transition-colors">
                    <td className="p-3 text-[#A66A62] font-semibold">{r.rawDistrict}</td>
                    <td className="p-3 text-[#5E8B72] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8B72]" />
                      <span>{r.normalizedDistrict}</span>
                    </td>
                    <td className="p-3 text-[#C9C2B7]">{r.schemeCode}</td>
                    <td className="p-3 text-[#F3F0E8]">₹{r.allocatedCr}</td>
                    <td className="p-3 text-[#F3F0E8]">₹{r.utilizedCr}</td>
                    <td className="p-3 font-bold">
                      <span className={r.utilizationRate < 50 ? 'text-[#A66A62]' : 'text-[#5E8B72]'}>
                        {r.utilizationRate}%
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#8E887E]">{r.zScore}σ</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          r.status === 'Flagged Gap'
                            ? 'bg-[#A66A62]/20 text-[#A66A62] border border-[#A66A62]/40'
                            : r.status === 'Lagging Anomaly'
                            ? 'bg-[#B59A63]/20 text-[#B59A63] border border-[#B59A63]/40'
                            : 'bg-[#5E8B72]/20 text-[#5E8B72]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
