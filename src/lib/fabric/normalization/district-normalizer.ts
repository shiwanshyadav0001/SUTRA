import { District, ResolvedCanonicalEntity } from '@/lib/types/data-fabric';
import { MAHARASHTRA_LGD_REGISTRY, LgdDistrictEntry } from '../registry/lgd-registry';
import { DeterministicNormalizer } from './normalizer';

const DISTRICT_NOISE_TOKENS = [
  'dist',
  'district',
  'tribal',
  'urban',
  'rural',
  'mh',
  'maharashtra',
  'taluka',
  'division',
  'belt',
  'state',
  'collectorate',
  'zilla',
  'parishad',
];

export class DistrictNormalizer {
  private static lgdRegistry: LgdDistrictEntry[] = MAHARASHTRA_LGD_REGISTRY;

  /**
   * Deterministically resolves a raw district string or identifier to a Canonical District Entity.
   * Priority:
   * 1. LGD Code Match (lgdCode or id)
   * 2. Exact Canonical Name Match
   * 3. Exact Alias Match
   * 4. Noise-stripped Token Match
   * 5. High-confidence Levenshtein/Composite Distance Match
   * 6. Fallback Unverified
   */
  static resolve(rawInput: string): ResolvedCanonicalEntity<District> {
    const rawTrimmed = (rawInput || '').trim();
    if (!rawTrimmed) {
      return {
        rawRecordId: '',
        entityType: 'District',
        canonicalId: 'UNRESOLVED',
        canonicalName: 'UNKNOWN',
        confidence: 0,
        resolutionMethod: 'UNRESOLVED_FALLBACK',
        matchDetails: { inputTerm: rawTrimmed, matchedKey: '' },
      };
    }

    const sanitized = DeterministicNormalizer.sanitize(rawTrimmed);

    // 1. Direct LGD Code or District ID Match
    const lgdNumericMatch = rawTrimmed.replace(/^LGD-?/i, '').trim();
    const lgdEntryByCode = this.lgdRegistry.find(
      (d) =>
        d.lgdCode === lgdNumericMatch ||
        d.id.toLowerCase() === rawTrimmed.toLowerCase() ||
        d.code.toLowerCase() === rawTrimmed.toLowerCase()
    );

    if (lgdEntryByCode) {
      return {
        rawRecordId: '',
        entityType: 'District',
        canonicalId: lgdEntryByCode.id,
        canonicalName: lgdEntryByCode.name.toUpperCase(),
        code: lgdEntryByCode.code,
        lgdCode: lgdEntryByCode.lgdCode,
        confidence: 100.0,
        resolutionMethod: 'LGD_CODE_EXACT',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: `LGD:${lgdEntryByCode.lgdCode}`,
          similarity: 100,
        },
        entity: lgdEntryByCode,
      };
    }

    // 2. Exact Canonical Name Match
    const exactNameMatch = this.lgdRegistry.find(
      (d) => DeterministicNormalizer.sanitize(d.name) === sanitized
    );

    if (exactNameMatch) {
      return {
        rawRecordId: '',
        entityType: 'District',
        canonicalId: exactNameMatch.id,
        canonicalName: exactNameMatch.name.toUpperCase(),
        code: exactNameMatch.code,
        lgdCode: exactNameMatch.lgdCode,
        confidence: 99.8,
        resolutionMethod: 'CANONICAL_EXACT',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: exactNameMatch.name,
          similarity: 100,
        },
        entity: exactNameMatch,
      };
    }

    // 3. Exact Alias Match from LGD Registry
    for (const district of this.lgdRegistry) {
      for (const alias of district.aliases) {
        if (DeterministicNormalizer.sanitize(alias) === sanitized) {
          return {
            rawRecordId: '',
            entityType: 'District',
            canonicalId: district.id,
            canonicalName: district.name.toUpperCase(),
            code: district.code,
            lgdCode: district.lgdCode,
            confidence: 99.2,
            resolutionMethod: 'ALIAS_EXACT',
            matchDetails: {
              inputTerm: rawTrimmed,
              matchedKey: alias,
              similarity: 100,
            },
            entity: district,
          };
        }
      }
    }

    // 4. Noise-stripped Normalized Token Match
    const strippedInput = DeterministicNormalizer.stripNoiseTokens(rawTrimmed, DISTRICT_NOISE_TOKENS);
    if (strippedInput.length > 2) {
      for (const district of this.lgdRegistry) {
        const strippedCanonical = DeterministicNormalizer.stripNoiseTokens(
          district.name,
          DISTRICT_NOISE_TOKENS
        );
        if (strippedInput === strippedCanonical) {
          return {
            rawRecordId: '',
            entityType: 'District',
            canonicalId: district.id,
            canonicalName: district.name.toUpperCase(),
            code: district.code,
            lgdCode: district.lgdCode,
            confidence: 98.5,
            resolutionMethod: 'NORMALIZED_CLEAN',
            matchDetails: {
              inputTerm: rawTrimmed,
              matchedKey: district.name,
              similarity: 98.5,
            },
            entity: district,
          };
        }

        for (const alias of district.aliases) {
          const strippedAlias = DeterministicNormalizer.stripNoiseTokens(
            alias,
            DISTRICT_NOISE_TOKENS
          );
          if (strippedInput === strippedAlias) {
            return {
              rawRecordId: '',
              entityType: 'District',
              canonicalId: district.id,
              canonicalName: district.name.toUpperCase(),
              code: district.code,
              lgdCode: district.lgdCode,
              confidence: 98.0,
              resolutionMethod: 'NORMALIZED_CLEAN',
              matchDetails: {
                inputTerm: rawTrimmed,
                matchedKey: alias,
                similarity: 98.0,
              },
              entity: district,
            };
          }
        }
      }
    }

    // 5. Deterministic Fuzzy Levenshtein & Composite Distance Match
    let bestMatch: {
      district: LgdDistrictEntry;
      matchedKey: string;
      similarity: number;
      distance: number;
    } | null = null;

    for (const district of this.lgdRegistry) {
      // Check against canonical name
      const score = DeterministicNormalizer.computeCompositeSimilarity(
        strippedInput || sanitized,
        district.name
      );
      const lev = DeterministicNormalizer.computeLevenshtein(
        strippedInput || sanitized,
        district.name
      );

      if (!bestMatch || score > bestMatch.similarity) {
        bestMatch = {
          district,
          matchedKey: district.name,
          similarity: score,
          distance: lev.distance,
        };
      }

      // Check against all aliases
      for (const alias of district.aliases) {
        const aliasScore = DeterministicNormalizer.computeCompositeSimilarity(
          strippedInput || sanitized,
          alias
        );
        const aliasLev = DeterministicNormalizer.computeLevenshtein(
          strippedInput || sanitized,
          alias
        );

        if (aliasScore > bestMatch.similarity) {
          bestMatch = {
            district,
            matchedKey: alias,
            similarity: aliasScore,
            distance: aliasLev.distance,
          };
        }
      }
    }

    if (bestMatch && bestMatch.similarity >= 75.0) {
      // Confidence reflects closeness of the match
      const confidence = Number(Math.min(96.0, bestMatch.similarity).toFixed(1));
      return {
        rawRecordId: '',
        entityType: 'District',
        canonicalId: bestMatch.district.id,
        canonicalName: bestMatch.district.name.toUpperCase(),
        code: bestMatch.district.code,
        lgdCode: bestMatch.district.lgdCode,
        confidence,
        resolutionMethod: 'LEVENSHTEIN_FUZZY',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: bestMatch.matchedKey,
          distance: bestMatch.distance,
          similarity: bestMatch.similarity,
        },
        entity: bestMatch.district,
      };
    }

    // 6. Fallback Unresolved Entity
    return {
      rawRecordId: '',
      entityType: 'District',
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
}
