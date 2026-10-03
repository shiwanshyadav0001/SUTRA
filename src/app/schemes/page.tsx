'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { SCHEMES_DATA, MINISTRIES_DATA } from '@/lib/data/governance-data';
import { Scheme } from '@/lib/types';
import { Search, ChevronRight, ArrowUpRight } from 'lucide-react';

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
      <div className="space-y-1.5 border-b border-[#D8D6CE] pb-6 select-none">
        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-[0.14em] text-[#B58A45] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#164A3A]" />
          <span>NATIONAL PROGRAMME REGISTRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18201C] font-editorial uppercase">
          SCHEME EXPLORER
        </h1>
        <p className="text-xs text-[#66706A]">
          Cross-ministerial repository index of centrally sponsored and central sector initiatives across India.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#FFFFFF] p-4 border border-[#D8D6CE] rounded-lg shadow-xs select-none">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#66706A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes, sectors, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F2EC] border border-[#D8D6CE] rounded text-xs text-[#18201C] placeholder-[#898E89] focus:outline-none focus:border-[#164A3A]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-[#66706A] font-semibold">Ministry:</span>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="bg-[#F4F2EC] border border-[#D8D6CE] rounded px-2.5 py-1.5 text-xs text-[#18201C] focus:border-[#164A3A] font-medium"
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
            <span className="text-[#66706A] font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F4F2EC] border border-[#D8D6CE] rounded px-2.5 py-1.5 text-xs text-[#18201C] focus:border-[#164A3A] font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Review">Review</option>
              <option value="Accelerated">Accelerated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Interface */}
      <div className="border border-[#D8D6CE] rounded-lg overflow-hidden bg-[#FFFFFF] shadow-xs select-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F4F2EC] border-b border-[#D8D6CE] text-[10px] text-[#66706A] uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5">SCHEME & SECTOR</th>
                <th className="p-3.5">MINISTRY</th>
                <th className="p-3.5 text-right">BUDGET</th>
                <th className="p-3.5 text-right">UTILIZED</th>
                <th className="p-3.5 text-right">BENEFICIARIES</th>
                <th className="p-3.5 text-right">PROJECTS</th>
                <th className="p-3.5 text-right">COVERAGE</th>
                <th className="p-3.5 text-right">OUTCOME</th>
                <th className="p-3.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E1]">
              {filteredSchemes.map((scheme) => (
                <tr
                  key={scheme.id}
                  className="hover:bg-[#F4F2EC] transition-colors group cursor-pointer"
                >
                  {/* Scheme Name & Sector */}
                  <td className="p-3.5">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="font-bold text-[#18201C] group-hover:text-[#164A3A] transition-colors block text-xs"
                    >
                      {scheme.name}
                    </Link>
                    <span className="text-[10px] text-[#66706A] block mt-0.5">
                      {scheme.code} • {scheme.sector}
                    </span>
                  </td>

                  {/* Ministry */}
                  <td className="p-3.5 text-[#66706A] text-[11px]">
                    <span className="px-1.5 py-0.2 rounded bg-[#F4F2EC] border border-[#D8D6CE] text-[#164A3A] text-[10px] font-bold mr-1.5">
                      {scheme.ministryId}
                    </span>
                    <span className="truncate max-w-[130px] inline-block align-middle font-medium text-[#18201C]">
                      {scheme.ministryName.replace('Ministry of ', '')}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="p-3.5 text-right font-bold text-[#18201C]">
                    ₹{scheme.budgetAllocationCr} Cr
                  </td>

                  {/* Utilized */}
                  <td className="p-3.5 text-right">
                    <span className="text-[#18201C] block font-bold">
                      ₹{scheme.fundUtilizedCr} Cr
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        scheme.utilizationRate < 70 ? 'text-[#A54848]' : 'text-[#28704D]'
                      }`}
                    >
                      {scheme.utilizationRate}%
                    </span>
                  </td>

                  {/* Beneficiaries */}
                  <td className="p-3.5 text-right font-medium text-[#18201C]">
                    {(scheme.beneficiariesCount / 1000000).toFixed(1)}M
                  </td>

                  {/* Projects */}
                  <td className="p-3.5 text-right font-medium text-[#66706A]">
                    {scheme.projectsCount}
                  </td>

                  {/* Coverage */}
                  <td className="p-3.5 text-right">
                    <span
                      className={`font-bold ${
                        scheme.coverageRate < 70 ? 'text-[#A54848]' : 'text-[#28704D]'
                      }`}
                    >
                      {scheme.coverageRate}%
                    </span>
                  </td>

                  {/* Outcome */}
                  <td className="p-3.5 text-right font-bold text-[#18201C]">
                    {scheme.outcomeIndex}/100
                  </td>

                  {/* Action */}
                  <td className="p-3.5 text-center">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F4F2EC] hover:bg-[#EAE8E1] border border-[#D8D6CE] text-[10px] font-bold text-[#164A3A] transition-colors"
                    >
                      <span>Dossier</span>
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
