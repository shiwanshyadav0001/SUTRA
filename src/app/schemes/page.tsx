'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { SCHEMES_DATA, MINISTRIES_DATA } from '@/lib/data/governance-data';
import { Scheme } from '@/lib/types';
import { Search, Filter, ArrowUpRight, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function SchemeExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredSchemes = SCHEMES_DATA.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.sector.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMinistry =
      selectedMinistry === 'all' || scheme.ministryId === selectedMinistry;

    const matchesStatus =
      selectedStatus === 'all' || scheme.status === selectedStatus;

    return matchesSearch && matchesMinistry && matchesStatus;
  });

  return (
    <AppShell>
      {/* Header */}
      <div className="space-y-2 border-b border-[#2A2926] pb-6">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B78A5A]" />
          <span>NATIONAL PROGRAMME REGISTRY</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F3F0E8] font-editorial">
          SCHEME EXPLORER
        </h1>
        <p className="text-xs text-[#8E887E]">
          Cross-ministerial repository index of centrally sponsored and central sector initiatives.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#141412] p-4 border border-[#2A2926] rounded-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8E887E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes, sectors, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#191917] border border-[#2A2926] rounded-sm text-xs text-[#F3F0E8] placeholder-[#7E7A72] focus:outline-none focus:border-[#B78A5A]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-[#8E887E]">Ministry:</span>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="bg-[#191917] border border-[#2A2926] rounded-sm px-2.5 py-1.5 text-xs text-[#F3F0E8] focus:border-[#B78A5A]"
            >
              <option value="all">All Ministries</option>
              {MINISTRIES_DATA.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} ({m.shortName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[#8E887E]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#191917] border border-[#2A2926] rounded-sm px-2.5 py-1.5 text-xs text-[#F3F0E8] focus:border-[#B78A5A]"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Review">Review</option>
              <option value="Accelerated">Accelerated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Refined List/Table Hybrid (Editorial Interface) */}
      <div className="border border-[#2A2926] rounded-sm overflow-hidden bg-[#141412]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0D0D0C] border-b border-[#2A2926] text-[10px] text-[#8E887E] uppercase tracking-wider">
              <tr>
                <th className="p-4">SCHEME & SECTOR</th>
                <th className="p-4">MINISTRY</th>
                <th className="p-4 text-right">BUDGET</th>
                <th className="p-4 text-right">UTILIZED</th>
                <th className="p-4 text-right">BENEFICIARIES</th>
                <th className="p-4 text-right">PROJECTS</th>
                <th className="p-4 text-right">COVERAGE</th>
                <th className="p-4 text-right">OUTCOME</th>
                <th className="p-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2926]">
              {filteredSchemes.map((scheme) => (
                <tr
                  key={scheme.id}
                  className="hover:bg-[#191917] transition-colors group"
                >
                  {/* Scheme Name & Sector */}
                  <td className="p-4">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="font-bold text-[#F3F0E8] group-hover:text-[#B78A5A] transition-colors block text-xs"
                    >
                      {scheme.name}
                    </Link>
                    <span className="text-[10px] text-[#8E887E] block mt-0.5">
                      {scheme.code} • {scheme.sector}
                    </span>
                  </td>

                  {/* Ministry */}
                  <td className="p-4 text-[#C9C2B7] text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#191917] border border-[#2A2926] text-[#B78A5A] text-[10px] mr-1.5">
                      {scheme.ministryId}
                    </span>
                    <span className="truncate max-w-[140px] inline-block align-middle">
                      {scheme.ministryName.replace('Ministry of ', '')}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="p-4 text-right font-semibold text-[#F3F0E8]">
                    ₹{scheme.budgetAllocationCr} Cr
                  </td>

                  {/* Utilized */}
                  <td className="p-4 text-right">
                    <span className="text-[#F3F0E8] block font-semibold">
                      ₹{scheme.fundUtilizedCr} Cr
                    </span>
                    <span
                      className={`text-[10px] ${
                        scheme.utilizationRate < 70 ? 'text-[#A66A62]' : 'text-[#5E8B72]'
                      }`}
                    >
                      {scheme.utilizationRate}%
                    </span>
                  </td>

                  {/* Beneficiaries */}
                  <td className="p-4 text-right text-[#C9C2B7]">
                    {(scheme.beneficiariesCount / 1000000).toFixed(1)}M
                  </td>

                  {/* Projects */}
                  <td className="p-4 text-right text-[#C9C2B7]">
                    {scheme.projectsCount}
                  </td>

                  {/* Coverage */}
                  <td className="p-4 text-right">
                    <span
                      className={`font-semibold ${
                        scheme.coverageRate < 70 ? 'text-[#A66A62]' : 'text-[#5E8B72]'
                      }`}
                    >
                      {scheme.coverageRate}%
                    </span>
                  </td>

                  {/* Outcome */}
                  <td className="p-4 text-right">
                    <span className="font-semibold text-[#B59A63]">
                      {scheme.outcomeIndex}
                    </span>
                    <span className="text-[9px] text-[#7E7A72]">/100</span>
                  </td>

                  {/* Action Link */}
                  <td className="p-4 text-center">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#191917] border border-[#2A2926] text-[11px] text-[#B78A5A] hover:border-[#B78A5A] transition-colors"
                    >
                      <span>Detail</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
