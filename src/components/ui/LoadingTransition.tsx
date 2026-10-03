'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
  const [ready, setReady] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    // Stage 1: Ministries thread synchronization
    const t1 = setTimeout(() => setStep(1), 500);
    // Stage 2: Schemes and cross-ministerial overlap detection
    const t2 = setTimeout(() => setStep(2), 1200);
    // Stage 3: Geographic project telemetry
    const t3 = setTimeout(() => setStep(3), 2000);
    // Stage 4: District outcome convergence
    const t4 = setTimeout(() => setStep(4), 2800);
    // Stage 5: Ready flag
    const t5 = setTimeout(() => {
      setReady(true);
      setStep(5);
    }, 3400);

    // Fallback safety timeout if onEnded doesn't trigger
    const tFallback = setTimeout(() => {
      finishTransition();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tFallback);
    };
  }, [router, destinationRoute, onComplete]);

  // Ensure video autoplays smoothly
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: still proceed with timer
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col items-center justify-center p-6 text-[#F3F0E8] select-none overflow-hidden">
      <div className="w-full max-w-lg flex flex-col items-center relative z-10">
        {/* Seamless Authentic SUTRA Video Element - Pure black blend, zero box/rectangle outline */}
        <div className="relative w-full max-w-[480px] aspect-video flex items-center justify-center overflow-hidden bg-[#000000]">
          <video
            ref={videoRef}
            src="/sutra.mp4"
            autoPlay
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => setIsVideoLoaded(true)}
            onEnded={() => {
              setReady(true);
              setTimeout(finishTransition, 250);
            }}
            onContextMenu={(e) => e.preventDefault()}
            className={`w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              outline: 'none',
              border: 'none',
              boxShadow: 'none',
              backgroundColor: '#000000',
            }}
          />
        </div>

        {/* Dynamic Governance Node Weaving Status */}
        <div className="w-full max-w-sm space-y-3 font-mono text-xs mt-4">
          <div className="flex items-center justify-between text-[11px] border-b border-[#2A2926] pb-2">
            <span className="text-[#8E887E] tracking-wider">GOVERNANCE KNOWLEDGE GRAPH</span>
            <span className={ready ? 'text-[#5E8B72] font-bold' : 'text-[#B78A5A]'}>
              {ready ? 'SYNCHRONIZED (100%)' : 'SYNCHRONIZING...'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
            <div
              className={`p-2 rounded border transition-colors duration-300 ${
                step >= 1
                  ? 'border-[#B78A5A] text-[#F3F0E8] bg-[#141412]'
                  : 'border-[#2A2926] text-[#7E7A72] bg-[#0A0A0A]'
              }`}
            >
              <span>MINISTRIES</span>
            </div>
            <div
              className={`p-2 rounded border transition-colors duration-300 ${
                step >= 2
                  ? 'border-[#B78A5A] text-[#F3F0E8] bg-[#141412]'
                  : 'border-[#2A2926] text-[#7E7A72] bg-[#0A0A0A]'
              }`}
            >
              <span>SCHEMES</span>
            </div>
            <div
              className={`p-2 rounded border transition-colors duration-300 ${
                step >= 3
                  ? 'border-[#B78A5A] text-[#F3F0E8] bg-[#141412]'
                  : 'border-[#2A2926] text-[#7E7A72] bg-[#0A0A0A]'
              }`}
            >
              <span>PROJECTS</span>
            </div>
            <div
              className={`p-2 rounded border transition-colors duration-300 ${
                step >= 4
                  ? 'border-[#5E8B72] text-[#5E8B72] bg-[#141412]'
                  : 'border-[#2A2926] text-[#7E7A72] bg-[#0A0A0A]'
              }`}
            >
              <span>DISTRICTS</span>
            </div>
          </div>

          {/* SUTRA READY APEX INDICATOR */}
          <div className="pt-2 text-center">
            {ready ? (
              <span className="inline-flex items-center space-x-2 text-[11px] text-[#5E8B72] font-bold tracking-widest uppercase animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#5E8B72]" />
                <span>SUTRA READY — ENTERING COMMAND CONSOLE</span>
              </span>
            ) : (
              <span className="text-[10px] text-[#7E7A72] tracking-wider uppercase">
                Weaving cross-ministerial intelligence threads...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

