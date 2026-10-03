import { SourceHealthStatus } from '@/lib/types/events';

export type DataTruthClassification =
  | 'VERIFIED_SOURCE_DATA'
  | 'DERIVED_ANALYSIS'
  | 'SIMULATED_DEMO'
  | 'USER_UPLOADED_DATA';

export type FreshnessStatus = 'HEALTHY' | 'STALE' | 'DEGRADED' | 'ERROR' | 'SIMULATION';

export type EndpointType =
  | 'OFFICIAL_API'
  | 'OFFICIAL_DOWNLOADABLE'
  | 'STRUCTURED_ENDPOINT'
  | 'AUDITED_FIXTURE_FALLBACK';

export interface CanonicalRecord {
  recordId: string;
  districtId: string;
  districtName: string;
  lgdCode: string;
  schemeId: string;
  metrics: Record<string, number | string>;
  reportingPeriod: string;
  hash: string;
}

export interface CanonicalSnapshot {
  snapshotId: string;
  sourceId: string;
  sourceName: string;
  timestamp: string;
  recordCount: number;
  contentHash: string;
  schemaVersion: string;
  classification: DataTruthClassification;
  endpointType: EndpointType;
  retrievalStatus: 'SUCCESS' | 'PARTIAL' | 'FALLBACK_FIXTURE' | 'FAILED';
  records: CanonicalRecord[];
}

export interface FieldDifference {
  fieldName: string;
  previousValue: number | string;
  currentValue: number | string;
  delta?: number;
  deltaPercent?: number;
}

export interface ChangedRecordDiff {
  recordId: string;
  districtId: string;
  districtName: string;
  lgdCode: string;
  schemeId: string;
  differences: FieldDifference[];
}

export interface SnapshotComparison {
  sourceId: string;
  previousSnapshotId: string | null;
  currentSnapshotId: string;
  timestamp: string;
  addedRecords: CanonicalRecord[];
  removedRecords: CanonicalRecord[];
  changedRecords: ChangedRecordDiff[];
  unchangedRecordsCount: number;
  totalRecords: number;
  hasMeaningfulChanges: boolean;
}

export interface SourceWatcherState {
  sourceId: string;
  sourceName: string;
  publisher: string;
  endpoint: string;
  endpointType: EndpointType;
  reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'DAILY';
  lastSuccessfulFetch: string;
  nextExpectedRefresh: string;
  recordCount: number;
  snapshotHash: string;
  previousSnapshotHash: string | null;
  freshnessStatus: FreshnessStatus;
  healthStatus: SourceHealthStatus['status'];
  errorCount: number;
  lastError: string | null;
  ingestionDurationMs: number;
  recordsChanged: number;
  activeMode: DataTruthClassification;
  isWatching: boolean;
}

export interface TelemetryMetrics {
  sourceToEventLatencyMs: number;
  eventToInvestigationLatencyMs: number;
  ingestionLatencyMs: number;
  normalizationLatencyMs: number;
  joinLatencyMs: number;
  eventGenerationLatencyMs: number;
  sseDeliveryLatencyMs: number;
  investigationGenerationLatencyMs: number;
  totalPipelineLatencyMs: number;
  lastMeasuredAt: string;
}

export interface EventFingerprint {
  fingerprint: string;
  sourceId: string;
  districtId: string;
  schemeId: string;
  metricKey: string;
  previousValue: number | string;
  currentValue: number | string;
  windowHour: string;
}
