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

      {/* Filter and Search Controls on Institutional Analytical Surface */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center surface-neutral-analytical p-4 border border-slate-200 rounded-lg shadow-sm my-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes, sectors, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-600 font-semibold">Ministry:</span>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs font-sans cursor-pointer"
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
            <span className="text-slate-600 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs font-sans cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Review">Review</option>
              <option value="Accelerated">Accelerated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Interface with Department Identity & Coverage Visualizers */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0B132B] text-slate-200 text-[10px] uppercase tracking-wider font-semibold border-b border-[#1E293B]">
              <tr>
                <th className="p-3.5">SCHEME & SECTOR</th>
                <th className="p-3.5">GOVERNMENT DEPARTMENT IDENTITY</th>
                <th className="p-3.5 text-right">BUDGET ALLOC</th>
                <th className="p-3.5 text-right">PFMS DRAWDOWN</th>
                <th className="p-3.5 text-right">BENEFICIARIES</th>
                <th className="p-3.5 text-right">PROJECTS</th>
                <th className="p-3.5 text-right">COVERAGE GAUGE</th>
                <th className="p-3.5 text-right">OUTCOME</th>
                <th className="p-3.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchemes.map((scheme) => (
                <tr
                  key={scheme.id}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  {/* Scheme Name & Sector */}
                  <td className="p-3.5">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors block text-xs"
                    >
                      {scheme.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {scheme.code}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        • {scheme.sector}
                      </span>
                    </div>
                  </td>

                  {/* Ministry & Department Identity Badge */}
                  <td className="p-3.5 text-slate-700 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[10px] font-bold border border-slate-700">
                        {scheme.ministryId}
                      </span>
                      <span className="truncate max-w-[150px] inline-block font-sans font-medium text-slate-800">
                        {scheme.ministryName.replace('Ministry of ', '')}
                      </span>
                    </div>
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
                      {scheme.utilizationRate}% utilized
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

                  {/* Coverage Gauge with visual progress indicator */}
                  <td className="p-3.5 text-right">
                    <span className="font-semibold text-slate-800 block">
                      {scheme.coverageRate}%
                    </span>
                    <div className="w-20 ml-auto bg-slate-200 h-1.5 rounded overflow-hidden mt-1">
                      <div
                        className={`h-full rounded ${
                          scheme.coverageRate >= 70
                            ? 'bg-emerald-600'
                            : scheme.coverageRate >= 50
                            ? 'bg-blue-600'
                            : 'bg-rose-600'
                        }`}
                        style={{ width: `${Math.min(scheme.coverageRate, 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Outcome Score */}
                  <td className="p-3.5 text-right font-bold text-emerald-700">
                    {scheme.outcomeIndex}/100
                  </td>

                  {/* Action */}
                  <td className="p-3.5 text-center">
                    <Link
                      href={`/scheme/${scheme.id}`}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[10px] text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold inline-flex items-center gap-1 shadow-2xs transition-colors"
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
