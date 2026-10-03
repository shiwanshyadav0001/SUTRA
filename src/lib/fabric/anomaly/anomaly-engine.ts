import { GovernanceAnomalySignal } from '@/lib/types/events';
import { CanonicalSnapshot } from '../watchers/types';

export interface AnomalyEvaluationContext {
  districtLgdCode: string;
  districtName: string;
  snapshotsBySource: Record<string, CanonicalSnapshot>;
  customTimestamp?: string;
}

export class GovernanceAnomalyEngine {
  /**
   * Evaluates all 7 statutory anomaly rules across active snapshots for a given district.
   */
  static evaluateDistrictAnomalies(ctx: AnomalyEvaluationContext): GovernanceAnomalySignal[] {
    const signals: GovernanceAnomalySignal[] = [];
    const now = ctx.customTimestamp || new Date().toISOString();

    const jjmSnap = ctx.snapshotsBySource['SRC-JJM-IMIS'] || ctx.snapshotsBySource['DS-JJM-MH'];
    const pmaygSnap = ctx.snapshotsBySource['SRC-PMAYG-AWAAS'] || ctx.snapshotsBySource['DS-PMAYG-MH'];
    const pkvySnap = ctx.snapshotsBySource['SRC-PKVY-OPEN'] || ctx.snapshotsBySource['DS-PKVY-MH'];

    const jjmRec = jjmSnap?.records.find((r) => r.lgdCode === ctx.districtLgdCode);
    const pmaygRec = pmaygSnap?.records.find((r) => r.lgdCode === ctx.districtLgdCode);
    const pkvyRec = pkvySnap?.records.find((r) => r.lgdCode === ctx.districtLgdCode);

    // --------------------------------------------------------------------------
    // RULE 1: RATE_OF_CHANGE
    // --------------------------------------------------------------------------
    if (jjmRec && typeof jjmRec.metrics.utilizationRate === 'number') {
      const utilRate = Number(jjmRec.metrics.utilizationRate);
      const benchmarkRate = 45.0; // Baseline expected rate for period
      const rateDiff = Number((utilRate - benchmarkRate).toFixed(2));

      if (Math.abs(rateDiff) >= 10.0) {
        signals.push({
          signalId: `SIG-ROC-${ctx.districtLgdCode}-${Date.now().toString(36).toUpperCase()}`,
          ruleId: 'RULE_RATE_OF_CHANGE',
          ruleName: 'Statutory Rate of Expenditure Change Surge',
          severity: Math.abs(rateDiff) >= 15.0 ? 'HIGH' : 'MEDIUM',
          districtId: `dist_${ctx.districtLgdCode}`,
          districtName: ctx.districtName,
          lgdCode: ctx.districtLgdCode,
          schemeIds: ['JJM'],
          detectedAt: now,
          facts: [
            {
              observedValue: `${utilRate}%`,
              expectedOrBenchmarkValue: `${benchmarkRate}%`,
              unit: 'Percentage',
              description: `JJM fund draw down rate observed at ${utilRate}% vs statutory period benchmark of ${benchmarkRate}%`,
            },
          ],
          calculation: {
            formulaName: 'Rate of Change Deviation',
            formulaText: 'ΔR = |Observed Rate - Period Benchmark|',
            computedScore: Math.abs(rateDiff),
            threshold: 10.0,
            deltaPp: rateDiff,
          },
          evidenceRefs: ['#7201'],
          snapshotHashes: [jjmSnap?.contentHash || ''].filter(Boolean),
          limitations: ['District-level aggregation reflects monthly IMIS reporting window.'],
          triggersInvestigation: Math.abs(rateDiff) >= 15.0,
          suggestedInvestigationTitle: `Rapid JJM Drawdown Surge in ${ctx.districtName}`,
        });
      }
    }

    // --------------------------------------------------------------------------
    // RULE 2: FINANCIAL_PHYSICAL_DIVERGENCE
    // --------------------------------------------------------------------------
    if (
      pmaygRec &&
      typeof pmaygRec.metrics.completion_percentage === 'number' &&
      typeof pmaygRec.metrics.utilized_funds_cr === 'number' &&
      typeof pmaygRec.metrics.allocated_funds_cr === 'number'
    ) {
      const completionPct = Number(pmaygRec.metrics.completion_percentage);
      const allocatedCr = Number(pmaygRec.metrics.allocated_funds_cr);
      const utilizedCr = Number(pmaygRec.metrics.utilized_funds_cr);
      const financialSpendPct = allocatedCr > 0 ? Number(((utilizedCr / allocatedCr) * 100).toFixed(2)) : 0;
      const divergence = Number((financialSpendPct - completionPct).toFixed(2));

      if (Math.abs(divergence) >= 12.0) {
        signals.push({
          signalId: `SIG-FPD-${ctx.districtLgdCode}-${Date.now().toString(36).toUpperCase()}`,
          ruleId: 'RULE_FINANCIAL_PHYSICAL_DIVERGENCE',
          ruleName: 'Financial Disbursement vs Physical Milestone Divergence',
          severity: Math.abs(divergence) >= 20.0 ? 'CRITICAL' : 'HIGH',
          districtId: `dist_${ctx.districtLgdCode}`,
          districtName: ctx.districtName,
          lgdCode: ctx.districtLgdCode,
          schemeIds: ['PMAY-G'],
          detectedAt: now,
          facts: [
            {
              observedValue: `${financialSpendPct}%`,
              expectedOrBenchmarkValue: `${completionPct}% physical completion`,
              unit: 'Percentage',
              description: `PMAY-G financial disbursement pace (${financialSpendPct}%) diverges from physical pucca house completions (${completionPct}%)`,
            },
          ],
          calculation: {
            formulaName: 'Financial vs Physical Divergence Metric',
            formulaText: 'ΔFPD = |(Utilized / Allocated) * 100 - Physical Completion Rate|',
            computedScore: Math.abs(divergence),
            threshold: 12.0,
            deltaPp: divergence,
          },
          evidenceRefs: ['#4401'],
          snapshotHashes: [pmaygSnap?.contentHash || ''].filter(Boolean),
          limitations: ['PMAY-G housing milestones rely on geo-tagged photo inspections in AwaasSoft.'],
          triggersInvestigation: true,
          suggestedInvestigationTitle: `PMAY-G Disbursement vs Physical Construction Gap in ${ctx.districtName}`,
        });
      }
    }

    // --------------------------------------------------------------------------
    // RULE 3: CROSS_PROGRAMME_CONVERGENCE_GAP
    // --------------------------------------------------------------------------
    if (
      jjmRec &&
      pmaygRec &&
      typeof jjmRec.metrics.utilizationRate === 'number' &&
      typeof pmaygRec.metrics.completion_percentage === 'number'
    ) {
      const jjmUtil = Number(jjmRec.metrics.utilizationRate);
      const pmaygComp = Number(pmaygRec.metrics.completion_percentage);
      const deltaD = Number(Math.abs(pmaygComp - jjmUtil).toFixed(2));

      if (deltaD >= 15.0) {
        signals.push({
          signalId: `SIG-CONV-${ctx.districtLgdCode}-${Date.now().toString(36).toUpperCase()}`,
          ruleId: 'RULE_CROSS_PROGRAMME_CONVERGENCE_GAP',
          ruleName: 'Cross-Programme Pace Divergence (PMAY-G vs JJM)',
          severity: deltaD >= 18.0 ? 'HIGH' : 'MEDIUM',
          districtId: `dist_${ctx.districtLgdCode}`,
          districtName: ctx.districtName,
          lgdCode: ctx.districtLgdCode,
          schemeIds: ['PMAY-G', 'JJM'],
          detectedAt: now,
          facts: [
            {
              observedValue: `PMAY-G: ${pmaygComp}%, JJM: ${jjmUtil}%`,
              expectedOrBenchmarkValue: 'ΔD < 10.0 pp target alignment',
              unit: 'Percentage Points',
              description: `Physical housing completion rate exceeds piped tap water drawdown by ${deltaD} pp in LGD ${ctx.districtLgdCode}`,
            },
          ],
          calculation: {
            formulaName: 'Cross-Programme Delivery Pace Divergence',
            formulaText: 'ΔD = |PMAY-G Completion Rate - JJM Drawdown Rate|',
            computedScore: deltaD,
            threshold: 15.0,
            deltaPp: deltaD,
          },
          evidenceRefs: ['#7201', '#4401'],
          snapshotHashes: [jjmSnap?.contentHash || '', pmaygSnap?.contentHash || ''].filter(Boolean),
          limitations: [
            'Represents geographic co-occurrence at district level, not verified dwelling-level overlap.',
          ],
          triggersInvestigation: true,
          suggestedInvestigationTitle: `Cross-Programme Convergence Gap in ${ctx.districtName}`,
        });
      }
    }

    // --------------------------------------------------------------------------
    // RULE 4: GEOGRAPHIC_COVERAGE_GAP
    // --------------------------------------------------------------------------
    if (pkvyRec && typeof pkvyRec.metrics.organic_transition_rate === 'number') {
      const transitionRate = Number(pkvyRec.metrics.organic_transition_rate);
      const minimumTarget = 30.0;

      if (transitionRate < minimumTarget) {
        signals.push({
          signalId: `SIG-GEO-${ctx.districtLgdCode}-${Date.now().toString(36).toUpperCase()}`,
          ruleId: 'RULE_GEOGRAPHIC_COVERAGE_GAP',
          ruleName: 'Organic Soil Health Cluster Coverage Deficit',
          severity: transitionRate < 20.0 ? 'HIGH' : 'MEDIUM',
          districtId: `dist_${ctx.districtLgdCode}`,
          districtName: ctx.districtName,
          lgdCode: ctx.districtLgdCode,
          schemeIds: ['PKVY'],
          detectedAt: now,
          facts: [
            {
              observedValue: `${transitionRate}%`,
              expectedOrBenchmarkValue: `${minimumTarget}% baseline target`,
              unit: 'Percentage',
              description: `Organic agriculture transition rate is ${transitionRate}%, falling below the state target of ${minimumTarget}%`,
            },
          ],
          calculation: {
            formulaName: 'Geographic Coverage Deficit Metric',
            formulaText: 'Deficit = Max(0, Regional Minimum Target - Observed Coverage Rate)',
            computedScore: Number((minimumTarget - transitionRate).toFixed(2)),
            threshold: minimumTarget,
            deltaPp: Number((transitionRate - minimumTarget).toFixed(2)),
          },
          evidenceRefs: ['#5501'],
          snapshotHashes: [pkvySnap?.contentHash || ''].filter(Boolean),
          limitations: ['PKVY cluster certifications follow multi-year PGS-India conversion timelines.'],
          triggersInvestigation: transitionRate < 20.0,
          suggestedInvestigationTitle: `Organic Farming Adoption Deficit in ${ctx.districtName}`,
        });
      }
    }

    // --------------------------------------------------------------------------
    // RULE 5: REPORTING_STALENESS
    // --------------------------------------------------------------------------
    const snapshotsList = [jjmSnap, pmaygSnap, pkvySnap].filter(Boolean) as CanonicalSnapshot[];
    for (const snap of snapshotsList) {
      const snapTime = new Date(snap.timestamp).getTime();
      const diffDays = (new Date(now).getTime() - snapTime) / (1000 * 60 * 60 * 24);
      if (diffDays > 60) {
        signals.push({
          signalId: `SIG-STALE-${snap.sourceId}-${ctx.districtLgdCode}`,
          ruleId: 'RULE_REPORTING_STALENESS',
          ruleName: `Statutory Cadence Staleness for ${snap.sourceName}`,
          severity: 'MEDIUM',
          districtId: `dist_${ctx.districtLgdCode}`,
          districtName: ctx.districtName,
          lgdCode: ctx.districtLgdCode,
          schemeIds: [snap.sourceName.split(' ')[0]],
          detectedAt: now,
          facts: [
            {
              observedValue: `${Math.floor(diffDays)} days since sync`,
              expectedOrBenchmarkValue: 'Within statutory reporting cadence',
              unit: 'Days',
              description: `Source snapshot ${snap.snapshotId} was retrieved ${Math.floor(diffDays)} days ago`,
            },
          ],
          calculation: {
            formulaName: 'Reporting Cadence Latency',
            formulaText: 'LatencyDays = (CurrentTime - LastSnapshotTime) / (86400 * 1000)',
            computedScore: diffDays,
            threshold: 60.0,
          },
          evidenceRefs: [],
          snapshotHashes: [snap.contentHash],
          limitations: ['Government open data portals may publish quarterly or bi-annual batches.'],
          triggersInvestigation: false,
        });
      }
    }

    // --------------------------------------------------------------------------
    // RULE 6: SUDDEN_UTILIZATION_CHANGE
    // --------------------------------------------------------------------------
    if (jjmRec && typeof jjmRec.metrics.utilizationRate === 'number') {
      const utilRate = Number(jjmRec.metrics.utilizationRate);
      if (utilRate >= 75.0) {
        signals.push({
          signalId: `SIG-UTIL-${ctx.districtLgdCode}-${Date.now().toString(36).toUpperCase()}`,
          ruleId: 'RULE_SUDDEN_UTILIZATION_CHANGE',
          ruleName: 'Accelerated Fund Drawdown Velocity',
          severity: 'HIGH',
          districtId: `dist_${ctx.districtLgdCode}`,
          districtName: ctx.districtName,
          lgdCode: ctx.districtLgdCode,
          schemeIds: ['JJM'],
          detectedAt: now,
          facts: [
            {
              observedValue: `${utilRate}%`,
              expectedOrBenchmarkValue: '< 70% Q3 threshold',
              unit: 'Percentage',
              description: `JJM fund draw down in ${ctx.districtName} reached ${utilRate}% before final fiscal quarter`,
            },
          ],
          calculation: {
            formulaName: 'Utilization Velocity Threshold',
            formulaText: 'Surge = Observed Utilization - Q3 Fiscal Threshold',
            computedScore: utilRate,
            threshold: 70.0,
            deltaPp: utilRate - 70.0,
          },
          evidenceRefs: ['#7201'],
          snapshotHashes: [jjmSnap?.contentHash || ''].filter(Boolean),
          limitations: ['Verification requires audited state treasury release receipts.'],
          triggersInvestigation: true,
          suggestedInvestigationTitle: `Accelerated JJM Fiscal Utilization in ${ctx.districtName}`,
        });
      }
    }

    // --------------------------------------------------------------------------
    // RULE 7: MISSING_EXPECTED_UPDATE
    // --------------------------------------------------------------------------
    if (!jjmRec || !pmaygRec) {
      signals.push({
        signalId: `SIG-MISS-${ctx.districtLgdCode}-${Date.now().toString(36).toUpperCase()}`,
        ruleId: 'RULE_MISSING_EXPECTED_UPDATE',
        ruleName: 'Missing Statutory District Dataset Records',
        severity: 'MEDIUM',
        districtId: `dist_${ctx.districtLgdCode}`,
        districtName: ctx.districtName,
        lgdCode: ctx.districtLgdCode,
        schemeIds: !jjmRec ? ['JJM'] : ['PMAY-G'],
        detectedAt: now,
        facts: [
          {
            observedValue: 'Record Omitted',
            expectedOrBenchmarkValue: 'Mandatory district return',
            unit: 'Presence',
            description: `LGD district ${ctx.districtLgdCode} (${ctx.districtName}) is absent in active official snapshot`,
          },
        ],
        calculation: {
          formulaName: 'Record Completeness Audit',
          formulaText: 'Completeness = Count(Available Records) / Count(Statutory Districts)',
          computedScore: 0,
          threshold: 1,
        },
        evidenceRefs: [],
        snapshotHashes: [],
        limitations: ['District may have undergone administrative bifurcation or name variation.'],
        triggersInvestigation: false,
      });
    }

    return signals;
  }
}
