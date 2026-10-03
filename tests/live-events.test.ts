import test from 'node:test';
import assert from 'node:assert/strict';
import { ChangeDetector } from '../src/lib/fabric/events/change-detector';
import { CanonicalEventBus } from '../src/lib/fabric/events/event-bus';
import {
  DEMO_SCENARIO_NANDURBAR_JJM_DRAWDOWN,
  DEMO_SCENARIO_GADCHIROLI_PMAYG_ACCELERATION,
  DEMO_SCENARIO_WASHIM_TAP_WATER_LAG,
  VERIFIED_BASELINE_EVENTS,
  SIMULATED_SCENARIOS,
} from '../src/lib/fabric/events/event-scenarios';

test('SUTRA V2 — Live Governance Intelligence & Event Engine Test Suite', async (t) => {
  await t.test('1. Deterministic Delta & Percentage Change Calculations', () => {
    // Nandurbar JJM Drawdown: 22.10 Cr -> 24.70 Cr
    const delta = ChangeDetector.calculateDelta(22.10, 24.70);
    const deltaPercent = ChangeDetector.calculateDeltaPercent(22.10, 24.70);

    assert.equal(delta, 2.6);
    assert.equal(deltaPercent, 11.76); // ((24.70 - 22.10)/22.10) * 100 = 11.7647... -> 11.76

    // Gadchiroli PMAY-G: 44.2% -> 51.9%
    const gdcDelta = ChangeDetector.calculateDelta(44.2, 51.9);
    const gdcDeltaPercent = ChangeDetector.calculateDeltaPercent(44.2, 51.9);

    assert.equal(gdcDelta, 7.7);
    assert.equal(gdcDeltaPercent, 17.42);

    // Negative change: 50.0 -> 40.0 (-20.0%)
    const negDelta = ChangeDetector.calculateDelta(50.0, 40.0);
    const negDeltaPercent = ChangeDetector.calculateDeltaPercent(50.0, 40.0);
    assert.equal(negDelta, -10.0);
    assert.equal(negDeltaPercent, -20.0);

    // Zero previous value edge-case handling
    const zeroDeltaPercent = ChangeDetector.calculateDeltaPercent(0, 15.0);
    assert.equal(zeroDeltaPercent, 100.0);
  });

  await t.test('2. Threshold Crossing & Severity Classification', () => {
    // Low change under 5% -> LOW
    assert.equal(ChangeDetector.classifySeverity(3.2), 'LOW');

    // Medium change between 5% and 15% -> MEDIUM
    assert.equal(ChangeDetector.classifySeverity(11.76), 'MEDIUM');

    // High change between 15% and 30% -> HIGH
    assert.equal(ChangeDetector.classifySeverity(18.4), 'HIGH');

    // Critical change > 30% -> CRITICAL
    assert.equal(ChangeDetector.classifySeverity(34.5), 'CRITICAL');

    // Custom threshold evaluation
    const thresholdTriggered = ChangeDetector.evaluateThreshold({
      metricName: 'fund_drawdown',
      currentValue: 24.70,
      thresholdValue: 23.00,
      direction: 'ABOVE',
    });
    assert.equal(thresholdTriggered, true);

    const thresholdNotTriggered = ChangeDetector.evaluateThreshold({
      metricName: 'fhtc_coverage',
      currentValue: 28.4,
      thresholdValue: 35.0,
      direction: 'ABOVE',
    });
    assert.equal(thresholdNotTriggered, false);
  });

  await t.test('3. Canonical Governance Event Creation with Cryptographic Provenance', () => {
    const event = ChangeDetector.createGovernanceEvent({
      datasetId: 'DATASET-JJM-MH-2026',
      source: 'Jal Jeevan Mission IMIS',
      districtId: 'Nandurbar',
      schemeId: 'JJM',
      eventType: 'FUND_DRAW_DOWN_CHANGED',
      previousValue: 22.10,
      currentValue: 24.70,
      unit: 'Cr',
      mode: 'LIVE_SIMULATION',
      evidenceIds: ['#7201'],
      findingId: 'SUTRA-FND-0001',
    });

    assert.ok(event.id.startsWith('EVT-'));
    assert.equal(event.lgdCode, '512'); // LGD resolved automatically for Nandurbar
    assert.equal(event.delta, 2.6);
    assert.equal(event.deltaPercent, 11.76);
    assert.equal(event.severity, 'MEDIUM');
    assert.equal(event.mode, 'LIVE_SIMULATION');
    assert.ok(event.provenanceHash.length === 64); // Valid SHA-256 hex string
    assert.deepEqual(event.evidenceIds, ['#7201']);
  });

  await t.test('4. District LGD Resolution during Event Normalization', () => {
    // Nandurbar
    const ndbEvent = ChangeDetector.createGovernanceEvent({
      datasetId: 'DATASET-JJM-MH-2026',
      source: 'JJM IMIS',
      districtId: 'Nandurbar',
      schemeId: 'JJM',
      eventType: 'FUND_DRAW_DOWN_CHANGED',
      previousValue: 10,
      currentValue: 12,
    });
    assert.equal(ndbEvent.lgdCode, '512');

    // Gadchiroli
    const gdcEvent = ChangeDetector.createGovernanceEvent({
      datasetId: 'DATASET-PMAYG-MH-2026',
      source: 'AwaasSoft',
      districtId: 'Gadchiroli',
      schemeId: 'PMAY-G',
      eventType: 'PHYSICAL_PROGRESS_CHANGED',
      previousValue: 40,
      currentValue: 48,
    });
    assert.equal(gdcEvent.lgdCode, '501');

    // Washim
    const wsmEvent = ChangeDetector.createGovernanceEvent({
      datasetId: 'DATASET-JJM-MH-2026',
      source: 'JJM IMIS',
      districtId: 'Washim',
      schemeId: 'JJM',
      eventType: 'COVERAGE_CHANGED',
      previousValue: 30,
      currentValue: 32,
    });
    assert.equal(wsmEvent.lgdCode, '525');
  });

  await t.test('5. Mode Separation: Real Verified Data vs Live Simulation Stream', () => {
    // Mode A: Verified Source Baseline
    const verifiedEvent = VERIFIED_BASELINE_EVENTS[0];
    assert.equal(verifiedEvent.mode, 'VERIFIED_SOURCE');
    assert.ok(verifiedEvent.datasetId.includes('JJM'));
    assert.ok(verifiedEvent.evidenceIds.length > 0);

    // Mode B: Live Simulation Demo Stream
    const demoScenario = DEMO_SCENARIO_NANDURBAR_JJM_DRAWDOWN;
    assert.equal(demoScenario.mode, 'LIVE_SIMULATION');
    assert.equal(demoScenario.districtName, 'Nandurbar');
    assert.equal(demoScenario.deltaPercent, 11.76);
    assert.equal(demoScenario.lgdCode, '512');

    // Ensure simulated scenario is never falsely flagged as verified baseline
    assert.notEqual(demoScenario.mode, 'VERIFIED_SOURCE');

    // Verify simulated scenarios catalog
    assert.equal(Object.keys(SIMULATED_SCENARIOS).length, 3);
    Object.values(SIMULATED_SCENARIOS).forEach((sc) => assert.equal(sc.event.mode, 'LIVE_SIMULATION'));
  });

  await t.test('6. Investigation Triggering & Multi-Evidence Linkage', () => {
    const bus = new CanonicalEventBus();

    let triggerCalled = false;
    bus.subscribe((event) => {
      if (event.districtName === 'Nandurbar' && event.schemeId === 'JJM') {
        triggerCalled = true;
        // Verify finding association and evidence anchor
        assert.equal(event.findingId, 'SUTRA-FND-0001');
        assert.ok(event.evidenceIds.includes('#7201'));
      }
    });

    bus.publish(DEMO_SCENARIO_NANDURBAR_JJM_DRAWDOWN);
    assert.equal(triggerCalled, true);
  });

  await t.test('7. Event Bus Telemetry & Rate Calculations', () => {
    const bus = new CanonicalEventBus();

    // Publish 3 scenario events on top of the 4 baseline events
    bus.publish(DEMO_SCENARIO_NANDURBAR_JJM_DRAWDOWN);
    bus.publish(DEMO_SCENARIO_GADCHIROLI_PMAYG_ACCELERATION);
    bus.publish(DEMO_SCENARIO_WASHIM_TAP_WATER_LAG);

    const history = bus.getHistory();
    assert.equal(history.length, 7);

    const summary = bus.getTelemetrySummary();
    assert.equal(summary.totalEventsProcessed, 7);
    assert.ok(summary.affectedDistrictsCount >= 3);
    assert.ok(summary.eventsPerMinute >= 0);
    assert.ok(summary.sourceHealthSummary.length === 3);

    // Verify all official connectors report audited status
    const jjmHealth = summary.sourceHealthSummary.find((s) => s.id === 'SRC-JJM-IMIS');
    assert.ok(jjmHealth);
    assert.equal(jjmHealth.status, 'ONLINE');
    assert.equal(jjmHealth.verificationLevel, 'OFFICIAL_SOURCE');
  });

  await t.test('8. Malformed Input & Stale Source Defensive Handling', () => {
    // Malformed NaN numbers handled deterministically
    const safeDelta = ChangeDetector.calculateDelta(NaN, 10);
    assert.equal(safeDelta, 0);

    const safeDeltaPercent = ChangeDetector.calculateDeltaPercent(10, NaN);
    assert.equal(safeDeltaPercent, 0);

    // Unregistered district returns fallback code '0'
    const unknownEvent = ChangeDetector.createGovernanceEvent({
      datasetId: 'DATASET-UNKNOWN',
      source: 'Unknown Feed',
      districtId: 'NonExistentDistrictXYZ',
      schemeId: 'SCHEME-X',
      eventType: 'ANOMALY_DETECTED',
      previousValue: 10,
      currentValue: 20,
    });
    assert.equal(unknownEvent.lgdCode, '0');
    assert.equal(unknownEvent.delta, 10);
  });
});
