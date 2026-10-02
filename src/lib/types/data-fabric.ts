export type SourceType = 'Government Open Data' | 'Union Budget / PFMS' | 'State Administrative Register';

export type SourceFormat = 'CSV' | 'JSON' | 'XLSX' | 'API' | 'PDF_TABLE' | 'XML';

export type DatasetStatus = 'Active' | 'Synced' | 'Validated' | 'Pending' | 'Deprecated';

export type SourceFieldType = 'string' | 'number' | 'boolean' | 'date' | 'geo' | 'currency' | 'object' | 'array';

export interface DatasetSource {
  id: string;
  name: string;
  publisher: string;
  sourceUrl: string;
  format: SourceFormat;
  description: string;
  status: DatasetStatus;
  lastSyncedAt: string;
  recordCount: number;
  geographicKey: string;
  temporalCoverage: string;
  provenanceHash: string;
}

export interface SourceFieldDefinition {
  name: string;
  dataType: SourceFieldType;
  description?: string;
  required: boolean;
  sampleValues?: string[];
}

export interface DatasetSchema {
  id: string;
  datasetSourceId: string;
  sourceFields: SourceFieldDefinition[];
  canonicalFieldMapping: Record<string, string>;
  fieldTypes: Record<string, SourceFieldType>;
  requiredFields: string[];
}

export interface Ministry {
  id: string;
  code: string;
  name: string;
  shortName: string;
  departmentCount: number;
  schemeCount: number;
  totalAllocationCr: number;
  totalUtilizedCr: number;
  description?: string;
  headMinister?: string;
  aliases?: string[];
}

export interface Department {
  id: string;
  code: string;
  name: string;
  ministryId: string;
  ministryCode: string;
  schemeCount: number;
  description?: string;
  aliases?: string[];
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  officialName: string;
  ministryId: string;
  ministryName: string;
  department: string;
  sector: string;
  targetGroup: string;
  startYear: number;
  status: 'Active' | 'Review' | 'Accelerated';
  budgetAllocationCr: number;
  fundUtilizedCr: number;
  utilizationRate: number;
  beneficiariesCount: number;
  projectsCount: number;
  coverageRate: number;
  outcomeIndex: number;
  summary: string;
  objectives: string[];
  keyDistricts: string[];
  aliases?: string[];
}

export interface District {
  id: string;
  code: string;
  lgdCode?: string;
  censusCode?: string;
  name: string;
  state: string;
  population: number;
  activeSchemesCount: number;
  projectsCount: number;
  beneficiariesCount: number;
  budgetAllocatedCr: number;
  fundUtilizedCr: number;
  fundUtilizationRate: number;
  coverageRate: number;
  regionalBenchmarkRate: number;
  gapPercentagePoints: number;
  isGapFlagged: boolean;
  flagFactors: string[];
  coordinates: [number, number];
  zone: string;
  eligibleDemandIndex: number;
  headquarters?: string;
  aliases?: string[];
}

export interface Project {
  id: string;
  code: string;
  name: string;
  schemeId: string;
  schemeCode: string;
  districtId: string;
  districtLgdCode: string;
  districtName: string;
  budgetCr: number;
  utilizedCr: number;
  status: 'Planned' | 'In-Progress' | 'Completed' | 'Delayed' | 'Under-Review';
  milestonesTotal: number;
  milestonesCompleted: number;
  completionRate: number;
  coordinates?: [number, number];
  startDate?: string;
  targetCompletionDate?: string;
  verifiedOnGround: boolean;
}

export interface Beneficiary {
  id: string;
  category: string;
  schemeId: string;
  schemeCode: string;
  districtId: string;
  districtName: string;
  targetCount: number;
  verifiedCount: number;
  dbtStatus: 'Seeded' | 'Pending' | 'Disbursed' | 'Flagged';
  aadhaarSeededRate: number;
  coverageRate: number;
  vulnerableSubgroups?: string[];
}

export interface Outcome {
  id: string;
  metricName: string;
  description: string;
  baselineValue: number;
  targetValue: number;
  achievedValue: number;
  unit: string;
  achievementRate: number;
  status: 'On-Track' | 'Lagging' | 'Critical' | 'Achieved';
  schemeId: string;
  districtId: string;
  lastMeasuredAt: string;
}

export interface ProvenanceMeta {
  sourceDatasetId: string;
  sourcePublisher: string;
  sourceUrl: string;
  rawRecordId: string;
  rawRecordHash: string;
  transformationHash: string;
  provenanceHash: string;
  ingestedAt: string;
  resolutionConfidence: number;
  resolutionMethod: string;
  districtLgdCode?: string;
  schemeCode?: string;
  pipelineVersion: string;
}

export interface EvidenceRecord {
  id: string;
  recordNumber: string;
  datasetId: string;
  datasetName: string;
  schemeId: string;
  schemeName: string;
  district: string;
  state: string;
  allocatedCr: number;
  utilizedCr: number;
  beneficiaries: number;
  completionRate: number;
  outcomeScore: number;
  sourceType: SourceType;
  primarySourceUrl: string;
  usedIn: string;
  lastUpdated: string;
  // Extended Provenance & LGD attributes (compatible with legacy records)
  districtLgdCode?: string;
  rawRecordHash?: string;
  transformationHash?: string;
  provenanceHash?: string;
  resolutionConfidence?: number;
  resolutionMethod?: string;
  provenance?: ProvenanceMeta;
}

export interface RawSourceRecord {
  id: string;
  sourceId: string;
  sourceRowNumber: number;
  payload: Record<string, unknown>;
  receivedAt: string;
  rawHash: string;
}

export interface NormalizedRecord {
  rawRecordId: string;
  sourceId: string;
  sanitizedFields: Record<string, unknown>;
  normalizedFields: {
    districtRaw?: string;
    districtNormalized?: string;
    schemeRaw?: string;
    schemeNormalized?: string;
    ministryRaw?: string;
    ministryNormalized?: string;
    allocatedCr?: number;
    utilizedCr?: number;
    beneficiaries?: number;
    completionRate?: number;
    outcomeScore?: number;
    [key: string]: unknown;
  };
  normalizationTimestamp: string;
  transformHash: string;
}

export type ResolutionMethod =
  | 'LGD_CODE_EXACT'
  | 'CANONICAL_EXACT'
  | 'ALIAS_EXACT'
  | 'NORMALIZED_CLEAN'
  | 'LEVENSHTEIN_FUZZY'
  | 'JARO_WINKLER'
  | 'UNRESOLVED_FALLBACK';

export interface MatchDetails {
  inputTerm: string;
  matchedKey: string;
  distance?: number;
  similarity?: number;
}

export interface ResolvedCanonicalEntity<T = unknown> {
  rawRecordId: string;
  entityType: 'Ministry' | 'Department' | 'Scheme' | 'District' | 'Project' | 'Beneficiary' | 'Outcome' | 'State';
  canonicalId: string;
  canonicalName: string;
  code?: string;
  lgdCode?: string;
  confidence: number;
  resolutionMethod: ResolutionMethod | string;
  matchDetails: MatchDetails;
  entity?: T;
}
