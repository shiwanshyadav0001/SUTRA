'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { LoadingTransition } from '@/components/ui/LoadingTransition';
import { SutraOfficialAnimatedLogo } from '@/components/brand/SutraOfficialAnimatedLogo';

export default function LandingPage() {
  const router = useRouter();
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // CloudFront video plate URL fallback
  const videoUrl =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4';

  useEffect(() => {
    // If reduced motion is requested, immediately complete intro
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsIntroDone(true);
      return;
    }

    // Instant trigger on next paint for buttery smooth entrance
    const frameId = requestAnimationFrame(() => {
      setIsIntroDone(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleEnterSutra = () => {
    setIsLoadingTransition(true);
  };

  if (isLoadingTransition) {
    return <LoadingTransition destinationRoute="/command" />;
  }

  return (
    <div className="relative min-h-screen bg-[#060A12] text-[#F3F0E8] overflow-x-hidden selection:bg-[#B78A5A]/30">
      {/* FIXED FULLSCREEN HERO STAGE */}
      <section className="relative w-full min-h-screen lg:h-screen overflow-hidden flex flex-col justify-between select-none">
        {/* Hardware-Accelerated Single Video Atmosphere (Zero GPU bottleneck) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none z-0 will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover object-right-top md:object-center-top opacity-50 filter contrast-110 brightness-75"
          >
            <source src="/sutra.mp4" type="video/mp4" />
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>

        {/* Directional Scrim Overlay (Ensures Left Typography is Crystal Clear while video atmosphere shines through) */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background:
              'linear-gradient(90deg, #060A12 0%, rgba(6,10,18,0.95) 44%, rgba(11,19,36,0.70) 68%, rgba(16,26,46,0.30) 90%, transparent 100%)',
          }}
        />

        {/* Subtle Institutional Coordinate & Grid Texture */}
        <div
          className="absolute inset-0 pointer-events-none z-1 opacity-35"
          style={{
            backgroundImage: `
              radial-gradient(circle at 80% 25%, rgba(30, 58, 138, 0.18) 0%, transparent 55%),
              radial-gradient(circle at 15% 75%, rgba(183, 138, 90, 0.08) 0%, transparent 45%),
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 56px 56px, 56px 56px',
          }}
        />

        {/* TOP BAR / HEADER */}
        <header className="relative z-20 px-8 lg:px-14 py-7 flex items-center justify-between border-b border-[#1C2B42]/50 bg-[#060A12]/80 backdrop-blur-md">
          {/* Logo */}
          <div
            className={`flex items-center space-x-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
              isIntroDone ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <SutraOfficialAnimatedLogo size="sm" emblemOnly={true} interactiveMagnet={true} className="w-10 h-10" />
            </div>
            <div>
              <span className="font-semibold text-base tracking-widest text-[#F3F0E8] font-editorial block leading-none">
                SUTRA
              </span>
              <span className="text-[9px] font-mono text-[#8E887E] tracking-widest uppercase block mt-1">
                Governance Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-9 font-mono text-xs text-[#C9C2B7]">
            {[
              { label: 'The Problem', href: '#problem' },
              { label: 'How It Works', href: '#architecture' },
              { label: 'Workspaces', href: '#capabilities' },
              { label: 'Governance Graph', href: '/relationships' },
              { label: 'Evidence Hub', href: '/evidence' },
            ].map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  transitionDelay: `${120 + idx * 50}ms`,
                }}
                className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#B78A5A] ${
                  isIntroDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Top CTA Button */}
          <div className="hidden lg:block">
            <button
              onClick={handleEnterSutra}
              style={{
                clipPath: isIntroDone
                  ? 'inset(0% 0% 0% 0%)'
                  : 'inset(0% 100% 0% 0%)',
                transition: 'clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.28s',
              }}
              className="px-6 py-2.5 bg-[#B78A5A] text-[#060A12] font-semibold text-xs rounded-none hover:bg-[#CBB093] transition-colors flex items-center space-x-2.5 group tracking-wide font-editorial cursor-pointer"
            >
              <span>ENTER SUTRA</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 text-[#F3F0E8] border border-[#1C2B42] bg-[#0B1324]"
            aria-label="Open menu"
          >
            <MenuIcon className="w-5 h-5 text-[#B78A5A]" />
          </button>
        </header>

        {/* HERO BODY: Two-Column Composition (Editorial Left + Atmospheric Telemetry Right) */}
        <div className="relative z-10 px-8 lg:px-14 py-8 flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-10 max-w-7xl w-full mx-auto">
          {/* Left Column: Typography & CTAs */}
          <div className="max-w-2xl space-y-6">
            {/* Tagline Eyebrow */}
            <div
              className={`inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-[#B78A5A] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 ${
                isIntroDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <span className="w-1.5 h-1.5 bg-[#B78A5A]" />
              <span>SUTRA • GOVERNANCE INTELLIGENCE SYSTEM</span>
            </div>

            {/* Headline with Masked Line Reveals */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#F3F0E8] font-editorial leading-[1.02]">
              {/* Line 1 */}
              <span className="block overflow-hidden pb-2 -mb-2">
                <span
                  style={{
                    transform: isIntroDone ? 'translateY(0%)' : 'translateY(120%)',
                    transition: 'transform 0.9s cubic-bezier(0.22, 0.85, 0.24, 1) 0.3s',
                  }}
                  className="block will-change-transform"
                >
                  GOVERNANCE,
                </span>
              </span>

              {/* Line 2 */}
              <span className="block overflow-hidden pb-2 -mb-2">
                <span
                  style={{
                    transform: isIntroDone ? 'translateY(0%)' : 'translateY(120%)',
                    transition: 'transform 0.9s cubic-bezier(0.22, 0.85, 0.24, 1) 0.4s',
                  }}
                  className="block text-[#B78A5A] will-change-transform"
                >
                  CONNECTED.
                </span>
              </span>
            </h1>

            {/* Subcopy */}
            <p
              style={{
                opacity: isIntroDone ? 1 : 0,
                transform: isIntroDone ? 'translateY(0px)' : 'translateY(14px)',
                transition:
                  'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.65s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.65s',
              }}
              className="text-base sm:text-lg text-[#C9C2B7] max-w-xl font-normal leading-relaxed will-change-transform"
            >
              An intelligence layer connecting programmes, resources, regions and outcomes across government data.
            </p>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2.5 py-1 rounded bg-[#0B1324] text-cyan-300 border border-[#1C2B42]">
                36 DISTRICTS
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0B1324] text-emerald-400 border border-[#1C2B42]">
                MULTI-PROGRAMME ANALYSIS
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0B1324] text-amber-300 border border-[#1C2B42]">
                EVIDENCE TRACEABILITY
              </span>
            </div>

            {/* Hero CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={handleEnterSutra}
                style={{
                  clipPath: isIntroDone
                    ? 'inset(0% 0% 0% 0%)'
                    : 'inset(0% 100% 0% 0%)',
                  transition: 'clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
                }}
                className="px-8 py-4 bg-[#B78A5A] text-[#060A12] font-semibold text-sm rounded-none hover:bg-[#CBB093] transition-colors shadow-2xl flex items-center space-x-3 group tracking-wide font-editorial cursor-pointer"
              >
                <span>ENTER SUTRA →</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href="#problem"
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transition: 'opacity 0.6s ease 0.95s',
                }}
                className="px-6 py-4 bg-[#0B1324] border border-[#1C2B42] text-[#C9C2B7] hover:text-[#F3F0E8] hover:border-[#8E887E] text-sm rounded-none transition-colors cursor-pointer"
              >
                SEE HOW IT WORKS
              </a>
            </div>
          </div>

          {/* Right Column: Floating Institutional Atmospheric Telemetry Chip */}
          <div className="hidden lg:flex flex-col items-end justify-center">
            <div className="p-4 rounded border border-[#1C2B42]/80 bg-[#0B1324]/75 backdrop-blur-md max-w-xs space-y-2.5 font-mono text-[11px] shadow-2xl text-slate-300">
              <div className="flex items-center justify-between border-b border-[#1C2B42] pb-2 text-[10px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-slate-100 uppercase tracking-wider">STATE TELEMETRY</span>
                </div>
                <span className="text-[#B78A5A]">LGD 512 • MH</span>
              </div>
              <div className="space-y-1.5 text-[10px] text-slate-400">
                <div className="flex justify-between">
                  <span>CANONICAL CORE:</span>
                  <span className="text-cyan-300 font-semibold">JJM • PMAY-G • PKVY</span>
                </div>
                <div className="flex justify-between">
                  <span>RESOLUTION:</span>
                  <span className="text-emerald-400 font-semibold">LGD DETERMINISTIC</span>
                </div>
                <div className="flex justify-between">
                  <span>PROVENANCE:</span>
                  <span className="text-amber-300 font-semibold">SHA-256 AUDITABLE</span>
                </div>
              </div>
              <div className="pt-1.5 border-t border-[#1C2B42] flex items-center justify-between text-[9px] text-[#8E887E]">
                <span>18.5204° N, 73.8567° E</span>
                <span className="text-emerald-400">VERIFIED PASS</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS STRIP (Verifiable System Facts) */}
        <div className="relative z-10 px-8 lg:px-14 py-6 border-t border-[#1C2B42]/80 bg-[#060A12]/85 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-8 lg:space-x-12 font-mono">
            {/* Stat 1 */}
            <div className="space-y-0.5">
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transform: isIntroDone ? 'translateY(0px)' : 'translateY(10px)',
                  transition: 'opacity 0.6s ease 0.9s, transform 0.6s ease 0.9s',
                }}
                className="text-2xl lg:text-3xl font-bold text-[#F3F0E8]"
              >
                36
              </div>
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transition: 'opacity 0.6s ease 0.95s',
                }}
                className="text-[10px] text-[#8E887E] uppercase tracking-wider font-editorial"
              >
                MAHARASHTRA LGD DISTRICTS
              </div>
            </div>

            {/* Vertical Rule 1 */}
            <div
              style={{
                transform: isIntroDone ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.85s',
              }}
              className="h-10 w-[1.5px] bg-[#1C2B42] origin-center"
            />

            {/* Stat 2 */}
            <div className="space-y-0.5">
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transform: isIntroDone ? 'translateY(0px)' : 'translateY(10px)',
                  transition: 'opacity 0.6s ease 0.95s, transform 0.6s ease 0.95s',
                }}
                className="text-2xl lg:text-3xl font-bold text-[#B78A5A]"
              >
                3
              </div>
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transition: 'opacity 0.6s ease 1.0s',
                }}
                className="text-[10px] text-[#8E887E] uppercase tracking-wider font-editorial"
              >
                PROGRAMME REGISTERS (JJM • PMAY-G • PKVY)
              </div>
            </div>

            {/* Vertical Rule 2 */}
            <div
              style={{
                transform: isIntroDone ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.9s',
              }}
              className="h-10 w-[1.5px] bg-[#1C2B42] origin-center"
            />

            {/* Stat 3 */}
            <div className="space-y-0.5">
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transform: isIntroDone ? 'translateY(0px)' : 'translateY(10px)',
                  transition: 'opacity 0.6s ease 1.0s, transform 0.6s ease 1.0s',
                }}
                className="text-2xl lg:text-3xl font-bold text-[#F3F0E8]"
              >
                1
              </div>
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transition: 'opacity 0.6s ease 1.05s',
                }}
                className="text-[10px] text-[#8E887E] uppercase tracking-wider font-editorial"
              >
                EVIDENCE PIPELINE (DATA FABRIC v1.6)
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#8E887E] flex flex-wrap items-center gap-2">
            <span className="text-cyan-400 font-semibold">DATA → ANALYSIS → EVIDENCE → REVIEW</span>
            <span>•</span>
            <span>ZERO-PII SOVEREIGN TELEMETRY</span>
          </div>
        </div>
      </section>

      {/* MOBILE FULLSCREEN MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#060A12]/98 flex flex-col justify-between p-8 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#1C2B42] pb-4">
            <span className="font-mono text-xs text-[#B78A5A] uppercase tracking-widest">
              SUTRA NAVIGATION
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 border border-[#1C2B42] text-[#C9C2B7]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 font-editorial text-2xl font-bold">
            <a
              href="#problem"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              01 The Problem
            </a>
            <a
              href="#architecture"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              02 How SUTRA Works
            </a>
            <a
              href="#capabilities"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              03 Institutional Workspaces
            </a>
            <Link
              href="/relationships"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              04 Governance Graph
            </Link>
            <Link
              href="/evidence"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              05 Evidence Hub
            </Link>
            <Link
              href="/command"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              06 Command Center
            </Link>
          </div>

          <div className="pt-4 border-t border-[#1C2B42]">
            <button
              onClick={handleEnterSutra}
              className="w-full py-4 bg-[#B78A5A] text-[#060A12] font-semibold text-sm hover:bg-[#CBB093] transition-colors font-editorial"
            >
              ENTER SUTRA CONSOLE →
            </button>
          </div>
        </div>
      )}

      {/* PART 2: THE PROBLEM STORY (Scroll Storytelling) */}
      <section id="problem" className="py-28 px-8 lg:px-14 max-w-5xl mx-auto border-t border-[#1C2B42]/60">
        <div className="space-y-16">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase block">
              THE STRUCTURAL BARRIER
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-editorial text-[#F3F0E8] leading-tight">
              GOVERNMENT DOESN&apos;T LACK DATA.
            </h2>
            <h3 className="text-4xl sm:text-5xl font-bold font-editorial text-[#B78A5A]">
              IT LACKS CONNECTION.
            </h3>
            <p className="text-sm sm:text-base text-[#C9C2B7] max-w-2xl leading-relaxed pt-2">
              Massive repositories exist across ministries, budgets, and state portals. Yet when decision-makers need cross-cutting answers, datasets remain trapped in administrative silos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Disconnected State */}
            <div className="p-6 rounded-none bg-[#0B1324] border border-[#1C2B42] space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8E887E] font-mono">
                <span>BEFORE: FRAGMENTED SILOS</span>
                <span className="text-rose-400">NO INTEROPERABILITY</span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                {['SCHEMES', 'FINANCE', 'PROJECTS', 'GEOGRAPHY', 'BENEFICIARIES', 'OUTCOMES'].map(
                  (item, i) => (
                    <div
                      key={item}
                      className="p-3 bg-[#101A2E] border border-[#1C2B42] text-center text-[#8E887E]"
                    >
                      <div className="text-[10px] text-slate-500 block">SILO 0{i + 1}</div>
                      <div className="font-semibold text-slate-200">{item}</div>
                    </div>
                  )
                )}
              </div>
              <p className="text-[11px] text-[#8E887E] leading-relaxed">
                Ministries cannot detect if identical target farmers in Nandurbar are receiving duplicate subsidies while basic infrastructure remains un-funded.
              </p>
            </div>

            {/* Connected State */}
            <div className="p-6 rounded-none bg-[#0B1324] border border-[#B78A5A]/50 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-[#8E887E] font-mono">
                <span className="text-[#B78A5A] font-semibold">WITH SUTRA: UNIFIED GRAPH</span>
                <span className="text-emerald-400">CANONICAL LINKAGE</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { label: 'MINISTRY', note: 'Policy Ownership & Budget Sanction' },
                  { label: 'SCHEME', note: 'Programme Rules & Beneficiary Criteria' },
                  { label: 'PROJECT', note: 'Execution Contracts & Work Orders' },
                  { label: 'LOCATION', note: 'LGD Code District & Gram Panchayat' },
                  { label: 'BENEFICIARY', note: 'Target Families & DBT Accounts' },
                  { label: 'OUTCOME', note: 'Physical Verification & Quality Index' },
                ].map((node, i, arr) => (
                  <React.Fragment key={node.label}>
                    <div className="p-2.5 bg-[#101A2E] border border-[#1C2B42] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#B78A5A]" />
                        <span className="font-bold text-[#F3F0E8]">{node.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{node.note}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="text-center text-[#B78A5A] text-[10px] leading-none py-0.5">
                        ↓
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PART 3: HOW SUTRA WORKS */}
      <section id="architecture" className="py-28 px-8 lg:px-14 max-w-5xl mx-auto border-t border-[#1C2B42]/60">
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
              FIVE-STEP INTELLIGENCE PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#F3F0E8]">
              HOW SUTRA OPERATES
            </h2>
            <p className="text-xs sm:text-sm text-[#8E887E]">
              From heterogeneous administrative files to explainable policy decisions.
            </p>
          </div>

          <div className="flex justify-center flex-wrap gap-2">
            {[
              { id: 1, num: '01', title: 'INGEST' },
              { id: 2, num: '02', title: 'HARMONIZE' },
              { id: 3, num: '03', title: 'CONNECT' },
              { id: 4, num: '04', title: 'DETECT' },
              { id: 5, num: '05', title: 'EXPLAIN' },
            ].map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-4 py-2 text-xs font-mono transition-all rounded-none cursor-pointer ${
                  activeStep === step.id
                    ? 'bg-[#B78A5A] text-[#060A12] font-bold shadow'
                    : 'bg-[#0B1324] text-slate-400 border border-[#1C2B42] hover:text-[#F3F0E8]'
                }`}
              >
                {step.num} {step.title}
              </button>
            ))}
          </div>

          <div className="p-8 bg-[#0B1324]/90 border border-[#1C2B42] min-h-[320px] flex flex-col justify-center">
            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-[#B78A5A]">01 / INGESTION</span>
                  <h3 className="text-xl font-bold font-editorial text-[#F3F0E8]">
                    Heterogeneous Multi-Format Feeds
                  </h3>
                </div>
                <p className="text-xs text-[#C9C2B7] max-w-xl">
                  SUTRA continuously ingests disparate formats across state governments, central ministries, and district field offices:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  {['CSV Files', 'Excel Sheets', 'Government Reports', 'PFMS Finance Data', 'GIS Shapefiles', 'State MIS Portals'].map(
                    (format) => (
                      <div
                        key={format}
                        className="p-3 bg-[#101A2E] border border-[#1C2B42] text-center"
                      >
                        <span className="text-[#B78A5A] block mb-1">↳</span>
                        <span className="text-[#F3F0E8]">{format}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-[#B78A5A]">02 / HARMONIZE</span>
                  <h3 className="text-xl font-bold font-editorial text-[#F3F0E8]">
                    Entity Resolution & Schema Canonicalization
                  </h3>
                </div>
                <p className="text-xs text-[#C9C2B7] max-w-xl">
                  Heterogeneous spelling, abbreviations, and department codes are normalized via phonetic match and semantic entity mapping:
                </p>
                <div className="p-4 bg-[#101A2E] border border-[#1C2B42] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] text-slate-500 block">RAW UNSTRUCTURED STRINGS</span>
                    <div className="text-slate-400">&quot;MH&quot;</div>
                    <div className="text-slate-400">&quot;Maharastra&quot;</div>
                    <div className="text-slate-400">&quot;Maharashtra State&quot;</div>
                  </div>
                  <div className="text-[#B78A5A] text-lg font-bold">→ SUTRA RESOLUTION →</div>
                  <div className="p-3 bg-[#0B1324] border border-emerald-500/40 text-center">
                    <span className="text-[10px] text-emerald-400 block">CANONICAL ENTITY</span>
                    <span className="text-[#F3F0E8] font-bold text-sm">MAHARASHTRA</span>
                    <span className="text-[9px] text-[#8E887E] block mt-1">EVIDENCE TRACEABLE • LGD DETERMINISTIC</span>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-[#B78A5A]">03 / CONNECT</span>
                  <h3 className="text-xl font-bold font-editorial text-[#F3F0E8]">
                    The Multi-Relational Governance Graph
                  </h3>
                </div>
                <p className="text-xs text-[#C9C2B7] max-w-xl">
                  Entities are linked through bidirectional relationships, allowing cross-ministry queries across funding, implementation, and target populations:
                </p>
                <div className="p-4 bg-[#101A2E] border border-[#1C2B42] font-mono text-xs flex flex-wrap justify-between items-center gap-2">
                  <span className="px-3 py-1.5 bg-[#0B1324] text-[#B78A5A] border border-[#1C2B42]">MINISTRY</span>
                  <span className="text-slate-500">──OWNS──▶</span>
                  <span className="px-3 py-1.5 bg-[#0B1324] text-[#F3F0E8] border border-[#1C2B42]">SCHEME</span>
                  <span className="text-slate-500">──FUNDS──▶</span>
                  <span className="px-3 py-1.5 bg-[#0B1324] text-[#B78A5A] border border-[#1C2B42]">PROJECT</span>
                  <span className="text-slate-500">──IN──▶</span>
                  <span className="px-3 py-1.5 bg-[#0B1324] text-[#F3F0E8] border border-[#1C2B42]">DISTRICT</span>
                  <span className="text-slate-500">──PRODUCES──▶</span>
                  <span className="px-3 py-1.5 bg-[#0B1324] text-emerald-400 border border-emerald-500/30">OUTCOME</span>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-[#B78A5A]">04 / DETECT</span>
                  <h3 className="text-xl font-bold font-editorial text-[#F3F0E8]">
                    Four Core Analytical Engines
                  </h3>
                </div>
                <div className="grid sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#101A2E] border border-[#1C2B42]">
                    <span className="text-[#B78A5A] block text-sm font-bold">OVERLAP</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Identifies redundant schemes funding identical interventions.
                    </p>
                  </div>
                  <div className="p-3 bg-[#101A2E] border border-[#1C2B42]">
                    <span className="text-amber-300 block text-sm font-bold">GAP</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Pinpoints high-need districts with critically low coverage.
                    </p>
                  </div>
                  <div className="p-3 bg-[#101A2E] border border-[#1C2B42]">
                    <span className="text-rose-400 block text-sm font-bold">ANOMALY</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Flags statistical deviations in fund utilization pace.
                    </p>
                  </div>
                  <div className="p-3 bg-[#101A2E] border border-emerald-500/30">
                    <span className="text-emerald-400 block text-sm font-bold">SIGNALS</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Early implementation signals before milestone slippages compound.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-mono text-[#B78A5A]">05 / EXPLAIN</span>
                  <h3 className="text-xl font-bold font-editorial text-[#F3F0E8]">
                    Evidence-Backed Traceability
                  </h3>
                </div>
                <p className="text-xs text-[#C9C2B7] max-w-xl">
                  SUTRA never issues black-box claims. Every finding decomposes into statistical attribution factors, linked directly to source financial records.
                </p>
                <div className="p-4 bg-[#101A2E] border border-[#B78A5A]/30 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">EXPLAINABILITY PATTERN</span>
                    <span className="text-[#F3F0E8] font-bold">
                      FINDING → FACTORS → DATA → SOURCE → EVIDENCE RECORD
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-[#B78A5A]/20 text-[#B78A5A] text-[10px]">
                    AUDIT READY
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PART 4: SYSTEM CAPABILITIES & LIVE INTERACTION PORTALS */}
      <section id="capabilities" className="py-24 px-8 lg:px-14 max-w-7xl mx-auto border-t border-[#1C2B42]/60">
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#B78A5A] uppercase">
              INSTITUTIONAL CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#F3F0E8]">
              DESIGNED FOR STATUTORY DECISION-MAKERS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore the dedicated intelligence workspaces connecting geographic telemetry, graph relationships, and auditable proof chains.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Geographic Intelligence -> /map */}
            <Link
              href="/map"
              className="group p-6 rounded-none bg-[#0B1324] border border-[#1C2B42] hover:border-[#B78A5A] transition-all flex flex-col justify-between space-y-5 cursor-pointer shadow-lg hover:shadow-2xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E887E]">
                  <span className="text-cyan-400 font-semibold">01 / GEOGRAPHIC GIS</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#101A2E] border border-[#1C2B42]">LGD 512</span>
                </div>
                <h3 className="text-lg font-bold font-editorial text-[#F3F0E8] group-hover:text-[#B78A5A] transition-colors">
                  Geographic Convergence Mapping
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  36-district geospatial overlays across Maharashtra. Detect physical delivery gaps in rural tap water against housing completions.
                </p>
              </div>

              {/* Technical Visual Representation */}
              <div className="p-3 bg-[#101A2E] border border-[#1C2B42] rounded font-mono text-[10px] space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>MAHARASHTRA DISTRICTS</span>
                  <span className="text-cyan-300 font-bold">36 ACTIVE</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                  <div className="p-1 bg-[#152238] text-slate-300 border border-[#1C2B42]">NANDURBAR</div>
                  <div className="p-1 bg-[#152238] text-slate-300 border border-[#1C2B42]">GADCHIROLI</div>
                  <div className="p-1 bg-[#152238] text-slate-300 border border-[#1C2B42]">YAVATMAL</div>
                </div>
                <div className="text-[9px] text-[#8E887E] flex justify-between pt-1 border-t border-[#1C2B42]">
                  <span>PMAY-G • JJM Overlays</span>
                  <span className="text-emerald-400">OPEN GIS MAP →</span>
                </div>
              </div>
            </Link>

            {/* Card 2: Governance Graph -> /relationships */}
            <Link
              href="/relationships"
              className="group p-6 rounded-none bg-[#0B1324] border border-[#1C2B42] hover:border-[#B78A5A] transition-all flex flex-col justify-between space-y-5 cursor-pointer shadow-lg hover:shadow-2xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E887E]">
                  <span className="text-[#B78A5A] font-semibold">02 / KNOWLEDGE GRAPH</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#101A2E] border border-[#1C2B42]">MULTI-RELATIONAL</span>
                </div>
                <h3 className="text-lg font-bold font-editorial text-[#F3F0E8] group-hover:text-[#B78A5A] transition-colors">
                  Entity & Scheme Topologies
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Traverse cross-ministry linkages across policy sanctions, financial contracts, district administrations, and actual field outcomes.
                </p>
              </div>

              {/* Technical Visual Representation */}
              <div className="p-3 bg-[#101A2E] border border-[#1C2B42] rounded font-mono text-[10px] space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>GRAPH TOPOLOGY</span>
                  <span className="text-[#B78A5A] font-bold">7 NODE TYPES</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-300 px-1 py-1 bg-[#152238] border border-[#1C2B42]">
                  <span className="text-[#B78A5A]">MINISTRY</span>
                  <span>──OWNS──▶</span>
                  <span className="text-cyan-300">SCHEME</span>
                  <span>──IN──▶</span>
                  <span className="text-emerald-400">DISTRICT</span>
                </div>
                <div className="text-[9px] text-[#8E887E] flex justify-between pt-1 border-t border-[#1C2B42]">
                  <span>Bidirectional Edge Queries</span>
                  <span className="text-[#B78A5A]">EXPLORE GRAPH →</span>
                </div>
              </div>
            </Link>

            {/* Card 3: Evidence Hub -> /evidence */}
            <Link
              href="/evidence"
              className="group p-6 rounded-none bg-[#0B1324] border border-[#1C2B42] hover:border-[#B78A5A] transition-all flex flex-col justify-between space-y-5 cursor-pointer shadow-lg hover:shadow-2xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E887E]">
                  <span className="text-emerald-400 font-semibold">03 / EVIDENCE LEDGER</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#101A2E] border border-[#1C2B42]">SHA-256</span>
                </div>
                <h3 className="text-lg font-bold font-editorial text-[#F3F0E8] group-hover:text-[#B78A5A] transition-colors">
                  Source Provenance & Cryptographic Audit
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cryptographic verification linking every displayed calculation back to official PFMS, IMIS, and AwaasSoft statutory source records.
                </p>
              </div>

              {/* Technical Visual Representation */}
              <div className="p-3 bg-[#101A2E] border border-[#1C2B42] rounded font-mono text-[10px] space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>PROVENANCE REGISTRY</span>
                  <span className="text-emerald-400 font-bold">100% AUDITABLE</span>
                </div>
                <div className="p-1.5 bg-[#152238] border border-[#1C2B42] text-[9px] text-slate-300 truncate">
                  SHA256: 8a4c1f9e2b0d...official_imis_cadence
                </div>
                <div className="text-[9px] text-[#8E887E] flex justify-between pt-1 border-t border-[#1C2B42]">
                  <span>Source-Bound Verification</span>
                  <span className="text-emerald-400">INSPECT EVIDENCE →</span>
                </div>
              </div>
            </Link>

            {/* Card 4: Investigation Workspace -> /investigate */}
            <Link
              href="/investigate"
              className="group p-6 rounded-none bg-[#0B1324] border border-[#1C2B42] hover:border-[#B78A5A] transition-all flex flex-col justify-between space-y-5 cursor-pointer shadow-lg hover:shadow-2xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E887E]">
                  <span className="text-amber-400 font-semibold">04 / INVESTIGATION</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#101A2E] border border-[#1C2B42]">WHY FLAGGED?</span>
                </div>
                <h3 className="text-lg font-bold font-editorial text-[#F3F0E8] group-hover:text-[#B78A5A] transition-colors">
                  Forensic Variance Investigation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Decompose anomalies into 6-tier explainable forensic attribution factors. Zero unsupported beneficiary-level inferences.
                </p>
              </div>

              {/* Technical Visual Representation */}
              <div className="p-3 bg-[#101A2E] border border-[#1C2B42] rounded font-mono text-[10px] space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>ANALYSIS STATUS</span>
                  <span className="text-amber-300 font-bold">NANDURBAR DELTA</span>
                </div>
                <div className="flex justify-between text-[9px] p-1.5 bg-[#152238] border border-[#1C2B42] text-slate-300">
                  <span>Pace Spread: 18.4 pp</span>
                  <span className="text-rose-400 font-semibold">PMAY-G vs JJM</span>
                </div>
                <div className="text-[9px] text-[#8E887E] flex justify-between pt-1 border-t border-[#1C2B42]">
                  <span>Explainable Fact Factors</span>
                  <span className="text-amber-400">OPEN WORKSPACE →</span>
                </div>
              </div>
            </Link>

            {/* Card 5: Scheme Registers -> /schemes */}
            <Link
              href="/schemes"
              className="group p-6 rounded-none bg-[#0B1324] border border-[#1C2B42] hover:border-[#B78A5A] transition-all flex flex-col justify-between space-y-5 cursor-pointer shadow-lg hover:shadow-2xl md:col-span-2 lg:col-span-2"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E887E]">
                  <span className="text-cyan-400 font-semibold">05 / CORE PROGRAMMES</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#101A2E] border border-[#1C2B42]">3 REGISTERS</span>
                </div>
                <h3 className="text-lg font-bold font-editorial text-[#F3F0E8] group-hover:text-[#B78A5A] transition-colors">
                  Multi-Programme Harmonization Engine
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unified visibility across Jal Jeevan Mission (water), Pradhan Mantri Awaas Yojana - Gramin (rural housing), and Paramparagat Krishi Vikas Yojana (organic farming).
                </p>
              </div>

              {/* Technical Visual Representation */}
              <div className="grid sm:grid-cols-3 gap-3 font-mono text-[10px]">
                <div className="p-2.5 bg-[#101A2E] border border-[#1C2B42] space-y-1">
                  <div className="text-[#B78A5A] font-bold">JJM (WATER)</div>
                  <div className="text-[9px] text-slate-400">Ministry of Jal Shakti</div>
                  <div className="text-emerald-400 font-bold text-[9px]">Tap Connections</div>
                </div>
                <div className="p-2.5 bg-[#101A2E] border border-[#1C2B42] space-y-1">
                  <div className="text-[#B78A5A] font-bold">PMAY-G (HOUSING)</div>
                  <div className="text-[9px] text-slate-400">Ministry of Rural Dev</div>
                  <div className="text-cyan-400 font-bold text-[9px]">Pucca Dwellings</div>
                </div>
                <div className="p-2.5 bg-[#101A2E] border border-[#1C2B42] space-y-1">
                  <div className="text-[#B78A5A] font-bold">PKVY (SOIL)</div>
                  <div className="text-[9px] text-slate-400">Ministry of Agriculture</div>
                  <div className="text-amber-400 font-bold text-[9px]">Farmer Clusters</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL APEX CTA BANNER */}
      <section className="py-20 px-8 lg:px-14 max-w-4xl mx-auto text-center border-t border-[#1C2B42]/60">
        <h2 className="text-3xl font-bold font-editorial text-[#F3F0E8] mb-3">
          READY FOR APEX DECISION INTELLIGENCE
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-8">
          Step inside the SUTRA command console to evaluate live cross-ministry signals and inspect district level governance.
        </p>
        <button
          onClick={handleEnterSutra}
          className="px-8 py-4 bg-[#B78A5A] text-[#060A12] font-semibold text-sm hover:bg-[#CBB093] transition-colors shadow-2xl inline-flex items-center space-x-3 tracking-wide font-editorial cursor-pointer"
        >
          <span>ENTER SUTRA COMMAND CENTER</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1C2B42] bg-[#060A12] px-8 py-6 text-center text-xs font-mono text-[#8E887E]">
        SUTRA PLATFORM • CONNECTING PROGRAMMES. REVEALING IMPACT. • GOVERNMENT OF INDIA 2026
      </footer>
    </div>
  );
}
