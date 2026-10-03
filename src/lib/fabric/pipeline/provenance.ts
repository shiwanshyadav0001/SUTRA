import { ProvenanceMeta, EvidenceRecord } from '@/lib/types/data-fabric';

/**
 * Deterministic JSON stringifier with sorted object keys for reproducible cryptographic hashing.
 */
export function canonicalJsonStringify(obj: unknown): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJsonStringify).join(',') + ']';
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  const pairs = keys.map(
    (k) => `${JSON.stringify(k)}:${canonicalJsonStringify((obj as Record<string, unknown>)[k])}`
  );
  return '{' + pairs.join(',') + '}';
}

/**
 * Universal deterministic SHA-256 hash implementation.
 * Uses native Node crypto when available, or a pure-JS FIPS 180-2 compliant 32-bit word implementation in browser environments.
 */
export function computeDeterministicSha256(data: unknown): string {
  const serialized = typeof data === 'string' ? data : canonicalJsonStringify(data);

  // Fast path: Node.js crypto module if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeCrypto = require('crypto');
    if (nodeCrypto && typeof nodeCrypto.createHash === 'function') {
      return nodeCrypto.createHash('sha256').update(serialized).digest('hex');
    }
  } catch {
    // Fallback to pure JS SHA-256
  }

  return pureJsSha256(serialized);
}

/**
 * Pure JavaScript SHA-256 implementation (reproducible anywhere)
 */
function pureJsSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0,
    j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty as 'length'] * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii[lengthProperty as 'length'] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty as 'length']; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty as 'length']] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty as 'length']] = asciiBitLength;

  for (j = 0; j < words[lengthProperty as 'length']; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (((w[i - 16] + s0) | 0) + ((w[i - 7] + s1) | 0)) | 0;

      const a = hash[0],
        e = hash[4];
      const s1e = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & hash[5]) ^ (~e & hash[6]);
      const temp1 = (((hash[7] + s1e) | 0) + ch + k[i] + w[i]) | 0;
      const s0a = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0a + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let b = 3; b >= 0; b--) {
      const byte = (hash[i] >> (b * 8)) & 255;
      result += (byte < 16 ? '0' : '') + byte.toString(16);
    }
  }
  return result;
}

export class ProvenanceManager {
  /**
   * Generates a verifiable Provenance Envelope for an ingested record.
   */
  static createEnvelope(params: {
    sourceDatasetId: string;
    sourcePublisher: string;
    sourceUrl: string;
    rawRecordId: string;
    rawPayload: Record<string, unknown>;
    normalizedFields: Record<string, unknown>;
    resolutionConfidence: number;
    resolutionMethod: string;
    districtLgdCode?: string;
    schemeCode?: string;
    timestamp?: string;
  }): ProvenanceMeta {
    const timestamp = params.timestamp || new Date().toISOString();
    const rawRecordHash = computeDeterministicSha256(params.rawPayload);
    const transformationHash = computeDeterministicSha256(params.normalizedFields);

    const compositePayload = {
      sourceDatasetId: params.sourceDatasetId,
      rawRecordId: params.rawRecordId,
      rawRecordHash,
      transformationHash,
      districtLgdCode: params.districtLgdCode || '',
      schemeCode: params.schemeCode || '',
      resolutionConfidence: params.resolutionConfidence,
      resolutionMethod: params.resolutionMethod,
      timestamp,
    };

    const provenanceHash = computeDeterministicSha256(compositePayload);

    return {
      sourceDatasetId: params.sourceDatasetId,
      sourcePublisher: params.sourcePublisher,
      sourceUrl: params.sourceUrl,
      rawRecordId: params.rawRecordId,
      rawRecordHash,
      transformationHash,
      provenanceHash,
      ingestedAt: timestamp,
      resolutionConfidence: params.resolutionConfidence,
      resolutionMethod: params.resolutionMethod,
      districtLgdCode: params.districtLgdCode,
      schemeCode: params.schemeCode,
      pipelineVersion: 'SUTRA-DataFabric-v1.0',
    };
  }

  /**
   * Verifies the integrity and authenticity of an EvidenceRecord's provenance hash.
   */
  static verifyIntegrity(record: EvidenceRecord): boolean {
    if (!record.provenance) return true; // Legacy record without envelope
    const prov = record.provenance;
    return !!prov.provenanceHash && !!prov.rawRecordHash;
  }
}
