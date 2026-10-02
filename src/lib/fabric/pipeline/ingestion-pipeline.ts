import {
  RawSourceRecord,
  NormalizedRecord,
  ResolvedCanonicalEntity,
  EvidenceRecord,
  DatasetSource,
  District,
  Scheme,
  SourceType,
} from '@/lib/types/data-fabric';
import { DatasetRegistry } from '../registry/dataset-registry';
import { DistrictNormalizer } from '../normalization/district-normalizer';
import { SchemeNormalizer } from '../normalization/scheme-normalizer';
import { ProvenanceManager, computeDeterministicSha256 } from './provenance';

export interface IngestionResult {
  rawRecord: RawSourceRecord;
  normalizedRecord: NormalizedRecord;
  resolvedDistrict: ResolvedCanonicalEntity<District>;
  resolvedScheme: ResolvedCanonicalEntity<Scheme>;
  evidenceRecord: EvidenceRecord;
}

export interface BatchIngestionSummary {
  datasetSource: DatasetSource;
  totalRecordsIngested: number;
  successfulCount: number;
  averageConfidence: number;
  results: IngestionResult[];
  ingestionTimestamp: string;
  batchProvenanceHash: string;
}

export class DataFabricPipeline {
  /**
   * Step 1: Raw Ingestion & Hashing
   */
  static processRawRecord(
    sourceId: string,
    rowNumber: number,
    payload: Record<string, unknown>,
    customTimestamp?: string
  ): RawSourceRecord {
    const timestamp = customTimestamp || new Date().toISOString();
    const rawHash = computeDeterministicSha256(payload);
    const id = `RAW-${sourceId}-${rowNumber}-${rawHash.substring(0, 8)}`;

    return {
      id,
      sourceId,
      sourceRowNumber: rowNumber,
      payload,
      receivedAt: timestamp,
      rawHash,
    };
  }

  /**
   * Step 2: Normalization & Field Mapping
   */
  static normalizeRawRecord(rawRecord: RawSourceRecord, customTimestamp?: string): NormalizedRecord {
    const p = rawRecord.payload;
    const sanitizedFields: Record<string, unknown> = {};

    // Extract district string from various potential column names
    const rawDistrict = String(
      p.District_Name ||
      p.district_name ||
      p.District ||
      p.district ||
      p.district_code ||
      p.District_Code ||
      ''
    ).trim();

    // Extract scheme string from various potential column names
    const rawScheme = String(
      p.Scheme_Code ||
      p.scheme_id ||
      p.scheme_code ||
      p.Scheme_Name ||
      p.scheme_name ||
      p.Scheme ||
      p.scheme ||
      ''
    ).trim();

    // Extract ministry string if present
    const rawMinistry = String(
      p.Ministry_Code ||
      p.ministry_code ||
      p.Ministry ||
      p.ministry ||
      ''
    ).trim();

    // Parse numeric attributes safely
    const allocatedCr = Number(p.Allocated_Cr || p.allocated_cr || p.budgetAllocationCr || p.budget_estimate || 0);
    const utilizedCr = Number(p.Utilized_Cr || p.utilized_cr || p.fundUtilizedCr || p.utilized_amount || 0);
    const beneficiaries = Number(p.Beneficiaries_Count || p.beneficiaries || p.beneficiaries_count || p.milestones_total || 0);
    const completionRate = allocatedCr > 0 ? Number(((utilizedCr / allocatedCr) * 100).toFixed(1)) : 0;
    const outcomeScore = Number(p.Outcome_Score || p.outcome_score || p.outcome_index || Math.min(100, Math.round(completionRate * 0.95)));

    const normalizedFields = {
      districtRaw: rawDistrict,
      districtNormalized: rawDistrict.toLowerCase().trim(),
      schemeRaw: rawScheme,
      schemeNormalized: rawScheme.toUpperCase().trim(),
      ministryRaw: rawMinistry,
      ministryNormalized: rawMinistry.toUpperCase().trim(),
      allocatedCr: Number.isNaN(allocatedCr) ? 0 : allocatedCr,
      utilizedCr: Number.isNaN(utilizedCr) ? 0 : utilizedCr,
      beneficiaries: Number.isNaN(beneficiaries) ? 0 : beneficiaries,
      completionRate: Number.isNaN(completionRate) ? 0 : completionRate,
      outcomeScore: Number.isNaN(outcomeScore) ? 0 : outcomeScore,
    };

    const timestamp = customTimestamp || new Date().toISOString();
    const transformHash = computeDeterministicSha256(normalizedFields);

    return {
      rawRecordId: rawRecord.id,
      sourceId: rawRecord.sourceId,
      sanitizedFields,
      normalizedFields,
      normalizationTimestamp: timestamp,
      transformHash,
    };
  }

  /**
   * Step 3: Deterministic Entity Resolution
   */
  static resolveEntities(normalized: NormalizedRecord): {
    resolvedDistrict: ResolvedCanonicalEntity<District>;
    resolvedScheme: ResolvedCanonicalEntity<Scheme>;
  } {
    const rawDistrict = normalized.normalizedFields.districtRaw || '';
    const rawScheme = normalized.normalizedFields.schemeRaw || '';

    const resolvedDistrict = DistrictNormalizer.resolve(rawDistrict);
    const resolvedScheme = SchemeNormalizer.resolve(rawScheme);

    resolvedDistrict.rawRecordId = normalized.rawRecordId;
    resolvedScheme.rawRecordId = normalized.rawRecordId;

    return { resolvedDistrict, resolvedScheme };
  }

  /**
   * Step 4: Evidence Record Generation with Full Provenance Trail
   */
  static generateEvidenceRecord(
    rawRecord: RawSourceRecord,
    normalized: NormalizedRecord,
    resolvedDistrict: ResolvedCanonicalEntity<District>,
    resolvedScheme: ResolvedCanonicalEntity<Scheme>,
    customRecordNumber?: string
  ): EvidenceRecord {
    const source = DatasetRegistry.getSourceById(rawRecord.sourceId) || {
      id: rawRecord.sourceId,
      name: 'Administrative Data Source',
      publisher: 'State / Central Government Portal',
      sourceUrl: 'https://data.gov.in/',
      format: 'CSV',
      description: 'Ingested governance record',
      status: 'Synced',
      lastSyncedAt: new Date().toISOString(),
      recordCount: 1,
      geographicKey: 'lgd_district_code',
      temporalCoverage: 'FY 2025-26',
      provenanceHash: '',
    };

    // Determine SourceType mapping
    let sourceType: SourceType = 'Government Open Data';
    if (source.id === 'DS-02' || source.publisher.includes('PFMS') || source.publisher.includes('Budget')) {
      sourceType = 'Union Budget / PFMS';
    } else if (source.id === 'DS-03' || source.publisher.includes('State') || source.publisher.includes('MIS')) {
      sourceType = 'State Administrative Register';
    }

    const recNum = customRecordNumber || `#${rawRecord.sourceRowNumber + 9000}`;
    const cleanNum = recNum.replace('#', '');
    const id = `REC-${cleanNum}`;

    const avgConfidence = Number(
      ((resolvedDistrict.confidence + resolvedScheme.confidence) / 2).toFixed(1)
    );

    const provenance = ProvenanceManager.createEnvelope({
      sourceDatasetId: source.id,
      sourcePublisher: source.publisher,
      sourceUrl: source.sourceUrl,
      rawRecordId: rawRecord.id,
      rawPayload: rawRecord.payload,
      normalizedFields: normalized.normalizedFields,
      resolutionConfidence: avgConfidence,
      resolutionMethod: `${resolvedDistrict.resolutionMethod}+${resolvedScheme.resolutionMethod}`,
      districtLgdCode: resolvedDistrict.lgdCode,
      schemeCode: resolvedScheme.code,
      timestamp: normalized.normalizationTimestamp,
    });

    const districtDisplay = resolvedDistrict.canonicalName;
    const schemeDisplay = resolvedScheme.canonicalName;

    return {
      id,
      recordNumber: recNum,
      datasetId: source.id,
      datasetName: source.name,
      schemeId: resolvedScheme.canonicalId,
      schemeName: `${schemeDisplay} (${resolvedScheme.code || resolvedScheme.canonicalId})`,
      district: districtDisplay,
      state: 'Maharashtra',
      allocatedCr: normalized.normalizedFields.allocatedCr || 0,
      utilizedCr: normalized.normalizedFields.utilizedCr || 0,
      beneficiaries: normalized.normalizedFields.beneficiaries || 0,
      completionRate: normalized.normalizedFields.completionRate || 0,
      outcomeScore: normalized.normalizedFields.outcomeScore || 0,
      sourceType,
      primarySourceUrl: source.sourceUrl,
      usedIn: `${districtDisplay} Convergence & Implementation Review`,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' IST',
      districtLgdCode: resolvedDistrict.lgdCode,
      rawRecordHash: rawRecord.rawHash,
      transformationHash: normalized.transformHash,
      provenanceHash: provenance.provenanceHash,
      resolutionConfidence: avgConfidence,
      resolutionMethod: provenance.resolutionMethod,
      provenance,
    };
  }

  /**
   * End-to-End Ingestion of a single record
   */
  static ingestRecord(
    sourceId: string,
    rowNumber: number,
    payload: Record<string, unknown>,
    customTimestamp?: string,
    customRecordNumber?: string
  ): IngestionResult {
    const rawRecord = this.processRawRecord(sourceId, rowNumber, payload, customTimestamp);
    const normalizedRecord = this.normalizeRawRecord(rawRecord, customTimestamp);
    const { resolvedDistrict, resolvedScheme } = this.resolveEntities(normalizedRecord);
    const evidenceRecord = this.generateEvidenceRecord(
      rawRecord,
      normalizedRecord,
      resolvedDistrict,
      resolvedScheme,
      customRecordNumber
    );

    return {
      rawRecord,
      normalizedRecord,
      resolvedDistrict,
      resolvedScheme,
      evidenceRecord,
    };
  }

  /**
   * End-to-End Batch Ingestion
   */
  static ingestBatch(
    sourceId: string,
    rows: Record<string, unknown>[],
    customTimestamp?: string
  ): BatchIngestionSummary {
    const source = DatasetRegistry.getSourceById(sourceId) || {
      id: sourceId,
      name: 'Custom Dataset',
      publisher: 'Administrative Portal',
      sourceUrl: 'https://data.gov.in/',
      format: 'CSV',
      description: 'Batch ingested dataset',
      status: 'Validated',
      lastSyncedAt: new Date().toISOString(),
      recordCount: rows.length,
      geographicKey: 'lgd_district_code',
      temporalCoverage: 'FY 2025-26',
      provenanceHash: '',
    };

    const results: IngestionResult[] = [];
    let totalConfidence = 0;

    for (let i = 0; i < rows.length; i++) {
      const res = this.ingestRecord(sourceId, i + 1, rows[i], customTimestamp);
      results.push(res);
      totalConfidence += (res.resolvedDistrict.confidence + res.resolvedScheme.confidence) / 2;
    }

    const averageConfidence = rows.length > 0 ? Number((totalConfidence / rows.length).toFixed(1)) : 100;
    const batchProvenanceHash = computeDeterministicSha256(
      results.map((r) => r.evidenceRecord.provenanceHash)
    );

    return {
      datasetSource: source,
      totalRecordsIngested: rows.length,
      successfulCount: results.filter((r) => r.resolvedDistrict.confidence >= 70).length,
      averageConfidence,
      results,
      ingestionTimestamp: customTimestamp || new Date().toISOString(),
      batchProvenanceHash,
    };
  }

  /**
   * Parses and ingests raw CSV string
   */
  static ingestCsv(
    sourceId: string,
    csvContent: string,
    customTimestamp?: string
  ): BatchIngestionSummary {
    const lines = csvContent.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      return this.ingestBatch(sourceId, [], customTimestamp);
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows: Record<string, unknown>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      const row: Record<string, unknown> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] !== undefined ? values[idx] : '';
      });
      rows.push(row);
    }

    return this.ingestBatch(sourceId, rows, customTimestamp);
  }
}
