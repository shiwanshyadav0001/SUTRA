'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Database,
  GitBranch,
  ShieldCheck,
  Search,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
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

  // CloudFront video plate URL
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
    <div className="relative min-h-screen bg-[#0D0D0C] text-[#F3F0E8] overflow-x-hidden selection:bg-[#B78A5A]/30">
      {/* FIXED FULLSCREEN STAGE */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col justify-between select-none">
        {/* Hardware-Accelerated Single Video Atmosphere (Zero GPU bottleneck) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none z-0 will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        >
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover object-right-top md:object-center-top opacity-45 filter contrast-110 brightness-75"
          />
        </div>

        {/* Directional Scrim Overlay (Ensures Left Typography is Crystal Clear) */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background:
              'linear-gradient(90deg, #0D0D0C 0%, rgba(13,13,12,0.95) 40%, rgba(13,13,12,0.70) 65%, rgba(13,13,12,0.20) 90%, transparent 100%)',
          }}
        />

        {/* TOP BAR / HEADER (One-shot entrance) */}
        <header className="relative z-20 px-8 lg:px-14 py-8 flex items-center justify-between">
          {/* Logo (t: 0.00, EXPO scale .9->1 + opacity 0->1) */}
          <div
            className={`flex items-center space-x-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
              isIntroDone ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            {/* Official SUTRA Master Logo Emblem */}
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

          {/* Top CTA Button (t: 0.28, clip-path draw) */}
          <div className="hidden lg:block">
            <button
              onClick={handleEnterSutra}
              style={{
                clipPath: isIntroDone
                  ? 'inset(0% 0% 0% 0%)'
                  : 'inset(0% 100% 0% 0%)',
                transition: 'clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.28s',
              }}
              className="px-6 py-3 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs rounded-none hover:bg-[#CBB093] transition-colors flex items-center space-x-3 group tracking-wide font-editorial"
            >
              <span>ENTER SUTRA</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Burger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 text-[#F3F0E8] border border-[#2A2926] bg-[#141412]"
            aria-label="Open menu"
          >
            <MenuIcon className="w-5 h-5 text-[#B78A5A]" />
          </button>
        </header>

        {/* HERO BODY (Left-Locked Typography & Clean Video Atmosphere) */}
        <div className="relative z-10 px-8 lg:px-14 flex-1 flex flex-col justify-center max-w-4xl">
          {/* Tagline Eyebrow */}
          <div
            className={`inline-flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-[#B78A5A] mb-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200 ${
              isIntroDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-[#B78A5A]" />
            <span>CROSS-MINISTRY GOVERNANCE INTELLIGENCE • 2026</span>
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
            className="text-base sm:text-lg text-[#C9C2B7] max-w-xl font-normal leading-relaxed mt-6 will-change-transform"
          >
            An intelligence layer connecting programmes, resources, regions and outcomes across 36 districts and central ministries.
          </p>

          {/* Hero CTA Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={handleEnterSutra}
              style={{
                clipPath: isIntroDone
                  ? 'inset(0% 0% 0% 0%)'
                  : 'inset(0% 100% 0% 0%)',
                transition: 'clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
              }}
              className="px-8 py-4 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-sm rounded-none hover:bg-[#CBB093] transition-colors shadow-2xl flex items-center space-x-3 group tracking-wide font-editorial"
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
              className="px-6 py-4 bg-[#141412] border border-[#2A2926] text-[#C9C2B7] hover:text-[#F3F0E8] hover:border-[#8E887E] text-sm rounded-none transition-colors"
            >
              SEE HOW IT WORKS
            </a>
          </div>
        </div>

        {/* BOTTOM STATS STRIP (Hardware-accelerated) */}
        <div className="relative z-10 px-8 lg:px-14 py-8 border-t border-[#2A2926]/60 bg-[#0D0D0C]/80 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                ₹2.84B
              </div>
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transition: 'opacity 0.6s ease 0.95s',
                }}
                className="text-[10px] text-[#8E887E] uppercase tracking-wider font-editorial"
              >
                TOTAL ALLOCATION
              </div>
            </div>

            {/* Vertical Rule 1 */}
            <div
              style={{
                transform: isIntroDone ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.85s',
              }}
              className="h-10 w-[1.5px] bg-gradient-to-b from-white/10 via-white/20 to-white/10 origin-center"
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
                73%
              </div>
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transition: 'opacity 0.6s ease 1.0s',
                }}
                className="text-[10px] text-[#8E887E] uppercase tracking-wider font-editorial"
              >
                FUND UTILIZATION
              </div>
            </div>

            {/* Vertical Rule 2 */}
            <div
              style={{
                transform: isIntroDone ? 'scaleY(1)' : 'scaleY(0)',
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.9s',
              }}
              className="h-10 w-[1.5px] bg-gradient-to-b from-white/10 via-white/20 to-white/10 origin-center"
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
                12.4M
              </div>
              <div
                style={{
                  opacity: isIntroDone ? 1 : 0,
                  transition: 'opacity 0.6s ease 1.05s',
                }}
                className="text-[10px] text-[#8E887E] uppercase tracking-wider font-editorial"
              >
                CITIZENS REACHED
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#7E7A72] flex items-center space-x-3">
            <span>AUDITABLE PFMS & data.gov.in FEEDS</span>
            <span>•</span>
            <span>36 MAHARASHTRA DISTRICTS</span>
          </div>
        </div>
      </section>

      {/* MOBILE FULLSCREEN MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0D0D0C] flex flex-col justify-between p-8 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#2A2926] pb-4">
            <span className="font-mono text-xs text-[#B78A5A] uppercase tracking-widest">
              SUTRA NAVIGATION
            </span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 border border-[#2A2926] text-[#C9C2B7]"
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
            <Link
              href="/command"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              03 Command Center
            </Link>
            <Link
              href="/map"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              04 Geographic Intelligence
            </Link>
            <Link
              href="/query"
              onClick={() => setIsMenuOpen(false)}
              className="block text-[#F3F0E8] hover:text-[#B78A5A]"
            >
              05 Ask SUTRA
            </Link>
          </div>

          <div className="pt-4 border-t border-[#2A2926]">
            <button
              onClick={handleEnterSutra}
              className="w-full py-4 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-sm"
            >
              ENTER SUTRA CONSOLE →
            </button>
          </div>
        </div>
      )}

      {/* PART 2: THE PROBLEM STORY (Scroll Storytelling) */}
      <section id="problem" className="py-28 px-8 lg:px-14 max-w-5xl mx-auto border-t border-[#2A2926]/60">
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
            <div className="p-6 rounded-none bg-[#141412] border border-[#2A2926] space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8E887E] font-mono">
                <span>BEFORE: FRAGMENTED SILOS</span>
                <span className="text-[#A66A62]">NO INTEROPERABILITY</span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                {['SCHEMES', 'FINANCE', 'PROJECTS', 'GEOGRAPHY', 'BENEFICIARIES', 'OUTCOMES'].map(
                  (item, i) => (
                    <div
                      key={item}
                      className="p-3 bg-[#191917] border border-[#2A2926] text-center text-[#8E887E]"
                    >
                      <div className="text-[10px] text-[#7E7A72] block">SILO 0{i + 1}</div>
                      <div className="font-semibold text-[#C9C2B7]">{item}</div>
                    </div>
                  )
                )}
              </div>
              <p className="text-[11px] text-[#8E887E] leading-relaxed">
                Ministries cannot detect if identical target farmers in Nandurbar are receiving duplicate subsidies while basic infrastructure remains un-funded.
              </p>
            </div>

            {/* Connected State */}
            <div className="p-6 rounded-none bg-[#191917] border border-[#B78A5A]/50 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-[#8E887E] font-mono">
                <span className="text-[#B78A5A] font-semibold">WITH SUTRA: UNIFIED GRAPH</span>
                <span className="text-[#5E8B72]">CANONICAL LINKAGE</span>
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
                    <div className="p-2.5 bg-[#141412] border border-[#2A2926] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-[#B78A5A]" />
                        <span className="font-bold text-[#F3F0E8]">{node.label}</span>
                      </div>
                      <span className="text-[10px] text-[#8E887E]">{node.note}</span>
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
      <section id="architecture" className="py-28 px-8 lg:px-14 max-w-5xl mx-auto border-t border-[#2A2926]/60">
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
                className={`px-4 py-2 text-xs font-mono transition-all rounded-none ${
                  activeStep === step.id
                    ? 'bg-[#B78A5A] text-[#0D0D0C] font-bold shadow'
                    : 'bg-[#191917] text-[#8E887E] border border-[#2A2926] hover:text-[#C9C2B7]'
                }`}
              >
                {step.num} {step.title}
              </button>
            ))}
          </div>

          <div className="p-8 bg-[#141412] border border-[#2A2926] min-h-[320px] flex flex-col justify-center">
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
                        className="p-3 bg-[#191917] border border-[#2A2926] text-center"
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
                <div className="p-4 bg-[#191917] border border-[#2A2926] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] text-[#7E7A72] block">RAW UNSTRUCTURED STRINGS</span>
                    <div className="text-[#8E887E]">&quot;MH&quot;</div>
                    <div className="text-[#8E887E]">&quot;Maharastra&quot;</div>
                    <div className="text-[#8E887E]">&quot;Maharashtra State&quot;</div>
                  </div>
                  <div className="text-[#B78A5A] text-lg font-bold">→ SUTRA RESOLUTION →</div>
                  <div className="p-3 bg-[#141412] border border-[#5E8B72]/40 text-center">
                    <span className="text-[10px] text-[#5E8B72] block">CANONICAL ENTITY</span>
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
                <div className="p-4 bg-[#191917] border border-[#2A2926] font-mono text-xs flex flex-wrap justify-between items-center gap-2">
                  <span className="px-3 py-1.5 bg-[#141412] text-[#B78A5A] border border-[#2A2926]">MINISTRY</span>
                  <span className="text-[#8E887E]">──OWNS──▶</span>
                  <span className="px-3 py-1.5 bg-[#141412] text-[#F3F0E8] border border-[#2A2926]">SCHEME</span>
                  <span className="text-[#8E887E]">──FUNDS──▶</span>
                  <span className="px-3 py-1.5 bg-[#141412] text-[#B78A5A] border border-[#2A2926]">PROJECT</span>
                  <span className="text-[#8E887E]">──IN──▶</span>
                  <span className="px-3 py-1.5 bg-[#141412] text-[#F3F0E8] border border-[#2A2926]">DISTRICT</span>
                  <span className="text-[#8E887E]">──PRODUCES──▶</span>
                  <span className="px-3 py-1.5 bg-[#141412] text-[#5E8B72] border border-[#5E8B72]/30">OUTCOME</span>
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
                  <div className="p-3 bg-[#191917] border border-[#2A2926]">
                    <span className="text-[#B78A5A] block text-sm font-bold">OVERLAP</span>
                    <p className="text-[11px] text-[#8E887E] mt-1">
                      Identifies redundant schemes funding identical interventions.
                    </p>
                  </div>
                  <div className="p-3 bg-[#191917] border border-[#2A2926]">
                    <span className="text-[#B59A63] block text-sm font-bold">GAP</span>
                    <p className="text-[11px] text-[#8E887E] mt-1">
                      Pinpoints high-need districts with critically low coverage.
                    </p>
                  </div>
                  <div className="p-3 bg-[#191917] border border-[#2A2926]">
                    <span className="text-[#A66A62] block text-sm font-bold">ANOMALY</span>
                    <p className="text-[11px] text-[#8E887E] mt-1">
                      Flags statistical deviations in fund utilization pace.
                    </p>
                  </div>
                  <div className="p-3 bg-[#191917] border border-[#5E8B72] block text-sm font-bold">
                    <span className="text-[#5E8B72] block text-sm font-bold">SIGNALS</span>
                    <p className="text-[11px] text-[#8E887E] mt-1">
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
                <div className="p-4 bg-[#191917] border border-[#B78A5A]/30 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#8E887E] uppercase block">EXPLAINABILITY PATTERN</span>
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

      {/* FINAL APEX CTA BANNER */}
      <section className="py-20 px-8 lg:px-14 max-w-4xl mx-auto text-center border-t border-[#2A2926]/60">
        <h2 className="text-3xl font-bold font-editorial text-[#F3F0E8] mb-3">
          READY FOR APEX DECISION INTELLIGENCE
        </h2>
        <p className="text-xs sm:text-sm text-[#8E887E] max-w-lg mx-auto mb-8">
          Step inside the SUTRA command console to evaluate live cross-ministry signals and inspect district level governance.
        </p>
        <button
          onClick={handleEnterSutra}
          className="px-8 py-4 bg-[#B78A5A] text-[#0D0D0C] font-semibold text-sm hover:bg-[#CBB093] transition-colors shadow-2xl inline-flex items-center space-x-3 tracking-wide font-editorial"
        >
          <span>ENTER SUTRA COMMAND CENTER</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2A2926] px-8 py-6 text-center text-xs font-mono text-[#7E7A72]">
        SUTRA PLATFORM • CONNECTING PROGRAMMES. REVEALING IMPACT. • GOVERNMENT OF INDIA 2026
      </footer>
    </div>
  );
}
