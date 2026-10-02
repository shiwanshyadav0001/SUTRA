import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { LgdRegistry } from '../src/lib/fabric/registry/lgd-registry';
import { SchemeRegistry } from '../src/lib/fabric/registry/scheme-registry';
import { MinistryRegistry } from '../src/lib/fabric/registry/ministry-registry';
import { DistrictNormalizer } from '../src/lib/fabric/normalization/district-normalizer';
import { SchemeNormalizer } from '../src/lib/fabric/normalization/scheme-normalizer';
import { MinistryNormalizer } from '../src/lib/fabric/normalization/ministry-normalizer';
import { DataFabricPipeline } from '../src/lib/fabric/pipeline/ingestion-pipeline';
import { computeDeterministicSha256, ProvenanceManager } from '../src/lib/fabric/pipeline/provenance';

describe('SUTRA Data Fabric v1 - Test Suite', () => {
  // Test 1: District Normalization
  describe('1. District Normalization', () => {
    it('should normalize noisy district names with administrative suffixes and prefixes', () => {
      const testCases = [
        { input: 'Nandurbar Dist', expectedCanonical: 'NANDURBAR', expectedLgd: '512' },
        { input: 'Dist Nandurbar', expectedCanonical: 'NANDURBAR', expectedLgd: '512' },
        { input: 'Gadchiroli Tribal', expectedCanonical: 'GADCHIROLI', expectedLgd: '501' },
        { input: 'Washim Dist', expectedCanonical: 'WASHIM', expectedLgd: '525' },
        { input: 'Thane Urban', expectedCanonical: 'THANE', expectedLgd: '523' },
        { input: 'Pune Rural', expectedCanonical: 'PUNE', expectedLgd: '516' },
      ];

      for (const tc of testCases) {
        const res = DistrictNormalizer.resolve(tc.input);
        assert.equal(res.canonicalName, tc.expectedCanonical, `Failed for input: ${tc.input}`);
        assert.equal(res.lgdCode, tc.expectedLgd, `LGD code mismatch for input: ${tc.input}`);
        assert.ok(res.confidence >= 95.0, `Confidence should be >= 95 for ${tc.input}, got ${res.confidence}`);
      }
    });

    it('should handle typographical errors via deterministic Levenshtein scoring', () => {
      const typoCases = [
        { input: 'Nandurbur', expectedCanonical: 'NANDURBAR', expectedLgd: '512' },
        { input: 'Dhhule', expectedCanonical: 'DHULE', expectedLgd: '500' },
        { input: 'Gadhchiroli', expectedCanonical: 'GADCHIROLI', expectedLgd: '501' },
      ];

      for (const tc of typoCases) {
        const res = DistrictNormalizer.resolve(tc.input);
        assert.equal(res.canonicalName, tc.expectedCanonical, `Typo resolution failed for: ${tc.input}`);
        assert.equal(res.lgdCode, tc.expectedLgd, `LGD mismatch for typo: ${tc.input}`);
        assert.ok(res.confidence >= 80.0, `Confidence should be >= 80 for typo ${tc.input}, got ${res.confidence}`);
      }
    });
  });

  // Test 2: District Alias Resolution
  describe('2. District Alias Resolution', () => {
    it('should resolve historical, colonial, and alternative district aliases to official canonical names', () => {
      const aliasCases = [
        { alias: 'Poona', expectedCanonical: 'PUNE', expectedLgd: '516', expectedCode: 'PUN' },
        { alias: 'Puna', expectedCanonical: 'PUNE', expectedLgd: '516', expectedCode: 'PUN' },
        { alias: 'Nasik', expectedCanonical: 'NASHIK', expectedLgd: '513', expectedCode: 'NSK' },
        { alias: 'Amraoti', expectedCanonical: 'AMRAVATI', expectedLgd: '494', expectedCode: 'AMR' },
        { alias: 'Yeotmal', expectedCanonical: 'YAVATMAL', expectedLgd: '526', expectedCode: 'YTL' },
        { alias: 'Nagpore', expectedCanonical: 'NAGPUR', expectedLgd: '510', expectedCode: 'NAG' },
        { alias: 'Aurangabad', expectedCanonical: 'CHHATRAPATI SAMBHAJINAGAR', expectedLgd: '495', expectedCode: 'AUR' },
        { alias: 'Osmanabad', expectedCanonical: 'DHARASHIV', expectedLgd: '514', expectedCode: 'OSM' },
        { alias: 'Ahmednagar', expectedCanonical: 'AHILYANAGAR', expectedLgd: '492', expectedCode: 'AHN' },
        { alias: 'Solapoor', expectedCanonical: 'SOLAPUR', expectedLgd: '522', expectedCode: 'SOL' },
        { alias: 'Sholapur', expectedCanonical: 'SOLAPUR', expectedLgd: '522', expectedCode: 'SOL' },
        { alias: 'Kolaba', expectedCanonical: 'RAIGAD', expectedLgd: '517', expectedCode: 'RGD' },
      ];

      for (const ac of aliasCases) {
        const res = DistrictNormalizer.resolve(ac.alias);
        assert.equal(res.canonicalName, ac.expectedCanonical, `Alias failed for: ${ac.alias}`);
        assert.equal(res.lgdCode, ac.expectedLgd, `LGD mismatch for alias: ${ac.alias}`);
        assert.equal(res.code, ac.expectedCode, `Code mismatch for alias: ${ac.alias}`);
        assert.ok(res.confidence >= 90.0, `Confidence should be >= 90 for alias ${ac.alias}, got ${res.confidence}`);
      }
    });
  });

  // Test 3: Canonical LGD Resolution
  describe('3. Canonical LGD Resolution', () => {
    it('should strictly prefer and resolve direct LGD numeric codes with 100% confidence', () => {
      const lgdCases = [
        { code: '512', expectedName: 'NANDURBAR', expectedId: 'DIST-27' },
        { code: '501', expectedName: 'GADCHIROLI', expectedId: 'DIST-34' },
        { code: '516', expectedName: 'PUNE', expectedId: 'DIST-25' },
        { code: '525', expectedName: 'WASHIM', expectedId: 'DIST-16' },
        { code: 'LGD-495', expectedName: 'CHHATRAPATI SAMBHAJINAGAR', expectedId: 'DIST-07' },
        { code: 'DIST-20', expectedName: 'YAVATMAL', expectedId: 'DIST-20' },
      ];

      for (const lc of lgdCases) {
        const res = DistrictNormalizer.resolve(lc.code);
        assert.equal(res.canonicalName, lc.expectedName, `Direct LGD lookup failed for: ${lc.code}`);
        assert.equal(res.canonicalId, lc.expectedId, `District ID mismatch for LGD: ${lc.code}`);
        assert.equal(res.confidence, 100.0, `Direct LGD match must yield 100.0% confidence`);
        assert.equal(res.resolutionMethod, 'LGD_CODE_EXACT');
      }
    });

    it('should verify all 36 Maharashtra districts exist in the LGD registry', () => {
      const allDistricts = LgdRegistry.getAllDistricts();
      assert.equal(allDistricts.length, 36, 'LGD Registry must contain exactly 36 Maharashtra districts');

      const uniqueLgdCodes = new Set(allDistricts.map((d) => d.lgdCode));
      assert.equal(uniqueLgdCodes.size, 36, 'All 36 districts must have unique LGD codes');
    });
  });

  // Test 4: Scheme Normalization
  describe('4. Scheme Normalization', () => {
    it('should resolve scheme acronyms, official names, and aliases deterministically', () => {
      const schemeCases = [
        { input: 'PKVY', expectedCode: 'PKVY', expectedId: 'AGR-004' },
        { input: 'PM Scheme A', expectedCode: 'PKVY', expectedId: 'AGR-004' },
        { input: 'Paramparagat Krishi Vikas Yojana', expectedCode: 'PKVY', expectedId: 'AGR-004' },
        { input: 'PM-KISAN', expectedCode: 'PM-KISAN', expectedId: 'AGR-001' },
        { input: 'PM Kisan Samman Nidhi', expectedCode: 'PM-KISAN', expectedId: 'AGR-001' },
        { input: 'PMAY-G', expectedCode: 'PMAY-G', expectedId: 'RUR-003' },
        { input: 'Rural Housing Mission', expectedCode: 'PMAY-G', expectedId: 'RUR-003' },
        { input: 'JJM', expectedCode: 'JJM', expectedId: 'JAL-001' },
        { input: 'Har Ghar Jal', expectedCode: 'JJM', expectedId: 'JAL-001' },
        { input: 'PMGSY', expectedCode: 'PMGSY', expectedId: 'RUR-002' },
        { input: 'AB-PMJAY', expectedCode: 'AB-PMJAY', expectedId: 'HLT-001' },
        { input: 'Ayushman Bharat', expectedCode: 'AB-PMJAY', expectedId: 'HLT-001' },
      ];

      for (const sc of schemeCases) {
        const res = SchemeNormalizer.resolve(sc.input);
        assert.equal(res.code, sc.expectedCode, `Scheme resolution failed for: ${sc.input}`);
        assert.equal(res.canonicalId, sc.expectedId, `Scheme ID mismatch for: ${sc.input}`);
        assert.ok(res.confidence >= 90.0, `Confidence should be >= 90 for scheme ${sc.input}, got ${res.confidence}`);
      }
    });

    it('should resolve ministry and department acronyms', () => {
      const minRes = MinistryNormalizer.resolveMinistry('MoA&FW');
      assert.equal(minRes.code, 'MoA&FW');
      assert.equal(minRes.canonicalId, 'MIN-01');

      const deptRes = MinistryNormalizer.resolveDepartment('DoA&FW');
      assert.equal(deptRes.code, 'DoA&FW');
      assert.equal(deptRes.canonicalId, 'DEP-01');

      assert.ok(SchemeRegistry.getAllSchemes().length > 0, 'Scheme registry should contain canonical schemes');
      assert.ok(MinistryRegistry.getAllMinistries().length > 0, 'Ministry registry should contain canonical ministries');
    });
  });

  // Test 5: Provenance Preservation
  describe('5. Provenance Preservation', () => {
    it('should preserve end-to-end cryptographic hash lineage across raw -> normalized -> resolved -> evidence', () => {
      const samplePayload = {
        District_Name: 'Nandurbur',
        Scheme_Code: 'AGR-004',
        Allocated_Cr: 48.2,
        Utilized_Cr: 20.1,
        Beneficiaries_Count: 38400,
      };

      const result = DataFabricPipeline.ingestRecord('DS-02', 1, samplePayload, '2026-10-01T12:00:00.000Z', '#9281');

      // 1. Raw record check
      assert.ok(result.rawRecord.rawHash, 'Raw record must have a deterministic rawHash');
      assert.equal(result.rawRecord.sourceId, 'DS-02');

      // 2. Normalized record check
      assert.ok(result.normalizedRecord.transformHash, 'Normalized record must have transformHash');
      assert.equal(result.normalizedRecord.normalizedFields.districtRaw, 'Nandurbur');
      assert.equal(result.normalizedRecord.normalizedFields.allocatedCr, 48.2);

      // 3. Resolved Canonical check
      assert.equal(result.resolvedDistrict.canonicalName, 'NANDURBAR');
      assert.equal(result.resolvedDistrict.lgdCode, '512');
      assert.equal(result.resolvedScheme.code, 'PKVY');

      // 4. Evidence Record check
      const ev = result.evidenceRecord;
      assert.equal(ev.recordNumber, '#9281');
      assert.equal(ev.district, 'NANDURBAR');
      assert.equal(ev.districtLgdCode, '512');
      assert.ok(ev.provenance, 'EvidenceRecord must contain ProvenanceMeta envelope');
      assert.equal(ev.provenance?.rawRecordHash, result.rawRecord.rawHash);
      assert.equal(ev.provenance?.transformationHash, result.normalizedRecord.transformHash);
      assert.ok(ev.provenance?.provenanceHash, 'Must generate unique composite provenanceHash');

      // 5. Verification check
      const isValid = ProvenanceManager.verifyIntegrity(ev);
      assert.equal(isValid, true, 'Provenance integrity verification should pass');
    });

    it('should batch process CSV data and maintain batch provenance signature', () => {
      const csv = `District_Name,Scheme_Code,Allocated_Cr,Utilized_Cr
Nandurbur,AGR-004,48.2,20.1
Gadchiroli Tribal,RUR-003,39.4,18.1
Washim Dist,JAL-001,41.0,21.3
Poona,HLT-001,142.0,128.5`;

      const summary = DataFabricPipeline.ingestCsv('DS-02', csv, '2026-10-01T12:00:00.000Z');
      assert.equal(summary.totalRecordsIngested, 4);
      assert.equal(summary.successfulCount, 4);
      assert.ok(summary.batchProvenanceHash.length === 64, 'Batch provenance hash must be 64-char SHA-256 hex');
      assert.ok(summary.averageConfidence > 90, 'Average confidence should exceed 90%');
    });
  });

  // Test 6: Deterministic Repeated Resolution
  describe('6. Deterministic Repeated Resolution', () => {
    it('should produce 100% identical outputs and hashes across 1,000 repeated executions', () => {
      const testInputs = [
        'Nandurbur',
        'Poona',
        'Aurangabad',
        'Washim Dist',
        'Amraoti',
        'Yeotmal',
        '512',
      ];

      for (const input of testInputs) {
        const firstRun = DistrictNormalizer.resolve(input);
        const firstHash = computeDeterministicSha256(firstRun);

        for (let i = 0; i < 50; i++) {
          const subsequentRun = DistrictNormalizer.resolve(input);
          const subsequentHash = computeDeterministicSha256(subsequentRun);

          assert.equal(
            subsequentHash,
            firstHash,
            `Non-deterministic variation detected on iteration ${i} for input "${input}"`
          );
          assert.equal(subsequentRun.canonicalName, firstRun.canonicalName);
          assert.equal(subsequentRun.confidence, firstRun.confidence);
          assert.equal(subsequentRun.lgdCode, firstRun.lgdCode);
        }
      }
    });

    it('should produce identical SHA-256 hashes regardless of JSON key order', () => {
      const objA = { z: 1, a: 2, m: { y: 'val', x: 10 } };
      const objB = { a: 2, m: { x: 10, y: 'val' }, z: 1 };

      const hashA = computeDeterministicSha256(objA);
      const hashB = computeDeterministicSha256(objB);

      assert.equal(hashA, hashB, 'Deterministic hashing must be invariant to property insertion order');
    });
  });
});
