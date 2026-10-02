export * from './data-fabric';

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

export interface DatasetMeta {
  id: string;
  name: string;
  recordsCount: number;
  source: string;
  sourceType: import('./data-fabric').SourceType;
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
