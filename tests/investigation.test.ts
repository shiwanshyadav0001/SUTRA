import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { JJMConnector } from '../src/lib/fabric/connectors/jjm-connector';
import { PMAYGConnector } from '../src/lib/fabric/connectors/pmayg-connector';
import { PKVYConnector } from '../src/lib/fabric/connectors/pkvy-connector';
import { InvestigationEngine } from '../src/lib/fabric/investigation/investigation-engine';

describe('SUTRA Data Fabric v1.6 — Evidence Audit & Intelligence Hardening Test Suite', () => {
  // Test 1: Source values are preserved
  describe('1. Source Values Preservation', () => {
    it('should preserve original source fields and values across ingestion without modification or rounding loss', () => {
      const jjmRecords = JJMConnector.getRawRecords();
      const pmaygRecords = PMAYGConnector.getRawRecords();
      const pkvyRecords = PKVYConnector.getRawRecords();

      const ndbJjm = jjmRecords.find((r) => r.district_lgd_code === '512')!;
      const ndbPmayg = pmaygRecords.find((r) => r.district_lgd_code === '512')!;
      const ndbPkvy = pkvyRecords.find((r) => r.district_lgd_code === '512')!;

      assert.equal(ndbJjm.total_rural_households, 284000);
      assert.equal(ndbJjm.fhtc_provided_households, 80656);
      assert.equal(ndbJjm.coverage_percentage, 28.4);
      assert.equal(ndbJjm.allocated_funds_cr, 48.2);
      assert.equal(ndbJjm.utilized_funds_cr, 20.1);

      assert.equal(ndbPmayg.sanctioned_houses, 46800);
      assert.equal(ndbPmayg.completed_pucca_houses, 21902);
      assert.equal(ndbPmayg.completion_percentage, 46.8);
      assert.equal(ndbPmayg.allocated_funds_cr, 64.5);
      assert.equal(ndbPmayg.utilized_funds_cr, 32.8);

      assert.equal(ndbPkvy.enrolled_farmers, 38400);
      assert.equal(ndbPkvy.certified_clusters, 24);
      assert.equal(ndbPkvy.organic_transition_rate, 41.5);
      assert.equal(ndbPkvy.allocated_funds_cr, 14.2);
      assert.equal(ndbPkvy.utilized_funds_cr, 5.9);
    });
  });

  // Test 2: Source vs derived values are distinguishable
  describe('2. Source Facts vs Derived Metrics Separation', () => {
    it('should strictly classify outputs into SOURCE_FACT, DERIVED_METRIC, and INTERPRETATION', () => {
      const investigation = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const finding = investigation.finding;

      assert.ok(finding.factBreakdown.sourceFacts.length >= 3, 'Must contain documented source facts');
      assert.ok(finding.factBreakdown.derivedMetrics.length >= 3, 'Must contain explicit derived metrics');
      assert.ok(finding.factBreakdown.interpretations.length >= 2, 'Must contain documented interpretations');

      // Check metric lineage items
      const sourceFacts = finding.metricLineage.filter((m) => m.classification === 'SOURCE_FACT');
      const derivedMetrics = finding.metricLineage.filter((m) => m.classification === 'DERIVED_METRIC');

      assert.ok(sourceFacts.length >= 6, 'Must have at least 6 source facts in lineage');
      assert.ok(derivedMetrics.length >= 4, 'Must have at least 4 derived metrics in lineage');

      for (const fact of sourceFacts) {
        assert.ok(fact.sourceDatasetId, 'Source fact must reference sourceDatasetId');
        assert.ok(fact.sourceField, 'Source fact must reference exact sourceField');
      }

      for (const derived of derivedMetrics) {
        assert.ok(derived.formula, 'Derived metric must state explicit formula');
        assert.ok(derived.derivationStep, 'Derived metric must explain derivation step');
      }
    });
  });

  // Test 3: Units are preserved
  describe('3. Unit Preservation & Financial Stages', () => {
    it('should preserve explicit units and financial stages across all metrics', () => {
      const investigation = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const definitions = investigation.finding.metricDefinitions;

      const jjmAlloc = definitions.find((d) => d.metricKey === 'JJM_ALLOCATED_FUNDS');
      assert.ok(jjmAlloc);
      assert.equal(jjmAlloc.unit, '₹ Crore');
      assert.equal(jjmAlloc.financialStage, 'APPROVED_ALLOCATION');

      const pmaygDbt = definitions.find((d) => d.metricKey === 'PMAYG_DISBURSED_DBT');
      assert.ok(pmaygDbt);
      assert.equal(pmaygDbt.unit, '₹ Crore');
      assert.equal(pmaygDbt.financialStage, 'DISBURSED_DBT');

      const jjmCoverage = definitions.find((d) => d.metricKey === 'JJM_FHTC_COVERAGE_RATE');
      assert.ok(jjmCoverage);
      assert.equal(jjmCoverage.unit, '% of rural households');
      assert.equal(jjmCoverage.financialStage, 'COVERAGE_RATE');
    });
  });

  // Test 4: Reporting periods are preserved
  describe('4. Reporting Periods Preservation', () => {
    it('should preserve and expose explicit reporting periods and frequencies for each dataset', () => {
      const investigation = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const datasets = investigation.finding.datasetsUsed;

      const jjm = datasets.find((d) => d.id === 'DS-JJM-MH');
      assert.ok(jjm);
      assert.equal(jjm.reportingFrequency, 'MONTHLY');

      const pmayg = datasets.find((d) => d.id === 'DS-PMAYG-MH');
      assert.ok(pmayg);
      assert.equal(pmayg.reportingFrequency, 'QUARTERLY');

      const pkvy = datasets.find((d) => d.id === 'DS-PKVY-MH');
      assert.ok(pkvy);
      assert.equal(pkvy.reportingFrequency, 'ANNUAL');
    });
  });

  // Test 5: Percentage-point difference is not represented as beneficiary overlap
  describe('5. Physical Delivery Pace vs Beneficiary Overlap Claim', () => {
    it('should represent percentage-point differences as physical delivery pace divergence rather than beneficiary overlap', () => {
      const investigation = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const finding = investigation.finding;

      assert.equal(finding.findingType, 'COVERAGE_CONVERGENCE_SIGNAL');
      assert.ok(
        !finding.detailedAnalysis.includes('without synchronized potable water access'),
        'Must not assert individual dwelling lack of water without person-level PII'
      );
      assert.ok(
        finding.detailedAnalysis.includes('physical pace divergence') ||
          finding.detailedAnalysis.includes('delivery pace divergence'),
        'Must describe metric as physical pace divergence'
      );
    });
  });

  // Test 6: District-level data cannot produce beneficiary-level claims
  describe('6. Geographic Aggregation Safety & Disclaimers', () => {
    it('should explicitly document that district-level data reflects geographic co-occurrence, not individual beneficiary overlap', () => {
      const investigation = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const limitations = investigation.finding.limitations;

      const hasBeneficiaryDisclaimer = limitations.some((lim) =>
        lim.toLowerCase().includes('individual beneficiary overlap cannot be determined')
      );
      assert.ok(hasBeneficiaryDisclaimer, 'Must include explicit limitation disclaimer regarding lack of person-level identity');

      const hasDenominatorNote = limitations.some((lim) =>
        lim.toLowerCase().includes('denominators are scheme-specific')
      );
      assert.ok(hasDenominatorNote, 'Must explain scheme-specific denominators (sanctioned units vs total rural census households)');
    });
  });

  // Test 7: Confidence is derived from documented components
  describe('7. Multi-Attribute Confidence Model', () => {
    it('should calculate overall confidence strictly from documented component scores with explicit weights', () => {
      const assessment = InvestigationEngine.computeConfidenceAssessment('EXACT', 'ASYNC_REPORTING', 3, 3);

      assert.equal(assessment.components.sourceAuthority.score, 1.0);
      assert.equal(assessment.components.sourceAuthority.weight, 0.25);

      assert.equal(assessment.components.geographicJoin.score, 1.0);
      assert.equal(assessment.components.geographicJoin.weight, 0.30);

      assert.equal(assessment.components.temporalAlignment.score, 0.65);
      assert.equal(assessment.components.temporalAlignment.weight, 0.20);

      assert.equal(assessment.components.metricCompleteness.score, 1.0);
      assert.equal(assessment.components.metricCompleteness.weight, 0.15);

      assert.equal(assessment.components.transformationComplexity.score, 0.90);
      assert.equal(assessment.components.transformationComplexity.weight, 0.10);

      // Expected calculation: 0.25*1.0 + 0.30*1.0 + 0.20*0.65 + 0.15*1.0 + 0.10*0.90 = 0.25 + 0.30 + 0.13 + 0.15 + 0.09 = 0.92 = 92.0%
      assert.equal(assessment.overallScore, 92.0);
      assert.equal(assessment.rating, 'HIGH');
    });
  });

  // Test 8: Asynchronous datasets are flagged
  describe('8. Asynchronous Dataset Flagging', () => {
    it('should flag multi-cadence reporting relationships as ASYNC_REPORTING with explanatory notes', () => {
      const investigation = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const finding = investigation.finding;

      assert.equal(finding.temporalAlignment, 'ASYNC_REPORTING');
      assert.ok(finding.temporalCoverageNote.includes('Asynchronous reporting cycles'));
      assert.ok(finding.temporalCoverageNote.includes('JJM operates on monthly telemetry'));
      assert.ok(finding.temporalCoverageNote.includes('PMAY-G on quarterly'));
    });
  });

  // Test 9: Every finding metric has evidence lineage
  describe('9. Comprehensive Evidence Lineage', () => {
    it('should provide an end-to-end audit lineage item for every displayed metric in the investigation', () => {
      const investigation = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const lineage = investigation.finding.metricLineage;

      const metricIds = lineage.map((m) => m.metricId);
      assert.ok(metricIds.includes('M-JJM-ALLOC'));
      assert.ok(metricIds.includes('M-JJM-DRAW'));
      assert.ok(metricIds.includes('M-JJM-COV'));
      assert.ok(metricIds.includes('M-PMAYG-ALLOC'));
      assert.ok(metricIds.includes('M-PMAYG-DBT'));
      assert.ok(metricIds.includes('M-PMAYG-COMP'));
      assert.ok(metricIds.includes('M-PKVY-ALLOC'));
      assert.ok(metricIds.includes('M-PKVY-DRAW'));
      assert.ok(metricIds.includes('M-DERIVED-TOT-ALLOC'));
      assert.ok(metricIds.includes('M-DERIVED-TOT-DRAW'));
      assert.ok(metricIds.includes('M-DERIVED-UNRELEASED'));
      assert.ok(metricIds.includes('M-DERIVED-COMPOSITE-DRAW'));
      assert.ok(metricIds.includes('M-DERIVED-DRAW-DEFICIT'));
      assert.ok(metricIds.includes('M-DERIVED-PACE-DIV'));
    });
  });

  // Test 10: Deterministic calculation remains reproducible
  describe('10. Reproducibility & Mathematical Invariance', () => {
    it('should produce mathematically invariant numbers and identical SHA-256 provenance hashes across repeated executions', () => {
      const run1 = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const run2 = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');

      assert.equal(run1.finding.id, run2.finding.id);
      assert.equal(run1.finding.confidence, run2.finding.confidence);
      assert.equal(
        run1.finding.provenanceHashes.findingHash,
        run2.finding.provenanceHashes.findingHash
      );
      assert.equal(
        run1.finding.provenanceHashes.calculationHash,
        run2.finding.provenanceHashes.calculationHash
      );
      assert.equal(
        run1.finding.calculation.outputValue,
        run2.finding.calculation.outputValue
      );
    });
  });
});

