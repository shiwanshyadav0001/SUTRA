'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SutraAnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  autoStart?: boolean;
  onAnimationComplete?: () => void;
  interactiveMagnet?: boolean;
  showTagline?: boolean;
  emblemOnly?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export function SutraAnimatedLogo({
  size = 'md',
  autoStart = true,
  onAnimationComplete,
  interactiveMagnet = true,
  showTagline = true,
  emblemOnly = false,
  className = '',
  theme = 'dark',
}: SutraAnimatedLogoProps) {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationStage, setAnimationStage] = useState<
    'idle' | 'threads' | 'nodes' | 'wordmark' | 'divider' | 'tagline' | 'settled'
  >('idle');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Dimension scaling
  const scaleMap = {
    sm: { width: emblemOnly ? 40 : 140, height: emblemOnly ? 40 : 110 },
    md: { width: emblemOnly ? 80 : 280, height: emblemOnly ? 80 : 220 },
    lg: { width: emblemOnly ? 160 : 440, height: emblemOnly ? 160 : 350 },
    hero: { width: emblemOnly ? 240 : 520, height: emblemOnly ? 240 : 420 },
  };

  const currentScale = scaleMap[size];

  // Start sequence
  useEffect(() => {
    if (!autoStart) return;

    const tStart = setTimeout(() => {
      setAnimationStarted(true);
      setAnimationStage('threads');
    }, 50);

    const tNodes = setTimeout(() => setAnimationStage('nodes'), 900);
    const tWordmark = setTimeout(() => setAnimationStage('wordmark'), 1300);
    const tDivider = setTimeout(() => setAnimationStage('divider'), 1900);
    const tTagline = setTimeout(() => setAnimationStage('tagline'), 2200);
    const tSettled = setTimeout(() => {
      setAnimationStage('settled');
      if (onAnimationComplete) onAnimationComplete();
    }, 3000);

    return () => {
      clearTimeout(tStart);
      clearTimeout(tNodes);
      clearTimeout(tWordmark);
      clearTimeout(tDivider);
      clearTimeout(tTagline);
      clearTimeout(tSettled);
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
      x: Math.max(-2.5, Math.min(2.5, deltaX * 2.5)),
      y: Math.max(-2.5, Math.min(2.5, deltaY * 2.5)),
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#F3F0E8' : '#0D0D0C';
  const subtextColor = isDarkMode ? '#C9C2B7' : '#4A4844';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{
        width: currentScale.width,
        height: emblemOnly ? currentScale.height : showTagline ? currentScale.height : currentScale.height * 0.8,
      }}
    >
      <svg
        viewBox={emblemOnly ? '195 20 210 240' : '0 0 600 490'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <defs>
          {/* Copper Ribbon Gradient */}
          <linearGradient id="sutraCopperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C9975E" />
            <stop offset="35%" stopColor="#B78A5A" />
            <stop offset="70%" stopColor="#8A5E35" />
            <stop offset="100%" stopColor="#D9AD70" />
          </linearGradient>

          {/* Charcoal companion gradient */}
          <linearGradient id="sutraDarkThreadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2A26" />
            <stop offset="50%" stopColor="#181816" />
            <stop offset="100%" stopColor="#3A3833" />
          </linearGradient>

          {/* Gold highlight filament gradient */}
          <linearGradient id="sutraGoldFilament" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5C287" />
            <stop offset="50%" stopColor="#B78A5A" />
            <stop offset="100%" stopColor="#D3A66A" />
          </linearGradient>

          {/* Node subtle micro-glow filter */}
          <filter id="nodeMicroGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* GROUP 1: THE LIVING "S" SUTRA THREADS & RIBBONS          */}
        {/* ======================================================== */}
        <g className="sutra-emblem-group" transform="translate(300, 130)">
          <g className={animationStage === 'settled' ? 'animate-subtle-drift' : ''}>
            {/* THREAD 1: PRIMARY COPPER SWEEPING S-RIBBON */}
            <path
              d="M 22 -95
                 C 2 -65, -38 -20, -46 22
                 C -54 62, -26 88, 5 102
                 C -18 100, -32 82, -28 52
                 C -22 15, 12 -28, 30 -62
                 C 38 -80, 32 -90, 22 -95 Z"
              fill="url(#sutraCopperGrad)"
              className="sutra-ribbon-fill"
              style={{
                opacity: animationStarted ? 1 : 0,
                transform: animationStarted ? 'scale(1)' : 'scale(0.85)',
                transformOrigin: '0 0',
                transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* THREAD 1 DRAW STROKE */}
            <path
              d="M 25 -95 C -10 -50, -50 -10, -45 35 C -40 80, -10 100, 5 105"
              fill="none"
              stroke="url(#sutraCopperGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              className="sutra-thread-copper"
              style={{
                strokeDasharray: 320,
                strokeDashoffset: animationStarted ? 0 : 320,
                transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.0s',
              }}
            />

            {/* THREAD 2: CHARCOAL WEAVE (0.15s Staggered draw) */}
            <path
              d="M 12 -75 C -15 -35, -15 15, 15 45 C 38 68, 32 98, 12 115"
              fill="none"
              stroke="url(#sutraDarkThreadGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              className="sutra-thread-charcoal"
              style={{
                strokeDasharray: 280,
                strokeDashoffset: animationStarted ? 0 : 280,
                transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
              }}
            />

            {/* THREAD 3: FINE GOLDEN FILAMENT (0.30s Staggered draw) */}
            <path
              d="M 28 -95 C 10 -40, 25 15, 42 55 C 55 85, 45 108, 15 120"
              fill="none"
              stroke="url(#sutraGoldFilament)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="sutra-thread-gold"
              style={{
                strokeDasharray: 300,
                strokeDashoffset: animationStarted ? 0 : 300,
                transition: 'stroke-dashoffset 1.15s cubic-bezier(0.16, 1, 0.3, 1) 0.30s',
              }}
            />

            {/* THREAD 3B: SECONDARY GOLD FILAMENT LOOP */}
            <path
              d="M -35 25 C -10 60, 20 80, 52 70"
              fill="none"
              stroke="url(#sutraGoldFilament)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              style={{
                opacity: animationStarted ? 0.75 : 0,
                transition: 'opacity 0.8s ease 0.6s',
              }}
            />

            {/* CONSTELLATION NETWORK NODES */}
            {/* NODE 1: TOP TIP BEAD */}
            <g
              transform="translate(26, -96)"
              style={{
                opacity: animationStage !== 'idle' && animationStage !== 'threads' ? 1 : 0,
                transform:
                  animationStage !== 'idle' && animationStage !== 'threads'
                    ? 'scale(1)'
                    : 'scale(0.2)',
                transformOrigin: '26px -96px',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s, opacity 0.3s ease 0.9s',
              }}
            >
              <circle cx="0" cy="0" r="7.5" fill="#B78A5A" filter="url(#nodeMicroGlow)" />
              <circle cx="-1.5" cy="-1.5" r="2.5" fill="#F3F0E8" opacity="0.6" />
            </g>

            {/* NODE 2: INNER UPPER EMBED */}
            <g
              transform="translate(-2, -42)"
              style={{
                opacity: animationStage !== 'idle' && animationStage !== 'threads' ? 1 : 0,
                transform:
                  animationStage !== 'idle' && animationStage !== 'threads'
                    ? 'scale(1)'
                    : 'scale(0.2)',
                transformOrigin: '-2px -42px',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1.05s, opacity 0.3s ease 1.05s',
              }}
            >
              <circle cx="0" cy="0" r="5" fill="#1C1B18" stroke="#B78A5A" strokeWidth="1.5" />
            </g>

            {/* NODE 3: MID-LEFT NODE */}
            <g
              transform="translate(-44, 26)"
              style={{
                opacity: animationStage !== 'idle' && animationStage !== 'threads' ? 1 : 0,
                transform:
                  animationStage !== 'idle' && animationStage !== 'threads'
                    ? 'scale(1)'
                    : 'scale(0.2)',
                transformOrigin: '-44px 26px',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1.12s, opacity 0.3s ease 1.12s',
              }}
            >
              <circle cx="0" cy="0" r="5.5" fill="#141412" stroke="#B78A5A" strokeWidth="2" />
              <circle cx="0" cy="0" r="2" fill="#B78A5A" />
            </g>

            {/* NODE 4: MID-RIGHT FILAMENT NODE */}
            <g
              transform="translate(48, 68)"
              style={{
                opacity: animationStage !== 'idle' && animationStage !== 'threads' ? 1 : 0,
                transform:
                  animationStage !== 'idle' && animationStage !== 'threads'
                    ? 'scale(1)'
                    : 'scale(0.2)',
                transformOrigin: '48px 68px',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1.18s, opacity 0.3s ease 1.18s',
              }}
            >
              <circle cx="0" cy="0" r="6" fill="#B78A5A" filter="url(#nodeMicroGlow)" />
              <circle cx="-1.2" cy="-1.2" r="2" fill="#F3F0E8" opacity="0.6" />
            </g>

            {/* NODE 5: BOTTOM TERMINATION BEAD */}
            <g
              transform="translate(-14, 122)"
              style={{
                opacity: animationStage !== 'idle' && animationStage !== 'threads' ? 1 : 0,
                transform:
                  animationStage !== 'idle' && animationStage !== 'threads'
                    ? 'scale(1)'
                    : 'scale(0.2)',
                transformOrigin: '-14px 122px',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 1.25s, opacity 0.3s ease 1.25s',
              }}
            >
              <circle cx="0" cy="0" r="8" fill="#B78A5A" filter="url(#nodeMicroGlow)" />
              <circle cx="-1.8" cy="-1.8" r="2.8" fill="#F3F0E8" opacity="0.65" />
            </g>
          </g>
        </g>

        {/* RENDER WORDMARK, DIVIDER & TAGLINE ONLY IF NOT emblemOnly */}
        {!emblemOnly && (
          <>
            {/* GROUP 3: "S U T R A" WORDMARK */}
            <g
              transform="translate(300, 330)"
              style={{
                clipPath:
                  animationStage === 'wordmark' ||
                  animationStage === 'divider' ||
                  animationStage === 'tagline' ||
                  animationStage === 'settled'
                    ? 'inset(0% 0% 0% 0%)'
                    : 'inset(0% 100% 0% 0%)',
                transition: 'clip-path 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <g transform="translate(-180, 0)">
                <path
                  d="M 38 -2 C 34 16, 2 -5, -4 14 C -8 28, 14 36, 36 34"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <path
                  d="M 72 -6 L 72 20 C 72 38, 108 38, 108 20 L 108 -6"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <path
                  d="M 136 -6 L 194 -6 M 165 -6 L 165 38"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="9"
                  strokeLinecap="square"
                />
                <path
                  d="M 224 38 L 224 -6 L 254 -6 C 274 -6, 274 16, 254 16 L 224 16 M 248 16 L 276 38"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="9"
                  strokeLinecap="square"
                />
                <path
                  d="M 304 38 L 334 -6 L 364 38"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="9"
                  strokeLinecap="square"
                />
                {/* Golden dot inside A */}
                <circle
                  cx="334"
                  cy="20"
                  r="6.5"
                  fill="#B78A5A"
                  filter="url(#nodeMicroGlow)"
                  style={{
                    opacity:
                      animationStage === 'wordmark' ||
                      animationStage === 'divider' ||
                      animationStage === 'tagline' ||
                      animationStage === 'settled'
                        ? 1
                        : 0,
                    transform:
                      animationStage === 'wordmark' ||
                      animationStage === 'divider' ||
                      animationStage === 'tagline' ||
                      animationStage === 'settled'
                        ? 'scale(1)'
                        : 'scale(0)',
                    transformOrigin: '334px 20px',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 0.3s ease 0.3s',
                  }}
                />
              </g>
            </g>

            {/* GROUP 4: CENTER OUTWARD EXPANDING DIVIDER */}
            <g transform="translate(300, 395)">
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#B78A5A"
                style={{
                  opacity:
                    animationStage === 'divider' ||
                    animationStage === 'tagline' ||
                    animationStage === 'settled'
                      ? 1
                      : 0,
                  transform:
                    animationStage === 'divider' ||
                    animationStage === 'tagline' ||
                    animationStage === 'settled'
                      ? 'scale(1)'
                      : 'scale(0)',
                  transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
                }}
              />
              <line
                x1="-14"
                y1="0"
                x2="-75"
                y2="0"
                stroke="#B78A5A"
                strokeWidth="1.2"
                strokeOpacity="0.75"
                style={{
                  strokeDasharray: 65,
                  strokeDashoffset:
                    animationStage === 'divider' ||
                    animationStage === 'tagline' ||
                    animationStage === 'settled'
                      ? 0
                      : 65,
                  transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              <line
                x1="14"
                y1="0"
                x2="75"
                y2="0"
                stroke="#B78A5A"
                strokeWidth="1.2"
                strokeOpacity="0.75"
                style={{
                  strokeDasharray: 65,
                  strokeDashoffset:
                    animationStage === 'divider' ||
                    animationStage === 'tagline' ||
                    animationStage === 'settled'
                      ? 0
                      : 65,
                  transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </g>

            {/* GROUP 5: TAGLINE */}
            {showTagline && (
              <g
                transform="translate(300, 435)"
                style={{
                  opacity:
                    animationStage === 'tagline' || animationStage === 'settled' ? 1 : 0,
                  transform:
                    animationStage === 'tagline' || animationStage === 'settled'
                      ? 'translateY(0px)'
                      : 'translateY(10px)',
                  transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fill={subtextColor}
                  fontSize="14.5"
                  fontFamily="Space Grotesk, sans-serif"
                  letterSpacing="7.5"
                  fontWeight="400"
                >
                  UNIFIED GOVERNANCE
                </text>
                <text
                  x="0"
                  y="22"
                  textAnchor="middle"
                  fill={subtextColor}
                  fontSize="12.5"
                  fontFamily="Space Grotesk, sans-serif"
                  letterSpacing="8.5"
                  fontWeight="400"
                >
                  INTELLIGENCE PLATFORM
                </text>
              </g>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
