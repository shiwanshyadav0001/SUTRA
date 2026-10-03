'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { EvidenceRecord, District, WhyFlaggedChain } from '@/lib/types';
import {
  GovernanceEvent,
  SourceHealthStatus,
  LiveTelemetrySummary,
  EventProcessingMode,
} from '@/lib/types/events';
import { EVIDENCE_RECORDS, MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';
import {
  BASELINE_VERIFIED_EVENTS,
  INITIAL_SOURCE_HEALTH,
  DEMO_SCENARIOS,
} from '@/lib/fabric/events/event-scenarios';
import { InvestigationEngine } from '@/lib/fabric/investigation/investigation-engine';
import { EvidenceDrawer } from '@/components/ui/EvidenceDrawer';
import { ExplainabilityModal } from '@/components/ui/ExplainabilityModal';
import { EngineSpecModal } from '@/components/modals/EngineSpecModal';
import { ExecutiveBriefModal } from '@/components/ui/ExecutiveBriefModal';
import { WhyFlaggedModal } from '@/components/investigation/WhyFlaggedModal';

interface ExplainParams {
  title: string;
  subtitle?: string;
  confidence: number;
  factors: { title: string; weight: number }[];
  evidenceRecordNumber?: string;
}

export interface IntelligenceContextType {
  openEvidence: (recordIdOrNumber: string) => void;
  openExplain: (params: ExplainParams) => void;
  openExecutiveBrief: (district?: District) => void;
  openEngineSpec: () => void;
  openWhyFlagged: (findingId?: string) => void;
  openWorkspace: (investigationId?: string) => void;
  selectedDistrict: District | null;
  setSelectedDistrict: (district: District | null) => void;
  nandurbarDistrict: District;
  // V2 Live Governance Telemetry
  events: GovernanceEvent[];
  activeEvents: GovernanceEvent[];
  latestEvent: GovernanceEvent | null;
  activeLiveEvent: GovernanceEvent | null;
  setActiveLiveEvent: (event: GovernanceEvent | null) => void;
  liveMode: EventProcessingMode;
  streamMode: EventProcessingMode;
  setLiveMode: (mode: EventProcessingMode) => void;
  isLiveStreaming: boolean;
  isStreaming: boolean;
  setIsLiveStreaming: (streaming: boolean) => void;
  activeDistrictLiveState: Record<string, boolean>;
  triggerScenario: (scenarioId: string) => Promise<GovernanceEvent | undefined>;
  sourceHealth: SourceHealthStatus[];
  telemetrySummary: LiveTelemetrySummary;
  resetLiveEvents: () => void;
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

  // V2 Why Flagged Modal State
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(false);
  const [whyFlaggedChain, setWhyFlaggedChain] = useState<WhyFlaggedChain | null>(null);
  const [activeFindingId, setActiveFindingId] = useState<string>('SUTRA-FND-0001');

  // V2 Live Telemetry State
  const [events, setEvents] = useState<GovernanceEvent[]>(BASELINE_VERIFIED_EVENTS);
  const [activeLiveEvent, setActiveLiveEvent] = useState<GovernanceEvent | null>(
    BASELINE_VERIFIED_EVENTS[0] || null
  );
  const [liveMode, setLiveMode] = useState<EventProcessingMode>('VERIFIED_SOURCE');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [sourceHealth, setSourceHealth] = useState<SourceHealthStatus[]>(INITIAL_SOURCE_HEALTH);

  const nandurbar =
    MAHARASHTRA_DISTRICTS.find((d) => d.name === 'Nandurbar') || MAHARASHTRA_DISTRICTS[0];
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(nandurbar);

  // Computed active district states
  const activeDistrictLiveState = useMemo(() => {
    const map: Record<string, boolean> = {
      Nandurbar: true,
    };
    events.forEach((e) => {
      if (e.districtName) map[e.districtName] = true;
    });
    return map;
  }, [events]);

  // Computed summary
  const latestEvent = events[0] || null;

  const telemetrySummary: LiveTelemetrySummary = {
    connected: isLiveStreaming,
    connectionStatus: isLiveStreaming ? 'STREAMING' : 'PAUSED',
    eventsPerMinute: Math.min(18, Math.max(4, events.length * 2)),
    totalEventsReceived: events.length,
    activeSignalsCount: events.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length,
    affectedDistricts: Array.from(new Set(events.map((e) => e.lgdCode))).map((lgd) => {
      const match = events.find((e) => e.lgdCode === lgd);
      return {
        lgdCode: lgd,
        name: match?.districtName || 'District',
        activeEventCount: events.filter((e) => e.lgdCode === lgd).length,
        severity: match?.severity || 'HIGH',
      };
    }),
    sources: sourceHealth,
    latestInvestigationId: latestEvent?.investigationId || 'INV-NDB-CONV-001',
    latestEvent: latestEvent || undefined,
    lastEventTimestamp: latestEvent?.timestamp || '2026-10-02T22:00:00.000Z',
  };

  // SSE Live Event Receiver
  useEffect(() => {
    if (!isLiveStreaming) return;

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/live/events');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_EVENT' && data.event) {
            setEvents((prev) => {
              const exists = prev.some((e) => e.id === data.event.id);
              if (exists) return prev;
              return [data.event, ...prev.slice(0, 49)];
            });
            setActiveLiveEvent(data.event);
          } else if (data.type === 'INITIAL_STATE' && data.events) {
            setEvents((prev) => (prev.length > 0 ? prev : data.events));
            if (data.sources) setSourceHealth(data.sources);
          }
        } catch {
          // ignore parsing error
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
        }
      };
    } catch {
      // ignore
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isLiveStreaming]);

  // Trigger Scenario Handler
  const triggerScenario = useCallback(async (scenarioId: string): Promise<GovernanceEvent | undefined> => {
    const scenario = DEMO_SCENARIOS[scenarioId];
    if (!scenario) return undefined;

    setLiveMode('DEMO_STREAM');
    const newEvent = scenario.event;

    // Dispatch locally and optimistically update
    setEvents((prev) => {
      const filtered = prev.filter((e) => e.id !== newEvent.id);
      return [newEvent, ...filtered.slice(0, 49)];
    });
    setActiveLiveEvent(newEvent);

    // Also inform API backend
    try {
      await fetch('/api/live/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_scenario', scenarioId }),
      });
    } catch {
      // optimistic state is already preserved
    }

    return newEvent;
  }, []);

  const resetLiveEvents = useCallback(async () => {
    setEvents([...BASELINE_VERIFIED_EVENTS]);
    setActiveLiveEvent(BASELINE_VERIFIED_EVENTS[0] || null);
    setLiveMode('VERIFIED_SOURCE');
    try {
      await fetch('/api/live/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
    } catch {
      // ignore
    }
  }, []);

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

  const openWhyFlagged = (findingId = 'SUTRA-FND-0001') => {
    setActiveFindingId(findingId);
    try {
      const invResult = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const targetFinding = invResult.findings.find((f) => f.id === findingId) || invResult.finding;
      setWhyFlaggedChain(targetFinding?.whyFlaggedChain || null);
    } catch {
      // fallback
    }
    setIsWhyFlaggedOpen(true);
  };

  const openWorkspace = (investigationId = 'INV-NDB-CONV-001') => {
    if (typeof window !== 'undefined') {
      window.location.assign(`/investigation/${investigationId}`);
    }
  };

  return (
    <IntelligenceContext.Provider
      value={{
        openEvidence,
        openExplain,
        openExecutiveBrief,
        openEngineSpec: () => setIsEngineSpecOpen(true),
        openWhyFlagged,
        openWorkspace,
        selectedDistrict,
        setSelectedDistrict,
        nandurbarDistrict: nandurbar,
        events,
        activeEvents: events,
        latestEvent,
        activeLiveEvent,
        setActiveLiveEvent,
        liveMode,
        streamMode: liveMode,
        setLiveMode,
        isLiveStreaming,
        isStreaming: isLiveStreaming,
        setIsLiveStreaming,
        activeDistrictLiveState,
        triggerScenario,
        sourceHealth,
        telemetrySummary,
        resetLiveEvents,
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
          evidenceRecordNumber={explainParams.evidenceRecordNumber || '#7201'}
          onViewEvidence={() => {
            openEvidence(explainParams.evidenceRecordNumber || '#7201');
          }}
        />
      )}

      {/* V2 Why Flagged Forensic Modal */}
      <WhyFlaggedModal
        isOpen={isWhyFlaggedOpen}
        onClose={() => setIsWhyFlaggedOpen(false)}
        chain={whyFlaggedChain}
        findingId={activeFindingId}
      />

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
