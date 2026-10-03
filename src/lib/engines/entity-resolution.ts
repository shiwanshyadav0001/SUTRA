import { DistrictNormalizer } from '../fabric/normalization/district-normalizer';
import { SchemeNormalizer } from '../fabric/normalization/scheme-normalizer';
import { MinistryNormalizer } from '../fabric/normalization/ministry-normalizer';
import { ENTITY_RESOLUTION_SAMPLES } from '../data/governance-data';

export class EntityResolutionEngine {
  /**
   * Deterministically resolves State name using Data Fabric Ministry/State Normalizer.
   */
  static resolveState(rawInput: string) {
    const clean = (rawInput || '').trim();
    // First check exact predefined sample table
    const sampleMatch = ENTITY_RESOLUTION_SAMPLES.find(
      (s) => s.type === 'State' && s.raw.toLowerCase() === clean.toLowerCase()
    );

    if (sampleMatch) {
      return {
        resolved: sampleMatch.resolved,
        confidence: sampleMatch.confidence,
        targetType: sampleMatch.type,
        method: sampleMatch.algorithm || 'ISO-3166-2-GeoCode-Match',
      };
    }

    const stateResult = MinistryNormalizer.resolveState(clean);
    return {
      resolved: stateResult.canonicalName,
      confidence: stateResult.confidence,
      targetType: 'State',
      method: stateResult.resolutionMethod === 'CANONICAL_EXACT' ? 'Deterministic-LGD-Registry-Lookup' : 'Fuzzy-Match-LGD',
    };
  }

  /**
   * Deterministically resolves District using LGD-First DistrictNormalizer.
   */
  static resolveDistrict(rawInput: string) {
    const result = DistrictNormalizer.resolve(rawInput);

    let method = 'Deterministic-LGD-Match';
    if (result.resolutionMethod === 'LGD_CODE_EXACT') {
      method = 'LGD-Code-Direct-Match';
    } else if (result.resolutionMethod === 'ALIAS_EXACT') {
      method = 'Official-LGD-Alias-Match';
    } else if (result.resolutionMethod === 'NORMALIZED_CLEAN') {
      method = 'Prefix-Sanitization-LGD-Match';
    } else if (result.resolutionMethod === 'LEVENSHTEIN_FUZZY') {
      method = 'Levenshtein-LGD-Distance';
    } else if (result.resolutionMethod === 'UNRESOLVED_FALLBACK') {
      method = 'Unverified-Entity';
    }

    return {
      resolved: result.canonicalName,
      code: result.code,
      confidence: result.confidence,
      lgdCode: result.lgdCode ? `LGD-${result.lgdCode}` : result.canonicalId,
      targetType: 'District',
      method,
      canonicalId: result.canonicalId,
      matchDetails: result.matchDetails,
    };
  }

  /**
   * Deterministically resolves Scheme using SchemeNormalizer.
   */
  static resolveScheme(rawInput: string) {
    const result = SchemeNormalizer.resolve(rawInput);
    return {
      resolved: `${result.code ? result.code + ' (' + result.canonicalName + ')' : result.canonicalName}`,
      code: result.code,
      canonicalId: result.canonicalId,
      confidence: result.confidence,
      targetType: 'Scheme',
      method: result.resolutionMethod,
      matchDetails: result.matchDetails,
    };
  }

  /**
   * Deterministically resolves Ministry or Department using MinistryNormalizer.
   */
  static resolveMinistry(rawInput: string) {
    const result = MinistryNormalizer.resolveMinistry(rawInput);
    return {
      resolved: `${result.code ? result.code + ' (' + result.canonicalName + ')' : result.canonicalName}`,
      code: result.code,
      canonicalId: result.canonicalId,
      confidence: result.confidence,
      targetType: 'Ministry',
      method: result.resolutionMethod,
      matchDetails: result.matchDetails,
    };
  }
}
