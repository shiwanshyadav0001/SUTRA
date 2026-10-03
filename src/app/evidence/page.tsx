'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Layers,
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
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>CANONICAL DATASET CATALOGUE & AUDIT REGISTRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
          EVIDENCE HUB
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Verifiable administrative records grounding all cross-ministry intelligence signals, gaps, and policy recommendations with full cryptographic provenance traceability.
        </p>
      </div>

      {/* Featured Canonical Investigation Card */}
      <div className="p-6 rounded-lg bg-white border border-blue-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
              FEATURED INVESTIGATION: SUTRA-FND-0001
            </span>
            <span className="text-[10px] font-mono text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50 font-semibold">
              VERIFIED SOURCE DATA
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500">
            LGD Identity Anchor: <span className="text-blue-700 font-bold">512 (NANDURBAR)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-lg font-bold text-slate-900 font-editorial">
              Nandurbar Tribal Habitation Cross-Programme Capital Delivery Lag & Convergence Gap
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Deterministic LGD join across Jal Jeevan Mission, PMAY-G Housing, and PKVY Agriculture proves a severe -27.2 pp capital drawdown deficit with ₹68.10 Cr in unabsorbed outlays and an 18.4 pp synchronization lag between completed houses and active tap connections.
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2 text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">PROVENANCE SHA-256</span>
            <code className="text-[10px] text-emerald-700 block truncate font-mono">
              b5e394f71a0e8c61a9d82f3c4e...
            </code>
            <Link
              href="/investigation/SUTRA-INV-2026-0001"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md text-xs hover:bg-blue-700 transition-colors mt-2 cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>INSPECT WORKSPACE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dataset Overview Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {DATASETS_META.map((dataset) => {
          const isSelected = dataset.id === selectedDatasetId;
          return (
            <div
              key={dataset.id}
              onClick={() => setSelectedDatasetId(dataset.id)}
              className={`p-4 rounded-lg bg-white border transition-all cursor-pointer space-y-2.5 shadow-2xs ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-blue-700 font-bold">{dataset.id}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  {dataset.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 font-editorial">
                  {dataset.name}
                </h3>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {dataset.recordsCount.toLocaleString()}
                  <span className="text-[10px] font-normal text-slate-500 ml-1">records</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 line-clamp-2">
                Source: {dataset.source}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{dataset.sourceType}</span>
                <span>{dataset.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Dataset Inspection & Schema Details */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-blue-700 font-semibold">
              ACTIVE REPOSITORY INSPECTOR: {selectedDataset.id}
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-editorial mt-0.5">
              {selectedDataset.name}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">{selectedDataset.description}</p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-600">
              Source Type: <strong className="text-slate-900 font-semibold">{selectedDataset.sourceType}</strong>
            </span>
          </div>
        </div>

        {/* Fields list */}
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5 font-semibold">
            CANONICAL SCHEMA FIELDS
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {selectedDataset.fields.map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Records Audit Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold font-editorial text-slate-900">
              Ground Telemetry Records (Verifiable Audit Trail)
            </h3>
            <p className="text-xs text-slate-500">
              Click any record to inspect exact field telemetry, transformation, and 8-stage provenance lineage.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search record, district, scheme..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">RECORD</th>
                  <th className="p-3.5">SCHEME</th>
                  <th className="p-3.5">DISTRICT</th>
                  <th className="p-3.5 text-right">ALLOCATED</th>
                  <th className="p-3.5 text-right">UTILIZED</th>
                  <th className="p-3.5 text-right">BENEFICIARIES</th>
                  <th className="p-3.5">SOURCE TYPE</th>
                  <th className="p-3.5 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    onClick={() => openEvidence(record.id)}
                  >
                    <td className="p-3.5 font-bold text-blue-700">
                      {record.recordNumber}
                    </td>
                    <td className="p-3.5 text-slate-900 font-medium">
                      {record.schemeName}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {record.district}, {record.state}
                    </td>
                    <td className="p-3.5 text-right text-slate-900 font-semibold">
                      ₹{record.allocatedCr} Cr
                    </td>
                    <td className="p-3.5 text-right font-semibold text-rose-700">
                      ₹{record.utilizedCr} Cr
                    </td>
                    <td className="p-3.5 text-right text-slate-600">
                      {record.beneficiaries.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                        {record.sourceType}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEvidence(record.id);
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[10px] text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold cursor-pointer shadow-2xs"
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
