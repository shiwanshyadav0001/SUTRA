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
  reportingFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | string;
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

export type JoinQuality = 'EXACT' | 'ALIAS' | 'FUZZY' | 'UNRESOLVED';

export type FindingType =
  | 'FINANCIAL_DRAWDOWN_DIVERGENCE'
  | 'PHYSICAL_DELIVERY_PACE_DIVERGENCE'
  | 'GEOGRAPHIC_CO_OCCURRENCE'
  | 'TEMPORAL_ALIGNMENT_RISK'
  | 'GEOGRAPHIC_CONVERGENCE_GAP'
  | 'CAPITAL_DRAWDOWN_DIVERGENCE'
  | 'INFRASTRUCTURE_DELIVERY_LAG'
  | 'CROSS_PROGRAMME_SYNERGY_OPPORTUNITY'
  | 'GEOGRAPHIC_OVERLAP'
  | 'COVERAGE_CONVERGENCE_SIGNAL';

export type DataClassification =
  | 'VERIFIED_SOURCE_DATA'
  | 'DERIVED_ANALYSIS'
  | 'SIMULATION'
  | 'DEMONSTRATION_DATA';

export type FactClassification = 'SOURCE_FACT' | 'DERIVED_METRIC' | 'INTERPRETATION';

export type TemporalAlignmentState = 'ALIGNED' | 'PARTIALLY_ALIGNED' | 'ASYNC_REPORTING';

export type FinancialStage =
  | 'APPROVED_ALLOCATION'
  | 'EXPENDITURE_DRAWDOWN'
  | 'DISBURSED_DBT'
  | 'PHYSICAL_PROGRESS'
  | 'COVERAGE_RATE'
  | 'TRANSITION_RATE';

export interface MetricDefinition {
  metricKey: string;
  displayName: string;
  exactSourceField: string;
  datasetId: string;
  publisher: string;
  unit: string;
  financialStage?: FinancialStage;
  reportingPeriod: string;
  reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  geographyLgd: string;
  classification: FactClassification;
  transformationDescription?: string;
}

export interface MetricAuditLineage {
  metricId: string;
  uiLabel: string;
  displayValue: string;
  classification: FactClassification;
  unit: string;
  financialStage?: FinancialStage;
  sourceDatasetId?: string;
  sourceField?: string;
  sourceRecordNumber?: string;
  sourceValue?: number | string;
  reportingPeriod?: string;
  formula?: string;
  derivationStep?: string;
}

export interface ConfidenceComponent {
  name: string;
  rating: string;
  score: number; // 0.0 to 1.0
  weight: number; // 0.0 to 1.0
  rationale: string;
}

export interface ConfidenceAssessment {
  overallScore: number; // 0 to 100
  rating: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  methodology: string;
  components: {
    sourceAuthority: ConfidenceComponent;
    geographicJoin: ConfidenceComponent;
    temporalAlignment: ConfidenceComponent;
    metricCompleteness: ConfidenceComponent;
    transformationComplexity: ConfidenceComponent;
  };
}

export interface WhyFlaggedChain {
  district: string;
  districtLgdCode: string;
  lgdEntity: {
    name: string;
    code: string;
    state: string;
    censusCode?: string;
  };
  programmes: {
    code: string;
    name: string;
    ministry: string;
    allocationCr: number;
    disbursedCr: number;
    progressRate: number;
    unit: string;
  }[];
  sourceDataPoints: {
    datasetId: string;
    metricName: string;
    rawValue: number | string;
    unit: string;
    reportingPeriod: string;
  }[];
  sourceDataMetrics?: {
    datasetId: string;
    metricName: string;
    rawValue: number | string;
    unit: string;
    reportingPeriod: string;
  }[];
  derivedMetrics: {
    name: string;
    formula: string;
    value: number | string;
    benchmarkDiff?: string;
  }[];
  derivedCalculations?: {
    name: string;
    formula: string;
    value: number | string;
    benchmarkDiff?: string;
  }[];
  signals: {
    id: string;
    type: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
  }[];
  findingId: string;
  findingSummary?: {
    findingId: string;
    title: string;
    type: string;
  };
  evidenceLinks: {
    recordNumber: string;
    datasetId: string;
    primarySourceUrl: string;
  }[];
  evidenceAnchors?: {
    recordNumber: string;
    datasetId: string;
    primarySourceUrl: string;
  }[];
}

export interface ConvergenceOpportunity {
  id: string; // e.g. SUTRA-CONV-NDB-01
  investigationId: string;
  title?: string;
  districtId: string;
  districtLgdCode: string;
  districtName: string;
  district?: {
    id?: string;
    name: string;
    lgdCode: string;
    state: string;
  };
  state: string;
  programmes: {
    code: string;
    name: string;
    ministry: string;
    role?: string;
  }[];
  supportingFindings: (string | {
    findingId: string;
    findingType: string;
    title: string;
    contribution: string;
  })[];
  evidence: EvidenceRecord[];
  rationale: string;
  confidenceScore?: number;
  confidence: number;
  confidenceAssessment: ConfidenceAssessment;
  limitations: string[];
  actionableRecommendations: string[];
  status: 'CANDIDATE_FOR_REVIEW' | 'FLAGGED_FOR_AUDIT' | 'ACTION_RECOMMENDED';
}

export interface JoinRecordResult {
  primaryKey: string; // e.g. lgdCode '512'
  districtName: string;
  quality: JoinQuality;
  confidence: number;
  records: Record<string, EvidenceRecord>; // datasetId -> EvidenceRecord
  joinedFields: Record<string, unknown>;
}

export interface FindingCalculation {
  formulaName: string;
  formulaLatex: string;
  formulaText: string;
  inputs: Record<string, number | string>;
  outputValue: number | string;
  outputUnit: string;
  interpretation: string;
  lineageItems?: MetricAuditLineage[];
}

export interface InvestigationFinding {
  id: string; // e.g. SUTRA-FND-0001
  investigationId: string; // e.g. INV-NDB-CONV-001
  title: string;
  findingType: FindingType;
  districtId: string;
  districtLgdCode: string;
  districtName: string;
  state: string;
  temporalAlignment: TemporalAlignmentState;
  temporalCoverageNote: string;
  datasetsUsed: {
    id: string;
    name: string;
    publisher: string;
    sourceUrl: string;
    recordCount: number;
    reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  }[];
  sourceRecords: EvidenceRecord[];
  metricDefinitions: MetricDefinition[];
  metricLineage: MetricAuditLineage[];
  joinKey: {
    primary: string;
    secondary?: string;
    quality: JoinQuality;
    confidence: number;
  };
  calculation: FindingCalculation;
  summary: string;
  detailedAnalysis: string;
  factBreakdown: {
    sourceFacts: string[];
    derivedMetrics: string[];
    interpretations: string[];
  };
  whyFlaggedChain?: WhyFlaggedChain;
  policyRecommendations: string[];
  confidenceAssessment: ConfidenceAssessment;
  confidence: number; // overall numeric confidence 0-100 derived from confidenceAssessment
  limitations: string[];
  generatedTimestamp: string;
  dataClassification: DataClassification;
  provenanceHashes: {
    inputHashes: string[];
    joinHash: string;
    calculationHash: string;
    findingHash: string;
  };
}

export interface GovernanceInvestigation {
  id: string; // e.g. INV-NDB-CONV-001
  title: string;
  question: string;
  districtIds: string[];
  targetDistrict: string;
  targetDistrictLgd: string;
  datasets: DatasetSource[];
  entities: {
    id: string;
    name: string;
    type: string;
    code?: string;
    lgdCode?: string;
  }[];
  relationships: {
    source: string;
    target: string;
    type: string;
    label?: string;
  }[];
  findings: InvestigationFinding[];
  convergenceOpportunities: ConvergenceOpportunity[];
  evidence: EvidenceRecord[];
  confidence: number;
  confidenceAssessment: ConfidenceAssessment;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FLAGGED';
  createdAt: string;
  methodology: string;
  limitations: string[];
  pipelineAuditTrail: {
    step: string;
    timestamp: string;
    hash: string;
    status: 'SUCCESS' | 'WARNING';
  }[];
}

export interface InvestigationPipelineResult {
  query: string;
  interpretation: {
    intent: string;
    targetDistrict: string;
    targetDistrictLgd: string;
    programmesInvolved: string[];
    analysisObjective: string;
  };
  datasets: DatasetSource[];
  entityResolutionSteps: {
    input: string;
    resolved: string;
    method: string;
    confidence: number;
    lgdCode?: string;
  }[];
  joinMatrix: JoinRecordResult[];
  finding: InvestigationFinding; // Primary / Featured Finding
  findings: InvestigationFinding[]; // Multi-finding list
  investigation: GovernanceInvestigation; // Canonical Investigation Model
  convergenceOpportunities: ConvergenceOpportunity[];
  evidenceRecords: EvidenceRecord[];
  methodology: string;
  limitations: string[];
  pipelineAuditTrail: {
    step: string;
    timestamp: string;
    hash: string;
    status: 'SUCCESS' | 'WARNING';
  }[];
}


