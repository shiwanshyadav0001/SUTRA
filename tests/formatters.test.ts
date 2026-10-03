import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  formatIndianNumber,
  formatStandardNumber,
  formatDeterministicCrores,
  formatDeterministicDate,
  formatDeterministicIST,
} from '../src/lib/formatters';
import { InvestigationEngine } from '../src/lib/fabric/investigation/investigation-engine';

describe('SUTRA Deterministic Formatter & Hydration Invariance Test Suite', () => {
  describe('1. Indian Numbering System Determinism', () => {
    it('should format numbers with exact Indian grouping without locale dependencies', () => {
      // Small numbers
      assert.equal(formatIndianNumber(0), '0');
      assert.equal(formatIndianNumber(42), '42');
      assert.equal(formatIndianNumber(999), '999');

      // Thousands
      assert.equal(formatIndianNumber(1000), '1,000');
      assert.equal(formatIndianNumber(5000), '5,000');
      assert.equal(formatIndianNumber(50000), '50,000');

      // Exact targets from the user hydration issue:
      assert.equal(formatIndianNumber(218000), '2,18,000');
      assert.equal(formatIndianNumber(1648295), '16,48,295');

      // Crores
      assert.equal(formatIndianNumber(10000000), '1,00,00,000');
      assert.equal(formatIndianNumber(12345678), '1,23,45,678');

      // Negative numbers
      assert.equal(formatIndianNumber(-1648295), '-16,48,295');

      // Decimals
      assert.equal(formatIndianNumber(1648295.45), '16,48,295.45');
    });

    it('should handle string inputs, null, and undefined safely', () => {
      assert.equal(formatIndianNumber('1648295'), '16,48,295');
      assert.equal(formatIndianNumber(null), '0');
      assert.equal(formatIndianNumber(undefined), '0');
      assert.equal(formatIndianNumber(''), '0');
    });
  });

  describe('2. Standard 3-digit Grouping Determinism', () => {
    it('should format numbers with 3-digit comma grouping', () => {
      assert.equal(formatStandardNumber(1648295), '1,648,295');
      assert.equal(formatStandardNumber(218000), '218,000');
    });
  });

  describe('3. Financial Crores Formatting', () => {
    it('should format INR Crores deterministically', () => {
      assert.equal(formatDeterministicCrores(68.1), '₹68.10 Cr');
      assert.equal(formatDeterministicCrores(120), '₹120.00 Cr');
    });
  });

  describe('4. Deterministic Date & Time Formatting', () => {
    it('should format UTC date deterministically', () => {
      const fixedDate = new Date('2025-10-15T10:30:00Z');
      assert.equal(formatDeterministicDate(fixedDate), '15 Oct 2025');
    });

    it('should format IST string deterministically', () => {
      const fixedDate = new Date('2025-10-15T12:00:00Z');
      const formatted = formatDeterministicIST(fixedDate);
      assert.ok(formatted.includes('15 Oct 2025'));
      assert.ok(formatted.includes('IST'));
    });
  });

  describe('5. Investigation Pipeline Inspector Hydration Invariance', () => {
    it('should produce identical deterministic strings for census population and beneficiaries', () => {
      const result = InvestigationEngine.runDistrictConvergenceInvestigation('Nandurbar');
      const fact3 = result.finding.factBreakdown.sourceFacts[2];

      // Must explicitly contain the Indian formatted strings 16,48,295 and 2,18,000
      assert.ok(
        fact3.includes('16,48,295 census population'),
        `Expected fact3 to contain '16,48,295 census population', received: ${fact3}`
      );
      assert.ok(
        fact3.includes('2,18,000 tracked scheme beneficiaries'),
        `Expected fact3 to contain '2,18,000 tracked scheme beneficiaries', received: ${fact3}`
      );
    });
  });
});
