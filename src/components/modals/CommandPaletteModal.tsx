'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Compass,
  LayoutDashboard,
  MapPin,
  FolderKanban,
  Network,
  AlertTriangle,
  Database,
  ArrowRightLeft,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const QUICK_COMMANDS = [
    {
      category: 'Specialist Workspaces',
      items: [
        {
          title: 'Investigate: Nandurbar Convergence Gap (SUTRA-FND-0001)',
          subtitle: '18.4 pp delivery lag between PMAY-G and JJM',
          icon: Compass,
          action: () => router.push('/investigation/SUTRA-INV-2026-0001'),
        },
        {
          title: 'Command Center Apex Console',
          subtitle: 'High-level statutory drawdown telemetry & national overview',
          icon: LayoutDashboard,
          action: () => router.push('/command'),
        },
        {
          title: 'Geographic Intelligence & 36-District GIS Map',
          subtitle: 'Spatial distribution of programme coverage & delivery gaps',
          icon: MapPin,
          action: () => router.push('/map'),
        },
        {
          title: 'Early Signals & Anomaly Detection',
          subtitle: 'Real-time telemetry mutations and statistical variance signals',
          icon: AlertTriangle,
          action: () => router.push('/signals'),
        },
        {
          title: 'Programme Overlap Engine',
          subtitle: 'Cross-scheme policy redundancy and bio-subsidy overlaps',
          icon: Layers,
          action: () => router.push('/overlaps'),
        },
        {
          title: 'Evidence Hub & Treasury Audit Trail',
          subtitle: 'Cryptographic SHA-256 provenance records & source documents',
          icon: Database,
          action: () => router.push('/evidence'),
        },
        {
          title: 'Data Ingestion & Entity Resolution',
          subtitle: 'Levenshtein string normalizer against official LGD directory',
          icon: ArrowRightLeft,
          action: () => router.push('/data'),
        },
        {
          title: 'Schemes & Programmes Registry',
          subtitle: 'Comprehensive dossier index of 6 central ministries',
          icon: FolderKanban,
          action: () => router.push('/schemes'),
        },
        {
          title: 'Sovereign Governance Graph',
          subtitle: 'Entity relationships across ministries, schemes, and districts',
          icon: Network,
          action: () => router.push('/relationships'),
        },
      ],
    },
    {
      category: 'Natural Governance Queries',
      items: [
        {
          title: 'Why was Nandurbar flagged for cross-programme convergence gap?',
          subtitle: 'Deep forensic breakdown of JJM water vs PMAY-G housing delivery lag',
          icon: Sparkles,
          action: () => router.push('/query?q=Why was Nandurbar flagged for cross-programme convergence gap?'),
        },
        {
          title: 'Which districts recently experienced a convergence gap?',
          subtitle: 'Identify Maharashtra districts with lagging capital drawdown',
          icon: Sparkles,
          action: () => router.push('/query?q=Which districts recently experienced a convergence gap?'),
        },
        {
          title: 'Which schemes changed significantly today in Maharashtra?',
          subtitle: 'Live anomaly velocity and metric mutation report',
          icon: Sparkles,
          action: () => router.push('/query?q=Which schemes changed significantly today in Maharashtra?'),
        },
        {
          title: 'Find programme convergence opportunities in Nandurbar',
          subtitle: 'Explore 3 joint inter-ministerial delivery interventions',
          icon: Sparkles,
          action: () => router.push('/query?q=Find programme convergence opportunities in Nandurbar'),
        },
      ],
    },
  ];

  // Filter commands
  const allItems = QUICK_COMMANDS.flatMap((group) => group.items);
  const filteredItems = searchTerm.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allItems;

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      } else if (searchTerm.trim()) {
        router.push(`/query?q=${encodeURIComponent(searchTerm.trim())}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a natural governance question or search destinations..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-slate-200 rounded text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No matching preset commands found</p>
              <p className="text-xs text-slate-500">
                Press <strong className="text-slate-800">Enter</strong> to run &quot;{searchTerm}&quot; through Ask SUTRA Natural Intelligence.
              </p>
              <button
                onClick={() => {
                  router.push(`/query?q=${encodeURIComponent(searchTerm.trim())}`);
                  onClose();
                }}
                className="mt-3 px-4 py-2 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <span>Execute Query</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      item.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-3 rounded-md flex items-center justify-between text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">{item.title}</div>
                        <div className="text-[11px] text-slate-500">{item.subtitle}</div>
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Dismiss</span>
          </div>
          <span>SUTRA v2.6 Apex Intelligence</span>
        </div>
      </div>
    </div>
  );
}
