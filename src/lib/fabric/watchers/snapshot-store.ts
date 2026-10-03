import { computeDeterministicSha256 } from '../pipeline/provenance';
import {
  CanonicalSnapshot,
  CanonicalRecord,
  SnapshotComparison,
  ChangedRecordDiff,
  FieldDifference,
  DataTruthClassification,
  EndpointType,
} from './types';

export class SnapshotStore {
  private static snapshotsBySource: Map<string, CanonicalSnapshot[]> = new Map();
  private static maxSnapshotsPerSource = 20;

  /**
   * Deterministically computes the SHA-256 hash of a snapshot payload.
   */
  static computeSnapshotHash(records: CanonicalRecord[]): string {
    const sortedRecords = [...records].sort((a, b) => a.recordId.localeCompare(b.recordId));
    return computeDeterministicSha256({
      count: records.length,
      recordHashes: sortedRecords.map((r) => r.hash),
    });
  }

  /**
   * Creates and stores a new canonical snapshot for a source.
   */
  static createSnapshot(params: {
    sourceId: string;
    sourceName: string;
    records: CanonicalRecord[];
    classification?: DataTruthClassification;
    endpointType?: EndpointType;
    schemaVersion?: string;
    retrievalStatus?: 'SUCCESS' | 'PARTIAL' | 'FALLBACK_FIXTURE' | 'FAILED';
    timestamp?: string;
  }): CanonicalSnapshot {
    const timestamp = params.timestamp || new Date().toISOString();
    const contentHash = this.computeSnapshotHash(params.records);
    const snapshotId = `SNAP-${params.sourceId}-${Date.now().toString(36).toUpperCase()}-${contentHash.slice(0, 8)}`;

    const snapshot: CanonicalSnapshot = {
      snapshotId,
      sourceId: params.sourceId,
      sourceName: params.sourceName,
      timestamp,
      recordCount: params.records.length,
      contentHash,
      schemaVersion: params.schemaVersion || '1.0.0',
      classification: params.classification || 'VERIFIED_SOURCE_DATA',
      endpointType: params.endpointType || 'OFFICIAL_DOWNLOADABLE',
      retrievalStatus: params.retrievalStatus || 'SUCCESS',
      records: params.records,
    };

    const existing = this.snapshotsBySource.get(params.sourceId) || [];
    this.snapshotsBySource.set(params.sourceId, [
      snapshot,
      ...existing.slice(0, this.maxSnapshotsPerSource - 1),
    ]);

    return snapshot;
  }

  /**
   * Returns the most recent snapshot for a source.
   */
  static getLatestSnapshot(sourceId: string): CanonicalSnapshot | undefined {
    const list = this.snapshotsBySource.get(sourceId);
    return list && list.length > 0 ? list[0] : undefined;
  }

  /**
   * Returns the previous snapshot (second latest) for a source.
   */
  static getPreviousSnapshot(sourceId: string): CanonicalSnapshot | undefined {
    const list = this.snapshotsBySource.get(sourceId);
    return list && list.length > 1 ? list[1] : undefined;
  }

  /**
   * Returns all snapshots for a source.
   */
  static getSnapshots(sourceId: string): CanonicalSnapshot[] {
    return this.snapshotsBySource.get(sourceId) || [];
  }

  /**
   * Deterministically compares two canonical snapshots and outputs record-level and field-level deltas.
   */
  static compareSnapshots(
    previous: CanonicalSnapshot | null | undefined,
    current: CanonicalSnapshot
  ): SnapshotComparison {
    if (!previous) {
      return {
        sourceId: current.sourceId,
        previousSnapshotId: null,
        currentSnapshotId: current.snapshotId,
        timestamp: current.timestamp,
        addedRecords: current.records,
        removedRecords: [],
        changedRecords: [],
        unchangedRecordsCount: 0,
        totalRecords: current.records.length,
        hasMeaningfulChanges: current.records.length > 0,
      };
    }

    const prevMap = new Map<string, CanonicalRecord>();
    previous.records.forEach((r) => prevMap.set(r.recordId, r));

    const currMap = new Map<string, CanonicalRecord>();
    current.records.forEach((r) => currMap.set(r.recordId, r));

    const addedRecords: CanonicalRecord[] = [];
    const changedRecords: ChangedRecordDiff[] = [];
    let unchangedCount = 0;

    for (const [recordId, currRecord] of currMap.entries()) {
      const prevRecord = prevMap.get(recordId);
      if (!prevRecord) {
        addedRecords.push(currRecord);
      } else if (prevRecord.hash !== currRecord.hash) {
        // Field-level comparison
        const differences: FieldDifference[] = [];
        const allKeys = Array.from(
          new Set([...Object.keys(prevRecord.metrics), ...Object.keys(currRecord.metrics)])
        );

        for (const key of allKeys) {
          const pVal = prevRecord.metrics[key];
          const cVal = currRecord.metrics[key];

          if (pVal !== cVal) {
            const diff: FieldDifference = {
              fieldName: key,
              previousValue: pVal !== undefined ? pVal : '',
              currentValue: cVal !== undefined ? cVal : '',
            };

            if (typeof pVal === 'number' && typeof cVal === 'number') {
              diff.delta = Number((cVal - pVal).toFixed(2));
              diff.deltaPercent =
                pVal > 0 ? Number((((cVal - pVal) / pVal) * 100).toFixed(2)) : 0;
            }

            differences.push(diff);
          }
        }

        if (differences.length > 0) {
          changedRecords.push({
            recordId,
            districtId: currRecord.districtId,
            districtName: currRecord.districtName,
            lgdCode: currRecord.lgdCode,
            schemeId: currRecord.schemeId,
            differences,
          });
        } else {
          unchangedCount++;
        }
      } else {
        unchangedCount++;
      }
    }

    const removedRecords: CanonicalRecord[] = [];
    for (const [recordId, prevRecord] of prevMap.entries()) {
      if (!currMap.has(recordId)) {
        removedRecords.push(prevRecord);
      }
    }

    return {
      sourceId: current.sourceId,
      previousSnapshotId: previous.snapshotId,
      currentSnapshotId: current.snapshotId,
      timestamp: current.timestamp,
      addedRecords,
      removedRecords,
      changedRecords,
      unchangedRecordsCount: unchangedCount,
      totalRecords: current.records.length,
      hasMeaningfulChanges:
        addedRecords.length > 0 || removedRecords.length > 0 || changedRecords.length > 0,
    };
  }

  /**
   * Resets the snapshot store.
   */
  static reset(): void {
    this.snapshotsBySource.clear();
  }
}
