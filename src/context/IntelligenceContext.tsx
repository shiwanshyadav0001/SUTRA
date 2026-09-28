'use client';

import React, { createContext, useContext, useState } from 'react';
import { EvidenceRecord, District, Scheme } from '@/lib/types';
import { EVIDENCE_RECORDS, MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import { EvidenceDrawer } from '@/components/ui/EvidenceDrawer';
import { ExplainabilityModal } from '@/components/ui/ExplainabilityModal';
import { EngineSpecModal } from '@/components/modals/EngineSpecModal';
import { ExecutiveBriefModal } from '@/components/ui/ExecutiveBriefModal';

interface ExplainParams {
  title: string;
  subtitle?: string;
  confidence: number;
  factors: { title: string; weight: number }[];
  evidenceRecordNumber?: string;
}

interface IntelligenceContextType {
  openEvidence: (recordIdOrNumber: string) => void;
  openExplain: (params: ExplainParams) => void;
  openExecutiveBrief: (district?: District) => void;
  openEngineSpec: () => void;
  selectedDistrict: District | null;
  setSelectedDistrict: (district: District | null) => void;
  nandurbarDistrict: District;
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export function IntelligenceProvider({ children }: { children: React.ReactNode }) {
  const [evidenceRecord, setEvidenceRecord] = useState<EvidenceRecord | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const [explainParams, setExplainParams] = useState<ExplainParams | null>(null);
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  const [briefDistrict, setBriefDistrict] = useState<District | null>(null);
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const [isEngineSpecOpen, setIsEngineSpecOpen] = useState(false);

  const nandurbar =
    MAHARASHTRA_DISTRICTS.find((d) => d.name === 'Nandurbar') || MAHARASHTRA_DISTRICTS[0];
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(nandurbar);

  const openEvidence = (recordIdOrNumber: string) => {
    const clean = recordIdOrNumber.replace('#', '').trim();
    const found =
      EVIDENCE_RECORDS.find(
        (r) =>
          r.id === clean ||
          r.id === `REC-${clean}` ||
          r.recordNumber.replace('#', '') === clean
      ) || EVIDENCE_RECORDS[0];

    setEvidenceRecord(found);
    setIsEvidenceOpen(true);
  };

  const openExplain = (params: ExplainParams) => {
    setExplainParams(params);
    setIsExplainOpen(true);
  };

  const openExecutiveBrief = (district?: District) => {
    setBriefDistrict(district || nandurbar);
    setIsBriefOpen(true);
  };

  return (
    <IntelligenceContext.Provider
      value={{
        openEvidence,
        openExplain,
        openExecutiveBrief,
        openEngineSpec: () => setIsEngineSpecOpen(true),
        selectedDistrict,
        setSelectedDistrict,
        nandurbarDistrict: nandurbar,
      }}
    >
      {children}

      {/* Global Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        record={evidenceRecord}
      />

      {/* Global Explainability Modal */}
      {explainParams && (
        <ExplainabilityModal
          isOpen={isExplainOpen}
          onClose={() => setIsExplainOpen(false)}
          title={explainParams.title}
          subtitle={explainParams.subtitle}
          confidence={explainParams.confidence}
          factors={explainParams.factors}
          evidenceRecordNumber={explainParams.evidenceRecordNumber || '#9281'}
          onViewEvidence={() => {
            openEvidence(explainParams.evidenceRecordNumber || '#9281');
          }}
        />
      )}

      {/* Global Official Executive Brief Modal */}
      {briefDistrict && (
        <ExecutiveBriefModal
          isOpen={isBriefOpen}
          onClose={() => setIsBriefOpen(false)}
          district={briefDistrict}
        />
      )}

      {/* Global Engine Spec & Mathematical Proof Modal */}
      <EngineSpecModal
        isOpen={isEngineSpecOpen}
        onClose={() => setIsEngineSpecOpen(false)}
      />
    </IntelligenceContext.Provider>
  );
}

export function useIntelligence() {
  const context = useContext(IntelligenceContext);
  if (!context) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
}
