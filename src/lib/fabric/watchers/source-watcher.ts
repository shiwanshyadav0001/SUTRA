import { computeDeterministicSha256 } from '../pipeline/provenance';
import { ChangeDetector } from '../events/change-detector';
import { EventBus } from '../events/event-bus';
import { GovernanceEvent } from '@/lib/types/events';
import { SnapshotStore } from './snapshot-store';
import { SourceFetcher } from './source-fetcher';
import { FreshnessManager } from './freshness-manager';
import {
  CanonicalSnapshot,
  CanonicalRecord,
  SnapshotComparison,
  SourceWatcherState,
  EndpointType,
  DataTruthClassification,
} from './types';

export interface SourceWatcherConfig {
  sourceId: string;
  sourceName: string;
  publisher: string;
  endpoint: string;
  endpointType: EndpointType;
  reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'DAILY';
  classification?: DataTruthClassification;
  initialRecords?: CanonicalRecord[];
}

export class SourceWatcher {
  private config: SourceWatcherConfig;
  private state: SourceWatcherState;
  private processedEventFingerprints: Set<string> = new Set();

  constructor(config: SourceWatcherConfig) {
    this.config = config;

    const timestamp = new Date().toISOString();
    const initialRecords = config.initialRecords || [];
    const snapshotHash = initialRecords.length > 0 ? SnapshotStore.computeSnapshotHash(initialRecords) : '0000000000000000';

    this.state = {
      sourceId: config.sourceId,
      sourceName: config.sourceName,
      publisher: config.publisher,
      endpoint: config.endpoint,
      endpointType: config.endpointType,
      reportingFrequency: config.reportingFrequency,
      lastSuccessfulFetch: timestamp,
      nextExpectedRefresh: FreshnessManager.computeNextExpectedRefresh(
        timestamp,
        config.reportingFrequency
      ),
      recordCount: initialRecords.length,
      snapshotHash,
      previousSnapshotHash: null,
      freshnessStatus: 'HEALTHY',
      healthStatus: 'ONLINE',
      errorCount: 0,
      lastError: null,
      ingestionDurationMs: 4.2,
      recordsChanged: 0,
      activeMode: config.classification || 'VERIFIED_SOURCE_DATA',
      isWatching: true,
    };

    if (initialRecords.length > 0) {
      SnapshotStore.createSnapshot({
        sourceId: config.sourceId,
        sourceName: config.sourceName,
        records: initialRecords,
        classification: config.classification || 'VERIFIED_SOURCE_DATA',
        endpointType: config.endpointType,
      });
    }
  }

  /**
   * Generates a deterministic event fingerprint for deduplication.
   */
  static generateEventFingerprint(params: {
    sourceId: string;
    districtId: string;
    schemeId: string;
    metricKey: string;
    previousValue: number | string;
    currentValue: number | string;
    timestamp?: string;
  }): string {
    const time = params.timestamp ? new Date(params.timestamp) : new Date();
    // 1-hour window quantization for deduplicating identical statutory changes
    const windowHour = `${time.getUTCFullYear()}-${time.getUTCMonth() + 1}-${time.getUTCDate()}T${time.getUTCHours()}`;

    return computeDeterministicSha256({
      sourceId: params.sourceId,
      districtId: params.districtId,
      schemeId: params.schemeId,
      metricKey: params.metricKey,
      previousValue: params.previousValue,
      currentValue: params.currentValue,
      windowHour,
    });
  }

  /**
   * Checks if an event is a duplicate.
   */
  isDuplicateEvent(fingerprint: string): boolean {
    return this.processedEventFingerprints.has(fingerprint);
  }

  /**
   * Performs an ingestion pass, generates a snapshot, runs change detection, and emits non-duplicate events.
   */
  async checkAndUpdate(overrideRecords?: CanonicalRecord[]): Promise<{
    snapshot: CanonicalSnapshot;
    comparison: SnapshotComparison;
    generatedEvents: GovernanceEvent[];
    duplicateCount: number;
  }> {
    const fetchResult = await SourceFetcher.fetchSource(this.config.sourceId, overrideRecords);

    if (fetchResult.status === 'FAILED') {
      this.state.errorCount++;
      this.state.lastError = fetchResult.error || 'Fetch failure';
      this.state.healthStatus = 'DEGRADED';
      this.state.freshnessStatus = 'DEGRADED';

      const latest = SnapshotStore.getLatestSnapshot(this.config.sourceId);
      const emptyComparison: SnapshotComparison = {
        sourceId: this.config.sourceId,
        previousSnapshotId: latest?.snapshotId || null,
        currentSnapshotId: 'FAILED',
        timestamp: new Date().toISOString(),
        addedRecords: [],
        removedRecords: [],
        changedRecords: [],
        unchangedRecordsCount: latest?.recordCount || 0,
        totalRecords: latest?.recordCount || 0,
        hasMeaningfulChanges: false,
      };

      return {
        snapshot: latest || ({} as CanonicalSnapshot),
        comparison: emptyComparison,
        generatedEvents: [],
        duplicateCount: 0,
      };
    }

    const previousSnapshot = SnapshotStore.getLatestSnapshot(this.config.sourceId);
    const currentSnapshot = SnapshotStore.createSnapshot({
      sourceId: this.config.sourceId,
      sourceName: this.config.sourceName,
      records: fetchResult.records,
      classification: fetchResult.classification,
      endpointType: fetchResult.endpointType,
      retrievalStatus: fetchResult.status,
    });

    const comparison = SnapshotStore.compareSnapshots(previousSnapshot, currentSnapshot);

    const timestamp = currentSnapshot.timestamp;
    this.state.previousSnapshotHash = this.state.snapshotHash;
    this.state.snapshotHash = currentSnapshot.contentHash;
    this.state.lastSuccessfulFetch = timestamp;
    this.state.nextExpectedRefresh = FreshnessManager.computeNextExpectedRefresh(
      timestamp,
      this.config.reportingFrequency
    );
    this.state.recordCount = currentSnapshot.recordCount;
    this.state.ingestionDurationMs = fetchResult.durationMs;
    this.state.recordsChanged = comparison.changedRecords.length;
    this.state.errorCount = 0;
    this.state.lastError = null;
    this.state.healthStatus = 'ONLINE';
    this.state.freshnessStatus = 'HEALTHY';

    // Process Changed Records into Governance Events
    const generatedEvents: GovernanceEvent[] = [];
    let duplicateCount = 0;

    for (const changed of comparison.changedRecords) {
      for (const diff of changed.differences) {
        const fingerprint = SourceWatcher.generateEventFingerprint({
          sourceId: this.config.sourceId,
          districtId: changed.districtId,
          schemeId: changed.schemeId,
          metricKey: diff.fieldName,
          previousValue: diff.previousValue,
          currentValue: diff.currentValue,
          timestamp,
        });

        if (this.processedEventFingerprints.has(fingerprint)) {
          duplicateCount++;
          continue;
        }

        this.processedEventFingerprints.add(fingerprint);

        const pNum = typeof diff.previousValue === 'number' ? diff.previousValue : 0;
        const cNum = typeof diff.currentValue === 'number' ? diff.currentValue : 0;

        const event = ChangeDetector.detectMetricChange({
          source: this.config.publisher,
          datasetId: this.config.sourceId,
          districtName: changed.districtName,
          lgdCode: changed.lgdCode,
          schemeId: changed.schemeId,
          metricKey: diff.fieldName,
          metricLabel: diff.fieldName.replace(/_/g, ' ').toUpperCase(),
          unit: diff.fieldName.includes('cr') ? '₹ Crore' : '%',
          previousValue: pNum,
          currentValue: cNum,
          customTimestamp: timestamp,
          mode: this.state.activeMode === 'VERIFIED_SOURCE_DATA' ? 'VERIFIED_SOURCE' : 'DEMO_STREAM',
        });

        EventBus.dispatch(event);
        generatedEvents.push(event);
      }
    }

    return {
      snapshot: currentSnapshot,
      comparison,
      generatedEvents,
      duplicateCount,
    };
  }

  /**
   * Returns current watcher state snapshot.
   */
  getState(): SourceWatcherState {
    return {
      ...this.state,
      freshnessStatus: FreshnessManager.evaluateFreshnessStatus({
        lastSuccessfulFetch: this.state.lastSuccessfulFetch,
        reportingFrequency: this.state.reportingFrequency,
        errorCount: this.state.errorCount,
        isSimulated: this.state.activeMode === 'SIMULATED_DEMO',
      }),
    };
  }

  /**
   * Clears fingerprint cache.
   */
  clearFingerprintCache(): void {
    this.processedEventFingerprints.clear();
  }
}
