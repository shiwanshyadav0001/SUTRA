import { FindingType } from './data-fabric';

export type GovernanceEventType =
  | 'FUND_DRAW_DOWN_CHANGED'
  | 'PHYSICAL_PROGRESS_CHANGED'
  | 'COVERAGE_CHANGED'
  | 'ANOMALY_DETECTED'
  | 'CONVERGENCE_GAP'
  | 'SCHEME_OVERLAP'
  | 'DATASET_REFRESH'
  | 'SOURCE_DEGRADED'
  | 'SOURCE_FETCH_FAILURE'
  | 'SOURCE_STALE'
  | 'SOURCE_SCHEMA_DRIFT'
  | 'SOURCE_UNAVAILABLE'
  | 'FINANCIAL_PHYSICAL_DIVERGENCE'
  | 'GEOGRAPHIC_COVERAGE_GAP'
  | 'SUDDEN_UTILIZATION_CHANGE'
  | 'INVESTIGATION_TRIGGERED';

export type AnomalyRuleId =
  | 'RULE_RATE_OF_CHANGE'
  | 'RULE_FINANCIAL_PHYSICAL_DIVERGENCE'
  | 'RULE_CROSS_PROGRAMME_CONVERGENCE_GAP'
  | 'RULE_GEOGRAPHIC_COVERAGE_GAP'
  | 'RULE_REPORTING_STALENESS'
  | 'RULE_SUDDEN_UTILIZATION_CHANGE'
  | 'RULE_MISSING_EXPECTED_UPDATE';

export interface GovernanceAnomalySignal {
  signalId: string;
  ruleId: AnomalyRuleId;
  ruleName: string;
  severity: EventSeverity;
  districtId: string;
  districtName: string;
  lgdCode: string;
  schemeIds: string[];
  detectedAt: string;
  facts: {
    observedValue: number | string;
    expectedOrBenchmarkValue: number | string;
    unit: string;
    description: string;
  }[];
  calculation: {
    formulaName: string;
    formulaText: string;
    computedScore: number;
    threshold: number;
    deltaPp?: number;
  };
  evidenceRefs: string[];
  snapshotHashes: string[];
  limitations: string[];
  triggersInvestigation: boolean;
  suggestedInvestigationTitle?: string;
}

export type EventSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type EventStatus = 'ACTIVE' | 'RESOLVED' | 'INVESTIGATING' | 'CORRELATED';

export type EventProcessingMode = 'VERIFIED_SOURCE' | 'DEMO_STREAM' | 'LIVE_SIMULATION';

export type DirectionType = 'INCREASE' | 'DECREASE' | 'NEUTRAL';

export interface GovernanceEvent {
  id: string; // e.g. EVT-NDB-JJM-001
  timestamp: string; // ISO 8601
  source: string; // Authority name e.g. "Department of Drinking Water & Sanitation"
  datasetId: string; // e.g. "DS-JJM-MH"
  datasetName: string;
  districtId: string; // e.g. "dist_512"
  districtName: string; // e.g. "Nandurbar"
  lgdCode: string; // e.g. "512"
  state: string; // e.g. "Maharashtra"
  schemeId: string; // e.g. "JJM"
  schemeName: string; // e.g. "Jal Jeevan Mission"
  ministry: string; // e.g. "Ministry of Jal Shakti"
  eventType: GovernanceEventType;
  metricKey: string; // e.g. "utilized_funds_cr"
  metricLabel: string; // e.g. "JJM Disbursed Expenditure"
  unit: string; // e.g. "₹ Crore"
  previousValue: number | string;
  currentValue: number | string;
  delta: number;
  deltaPercent: number;
  direction: DirectionType;
  thresholdExceeded: boolean;
  severity: EventSeverity;
  status: EventStatus;
  mode: EventProcessingMode;
  evidenceIds: string[]; // Evidence record numbers
  findingId?: string; // Associated finding e.g. "SUTRA-FND-0001"
  findingType?: FindingType;
  investigationId?: string; // e.g. "INV-NDB-CONV-001"
  explanation: string;
  generatedAt: string;
  processingPipelineStep:
    | 'INGESTED'
    | 'NORMALIZED'
    | 'RESOLVED'
    | 'COMPARED'
    | 'CORRELATED'
    | 'INVESTIGATED';
  provenanceHash: string;
}

export interface SourceHealthStatus {
  id?: string;
  datasetId: string;
  name: string;
  schemeName?: string;
  publisher: string;
  status: 'ONLINE' | 'STALE' | 'DEGRADED' | 'UNAVAILABLE' | 'SIMULATED';
  lastRefresh: string;
  recordCount: number;
  freshness: string; // e.g. "12m ago"
  reportingFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'DAILY';
  updateFrequency?: string;
  verifiedSourceUrl: string;
  verificationLevel: 'STATUTORY_VERIFIED' | 'SYNTHETIC_DEMO' | 'OFFICIAL_SOURCE';
}

export interface LiveTelemetrySummary {
  connected: boolean;
  connectionStatus: 'CONNECTED' | 'STREAMING' | 'PAUSED' | 'DISCONNECTED';
  eventsPerMinute: number;
  totalEventsReceived: number;
  totalEventsProcessed?: number;
  activeSignalsCount: number;
  affectedDistricts: {
    lgdCode: string;
    name: string;
    activeEventCount: number;
    severity: EventSeverity;
  }[];
  affectedDistrictsCount?: number;
  sources: SourceHealthStatus[];
  sourceHealthSummary?: SourceHealthStatus[];
  latestInvestigationId?: string;
  latestEvent?: GovernanceEvent;
  lastEventTimestamp: string;
}
