'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useIntelligence } from '@/context/IntelligenceContext';
import {
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface TourStep {
  step: number;
  title: string;
  route: string;
  instruction: string;
  actionText?: string;
  executeAction?: (context: {
    openExplain: (params: any) => void;
    openEvidence: (id: string) => void;
  }) => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: 'Landing Story & Ingestion Pipeline',
    route: '/',
    instruction:
      'Show the core thesis: "Government doesn\'t lack data. It lacks connection." Scroll to demonstrate the 5-step pipeline.',
  },
  {
    step: 2,
    title: 'Command Center & Drawdown Velocity',
    route: '/command',
    instruction:
      'Highlight the 6 animated apex metrics: ₹2.84B total allocation, 73% fund utilization, and 12.4M verified beneficiaries.',
  },
  {
    step: 3,
    title: 'Geographic Intelligence & Nandurbar Gap',
    route: '/map',
    instruction:
      'Show 36-district Maharashtra cartography. Click Nandurbar to highlight the 36 percentage points delivery gap below benchmark.',
  },
  {
    step: 4,
    title: 'Programme Overlap Detection (82% Redundancy)',
    route: '/overlaps',
    instruction:
      'Demonstrate Scheme A (PKVY) ⇄ Scheme B (MOVCDNER) cross-programme overlap with 91% target group match.',
  },
  {
    step: 5,
    title: 'Ask SUTRA Natural Language Query',
    route: '/query',
    instruction:
      'Demonstrate natural query translation without hallucination. Click ANALYZE to run the 7-stage verification checklist.',
  },
  {
    step: 6,
    title: 'Explainable AI Attribution Breakdown',
    route: '/intelligence/gaps',
    instruction:
      'Click "Why This Insight?" to decompose confidence into 4 transparent statistical factors.',
    actionText: 'Open Nandurbar Factors',
    executeAction: ({ openExplain }) => {
      openExplain({
        title: 'Nandurbar Territorial Gap Detection',
        subtitle: 'Coverage: 28% vs Regional Benchmark: 64% (Gap: 36 pp)',
        confidence: 87,
        factors: [
          { title: 'HIGH BENEFICIARY DEMAND', weight: 26 },
          { title: 'LOW FUND UTILIZATION', weight: 31 },
          { title: 'LOW PROJECT DENSITY', weight: 22 },
          { title: 'REGIONAL DEVIATION', weight: 21 },
        ],
        evidenceRecordNumber: '#9281',
      });
    },
  },
  {
    step: 7,
    title: 'Verifiable Evidence Ledger (Record #9281)',
    route: '/evidence',
    instruction:
      'Trace insight directly to Treasury Record #9281. Prove source provenance: Union Budget / PFMS.',
    actionText: 'Inspect Record #9281',
    executeAction: ({ openEvidence }) => {
      openEvidence('#9281');
    },
  },
];

export function GuidedDemoTour() {
  const router = useRouter();
  const pathname = usePathname();
  const { openEvidence, openExplain } = useIntelligence();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const currentStep = TOUR_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      const nextStep = TOUR_STEPS[nextIdx];
      if (pathname !== nextStep.route) {
        router.push(nextStep.route);
      }
      if (nextStep.executeAction) {
        setTimeout(() => {
          nextStep.executeAction?.({ openEvidence, openExplain });
        }, 400);
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      const prevStep = TOUR_STEPS[prevIdx];
      if (pathname !== prevStep.route) {
        router.push(prevStep.route);
      }
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setIsOpen(true);
            if (pathname !== currentStep.route) {
              router.push(currentStep.route);
            }
          }}
          className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#B78A5A] text-[#0D0D0C] font-semibold text-xs shadow-2xl hover:bg-[#CBB093] transition-all border border-[#F3F0E8]/30 group"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="tracking-wide">EXECUTIVE WALKTHROUGH (3-MIN)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 bg-[#141412] border-2 border-[#B78A5A] rounded-sm shadow-2xl p-5 text-xs font-editorial space-y-3 animate-in slide-in-from-bottom-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#2A2926] pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#B78A5A] animate-ping" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#B78A5A] font-bold">
            APEX POLICY BRIEFING ({currentStep.step} / {TOUR_STEPS.length})
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[#8E887E] hover:text-[#F3F0E8] p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Title & Instruction */}
      <div className="space-y-1">
        <h3 className="font-bold text-sm text-[#F3F0E8]">{currentStep.title}</h3>
        <p className="text-[11px] text-[#C9C2B7] leading-relaxed">
          {currentStep.instruction}
        </p>
      </div>

      {/* Action Trigger button if step has specific action */}
      {currentStep.actionText && currentStep.executeAction && (
        <div>
          <button
            onClick={() =>
              currentStep.executeAction?.({ openEvidence, openExplain })
            }
            className="w-full py-1.5 px-3 rounded bg-[#191917] border border-[#B78A5A]/50 text-[#B78A5A] text-[11px] font-mono hover:bg-[#B78A5A] hover:text-[#0D0D0C] transition-colors"
          >
            ↳ {currentStep.actionText}
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2A2926] text-[11px] font-mono">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="flex items-center space-x-1 text-[#8E887E] hover:text-[#F3F0E8] disabled:opacity-30"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>PREV</span>
        </button>

        <span className="text-[10px] text-[#7E7A72]">
          ROUTE: {currentStep.route}
        </span>

        {currentStepIdx < TOUR_STEPS.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-[#B78A5A] text-[#0D0D0C] font-bold hover:bg-[#CBB093]"
          >
            <span>NEXT STEP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 rounded bg-[#5E8B72] text-[#0D0D0C] font-bold"
          >
            COMPLETE ✓
          </button>
        )}
      </div>
    </div>
  );
}
