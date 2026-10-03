import { EvidenceRecord, JoinRecordResult, JoinQuality } from '@/lib/types/data-fabric';
import { LgdRegistry } from '../registry/lgd-registry';
import { DistrictNormalizer } from '../normalization/district-normalizer';

export interface JoinDatasetInput {
  datasetId: string;
  records: EvidenceRecord[];
}

export class CrossDatasetJoinEngine {
  /**
   * Deterministically joins multiple datasets using the Local Government Directory (LGD) district code as the primary identity anchor.
   */
  static joinByDistrictLgd(datasets: JoinDatasetInput[]): JoinRecordResult[] {
    if (!datasets || datasets.length === 0) return [];

    // Map of LGD Code -> Map of DatasetId -> EvidenceRecord
    const districtLgdMap = new Map<
      string,
      {
        canonicalName: string;
        quality: JoinQuality;
        confidence: number;
        records: Record<string, EvidenceRecord>;
      }
    >();

    // Seed with all canonical Maharashtra LGD districts
    const allLgdDistricts = LgdRegistry.getAllDistricts();
    for (const d of allLgdDistricts) {
      districtLgdMap.set(d.lgdCode, {
        canonicalName: d.name.toUpperCase(),
        quality: 'EXACT',
        confidence: 100.0,
        records: {},
      });
    }

    // Populate records from each dataset
    for (const ds of datasets) {
      for (const rec of ds.records) {
        let lgdKey = rec.districtLgdCode;
        let quality: JoinQuality = 'EXACT';
        let confidence = 100.0;

        // If LGD code is not explicitly present, resolve using deterministic DistrictNormalizer
        if (!lgdKey || !districtLgdMap.has(lgdKey)) {
          const resolved = DistrictNormalizer.resolve(rec.district);
          if (resolved.lgdCode && districtLgdMap.has(resolved.lgdCode)) {
            lgdKey = resolved.lgdCode;
            if (resolved.resolutionMethod === 'LGD_CODE_EXACT') {
              quality = 'EXACT';
              confidence = 100.0;
            } else if (resolved.resolutionMethod === 'ALIAS_EXACT') {
              quality = 'ALIAS';
              confidence = 99.2;
            } else if (resolved.resolutionMethod === 'NORMALIZED_CLEAN') {
              quality = 'ALIAS';
              confidence = 98.0;
            } else {
              quality = 'FUZZY';
              confidence = resolved.confidence;
            }
          } else {
            // Unresolved record
            lgdKey = `UNRESOLVED-${rec.district.toUpperCase().replace(/\s+/g, '_')}`;
            quality = 'UNRESOLVED';
            confidence = 50.0;
            if (!districtLgdMap.has(lgdKey)) {
              districtLgdMap.set(lgdKey, {
                canonicalName: rec.district.toUpperCase(),
                quality,
                confidence,
                records: {},
              });
            }
          }
        }

        const entry = districtLgdMap.get(lgdKey);
        if (entry) {
          entry.records[ds.datasetId] = rec;
          // Maintain lowest join quality for the aggregate row
          if (quality === 'UNRESOLVED') {
            entry.quality = 'UNRESOLVED';
            entry.confidence = Math.min(entry.confidence, confidence);
          } else if (quality === 'FUZZY' && entry.quality !== 'UNRESOLVED') {
            entry.quality = 'FUZZY';
            entry.confidence = Math.min(entry.confidence, confidence);
          } else if (quality === 'ALIAS' && entry.quality === 'EXACT') {
            entry.quality = 'ALIAS';
            entry.confidence = Math.min(entry.confidence, confidence);
          }
        }
      }
    }

    // Convert map to JoinRecordResult array, filtering only districts that have at least one record
    const results: JoinRecordResult[] = [];

    districtLgdMap.forEach((val, lgdCode) => {
      const recordKeys = Object.keys(val.records);
      if (recordKeys.length > 0) {
        // Aggregate joined fields
        let totalAllocated = 0;
        let totalUtilized = 0;
        let totalBeneficiaries = 0;
        const coverageRates: number[] = [];

        for (const r of Object.values(val.records)) {
          totalAllocated += r.allocatedCr;
          totalUtilized += r.utilizedCr;
          totalBeneficiaries += r.beneficiaries;
          if (r.completionRate > 0) {
            coverageRates.push(r.completionRate);
          }
        }

        const compositeDrawdownRate =
          totalAllocated > 0 ? Number(((totalUtilized / totalAllocated) * 100).toFixed(1)) : 0;
        const meanCoverageRate =
          coverageRates.length > 0
            ? Number((coverageRates.reduce((a, b) => a + b, 0) / coverageRates.length).toFixed(1))
            : 0;

        results.push({
          primaryKey: lgdCode,
          districtName: val.canonicalName,
          quality: val.quality,
          confidence: val.confidence,
          records: val.records,
          joinedFields: {
            programmesJoinedCount: recordKeys.length,
            totalAllocatedCr: Number(totalAllocated.toFixed(2)),
            totalUtilizedCr: Number(totalUtilized.toFixed(2)),
            compositeDrawdownRate,
            meanCoverageRate,
            totalBeneficiaries,
            isTribalPriority: ['512', '501', '525', '500'].includes(lgdCode),
          },
        });
      }
    });

    return results;
  }

  /**
   * Retrieves joined records specifically for a target district LGD code
   */
  static getJoinedDistrict(
    targetLgdCode: string,
    datasets: JoinDatasetInput[]
  ): JoinRecordResult | undefined {
    const joined = this.joinByDistrictLgd(datasets);
    return joined.find((j) => j.primaryKey === targetLgdCode);
  }
}
