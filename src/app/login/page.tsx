'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SutraLogo } from '@/components/brand/SutraLogo';
import { LoadingTransition } from '@/components/ui/LoadingTransition';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('officer.apex@pmo.nic.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  if (isLoading) {
    return <LoadingTransition destinationRoute="/command" />;
  }

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex items-center justify-center p-4 md:p-8 select-none relative overflow-hidden">
      {/* Extremely minimal subtle geometric data-network line art */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="civicNetGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="#D8D6CE" />
            <line x1="30" y1="0" x2="30" y2="60" stroke="#EAE8E1" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="0" y1="30" x2="60" y2="30" stroke="#EAE8E1" strokeWidth="0.5" strokeDasharray="3 3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#civicNetGrid)" />
      </svg>

      {/* Main Split Institutional Auth Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#FFFFFF] border border-[#D8D6CE] rounded-lg shadow-sm grid md:grid-cols-12 overflow-hidden">
        {/* Left Side: Brand, Identity, Motto */}
        <div className="md:col-span-6 bg-[#EAE8E1] border-b md:border-b-0 md:border-r border-[#D8D6CE] p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <SutraLogo size="lg" theme="light" />

            <div>
              <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-[#66706A] font-bold block">
                NATIONAL GOVERNANCE APEX
              </span>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#18201C] font-editorial uppercase mt-1">
                SUTRA
              </h1>
              <p className="text-xs uppercase tracking-[0.14em] text-[#164A3A] font-bold mt-1">
                UNIFIED GOVERNANCE INTELLIGENCE
              </p>
            </div>

            <p className="text-xs text-[#66706A] leading-relaxed">
              Cross-Ministry Governance & Impact Intelligence Platform connecting programmes, resources, geography and verified public outcomes.
            </p>
          </div>

          <div className="pt-8 border-t border-[#D8D6CE] space-y-2 font-mono text-[10px] text-[#66706A]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28704D]" />
              <span>LGD-First Deterministic Spatial Resolution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B58A45]" />
              <span>data.gov.in + PFMS Ledger + NIC Enclave</span>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Access Panel */}
        <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E1]">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#66706A] font-semibold">
                SECURE ACCESS PANEL
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#E3EDE7] text-[#28704D] font-bold border border-[#28704D]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28704D]" />
                ENCLAVE ACTIVE
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#18201C] mb-1.5 font-editorial">
                  Official Email
                </label>
                <div className="flex items-center px-3 py-2 bg-[#F4F2EC] border border-[#D8D6CE] rounded focus-within:border-[#164A3A] transition-colors">
                  <Mail className="w-4 h-4 text-[#66706A] mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="officer@nic.in"
                    className="w-full bg-transparent text-xs font-mono text-[#18201C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18201C] mb-1.5 font-editorial">
                  Password
                </label>
                <div className="flex items-center px-3 py-2 bg-[#F4F2EC] border border-[#D8D6CE] rounded focus-within:border-[#164A3A] transition-colors">
                  <Lock className="w-4 h-4 text-[#66706A] mr-2 flex-shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-transparent text-xs font-mono text-[#18201C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded bg-[#164A3A] hover:bg-[#0D3026] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>ENTER SUTRA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          <div className="text-center pt-4 border-t border-[#EAE8E1]">
            <p className="text-[10px] uppercase font-mono tracking-[0.14em] text-[#66706A] font-semibold">
              AUTHORIZED GOVERNANCE ENVIRONMENT
            </p>
            <p className="text-[9px] text-[#898E89] mt-0.5 font-mono">
              NIC • Survey of India • MoPR LGD Architecture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
