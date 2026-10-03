import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GovernanceAnomalyEngine } from '../src/lib/fabric/anomaly/anomaly-engine';
import { LiveGovernanceEventMesh } from '../src/lib/fabric/mesh/event-mesh';
import { SnapshotStore } from '../src/lib/fabric/watchers/snapshot-store';
import { WatcherRegistry } from '../src/lib/fabric/watchers/watcher-registry';
import { LgdRegistry } from '../src/lib/fabric/registry/lgd-registry';
import { CanonicalRecord, CanonicalSnapshot } from '../src/lib/fabric/watchers/types';

describe('SUTRA V4 — Live Governance Event Mesh & Anomaly Engine Test Suite', () => {

  const makeRecord = (
    id: string,
    distName: string,
    lgd: string,
    scheme: string,
    metrics: Record<string, number | string>
  ): CanonicalRecord => ({
    recordId: id,
    districtId: `DIST-${lgd}`,
    districtName: distName,
    lgdCode: lgd,
    schemeId: scheme,
    reportingPeriod: '2026-03',
    metrics,
    hash: `HASH-${id}-${JSON.stringify(metrics)}`,
  });

  // ============================================================================
  // 1. PHASE 1: SOURCE TRUTH & CONNECTOR AUDIT
  // ============================================================================
  describe('1. Source Truth & Connector Audit', () => {
    it('should maintain explicit provenance metadata for official connectors', () => {
      WatcherRegistry.initialize();
      const watchers = WatcherRegistry.getAllWatcherStates();

      for (const state of watchers) {
        assert.ok(state.sourceId);
        assert.ok(state.sourceName);
        assert.ok(state.publisher);
        assert.ok(state.endpoint.startsWith('http'));
        assert.ok(state.snapshotHash.length >= 16);
        assert.ok(state.activeMode === 'VERIFIED_SOURCE_DATA' || state.activeMode === 'SIMULATED_DEMO');
      }
    });
  });

  // ============================================================================
  // 2. PHASE 2: DURABLE SNAPSHOT HISTORY & TIME MACHINE
  // ============================================================================
  describe('2. Durable Snapshot History & Time Machine', () => {
    it('should persist snapshot history ring buffer and reconstruct district metrics over time', () => {
      const snap1 = SnapshotStore.createSnapshot({
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM',
        records: [makeRecord('JJM-512', 'Nandurbar', '512', 'JJM', { utilizationRate: 48.2 })],
        timestamp: '2026-01-15T10:00:00.000Z',
      });

      const snap2 = SnapshotStore.createSnapshot({
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM',
        records: [makeRecord('JJM-512', 'Nandurbar', '512', 'JJM', { utilizationRate: 60.0 })],
        timestamp: '2026-02-15T10:00:00.000Z',
      });

      assert.ok(snap1.contentHash);
      assert.ok(snap2.contentHash);

      const history = SnapshotStore.getSnapshots('SRC-JJM-IMIS');
      assert.ok(history.length >= 2);

      const mesh = LiveGovernanceEventMesh.getInstance();
      const timeline = mesh.reconstructDistrictState('512');
      assert.strictEqual(timeline.lgdCode, '512');
      assert.ok(timeline.snapshots.length > 0);
    });
  });

  // ============================================================================
  // 3. PHASE 5: DETERMINISTIC ANOMALY ENGINE (7 STATUTORY RULES)
  // ============================================================================
  describe('3. Deterministic Anomaly Engine (7 Statutory Rules)', () => {
    it('Rule 1: should detect RATE_OF_CHANGE surges', () => {
      const jjmSnap: CanonicalSnapshot = {
        snapshotId: 'SNAP-JJM',
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM IMIS',
        timestamp: new Date().toISOString(),
        recordCount: 1,
        contentHash: 'H1',
        schemaVersion: '1.0.0',
        classification: 'VERIFIED_SOURCE_DATA',
        endpointType: 'STRUCTURED_ENDPOINT',
        retrievalStatus: 'SUCCESS',
        records: [makeRecord('JJM-512', 'Nandurbar', '512', 'JJM', { utilizationRate: 60.0 })],
      };

      const signals = GovernanceAnomalyEngine.evaluateDistrictAnomalies({
        districtLgdCode: '512',
        districtName: 'Nandurbar',
        snapshotsBySource: { 'SRC-JJM-IMIS': jjmSnap },
      });

      const rocSignal = signals.find((s) => s.ruleId === 'RULE_RATE_OF_CHANGE');
      assert.ok(rocSignal);
      assert.strictEqual(rocSignal?.severity, 'HIGH');
      assert.strictEqual(rocSignal?.calculation.computedScore, 15.0);
    });

    it('Rule 2: should detect FINANCIAL_PHYSICAL_DIVERGENCE', () => {
      const pmaygSnap: CanonicalSnapshot = {
        snapshotId: 'SNAP-PMAYG',
        sourceId: 'SRC-PMAYG-AWAAS',
        sourceName: 'PMAY-G',
        timestamp: new Date().toISOString(),
        recordCount: 1,
        contentHash: 'H2',
        schemaVersion: '1.0.0',
        classification: 'VERIFIED_SOURCE_DATA',
        endpointType: 'OFFICIAL_DOWNLOADABLE',
        retrievalStatus: 'SUCCESS',
        records: [
          makeRecord('PMAY-512', 'Nandurbar', '512', 'PMAY-G', {
            completion_percentage: 66.6,
            allocated_funds_cr: 100,
            utilized_funds_cr: 90, // 90% spend vs 66.6% completion = 23.4% divergence
          }),
        ],
      };

      const signals = GovernanceAnomalyEngine.evaluateDistrictAnomalies({
        districtLgdCode: '512',
        districtName: 'Nandurbar',
        snapshotsBySource: { 'SRC-PMAYG-AWAAS': pmaygSnap },
      });

      const fpdSignal = signals.find((s) => s.ruleId === 'RULE_FINANCIAL_PHYSICAL_DIVERGENCE');
      assert.ok(fpdSignal);
      assert.strictEqual(fpdSignal?.severity, 'CRITICAL');
      assert.strictEqual(fpdSignal?.calculation.computedScore, 23.4);
    });

    it('Rule 3: should detect CROSS_PROGRAMME_CONVERGENCE_GAP', () => {
      const jjmSnap: CanonicalSnapshot = {
        snapshotId: 'SNAP-JJM',
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM',
        timestamp: new Date().toISOString(),
        recordCount: 1,
        contentHash: 'H1',
        schemaVersion: '1.0.0',
        classification: 'VERIFIED_SOURCE_DATA',
        endpointType: 'STRUCTURED_ENDPOINT',
        retrievalStatus: 'SUCCESS',
        records: [makeRecord('JJM-512', 'Nandurbar', '512', 'JJM', { utilizationRate: 48.2 })],
      };

      const pmaygSnap: CanonicalSnapshot = {
        snapshotId: 'SNAP-PMAYG',
        sourceId: 'SRC-PMAYG-AWAAS',
        sourceName: 'PMAY-G',
        timestamp: new Date().toISOString(),
        recordCount: 1,
        contentHash: 'H2',
        schemaVersion: '1.0.0',
        classification: 'VERIFIED_SOURCE_DATA',
        endpointType: 'OFFICIAL_DOWNLOADABLE',
        retrievalStatus: 'SUCCESS',
        records: [
          makeRecord('PMAY-512', 'Nandurbar', '512', 'PMAY-G', {
            completion_percentage: 66.6,
          }),
        ],
      };

      const signals = GovernanceAnomalyEngine.evaluateDistrictAnomalies({
        districtLgdCode: '512',
        districtName: 'Nandurbar',
        snapshotsBySource: { 'SRC-JJM-IMIS': jjmSnap, 'SRC-PMAYG-AWAAS': pmaygSnap },
      });

      const convSignal = signals.find((s) => s.ruleId === 'RULE_CROSS_PROGRAMME_CONVERGENCE_GAP');
      assert.ok(convSignal);
      assert.strictEqual(convSignal?.calculation.computedScore, 18.4);
      assert.strictEqual(convSignal?.triggersInvestigation, true);
    });

    it('Rule 4: should detect GEOGRAPHIC_COVERAGE_GAP for PKVY', () => {
      const pkvySnap: CanonicalSnapshot = {
        snapshotId: 'SNAP-PKVY',
        sourceId: 'SRC-PKVY-OPEN',
        sourceName: 'PKVY',
        timestamp: new Date().toISOString(),
        recordCount: 1,
        contentHash: 'H3',
        schemaVersion: '1.0.0',
        classification: 'VERIFIED_SOURCE_DATA',
        endpointType: 'OFFICIAL_API',
        retrievalStatus: 'SUCCESS',
        records: [makeRecord('PKVY-512', 'Nandurbar', '512', 'PKVY', { organic_transition_rate: 14.5 })],
      };

      const signals = GovernanceAnomalyEngine.evaluateDistrictAnomalies({
        districtLgdCode: '512',
        districtName: 'Nandurbar',
        snapshotsBySource: { 'SRC-PKVY-OPEN': pkvySnap },
      });

      const geoSignal = signals.find((s) => s.ruleId === 'RULE_GEOGRAPHIC_COVERAGE_GAP');
      assert.ok(geoSignal);
      assert.strictEqual(geoSignal?.severity, 'HIGH');
    });

    it('Rule 5: should flag REPORTING_STALENESS for old snapshots', () => {
      const oldSnap: CanonicalSnapshot = {
        snapshotId: 'SNAP-OLD',
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM IMIS',
        timestamp: '2025-01-01T00:00:00.000Z', // 1+ year old
        recordCount: 1,
        contentHash: 'HOLD',
        schemaVersion: '1.0.0',
        classification: 'VERIFIED_SOURCE_DATA',
        endpointType: 'STRUCTURED_ENDPOINT',
        retrievalStatus: 'SUCCESS',
        records: [makeRecord('JJM-512', 'Nandurbar', '512', 'JJM', { utilizationRate: 48.2 })],
      };

      const signals = GovernanceAnomalyEngine.evaluateDistrictAnomalies({
        districtLgdCode: '512',
        districtName: 'Nandurbar',
        snapshotsBySource: { 'SRC-JJM-IMIS': oldSnap },
      });

      const staleSignal = signals.find((s) => s.ruleId === 'RULE_REPORTING_STALENESS');
      assert.ok(staleSignal);
    });

    it('Rule 6: should flag SUDDEN_UTILIZATION_CHANGE surge', () => {
      const jjmSnap: CanonicalSnapshot = {
        snapshotId: 'SNAP-JJM',
        sourceId: 'SRC-JJM-IMIS',
        sourceName: 'JJM',
        timestamp: new Date().toISOString(),
        recordCount: 1,
        contentHash: 'H1',
        schemaVersion: '1.0.0',
        classification: 'VERIFIED_SOURCE_DATA',
        endpointType: 'STRUCTURED_ENDPOINT',
        retrievalStatus: 'SUCCESS',
        records: [makeRecord('JJM-512', 'Nandurbar', '512', 'JJM', { utilizationRate: 85.0 })],
      };

      const signals = GovernanceAnomalyEngine.evaluateDistrictAnomalies({
        districtLgdCode: '512',
        districtName: 'Nandurbar',
        snapshotsBySource: { 'SRC-JJM-IMIS': jjmSnap },
      });

      const utilSignal = signals.find((s) => s.ruleId === 'RULE_SUDDEN_UTILIZATION_CHANGE');
      assert.ok(utilSignal);
      assert.strictEqual(utilSignal?.severity, 'HIGH');
    });

    it('Rule 7: should flag MISSING_EXPECTED_UPDATE if records are omitted', () => {
      const signals = GovernanceAnomalyEngine.evaluateDistrictAnomalies({
        districtLgdCode: '999',
        districtName: 'MissingDistrict',
        snapshotsBySource: {},
      });

      const missSignal = signals.find((s) => s.ruleId === 'RULE_MISSING_EXPECTED_UPDATE');
      assert.ok(missSignal);
    });
  });

  // ============================================================================
  // 4. PHASE 6: AUTOMATIC INVESTIGATION CREATION
  // ============================================================================
  describe('4. Automatic Investigation Creation from Anomaly Signals', () => {
    it('should automatically construct an auditable GovernanceInvestigation with mathematical proofs', () => {
      const mesh = LiveGovernanceEventMesh.getInstance();
      const mockSignal = {
        signalId: 'SIG-TEST-512',
        ruleId: 'RULE_CROSS_PROGRAMME_CONVERGENCE_GAP' as const,
        ruleName: 'Cross-Programme Convergence Gap',
        severity: 'HIGH' as const,
        districtId: 'dist_512',
        districtName: 'Nandurbar',
        lgdCode: '512',
        schemeIds: ['JJM', 'PMAY-G'],
        detectedAt: new Date().toISOString(),
        facts: [],
        calculation: {
          formulaName: 'Cross-Programme Delivery Pace Divergence',
          formulaText: 'ΔD = |PMAY-G - JJM|',
          computedScore: 18.4,
          threshold: 15.0,
        },
        evidenceRefs: ['#7201', '#4401'],
        snapshotHashes: ['H1', 'H2'],
        limitations: ['District-level co-occurrence.'],
        triggersInvestigation: true,
      };

      const investigation = mesh.autoCreateInvestigation(mockSignal);
      assert.ok(investigation);
      assert.strictEqual(investigation?.targetDistrictLgd, '512');
      assert.strictEqual(investigation?.targetDistrict.toUpperCase(), 'NANDURBAR');
      assert.ok(investigation?.findings.length > 0);
      assert.ok(investigation?.evidence.length > 0);
      assert.ok(investigation?.confidence >= 80);
    });
  });

  // ============================================================================
  // 5. PHASE 9: 36 DISTRICT EXPANSION
  // ============================================================================
  describe('5. 36 Maharashtra District Statutory Coverage', () => {
    it('should provide explicit coverage summary for all 36 Maharashtra districts without fabrication', () => {
      const coverage = LgdRegistry.getDistrictCoverageSummary();

      assert.strictEqual(coverage.totalDistricts, 36);
      assert.strictEqual(coverage.verifiedDistrictsCount, 28);
      assert.strictEqual(coverage.staleDistrictsCount, 5);
      assert.strictEqual(coverage.unavailableDistrictsCount, 3);
      assert.strictEqual(coverage.lgdResolutionQuality, 1.0);
      assert.strictEqual(coverage.breakdown.length, 36);
    });
  });
});
