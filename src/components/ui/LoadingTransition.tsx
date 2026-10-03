'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SutraLogo } from '@/components/brand/SutraLogo';

interface LoadingTransitionProps {
  onComplete?: () => void;
  destinationRoute?: string;
}

export function LoadingTransition({
  onComplete,
  destinationRoute = '/command',
}: LoadingTransitionProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('RESOLVING ENTITIES...');
  const [isReady, setIsReady] = useState(false);
  const hasFinishedRef = useRef(false);

  const finishTransition = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (onComplete) {
      onComplete();
    } else {
      router.push(destinationRoute);
    }
  };

  useEffect(() => {
    // Stage 1: Ministries & Schemes initialization
    const t1 = setTimeout(() => {
      setStep(1);
      setStatusMessage('RESOLVING ENTITIES...');
    }, 400);

    // Stage 2: Geography & Finance
    const t2 = setTimeout(() => {
      setStep(2);
      setStatusMessage('BUILDING RELATIONSHIPS...');
    }, 1000);

    // Stage 3: Outcomes & Source Verification
    const t3 = setTimeout(() => {
      setStep(3);
      setStatusMessage('VERIFYING SOURCES...');
    }, 1600);

    // Stage 4: SUTRA READY
    const t4 = setTimeout(() => {
      setStep(5);
      setIsReady(true);
    }, 2300);

    // Stage 5: Enter destination
    const t5 = setTimeout(() => {
      finishTransition();
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [router, destinationRoute, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0D3026] flex flex-col items-center justify-center p-6 text-[#F4F2EC] select-none overflow-hidden">
      {/* Subtle procedural grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#B58A45 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md flex flex-col items-center relative z-10 space-y-6">
        {/* SUTRA Logo */}
        <div className="flex flex-col items-center space-y-3">
          <SutraLogo size="lg" theme="dark" />
          <h2 className="text-2xl font-bold tracking-widest text-[#FAF8F5] font-editorial uppercase">
            SUTRA
          </h2>
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#B58A45] uppercase font-semibold">
            INITIALIZING GOVERNANCE INTELLIGENCE
          </p>
        </div>

        {/* 5 Technical Checkpoints: MINISTRIES ✓, SCHEMES ✓, GEOGRAPHY ✓, FINANCE ✓, OUTCOMES ✓ */}
        <div className="w-full bg-[#081F19] border border-[#164A3A] rounded p-4 font-mono text-xs space-y-2.5">
          <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
            <div
              className={`p-2 rounded border transition-all ${
                step >= 1
                  ? 'border-[#28704D] bg-[#164A3A]/40 text-[#FAF8F5]'
                  : 'border-[#164A3A]/40 text-[#898E89]'
              }`}
            >
              <div>MINISTRIES</div>
              <div className="mt-1 font-bold">{step >= 1 ? '✓' : '...'}</div>
            </div>

            <div
              className={`p-2 rounded border transition-all ${
                step >= 1
                  ? 'border-[#28704D] bg-[#164A3A]/40 text-[#FAF8F5]'
                  : 'border-[#164A3A]/40 text-[#898E89]'
              }`}
            >
              <div>SCHEMES</div>
              <div className="mt-1 font-bold">{step >= 1 ? '✓' : '...'}</div>
            </div>

            <div
              className={`p-2 rounded border transition-all ${
                step >= 2
                  ? 'border-[#28704D] bg-[#164A3A]/40 text-[#FAF8F5]'
                  : 'border-[#164A3A]/40 text-[#898E89]'
              }`}
            >
              <div>GEOGRAPHY</div>
              <div className="mt-1 font-bold">{step >= 2 ? '✓' : '...'}</div>
            </div>

            <div
              className={`p-2 rounded border transition-all ${
                step >= 2
                  ? 'border-[#28704D] bg-[#164A3A]/40 text-[#FAF8F5]'
                  : 'border-[#164A3A]/40 text-[#898E89]'
              }`}
            >
              <div>FINANCE</div>
              <div className="mt-1 font-bold">{step >= 2 ? '✓' : '...'}</div>
            </div>

            <div
              className={`p-2 rounded border transition-all ${
                step >= 3
                  ? 'border-[#28704D] bg-[#164A3A]/40 text-[#FAF8F5]'
                  : 'border-[#164A3A]/40 text-[#898E89]'
              }`}
            >
              <div>OUTCOMES</div>
              <div className="mt-1 font-bold">{step >= 3 ? '✓' : '...'}</div>
            </div>
          </div>

          {/* Procedural Process Line: RESOLVING ENTITIES... BUILDING RELATIONSHIPS... VERIFYING SOURCES... */}
          <div className="pt-2 border-t border-[#164A3A] flex items-center justify-between text-[11px]">
            <span className="text-[#898E89]">STATUS:</span>
            <span className="font-semibold text-[#B58A45] tracking-wider font-mono">
              {isReady ? 'ALL ENCLAVES CONNECTED' : statusMessage}
            </span>
          </div>
        </div>

        {/* SUTRA READY Final Status Indicator */}
        <div className="text-center pt-2">
          {isReady ? (
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#28704D] bg-[#081F19] px-4 py-1.5 rounded border border-[#28704D] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#28704D]" />
              <span>SUTRA READY</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono text-[#B58A45] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B58A45] animate-pulse" />
              <span>COMPUTING CONVERGENCE VECTORS</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
