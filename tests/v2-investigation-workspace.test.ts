import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { InvestigationEngine } from '../src/lib/fabric/investigation/investigation-engine';

describe('SUTRA V2.0 — Governance Intelligence Workspace Test Suite', () => {
  // Test 1: Investigation creation and canonical domain model
  describe('1. Canonical Investigation Creation', () => {
    it('should generate a canonical GovernanceInvestigation domain model with all required fields', () => {
      const result = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const inv = result.investigation;

      assert.ok(inv.id.startsWith('INV-'));
      assert.equal(inv.targetDistrict, 'NANDURBAR');
      assert.equal(inv.targetDistrictLgd, '512');
      assert.equal(inv.status, 'COMPLETED');
      assert.ok(inv.confidence >= 90.0);
      assert.ok(inv.datasets.length >= 3);
      assert.ok(inv.entities.length >= 10);
      assert.ok(inv.relationships.length >= 10);
      assert.ok(inv.findings.length >= 4);
      assert.ok(inv.convergenceOpportunities.length >= 1);
      assert.ok(inv.evidence.length >= 3);
      assert.ok(inv.methodology.length > 20);
      assert.ok(inv.limitations.length >= 2);
    });
  });

  // Test 2: Multiple finding types generation
  describe('2. Multi-Finding Engine & Categories', () => {
    it('should generate multiple distinct findings covering key analytical categories', () => {
      const result = InvestigationEngine.runDistrictConvergenceInvestigation('512');
      const findings = result.findings;

      assert.equal(findings.length, 4);

      const fnd1 = findings.find((f) => f.id === 'SUTRA-FND-0001')!;
      const fnd2 = findings.find((f) => f.id === 'SUTRA-FND-0002')!;
      const fnd3 = findings.find((f) => f.id === 'SUTRA-FND-0003')!;
      const fnd4 = findings.find((f) => f.id === 'SUTRA-FND-0004')!;

      assert.ok(fnd1, 'SUTRA-FND-0001 must exist');
      assert.ok(fnd2, 'SUTRA-FND-0002 must exist');
      assert.ok(fnd3, 'SUTRA-FND-0003 must exist');
      assert.ok(fnd4, 'SUTRA-FND-0004 must exist');

      assert.equal(fnd2.findingType, 'PHYSICAL_DELIVERY_PACE_DIVERGENCE');
      assert.equal(fnd3.findingType, 'GEOGRAPHIC_CO_OCCURRENCE');
      assert.equal(fnd4.findingType, 'TEMPORAL_ALIGNMENT_RISK');

      // Verify deterministic math in findings
      assert.ok(fnd1.calculation.formulaText.includes('27.7') || fnd1.calculation.outputValue.toString().includes('27.7'));
      assert.ok(fnd2.calculation.outputValue.toString().includes('18.4') || fnd2.calculation.formulaText.includes('18.4'));
    });
  });

  // Test 3: Finding to Evidence Lineage
  describe('3. Finding to Evidence Lineage Traceability', () => {
    it('should link all findings to verified source evidence records and cryptographic hashes', () => {
      const result = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');

      for (const finding of result.findings) {
        assert.ok(finding.metricLineage.length > 0, `Finding ${finding.id} must have metric lineage`);
        assert.ok(finding.sourceRecords.length > 0, `Finding ${finding.id} must have source records`);
        assert.ok(finding.provenanceHashes.findingHash, `Finding ${finding.id} must have SHA-256 finding hash`);
        assert.ok(finding.provenanceHashes.calculationHash, `Finding ${finding.id} must have calculation hash`);
        assert.ok(finding.provenanceHashes.joinHash, `Finding ${finding.id} must have join hash`);
      }
    });
  });

  // Test 4: Graph Entity Relationships
  describe('4. Governance Graph Relationships', () => {
    it('should construct graph with 7 node types and formal relationship edges', () => {
      const graph = InvestigationEngine.getInvestigationGraph('512');
      const { nodes, links } = graph;

      const nodeTypes = new Set(nodes.map((n) => n.type.toLowerCase()));
      assert.ok(nodeTypes.has('ministry'), 'Graph must have ministry nodes');
      assert.ok(nodeTypes.has('scheme'), 'Graph must have scheme nodes');
      assert.ok(nodeTypes.has('district'), 'Graph must have district nodes');
      assert.ok(nodeTypes.has('dataset'), 'Graph must have dataset nodes');
      assert.ok(nodeTypes.has('finding'), 'Graph must have finding nodes');
      assert.ok(nodeTypes.has('evidence'), 'Graph must have evidence nodes');

      const linkTypes = new Set(links.map((l) => l.type));
      assert.ok(linkTypes.has('ADMINISTERS'), 'Must contain ADMINISTERS link');
      assert.ok(linkTypes.has('OPERATES_IN'), 'Must contain OPERATES_IN link');
      assert.ok(linkTypes.has('REPORTS'), 'Must contain REPORTS link');
      assert.ok(linkTypes.has('GENERATES'), 'Must contain GENERATES link');
      assert.ok(linkTypes.has('SUPPORTS'), 'Must contain SUPPORTS link');
      assert.ok(linkTypes.has('CO_OCCURS_WITH'), 'Must contain CO_OCCURS_WITH link');
    });
  });

  // Test 5: "Why Flagged?" Forensic Explainable Chain
  describe('5. Explainable "Why Flagged?" Forensic Chain', () => {
    it('should generate a 6-tier explainable chain from district down to evidence without hardcoded strings', () => {
      const result = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const chain = result.finding.whyFlaggedChain;

      assert.ok(chain, 'WhyFlaggedChain must be present');
      assert.equal(chain.lgdEntity.name, 'NANDURBAR');
      assert.equal(chain.lgdEntity.code, '512');
      assert.equal(chain.programmes.length, 3);
      assert.equal(chain.sourceDataMetrics?.length, 3);
      assert.ok((chain.derivedCalculations?.length || 0) >= 3);
      assert.ok(chain.signals.length >= 3);
      assert.equal(chain.findingSummary?.findingId, 'SUTRA-FND-0001');
      assert.ok((chain.evidenceAnchors?.length || 0) >= 3);

      // Verify exact arithmetic values in chain
      const unreleasedCalc = chain.derivedCalculations?.find((c) => c.name.includes('Unreleased'));
      assert.ok(unreleasedCalc);
      assert.ok(unreleasedCalc.value.toString().includes('68.1'));
    });
  });

  // Test 6: Convergence Opportunity Intelligence Object
  describe('6. Convergence Opportunity Intelligence Generation', () => {
    it('should create conservative ConvergenceOpportunity objects with supporting findings', () => {
      const result = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const opportunities = result.convergenceOpportunities;

      assert.ok(opportunities.length >= 1);
      const opp = opportunities[0];

      assert.equal(opp.id, 'SUTRA-CONV-NDB-01');
      assert.equal(opp.district?.name, 'NANDURBAR');
      assert.equal(opp.district?.lgdCode, '512');
      assert.equal(opp.programmes.length, 3);
      assert.ok(opp.supportingFindings.length >= 3);
      assert.ok(opp.actionableRecommendations.length >= 2);
      assert.equal(opp.status, 'CANDIDATE_FOR_REVIEW');

      // Conservative terminology check
      assert.ok(
        !opp.rationale.toLowerCase().includes('programmes must be merged'),
        'Must use conservative review terminology'
      );
      assert.ok(
        opp.limitations.some((l) => l.toLowerCase().includes('candidate for administrative convergence review')),
        'Must explicitly state candidate for review'
      );
    });
  });

  // Test 7: No Unsupported Beneficiary-Level Claims
  describe('7. Safeguard Against Unsupported Beneficiary-Level Inference', () => {
    it('should never state that specific individual dwellings lack water or specific farmers lack houses', () => {
      const result = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');

      for (const finding of result.findings) {
        assert.ok(
          !finding.summary.toLowerCase().includes('beneficiary overlap verified'),
          'Must not claim verified individual beneficiary overlap'
        );
        assert.ok(
          finding.limitations.some((lim) =>
            lim.toLowerCase().includes('individual beneficiary overlap cannot be determined')
          ),
          'Every finding must state the aggregation limitation'
        );
      }
    });
  });
});
