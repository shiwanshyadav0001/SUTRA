'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { SCHEMES_DATA, MINISTRIES_DATA } from '@/lib/data/governance-data';
import { Scheme } from '@/lib/types';
import { Search, Filter, ArrowUpRight, ChevronRight, SlidersHorizontal, Layers } from 'lucide-react';

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
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-2 text-[11px] font-mono tracking-wider text-blue-700 uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>NATIONAL PROGRAMME REGISTRY • FLAGSHIP PORTFOLIO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-editorial">
          SCHEME EXPLORER
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Cross-ministerial repository index of centrally sponsored and central sector initiatives with verified PFMS outlays and delivery milestones.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-4 border border-slate-200 rounded-lg shadow-sm my-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes, sectors, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-semibold">Ministry:</span>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
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
            <tbody className="divide-y divide-slate-100">
              {filteredSchemes.map((scheme) => (
                <tr
                  key={scheme.id}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  {/* Scheme Name & Sector */}
                  <td className="p-3.5">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors block text-xs"
                    >
                      {scheme.name}
                    </Link>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {scheme.code} • {scheme.sector}
                    </span>
                  </td>

                  {/* Ministry */}
                  <td className="p-3.5 text-slate-600 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold mr-1.5">
                      {scheme.ministryId}
                    </span>
                    <span className="truncate max-w-[140px] inline-block align-middle font-sans">
                      {scheme.ministryName.replace('Ministry of ', '')}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="p-3.5 text-right font-semibold text-slate-900">
                    ₹{scheme.budgetAllocationCr} Cr
                  </td>

                  {/* Utilized */}
                  <td className="p-3.5 text-right">
                    <span className="text-slate-900 block font-semibold">
                      ₹{scheme.fundUtilizedCr} Cr
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        scheme.utilizationRate < 70 ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {scheme.utilizationRate}%
                    </span>
                  </td>

                  {/* Beneficiaries */}
                  <td className="p-3.5 text-right text-slate-600">
                    {scheme.beneficiariesCount.toLocaleString()}
                  </td>

                  {/* Projects */}
                  <td className="p-3.5 text-right text-slate-600">
                    {scheme.projectsCount.toLocaleString()}
                  </td>

                  {/* Coverage */}
                  <td className="p-3.5 text-right font-semibold text-slate-800">
                    {scheme.coverageRate}%
                  </td>

                  {/* Outcome Score */}
                  <td className="p-3.5 text-right font-bold text-emerald-700">
                    {scheme.outcomeIndex}/100
                  </td>

                  {/* Action */}
                  <td className="p-3.5 text-center">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[10px] text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold inline-flex items-center gap-1 shadow-2xs"
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
