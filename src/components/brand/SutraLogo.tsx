'use client';

import React from 'react';

interface SutraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export function SutraLogo({
  size = 'md',
  showWordmark = false,
  showSubtitle = false,
  className = '',
  theme = 'light',
}: SutraLogoProps) {
  const pixelSizes = {
    xs: 20,
    sm: 26,
    md: 36,
    lg: 48,
    xl: 64,
  };

  const px = pixelSizes[size] || 36;
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Minimal Geometric Emblem: Interlocking Precision Governance Threads */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Subtle geometric grid background accent */}
        <circle cx="24" cy="24" r="22" stroke={isDark ? '#263830' : '#D8D6CE'} strokeWidth="1" strokeDasharray="2 3" />
        
        {/* Primary Upper Thread (Deep Forest Green) */}
        <path
          d="M 12 18 C 12 13 18 10 24 10 C 31 10 36 14 36 20 C 36 26 28 27 24 28 C 19 29 12 31 12 37 C 12 43 18 46 25 46 C 32 46 36 43 36 38"
          stroke={isDark ? '#2E8B65' : '#164A3A'}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Geometric Intersection Thread (Muted Gold) */}
        <path
          d="M 17 24 L 31 24"
          stroke="#B58A45"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Institutional Intelligence Core (Gold Diamond Node) */}
        <rect
          x="22"
          y="22"
          width="4"
          height="4"
          transform="rotate(45 24 24)"
          fill="#B58A45"
        />

        {/* Precision Coordinate Markers */}
        <circle cx="24" cy="10" r="1.5" fill="#B58A45" />
        <circle cx="25" cy="46" r="1.5" fill={isDark ? '#5B8C78' : '#164A3A'} />
      </svg>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-semibold tracking-wider font-editorial ${
                size === 'lg' || size === 'xl' ? 'text-xl' : 'text-sm'
              } ${isDark ? 'text-[#FAF8F5]' : 'text-[#18201C]'}`}
            >
              SUTRA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B58A45]" />
          </div>
          {showSubtitle && (
            <span
              className={`text-[9px] uppercase tracking-[0.15em] font-medium ${
                isDark ? 'text-[#898E89]' : 'text-[#66706A]'
              }`}
            >
              Unified Governance Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
}
