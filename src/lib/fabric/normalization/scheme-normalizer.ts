import { Scheme, ResolvedCanonicalEntity } from '@/lib/types/data-fabric';
import { CANONICAL_SCHEMES_REGISTRY, CanonicalSchemeEntry } from '../registry/scheme-registry';
import { DeterministicNormalizer } from './normalizer';

const SCHEME_NOISE_TOKENS = [
  'scheme',
  'mission',
  'yojana',
  'project',
  'initiative',
  'sub-mission',
  'programme',
  'phase-i',
  'phase-ii',
  'phase-iii',
  'phase',
  'centrally',
  'sponsored',
  'sector',
  'national',
  'pradhan',
  'mantri',
];

export class SchemeNormalizer {
  private static schemeRegistry: CanonicalSchemeEntry[] = CANONICAL_SCHEMES_REGISTRY;

  /**
   * Deterministically resolves a raw scheme title, code, or alias to a Canonical Scheme Entity.
   */
  static resolve(rawInput: string): ResolvedCanonicalEntity<Scheme> {
    const rawTrimmed = (rawInput || '').trim();
    if (!rawTrimmed) {
      return {
        rawRecordId: '',
        entityType: 'Scheme',
        canonicalId: 'UNRESOLVED',
        canonicalName: 'UNKNOWN',
        confidence: 0,
        resolutionMethod: 'UNRESOLVED_FALLBACK',
        matchDetails: { inputTerm: rawTrimmed, matchedKey: '' },
      };
    }

    const sanitized = DeterministicNormalizer.sanitize(rawTrimmed);

    // 1. Direct Scheme Code or ID Match
    const schemeByCodeOrId = this.schemeRegistry.find(
      (s) =>
        s.code.toLowerCase() === sanitized.replace(/[^a-z0-9]/g, '') ||
        s.code.toLowerCase() === rawTrimmed.toLowerCase() ||
        s.id.toLowerCase() === rawTrimmed.toLowerCase()
    );

    if (schemeByCodeOrId) {
      return {
        rawRecordId: '',
        entityType: 'Scheme',
        canonicalId: schemeByCodeOrId.id,
        canonicalName: schemeByCodeOrId.name,
        code: schemeByCodeOrId.code,
        confidence: 100.0,
        resolutionMethod: 'CANONICAL_EXACT',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: schemeByCodeOrId.code,
          similarity: 100,
        },
        entity: schemeByCodeOrId,
      };
    }

    // 2. Official / Gazette Name Exact Match
    const exactNameMatch = this.schemeRegistry.find(
      (s) =>
        DeterministicNormalizer.sanitize(s.officialName) === sanitized ||
        DeterministicNormalizer.sanitize(s.gazetteName) === sanitized ||
        DeterministicNormalizer.sanitize(s.name) === sanitized
    );

    if (exactNameMatch) {
      return {
        rawRecordId: '',
        entityType: 'Scheme',
        canonicalId: exactNameMatch.id,
        canonicalName: exactNameMatch.name,
        code: exactNameMatch.code,
        confidence: 99.5,
        resolutionMethod: 'CANONICAL_EXACT',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: exactNameMatch.officialName,
          similarity: 100,
        },
        entity: exactNameMatch,
      };
    }

    // 3. Exact Alias Match
    for (const scheme of this.schemeRegistry) {
      for (const alias of scheme.aliases) {
        if (DeterministicNormalizer.sanitize(alias) === sanitized) {
          return {
            rawRecordId: '',
            entityType: 'Scheme',
            canonicalId: scheme.id,
            canonicalName: scheme.name,
            code: scheme.code,
            confidence: 99.0,
            resolutionMethod: 'ALIAS_EXACT',
            matchDetails: {
              inputTerm: rawTrimmed,
              matchedKey: alias,
              similarity: 100,
            },
            entity: scheme,
          };
        }
      }
    }

    // 4. Token-stripped Normalized Match
    const strippedInput = DeterministicNormalizer.stripNoiseTokens(rawTrimmed, SCHEME_NOISE_TOKENS);
    if (strippedInput.length > 2) {
      for (const scheme of this.schemeRegistry) {
        const strippedOfficial = DeterministicNormalizer.stripNoiseTokens(
          scheme.officialName,
          SCHEME_NOISE_TOKENS
        );
        if (strippedInput === strippedOfficial) {
          return {
            rawRecordId: '',
            entityType: 'Scheme',
            canonicalId: scheme.id,
            canonicalName: scheme.name,
            code: scheme.code,
            confidence: 98.0,
            resolutionMethod: 'NORMALIZED_CLEAN',
            matchDetails: {
              inputTerm: rawTrimmed,
              matchedKey: scheme.officialName,
              similarity: 98.0,
            },
            entity: scheme,
          };
        }

        for (const alias of scheme.aliases) {
          const strippedAlias = DeterministicNormalizer.stripNoiseTokens(
            alias,
            SCHEME_NOISE_TOKENS
          );
          if (strippedInput === strippedAlias) {
            return {
              rawRecordId: '',
              entityType: 'Scheme',
              canonicalId: scheme.id,
              canonicalName: scheme.name,
              code: scheme.code,
              confidence: 97.5,
              resolutionMethod: 'NORMALIZED_CLEAN',
              matchDetails: {
                inputTerm: rawTrimmed,
                matchedKey: alias,
                similarity: 97.5,
              },
              entity: scheme,
            };
          }
        }
      }
    }

    // 5. Deterministic Fuzzy & Composite Similarity Match
    let bestMatch: {
      scheme: CanonicalSchemeEntry;
      matchedKey: string;
      similarity: number;
      distance: number;
    } | null = null;

    for (const scheme of this.schemeRegistry) {
      const score = DeterministicNormalizer.computeCompositeSimilarity(sanitized, scheme.officialName);
      const lev = DeterministicNormalizer.computeLevenshtein(sanitized, scheme.officialName);

      if (!bestMatch || score > bestMatch.similarity) {
        bestMatch = {
          scheme,
          matchedKey: scheme.officialName,
          similarity: score,
          distance: lev.distance,
        };
      }

      for (const alias of scheme.aliases) {
        const aliasScore = DeterministicNormalizer.computeCompositeSimilarity(sanitized, alias);
        const aliasLev = DeterministicNormalizer.computeLevenshtein(sanitized, alias);

        if (aliasScore > bestMatch.similarity) {
          bestMatch = {
            scheme,
            matchedKey: alias,
            similarity: aliasScore,
            distance: aliasLev.distance,
          };
        }
      }
    }

    if (bestMatch && bestMatch.similarity >= 70.0) {
      const confidence = Number(Math.min(95.0, bestMatch.similarity).toFixed(1));
      return {
        rawRecordId: '',
        entityType: 'Scheme',
        canonicalId: bestMatch.scheme.id,
        canonicalName: bestMatch.scheme.name,
        code: bestMatch.scheme.code,
        confidence,
        resolutionMethod: 'LEVENSHTEIN_FUZZY',
        matchDetails: {
          inputTerm: rawTrimmed,
          matchedKey: bestMatch.matchedKey,
          distance: bestMatch.distance,
          similarity: bestMatch.similarity,
        },
        entity: bestMatch.scheme,
      };
    }

    // 6. Fallback Unresolved Entity
    return {
      rawRecordId: '',
      entityType: 'Scheme',
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
