import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SnapshotStore } from '../src/lib/fabric/watchers/snapshot-store';
import { FreshnessManager } from '../src/lib/fabric/watchers/freshness-manager';
import { SourceWatcher } from '../src/lib/fabric/watchers/source-watcher';
import { WatcherRegistry } from '../src/lib/fabric/watchers/watcher-registry';
import { CanonicalRecord } from '../src/lib/fabric/watchers/types';

describe('SUTRA V3 — Source Watchers, Deterministic Snapshots & Replay Engine Test Suite', () => {

  // Helper to create valid CanonicalRecord objects
  const makeRecord = (
    id: string,
    distName: string,
    lgd: number | string,
    scheme: string,
    metrics: Record<string, number | string>,
    hash?: string
  ): CanonicalRecord => ({
    recordId: id,
    districtId: `DIST-${lgd}`,
    districtName: distName,
    lgdCode: String(lgd),
    schemeId: scheme,
    reportingPeriod: '2026-03',
    metrics,
    hash: hash || `HASH-${id}-${JSON.stringify(metrics)}`,
  });

  // ============================================================================
  // 1. DETERMINISTIC SNAPSHOT CREATION & SHA-256 HASHING
  // ============================================================================
  describe('1. Deterministic Snapshot Creation & Hashing', () => {
    it('should create canonical snapshots with valid SHA-256 content hashes', () => {
      const records: CanonicalRecord[] = [
        makeRecord('JJM-512', 'Nandurbar', 512, 'JJM', { utilizationRate: 48.2, fundAllocatedCr: 120.0 }, 'H1'),
        makeRecord('JJM-501', 'Gadchiroli', 501, 'JJM', { utilizationRate: 64.1, fundAllocatedCr: 80.0 }, 'H2'),
      ];

      const snapshot1 = SnapshotStore.createSnapshot({
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'Jal Jeevan Mission (JJM IMIS)',
        records,
        classification: 'VERIFIED_SOURCE_DATA',
      });

      assert.strictEqual(snapshot1.sourceId, 'SRC-JJM-IMIS');
      assert.strictEqual(snapshot1.recordCount, 2);
      assert.strictEqual(snapshot1.contentHash.length, 64);
      assert.strictEqual(snapshot1.classification, 'VERIFIED_SOURCE_DATA');

      // Determinism test: identical data must produce identical SHA-256 hash
      const snapshot2 = SnapshotStore.createSnapshot({
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'Jal Jeevan Mission (JJM IMIS)',
        records,
        classification: 'VERIFIED_SOURCE_DATA',
      });
      assert.strictEqual(snapshot1.contentHash, snapshot2.contentHash);
    });

    it('should produce identical hash regardless of record array insertion order', () => {
      const recA = makeRecord('JJM-512', 'Nandurbar', 512, 'JJM', { val: 100 }, 'HA');
      const recB = makeRecord('JJM-501', 'Gadchiroli', 501, 'JJM', { val: 200 }, 'HB');

      const snapOrder1 = SnapshotStore.createSnapshot({
        sourceId: 'TEST_SRC',
        sourceName: 'Test Source',
        records: [recA, recB],
      });
      const snapOrder2 = SnapshotStore.createSnapshot({
        sourceId: 'TEST_SRC',
        sourceName: 'Test Source',
        records: [recB, recA],
      });

      assert.strictEqual(snapOrder1.contentHash, snapOrder2.contentHash);
    });
  });

  // ============================================================================
  // 2. SNAPSHOT COMPARISON & FIELD-LEVEL DIFFS
  // ============================================================================
  describe('2. Snapshot Comparison & Field-Level Diffs', () => {
    it('should detect added, removed, changed, and unchanged records with numeric deltas', () => {
      const prevRecords: CanonicalRecord[] = [
        makeRecord('REC-512', 'Nandurbar', 512, 'JJM', { utilizationRate: 48.2, fundAllocatedCr: 120.0 }, 'H_PREV_512'),
        makeRecord('REC-501', 'Gadchiroli', 501, 'JJM', { utilizationRate: 64.1, fundAllocatedCr: 80.0 }, 'H_501'),
        makeRecord('REC-525', 'Washim', 525, 'JJM', { utilizationRate: 70.0, fundAllocatedCr: 50.0 }, 'H_525'),
      ];

      const currRecords: CanonicalRecord[] = [
        // Changed record (Nandurbar utilization increased to 60.0%)
        makeRecord('REC-512', 'Nandurbar', 512, 'JJM', { utilizationRate: 60.0, fundAllocatedCr: 120.0 }, 'H_CURR_512'),
        // Unchanged record (Gadchiroli)
        makeRecord('REC-501', 'Gadchiroli', 501, 'JJM', { utilizationRate: 64.1, fundAllocatedCr: 80.0 }, 'H_501'),
        // Added record (Yavatmal)
        makeRecord('REC-510', 'Yavatmal', 510, 'JJM', { utilizationRate: 55.4, fundAllocatedCr: 90.0 }, 'H_510'),
        // (Washim removed)
      ];

      const snapPrev = SnapshotStore.createSnapshot({
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM',
        records: prevRecords,
      });
      const snapCurr = SnapshotStore.createSnapshot({
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM',
        records: currRecords,
      });

      const comparison = SnapshotStore.compareSnapshots(snapPrev, snapCurr);

      assert.strictEqual(comparison.addedRecords.length, 1);
      assert.strictEqual(comparison.removedRecords.length, 1);
      assert.strictEqual(comparison.changedRecords.length, 1);
      assert.strictEqual(comparison.unchangedRecordsCount, 1);

      // Verify specific field change for Nandurbar
      const nandurbarDiff = comparison.changedRecords.find((r) => r.lgdCode === '512');
      assert.ok(nandurbarDiff);
      assert.strictEqual(nandurbarDiff?.differences.length, 1);
      assert.strictEqual(nandurbarDiff?.differences[0].fieldName, 'utilizationRate');
      assert.strictEqual(nandurbarDiff?.differences[0].previousValue, 48.2);
      assert.strictEqual(nandurbarDiff?.differences[0].currentValue, 60.0);
      assert.strictEqual(nandurbarDiff?.differences[0].delta, 11.8);
    });
  });

  // ============================================================================
  // 3. DETERMINISTIC EVENT FINGERPRINTS & DEDUPLICATION
  // ============================================================================
  describe('3. Event Fingerprint Deduplication', () => {
    it('should generate identical fingerprints for equivalent changes within the same time window', () => {
      const fixedTime = '2026-10-02T10:15:00.000Z';
      const fp1 = SourceWatcher.generateEventFingerprint({
        sourceId: 'SRC-JJM-IMIS',
        districtId: 'DIST-512',
        schemeId: 'JJM',
        metricKey: 'fund_draw_down',
        previousValue: 48.2,
        currentValue: 60.0,
        timestamp: fixedTime,
      });

      const fp2 = SourceWatcher.generateEventFingerprint({
        sourceId: 'SRC-JJM-IMIS',
        districtId: 'DIST-512',
        schemeId: 'JJM',
        metricKey: 'fund_draw_down',
        previousValue: 48.2,
        currentValue: 60.0,
        timestamp: fixedTime,
      });

      assert.strictEqual(fp1, fp2);
      assert.strictEqual(fp1.length, 64);
    });

    it('should generate different fingerprints when values or districts differ', () => {
      const fixedTime = '2026-10-02T10:15:00.000Z';
      const fp1 = SourceWatcher.generateEventFingerprint({
        sourceId: 'SRC-JJM-IMIS',
        districtId: 'DIST-512',
        schemeId: 'JJM',
        metricKey: 'fund_draw_down',
        previousValue: 48.2,
        currentValue: 60.0,
        timestamp: fixedTime,
      });

      const fpDifferentDistrict = SourceWatcher.generateEventFingerprint({
        sourceId: 'SRC-JJM-IMIS',
        districtId: 'DIST-501',
        schemeId: 'JJM',
        metricKey: 'fund_draw_down',
        previousValue: 48.2,
        currentValue: 60.0,
        timestamp: fixedTime,
      });

      const fpDifferentValue = SourceWatcher.generateEventFingerprint({
        sourceId: 'SRC-JJM-IMIS',
        districtId: 'DIST-512',
        schemeId: 'JJM',
        metricKey: 'fund_draw_down',
        previousValue: 48.2,
        currentValue: 65.0,
        timestamp: fixedTime,
      });

      assert.notStrictEqual(fp1, fpDifferentDistrict);
      assert.notStrictEqual(fp1, fpDifferentValue);
    });
  });

  // ============================================================================
  // 4. FRESHNESS MANAGER & STATUTORY CADENCE
  // ============================================================================
  describe('4. Freshness Manager Calculations', () => {
    it('should calculate relative freshness and cadence scheduling accurately', () => {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
      const freshnessStr = FreshnessManager.computeFreshnessLabel(tenMinutesAgo);

      assert.strictEqual(freshnessStr, '10m ago');

      // Test health status determination
      const healthHealthy = FreshnessManager.evaluateFreshnessStatus({
        lastSuccessfulFetch: tenMinutesAgo,
        reportingFrequency: 'DAILY',
        errorCount: 0,
      });
      assert.strictEqual(healthHealthy, 'HEALTHY');

      // Error count >= 3 should yield ERROR
      const healthError = FreshnessManager.evaluateFreshnessStatus({
        lastSuccessfulFetch: tenMinutesAgo,
        reportingFrequency: 'DAILY',
        errorCount: 3,
      });
      assert.strictEqual(healthError, 'ERROR');

      // Stale test (e.g. 10 days ago for daily cadence)
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const healthStale = FreshnessManager.evaluateFreshnessStatus({
        lastSuccessfulFetch: tenDaysAgo,
        reportingFrequency: 'DAILY',
        errorCount: 0,
      });
      assert.strictEqual(healthStale, 'STALE');
    });
  });

  // ============================================================================
  // 5. WATCHER REGISTRY & REAL-TIME EVENT INGESTION
  // ============================================================================
  describe('5. Watcher Registry & Ingestion Pipeline', () => {
    it('should initialize official source watchers for JJM, PMAY-G, and PKVY', () => {
      WatcherRegistry.initialize();
      const allWatchers = WatcherRegistry.getAllWatchers();

      assert.strictEqual(allWatchers.length, 3);
      const states = WatcherRegistry.getAllWatcherStates();
      const sourceIds = states.map((s) => s.sourceId);
      assert.ok(sourceIds.includes('SRC-JJM-IMIS'));
      assert.ok(sourceIds.includes('SRC-PMAYG-AWAAS'));
      assert.ok(sourceIds.includes('SRC-PKVY-OPEN'));
    });

    it('should track pipeline telemetry metrics', () => {
      WatcherRegistry.initialize();
      const telemetry = WatcherRegistry.getTelemetryMetrics();

      assert.ok(telemetry.ingestionLatencyMs >= 0);
      assert.ok(telemetry.normalizationLatencyMs >= 0);
      assert.ok(telemetry.sourceToEventLatencyMs >= 0);
      assert.ok(telemetry.totalPipelineLatencyMs >= 0);
    });

    it('should convert watcher states to SourceHealthStatus list', () => {
      WatcherRegistry.initialize();
      const healthList = WatcherRegistry.getSourceHealthList();

      assert.strictEqual(healthList.length, 3);
      assert.strictEqual(healthList[0].verificationLevel, 'OFFICIAL_SOURCE');
      assert.strictEqual(healthList[0].status, 'ONLINE');
    });
  });

  // ============================================================================
  // 6. DATA TRUTH MODEL LABELS & DEFENSIVE HANDLING
  // ============================================================================
  describe('6. Data Truth Model & Non-Fabrication', () => {
    it('should maintain explicit classification on all snapshots and events', () => {
      const snap = SnapshotStore.createSnapshot({
        sourceId: 'SRC-PMAYG-AWAAS',
        sourceName: 'PMAY-G',
        records: [],
        classification: 'VERIFIED_SOURCE_DATA',
      });
      assert.strictEqual(snap.classification, 'VERIFIED_SOURCE_DATA');

      const demoSnap = SnapshotStore.createSnapshot({
        sourceId: 'DEMO_SRC',
        sourceName: 'Demo Source',
        records: [],
        classification: 'SIMULATED_DEMO',
      });
      assert.strictEqual(demoSnap.classification, 'SIMULATED_DEMO');
    });

    it('should gracefully handle empty record sets in snapshot comparison', () => {
      const snapEmpty = SnapshotStore.createSnapshot({
        sourceId: 'TEST_EMPTY',
        sourceName: 'Empty',
        records: [],
      });
      const snapFull = SnapshotStore.createSnapshot({
        sourceId: 'TEST_FULL',
        sourceName: 'Full',
        records: [makeRecord('R-512', 'Nandurbar', 512, 'JJM', { val: 10 })],
      });

      const comparison = SnapshotStore.compareSnapshots(snapEmpty, snapFull);
      assert.strictEqual(comparison.addedRecords.length, 1);
      assert.strictEqual(comparison.removedRecords.length, 0);
      assert.strictEqual(comparison.changedRecords.length, 0);
    });
  });
});
