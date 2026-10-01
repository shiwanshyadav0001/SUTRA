export type SourceType = 'Government Open Data' | 'Union Budget / PFMS' | 'State Administrative Register';

export interface Ministry {
  id: string;
  code: string;
  name: string;
  shortName: string;
  departmentCount: number;
  schemeCount: number;
  totalAllocationCr: number;
  totalUtilizedCr: number;
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
}

export interface District {
  id: string;
  code: string;
  name: string;
  state: string;
  population: number; // e.g. 1,648,000 for Nandurbar (1.6M)
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
  coordinates: [number, number]; // [lat, lng]
  zone: string;
  eligibleDemandIndex: number; // 0 - 100
}

export interface OverlapInsight {
  id: string;
  schemeAId: string;
  schemeBId: string;
  schemeAName: string;
  schemeBName: string;
  similarityScore: number;
  breakdown: {
    targetGroup: number;
    geography: number;
    intervention: number;
    implementationPeriod: number;
  };
  whyFlagged: string[];
  recommendation: string;
  evidenceDatasetId: string;
  evidenceRecordIds: string[];
}

export interface ImplementationSignal {
  id: string;
  schemeId: string;
  schemeName: string;
  ministryName: string;
  districtId?: string;
  districtName?: string;
  expectedUtilization: number;
  currentUtilization: number;
  deviation: number;
  confidence: number;
  factors: {
    title: string;
    value: number;
  }[];
  explanation: string;
  evidenceRecordId: string;
  metric: string;
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
}

export interface DatasetMeta {
  id: string;
  name: string;
  recordsCount: number;
  source: string;
  sourceType: SourceType;
  fields: string[];
  status: 'Live Synced' | 'Validated' | 'Cached';
  lastUpdated: string;
  description: string;
}

export type NodeType =
  | 'ministry'
  | 'department'
  | 'scheme'
  | 'project'
  | 'district'
  | 'beneficiary'
  | 'budget'
  | 'outcome';

export type EdgeType =
  | 'OWNS'
  | 'FUNDS'
  | 'IMPLEMENTED_IN'
  | 'SERVES'
  | 'PRODUCES'
  | 'OVERLAPS_WITH';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  val: number;
  subtext?: string;
  ministry?: string;
  data?: Record<string, unknown>;
}

export interface GraphLink {
  source: string;
  target: string;
  type: EdgeType;
  weight?: number;
  label?: string;
}

export interface EntityResolutionSample {
  raw: string;
  resolved: string;
  type: 'State' | 'Scheme' | 'Department' | 'District';
  confidence: number;
  algorithm: string;
}
