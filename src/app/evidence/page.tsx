'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { DATASETS_META, EVIDENCE_RECORDS } from '@/lib/data/governance-data';
import { DatasetMeta, EvidenceRecord } from '@/lib/types';
import {
  Database,
  Search,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  Filter,
  ArrowRight,
} from 'lucide-react';

export default function EvidenceHubPage() {
  const { openEvidence } = useIntelligence();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('DS-02');
  const [searchFilter, setSearchFilter] = useState('');

  const selectedDataset =
    DATASETS_META.find((d) => d.id === selectedDatasetId) || DATASETS_META[1];

  const filteredRecords = EVIDENCE_RECORDS.filter(
    (r) =>
      r.district.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.schemeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.recordNumber.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <AppShell>
      {/* Title */}
      <div className="space-y-2 border-b border-[#2A2926] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
          <span>CANONICAL DATASET CATALOGUE & AUDIT REGISTRY</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
          EVIDENCE HUB
        </h1>
        <p className="text-xs text-[#8E887E] max-w-2xl">
          Verifiable administrative records grounding all cross-ministry intelligence signals, gaps, and policy recommendations with full provenance traceability.
        </p>
      </div>

      {/* Featured Canonical Investigation Card */}
      <div className="p-6 rounded-sm bg-[#141412] border-2 border-[#B78A5A]/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2926] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#B78A5A]/20 text-[#B78A5A] border border-[#B78A5A]/40 font-bold">
              FEATURED INVESTIGATION: SUTRA-FND-0001
            </span>
            <span className="text-[10px] font-mono text-[#5E8B72] border border-[#5E8B72]/30 px-2 py-0.5 rounded bg-[#5E8B72]/10">
              VERIFIED SOURCE DATA
            </span>
          </div>
          <div className="text-xs font-mono text-[#8E887E]">
            LGD Identity Anchor: <span className="text-[#B78A5A] font-bold">512 (NANDURBAR)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-lg font-bold text-[#F3F0E8] font-editorial">
              Nandurbar Tribal Habitation Cross-Programme Capital Delivery Lag & Convergence Gap
            </h3>
            <p className="text-xs text-[#C9C2B7] font-editorial leading-relaxed">
              Deterministic LGD join across Jal Jeevan Mission, PMAY-G Housing, and PKVY Agriculture proves a severe -27.2 pp capital drawdown deficit with ₹68.10 Cr in unabsorbed outlays and an 18.4 pp synchronization lag between completed houses and active tap connections.
            </p>
          </div>
          <div className="p-4 bg-[#191917] border border-[#2A2926] rounded space-y-2 text-right">
            <span className="text-[10px] text-[#8E887E] uppercase block">PROVENANCE SHA-256</span>
            <code className="text-[10px] text-[#5E8B72] block truncate">
              b5e394f71a0e8c61a9d82f3c4e...
            </code>
            <a
              href="/query"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#B78A5A] text-[#0D0D0C] font-bold rounded text-xs hover:bg-[#CBB093] transition-colors mt-2"
            >
              <span>INSPECT PIPELINE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Dataset Overview Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DATASETS_META.map((dataset) => {
          const isSelected = dataset.id === selectedDatasetId;
          return (
            <div
              key={dataset.id}
              onClick={() => setSelectedDatasetId(dataset.id)}
              className={`p-5 rounded-sm bg-[#141412] border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'border-[#B78A5A] shadow-lg bg-[#191917]'
                  : 'border-[#2A2926] hover:border-[#8E887E]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-[#B78A5A] font-bold">{dataset.id}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#5E8B72]/15 text-[#5E8B72] border border-[#5E8B72]/30">
                  {dataset.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#F3F0E8] font-editorial">
                  {dataset.name}
                </h3>
                <div className="text-xl font-bold font-mono text-[#F3F0E8] mt-1">
                  {dataset.recordsCount.toLocaleString()}
                  <span className="text-[10px] font-normal text-[#8E887E] ml-1">records</span>
                </div>
              </div>

              <div className="text-[11px] text-[#8E887E] line-clamp-2">
                Source: {dataset.source}
              </div>

              <div className="pt-2 border-t border-[#2A2926] flex items-center justify-between text-[10px] font-mono text-[#7E7A72]">
                <span>{dataset.sourceType}</span>
                <span>{dataset.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Dataset Inspection & Schema Details */}
      <div className="p-6 rounded-sm bg-[#141412] border border-[#2A2926] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A2926] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#B78A5A]">
              ACTIVE REPOSITORY INSPECTOR: {selectedDataset.id}
            </span>
            <h2 className="text-xl font-bold text-[#F3F0E8] font-editorial mt-0.5">
              {selectedDataset.name}
            </h2>
            <p className="text-xs text-[#8E887E] mt-0.5">{selectedDataset.description}</p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-[#C9C2B7]">
              Source Type: <strong className="text-[#F3F0E8]">{selectedDataset.sourceType}</strong>
            </span>
          </div>
        </div>

        {/* Fields list */}
        <div>
          <span className="text-[10px] font-mono text-[#8E887E] uppercase block mb-2">
            CANONICAL SCHEMA FIELDS
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {selectedDataset.fields.map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded bg-[#191917] border border-[#2A2926] text-[#C9C2B7]"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Records Audit Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold font-editorial text-[#F3F0E8]">
              Ground Telemetry Records (Verifiable Audit Trail)
            </h3>
            <p className="text-xs text-[#8E887E]">
              Click any record to inspect exact field telemetry and usage in SUTRA insights.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8E887E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search record, district, scheme..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#191917] border border-[#2A2926] rounded text-xs text-[#F3F0E8] placeholder-[#7E7A72] focus:outline-none focus:border-[#B78A5A]"
            />
          </div>
        </div>

        <div className="border border-[#2A2926] rounded-sm overflow-hidden bg-[#141412]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0D0D0C] border-b border-[#2A2926] text-[10px] text-[#8E887E] uppercase tracking-wider">
                <tr>
                  <th className="p-4">RECORD</th>
                  <th className="p-4">SCHEME</th>
                  <th className="p-4">DISTRICT</th>
                  <th className="p-4 text-right">ALLOCATED</th>
                  <th className="p-4 text-right">UTILIZED</th>
                  <th className="p-4 text-right">BENEFICIARIES</th>
                  <th className="p-4">SOURCE TYPE</th>
                  <th className="p-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2926]">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-[#191917] transition-colors cursor-pointer"
                    onClick={() => openEvidence(record.id)}
                  >
                    <td className="p-4 font-bold text-[#B78A5A]">
                      {record.recordNumber}
                    </td>
                    <td className="p-4 text-[#F3F0E8]">
                      {record.schemeName}
                    </td>
                    <td className="p-4 text-[#C9C2B7]">
                      {record.district}, {record.state}
                    </td>
                    <td className="p-4 text-right text-[#F3F0E8]">
                      ₹{record.allocatedCr} Cr
                    </td>
                    <td className="p-4 text-right font-semibold text-[#B78A5A]">
                      ₹{record.utilizedCr} Cr
                    </td>
                    <td className="p-4 text-right text-[#C9C2B7]">
                      {record.beneficiaries.toLocaleString()}
                    </td>
                    <td className="p-4 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-[#191917] border border-[#2A2926] text-[#C9C2B7]">
                        {record.sourceType}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEvidence(record.id);
                        }}
                        className="px-2.5 py-1 bg-[#191917] border border-[#2A2926] rounded text-[10px] text-[#B78A5A] hover:border-[#B78A5A]"
                      >
                        Inspect
                      </button>
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
