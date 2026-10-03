import { Ministry, Department, ResolvedCanonicalEntity } from '@/lib/types/data-fabric';
import {
  CANONICAL_MINISTRIES_REGISTRY,
  CanonicalMinistryEntry,
  MinistryRegistry,
} from '../registry/ministry-registry';
import { DeterministicNormalizer } from './normalizer';

export class MinistryNormalizer {
  private static ministries: CanonicalMinistryEntry[] = CANONICAL_MINISTRIES_REGISTRY;

  /**
   * Deterministically resolves a raw ministry name or acronym to a Canonical Ministry Entity.
   */
  static resolveMinistry(rawInput: string): ResolvedCanonicalEntity<Ministry> {
    const rawTrimmed = (rawInput || '').trim();
    if (!rawTrimmed) {
      return {
        rawRecordId: '',
        entityType: 'Ministry',
        canonicalId: 'UNRESOLVED',
        canonicalName: 'UNKNOWN',
        confidence: 0,
        resolutionMethod: 'UNRESOLVED_FALLBACK',
        matchDetails: { inputTerm: rawTrimmed, matchedKey: '' },
      };
    }

    const sanitized = DeterministicNormalizer.sanitize(rawTrimmed);

    // 1. Direct Code / ID Match
    const byCode = this.ministries.find(
      (m) =>
        m.code.toLowerCase() === sanitized.replace(/[^a-z0-9]/g, '') ||
        m.code.toLowerCase() === rawTrimmed.toLowerCase() ||
        m.id.toLowerCase() === rawTrimmed.toLowerCase()
    );

    if (byCode) {
      return {
        rawRecordId: '',
        entityType: 'Ministry',
        canonicalId: byCode.id,
        canonicalName: byCode.name,
        code: byCode.code,
        confidence: 100.0,
        resolutionMethod: 'CANONICAL_EXACT',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: byCode.code,
          similarity: 100,
        },
        entity: byCode,
      };
    }

    // 2. Exact Name Match
    const byName = this.ministries.find(
      (m) => DeterministicNormalizer.sanitize(m.name) === sanitized
    );

    if (byName) {
      return {
        rawRecordId: '',
        entityType: 'Ministry',
        canonicalId: byName.id,
        canonicalName: byName.name,
        code: byName.code,
        confidence: 99.5,
        resolutionMethod: 'CANONICAL_EXACT',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: byName.name,
          similarity: 100,
        },
        entity: byName,
      };
    }

    // 3. Exact Alias Match
    for (const ministry of this.ministries) {
      for (const alias of ministry.aliases) {
        if (DeterministicNormalizer.sanitize(alias) === sanitized) {
          return {
            rawRecordId: '',
            entityType: 'Ministry',
            canonicalId: ministry.id,
            canonicalName: ministry.name,
            code: ministry.code,
            confidence: 99.0,
            resolutionMethod: 'ALIAS_EXACT',
            matchDetails: {
              inputTerm: rawTrimmed,
              matchedKey: alias,
              similarity: 100,
            },
            entity: ministry,
          };
        }
      }
    }

    // 4. Fuzzy Match
    let bestMatch: { ministry: CanonicalMinistryEntry; matchedKey: string; similarity: number } | null = null;
    for (const ministry of this.ministries) {
      const score = DeterministicNormalizer.computeCompositeSimilarity(sanitized, ministry.name);
      if (!bestMatch || score > bestMatch.similarity) {
        bestMatch = { ministry, matchedKey: ministry.name, similarity: score };
      }
      for (const alias of ministry.aliases) {
        const aliasScore = DeterministicNormalizer.computeCompositeSimilarity(sanitized, alias);
        if (aliasScore > bestMatch.similarity) {
          bestMatch = { ministry, matchedKey: alias, similarity: aliasScore };
        }
      }
    }

    if (bestMatch && bestMatch.similarity >= 70.0) {
      return {
        rawRecordId: '',
        entityType: 'Ministry',
        canonicalId: bestMatch.ministry.id,
        canonicalName: bestMatch.ministry.name,
        code: bestMatch.ministry.code,
        confidence: Number(Math.min(95.0, bestMatch.similarity).toFixed(1)),
        resolutionMethod: 'LEVENSHTEIN_FUZZY',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: bestMatch.matchedKey,
          similarity: bestMatch.similarity,
        },
        entity: bestMatch.ministry,
      };
    }

    return {
      rawRecordId: '',
      entityType: 'Ministry',
      canonicalId: `UNRESOLVED-${sanitized.toUpperCase().replace(/\s+/g, '_')}`,
      canonicalName: rawTrimmed.toUpperCase(),
      confidence: 50.0,
      resolutionMethod: 'UNRESOLVED_FALLBACK',
      matchDetails: {
        inputTerm: rawTrimmed,
        matchedKey: '',
        similarity: bestMatch?.similarity || 0,
      },
    };
  }

  /**
   * Deterministically resolves a raw department name or acronym.
   */
  static resolveDepartment(rawInput: string): ResolvedCanonicalEntity<Department> {
    const rawTrimmed = (rawInput || '').trim();
    const sanitized = DeterministicNormalizer.sanitize(rawTrimmed);
    const departments = MinistryRegistry.getAllDepartments();

    // Direct Code or ID match
    const byCode = departments.find(
      (d) =>
        d.code.toLowerCase() === sanitized.replace(/[^a-z0-9]/g, '') ||
        d.code.toLowerCase() === rawTrimmed.toLowerCase() ||
        d.id.toLowerCase() === rawTrimmed.toLowerCase()
    );

    if (byCode) {
      return {
        rawRecordId: '',
        entityType: 'Department',
        canonicalId: byCode.id,
        canonicalName: byCode.name,
        code: byCode.code,
        confidence: 100.0,
        resolutionMethod: 'CANONICAL_EXACT',
        matchDetails: { inputTerm: rawTrimmed, matchedKey: byCode.code, similarity: 100 },
        entity: byCode,
      };
    }

    // Name or Alias match
    for (const dept of departments) {
      if (DeterministicNormalizer.sanitize(dept.name) === sanitized) {
        return {
          rawRecordId: '',
          entityType: 'Department',
          canonicalId: dept.id,
          canonicalName: dept.name,
          code: dept.code,
          confidence: 99.5,
          resolutionMethod: 'CANONICAL_EXACT',
          matchDetails: { inputTerm: rawTrimmed, matchedKey: dept.name, similarity: 100 },
          entity: dept,
        };
      }
      for (const alias of dept.aliases || []) {
        if (DeterministicNormalizer.sanitize(alias) === sanitized) {
          return {
            rawRecordId: '',
            entityType: 'Department',
            canonicalId: dept.id,
            canonicalName: dept.name,
            code: dept.code,
            confidence: 99.0,
            resolutionMethod: 'ALIAS_EXACT',
            matchDetails: { inputTerm: rawTrimmed, matchedKey: alias, similarity: 100 },
            entity: dept,
          };
        }
      }
    }

    return {
      rawRecordId: '',
      entityType: 'Department',
      canonicalId: `UNRESOLVED-${sanitized.toUpperCase().replace(/\s+/g, '_')}`,
      canonicalName: rawTrimmed.toUpperCase(),
      confidence: 60.0,
      resolutionMethod: 'UNRESOLVED_FALLBACK',
      matchDetails: { inputTerm: rawTrimmed, matchedKey: '' },
    };
  }

  /**
   * Deterministically resolves a raw state string (e.g. MH, Maharastra, Bombay State)
   */
  static resolveState(rawInput: string): ResolvedCanonicalEntity {
    const rawTrimmed = (rawInput || '').trim();
    const sanitized = DeterministicNormalizer.sanitize(rawTrimmed);

    if (
      sanitized === 'mh' ||
      sanitized === 'maharashtra' ||
      sanitized === 'maharastra' ||
      sanitized === 'bombay' ||
      sanitized.includes('maharashtra') ||
      sanitized.includes('maharastra') ||
      sanitized.includes('bombay state')
    ) {
      return {
        rawRecordId: '',
        entityType: 'State',
        canonicalId: 'STATE-27',
        canonicalName: 'MAHARASHTRA',
        code: 'MH',
        confidence: 99.5,
        resolutionMethod: 'CANONICAL_EXACT',
        matchDetails: { inputTerm: rawTrimmed, matchedKey: 'Maharashtra', similarity: 100 },
      };
    }

    return {
      rawRecordId: '',
      entityType: 'State',
      canonicalId: `STATE-${sanitized.toUpperCase()}`,
      canonicalName: rawTrimmed.toUpperCase(),
      confidence: 75.0,
      resolutionMethod: 'UNRESOLVED_FALLBACK',
      matchDetails: { inputTerm: rawTrimmed, matchedKey: '' },
    };
  }
}
