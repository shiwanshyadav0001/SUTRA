'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useIntelligence } from '@/context/IntelligenceContext';
import { DATASETS_META, EVIDENCE_RECORDS } from '@/lib/data/governance-data';
import {
  Database,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Filter,
  ArrowRight,
  Server,
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
      <div className="space-y-1.5 border-b border-[#D8D6CE] pb-6 select-none">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
          <span>CANONICAL DATASET CATALOGUE & AUDIT REGISTRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
          EVIDENCE HUB
        </h1>
        <p className="text-xs text-[#66706A] max-w-2xl leading-relaxed">
          Every intelligence finding is traceable to its verified dataset, source registry, record, field, date, calculation and confidence score.
        </p>
      </div>

      {/* COMPACT DATA PROVENANCE COMPONENT (Required by Spec) */}
      <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#D8D6CE] shadow-xs space-y-4 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE8E1] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-[#E3EDE7] flex items-center justify-center text-[#28704D]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#66706A] font-semibold block">
                COMPACT PROVENANCE REGISTRY
              </span>
              <h2 className="text-sm font-bold text-[#18201C] font-editorial">
                Verified Governance Ingestion Sources
              </h2>
            </div>
          </div>
          <div className="text-xs font-mono text-[#28704D] font-bold flex items-center gap-1.5 bg-[#E3EDE7] px-2.5 py-1 rounded border border-[#28704D]/30">
            <span className="w-2 h-2 rounded-full bg-[#28704D]" />
            <span>ALL SOURCES AUDITED & ACTIVE</span>
          </div>
        </div>

        {/* 3 Core Sources as specified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#18201C] text-sm">data.gov.in</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E3EDE7] text-[#28704D] border border-[#28704D]/30">
                VERIFIED
              </span>
            </div>
            <div className="text-[10px] text-[#66706A]">Source Type: Open Government Data Platform</div>
            <div className="flex justify-between text-[10px] text-[#66706A] pt-1 border-t border-[#D8D6CE]">
              <span>Last Ingest: 03 Oct 2026</span>
              <span className="font-bold text-[#164A3A]">2,840 Records</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#18201C] text-sm">PFMS</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E3EDE7] text-[#28704D] border border-[#28704D]/30">
                VERIFIED
              </span>
            </div>
            <div className="text-[10px] text-[#66706A]">Source Type: Public Financial Management Ledger</div>
            <div className="flex justify-between text-[10px] text-[#66706A] pt-1 border-t border-[#D8D6CE]">
              <span>Last Ingest: 02 Oct 2026</span>
              <span className="font-bold text-[#164A3A]">Live Tranches</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-[#F4F2EC] border border-[#D8D6CE] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#18201C] text-sm">LGD Spatial Core</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E3EDE7] text-[#28704D] border border-[#28704D]/30">
                VERIFIED
              </span>
            </div>
            <div className="text-[10px] text-[#66706A]">Source Type: Ministry of Panchayati Raj Boundary</div>
            <div className="flex justify-between text-[10px] text-[#66706A] pt-1 border-t border-[#D8D6CE]">
              <span>Last Ingest: 01 Oct 2026</span>
              <span className="font-bold text-[#164A3A]">766 Districts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
        {DATASETS_META.map((dataset) => {
          const isSelected = dataset.id === selectedDatasetId;
          return (
            <div
              key={dataset.id}
              onClick={() => setSelectedDatasetId(dataset.id)}
              className={`p-4 rounded-lg bg-[#FFFFFF] border transition-all cursor-pointer space-y-2.5 shadow-xs ${
                isSelected
                  ? 'border-[#164A3A] ring-1 ring-[#164A3A]'
                  : 'border-[#D8D6CE] hover:border-[#66706A]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-[#164A3A] font-bold">{dataset.id}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E3EDE7] text-[#28704D] font-bold border border-[#28704D]/30">
                  {dataset.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#18201C] font-editorial">
                  {dataset.name}
                </h3>
                <div className="text-xl font-bold font-mono text-[#18201C] mt-0.5">
                  {dataset.recordsCount.toLocaleString()}
                  <span className="text-[10px] font-normal text-[#66706A] ml-1">records</span>
                </div>
              </div>

              <div className="text-[11px] text-[#66706A] line-clamp-1 font-mono">
                Source: {dataset.source}
              </div>

              <div className="pt-2 border-t border-[#EAE8E1] flex items-center justify-between text-[10px] font-mono text-[#66706A]">
                <span>{dataset.sourceType}</span>
                <span>{dataset.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Records Audit Table with Exact Traceability Required by Spec */}
      <div className="space-y-3 select-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold font-editorial text-[#18201C]">
              Auditable Telemetry Records & Provenance Ledger
            </h3>
            <p className="text-xs text-[#66706A]">
              Click any record to inspect exact statutory parameters and calculation methodology.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#66706A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter record, district, scheme..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D6CE] rounded text-xs text-[#18201C] placeholder-[#898E89] focus:outline-none focus:border-[#164A3A]"
            />
          </div>
        </div>

        <div className="border border-[#D8D6CE] rounded-lg overflow-hidden bg-[#FFFFFF] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F4F2EC] border-b border-[#D8D6CE] text-[10px] text-[#66706A] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">SOURCE</th>
                  <th className="p-3.5">DATASET</th>
                  <th className="p-3.5">RECORD</th>
                  <th className="p-3.5">FIELD</th>
                  <th className="p-3.5 text-right">ALLOCATED</th>
                  <th className="p-3.5 text-right">UTILIZED</th>
                  <th className="p-3.5 text-center">STATUS</th>
                  <th className="p-3.5 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE8E1]">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-[#F4F2EC] transition-colors cursor-pointer"
                    onClick={() => openEvidence(record.id)}
                  >
                    <td className="p-3.5 font-bold text-[#164A3A]">
                      {record.sourceType === 'Government Open Data'
                        ? 'data.gov.in'
                        : record.sourceType === 'Union Budget / PFMS'
                        ? 'PFMS'
                        : 'LGD Spatial Core'}
                    </td>
                    <td className="p-3.5 text-[#18201C] font-medium">
                      {record.datasetName}
                    </td>
                    <td className="p-3.5 text-[#18201C]">
                      {record.district} ({record.recordNumber})
                    </td>
                    <td className="p-3.5 text-[#66706A]">
                      Beneficiary Coverage
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#18201C]">
                      ₹{record.allocatedCr} Cr
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#28704D]">
                      ₹{record.utilizedCr} Cr
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#E3EDE7] text-[#28704D] border border-[#28704D]/30">
                        VERIFIED
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEvidence(record.id);
                        }}
                        className="px-2.5 py-1 bg-[#FFFFFF] border border-[#D8D6CE] hover:border-[#164A3A] rounded text-[10px] text-[#164A3A] font-bold"
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
