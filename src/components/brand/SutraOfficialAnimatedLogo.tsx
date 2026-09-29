'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface SutraOfficialAnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  autoStart?: boolean;
  onAnimationComplete?: () => void;
  interactiveMagnet?: boolean;
  emblemOnly?: boolean;
  className?: string;
}

export function SutraOfficialAnimatedLogo({
  size = 'md',
  autoStart = true,
  onAnimationComplete,
  interactiveMagnet = true,
  emblemOnly = false,
  className = '',
}: SutraOfficialAnimatedLogoProps) {
  const [stage, setStage] = useState<'idle' | 'emblem' | 'wordmark' | 'divider' | 'tagline' | 'settled'>('idle');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Exact dimension maps for full logo and emblem-only
  const dimensions = {
    sm: emblemOnly ? { w: 38, h: 38 } : { w: 140, h: 140 },
    md: emblemOnly ? { w: 72, h: 72 } : { w: 280, h: 280 },
    lg: emblemOnly ? { w: 120, h: 120 } : { w: 380, h: 380 },
    hero: emblemOnly ? { w: 180, h: 180 } : { w: 460, h: 460 },
  }[size];

  useEffect(() => {
    if (!autoStart) {
      setStage('settled');
      return;
    }

    // Choreographed timeline matching user's spec
    const t0 = setTimeout(() => setStage('emblem'), 80);      // 0.0s: S-Emblem weaves in
    const t1 = setTimeout(() => setStage('wordmark'), 1200);   // 1.2s: SUTRA wordmark reveals
    const t2 = setTimeout(() => setStage('divider'), 1900);    // 1.9s: Center divider expands
    const t3 = setTimeout(() => setStage('tagline'), 2300);    // 2.3s: Tagline slides in
    const t4 = setTimeout(() => {
      setStage('settled');
      if (onAnimationComplete) onAnimationComplete();
    }, 3200);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [autoStart, onAnimationComplete]);

  // Subtle interactive magnet effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveMagnet || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setMouseOffset({
      x: Math.max(-3, Math.min(3, deltaX * 3)),
      y: Math.max(-3, Math.min(3, deltaY * 3)),
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // IF EMBLEM ONLY (for topbar, header, sidebar):
  if (emblemOnly) {
    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative inline-flex items-center justify-center select-none overflow-hidden ${className}`}
        style={{
          width: dimensions.w,
          height: dimensions.h,
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div
          className={`relative w-full h-full flex items-center justify-center ${
            stage === 'settled' ? 'animate-subtle-drift' : ''
          }`}
          style={{
            opacity: stage !== 'idle' ? 1 : 0,
            transform: stage !== 'idle' ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* S-Emblem crop: perfectly centered on Parliament Dome, Tiranga and 3D Ribbon */}
          <div
            className="w-full h-full relative"
            style={{
              backgroundImage: 'url(/images/sutra-official-logo.png)',
              backgroundSize: '135% auto',
              backgroundPosition: 'center 18%',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 2px 10px rgba(183, 138, 90, 0.35))',
            }}
          />
        </div>
      </div>
    );
  }

  // FULL OFFICIAL LOGO CHOREOGRAPHY
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{
        width: dimensions.w,
        height: dimensions.h,
        transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {/* Golden Aura Glow Backdrop */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle at 50% 35%, rgba(183, 138, 90, 0.22) 0%, rgba(183, 138, 90, 0.05) 45%, transparent 70%)',
          opacity: stage !== 'idle' ? 1 : 0,
        }}
      />

      <div
        className={`relative w-full h-full flex items-center justify-center ${
          stage === 'settled' ? 'animate-subtle-drift' : ''
        }`}
      >
        {/* STAGE 1: S-EMBLEM (Top 65% - 3D Ribbon, Parliament Dome, Nodes) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'inset(0% 0% 35% 0%)',
            opacity: stage !== 'idle' ? 1 : 0,
            transform: stage !== 'idle' ? 'scale(1)' : 'scale(0.88)',
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sutra-official-logo.png"
            alt="SUTRA Emblem"
            className="w-full h-full object-contain filter drop-shadow(0 4px 18px rgba(183, 138, 90, 0.3))"
          />
        </div>

        {/* STAGE 2: S U T R A WORDMARK (65% to 83% - Left-to-Right Mask Reveal) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath:
              stage === 'wordmark' || stage === 'divider' || stage === 'tagline' || stage === 'settled'
                ? 'inset(65% 0% 17% 0%)'
                : 'inset(65% 100% 17% 0%)',
            opacity:
              stage === 'wordmark' || stage === 'divider' || stage === 'tagline' || stage === 'settled'
                ? 1
                : 0,
            transition: 'clip-path 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sutra-official-logo.png"
            alt="SUTRA Wordmark"
            className="w-full h-full object-contain filter drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5))"
          />
        </div>

        {/* STAGE 3: CENTER DIVIDER & TAGLINE (83% to 100% - Center-outward expansion & fade-up) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: 'inset(83% 0% 0% 0%)',
            opacity: stage === 'divider' || stage === 'tagline' || stage === 'settled' ? 1 : 0,
            transform:
              stage === 'tagline' || stage === 'settled'
                ? 'translateY(0px)'
                : 'translateY(8px)',
            transition:
              'opacity 0.65s ease, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sutra-official-logo.png"
            alt="UNIFIED GOVERNANCE INTELLIGENCE PLATFORM"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
