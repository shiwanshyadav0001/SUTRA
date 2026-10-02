import { DatasetSource, DatasetSchema } from '@/lib/types/data-fabric';

export const CANONICAL_DATASET_SOURCES: DatasetSource[] = [
  {
    id: 'DS-01',
    name: 'National Scheme Master Registry (NSMR)',
    publisher: 'Open Government Data Platform & NITI Aayog Portal',
    sourceUrl: 'https://data.gov.in/catalog/national-scheme-master-registry',
    format: 'CSV',
    description: 'Master canonical catalogue of Centrally Sponsored and Central Sector governance schemes.',
    status: 'Synced',
    lastSyncedAt: '2026-09-28T10:00:00.000Z',
    recordCount: 12842,
    geographicKey: 'lgd_district_code',
    temporalCoverage: 'FY 2024-2027',
    provenanceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'DS-02',
    name: 'PFMS Treasury Sanctions & Drawdowns Feed',
    publisher: 'Union Budget Statement & Public Financial Management System (CGA)',
    sourceUrl: 'https://pfms.nic.in/Static/HelpManual/SchemeWiseExpenditure.pdf',
    format: 'CSV',
    description: 'Direct disbursement, sanction, allocation, and expenditure records across districts and schemes.',
    status: 'Synced',
    lastSyncedAt: '2026-10-01T18:30:00.000Z',
    recordCount: 48291,
    geographicKey: 'lgd_district_code',
    temporalCoverage: 'FY 2025-2026 Q2',
    provenanceHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
  },
  {
    id: 'DS-03',
    name: 'State Administrative Milestone & Outcomes Register',
    publisher: 'Ministry MIS Portals & Maharashtra State Department Ledgers',
    sourceUrl: 'https://data.gov.in/resource/rural-housing-milestones',
    format: 'CSV',
    description: 'Ground-level physical milestone completions, geocoded verification, and infrastructure outcomes.',
    status: 'Validated',
    lastSyncedAt: '2026-10-02T09:15:00.000Z',
    recordCount: 8420,
    geographicKey: 'lgd_district_code',
    temporalCoverage: 'FY 2025-2026 Continuous',
    provenanceHash: 'dca3f24b2fb66a1e35d1f885e353baec97b5e1337c76ccca10d5718eb8cc7551',
  },
  {
    id: 'DS-04',
    name: 'Socio-Economic DBT Beneficiary Mission Register',
    publisher: 'National DBT Mission & SECC Administrative Registry',
    sourceUrl: 'https://dbtbharat.gov.in/',
    format: 'CSV',
    description: 'Anonymized demographic records detailing coverage ratios, pending payments, and inclusion indicators.',
    status: 'Validated',
    lastSyncedAt: '2026-09-30T21:00:00.000Z',
    recordCount: 92311,
    geographicKey: 'lgd_district_code',
    temporalCoverage: 'FY 2024-2026',
    provenanceHash: 'a6c0e86b24eb14c810df2bc756c9a9d20c541743f55403e1e9cf0901e14187f5',
  },
];

export const CANONICAL_DATASET_SCHEMAS: Record<string, DatasetSchema> = {
  'DS-01': {
    id: 'SCHEMA-DS-01',
    datasetSourceId: 'DS-01',
    sourceFields: [
      { name: 'scheme_id', dataType: 'string', required: true, description: 'Source scheme identifier' },
      { name: 'scheme_name', dataType: 'string', required: true, description: 'Official or working title' },
      { name: 'ministry_code', dataType: 'string', required: true, description: 'Parent ministry code' },
      { name: 'department', dataType: 'string', required: false, description: 'Implementing department' },
      { name: 'sector_code', dataType: 'string', required: false, description: 'Policy sector' },
      { name: 'target_segment', dataType: 'string', required: false, description: 'Beneficiary group description' },
      { name: 'launch_fy', dataType: 'number', required: false, description: 'Year of launch' },
      { name: 'status', dataType: 'string', required: false, description: 'Operational status' },
    ],
    canonicalFieldMapping: {
      'scheme_id': 'Scheme.code',
      'scheme_name': 'Scheme.officialName',
      'ministry_code': 'Ministry.code',
      'department': 'Department.name',
      'sector_code': 'Scheme.sector',
      'target_segment': 'Scheme.targetGroup',
      'launch_fy': 'Scheme.startYear',
      'status': 'Scheme.status',
    },
    fieldTypes: {
      'scheme_id': 'string',
      'scheme_name': 'string',
      'ministry_code': 'string',
      'department': 'string',
      'sector_code': 'string',
      'target_segment': 'string',
      'launch_fy': 'number',
      'status': 'string',
    },
    requiredFields: ['scheme_id', 'scheme_name', 'ministry_code'],
  },
  'DS-02': {
    id: 'SCHEMA-DS-02',
    datasetSourceId: 'DS-02',
    sourceFields: [
      { name: 'District_Name', dataType: 'string', required: true, description: 'District name or dialect variant' },
      { name: 'Scheme_Code', dataType: 'string', required: true, description: 'Governance scheme identifier or acronym' },
      { name: 'Allocated_Cr', dataType: 'currency', required: true, description: 'Approved budget in Crore INR' },
      { name: 'Utilized_Cr', dataType: 'currency', required: true, description: 'Actual expenditure in Crore INR' },
      { name: 'Beneficiaries_Count', dataType: 'number', required: false, description: 'Enrolled beneficiary count' },
      { name: 'State_Code', dataType: 'string', required: false, description: 'State code (e.g. MH)' },
      { name: 'Sanction_ID', dataType: 'string', required: false, description: 'Treasury transaction ID' },
    ],
    canonicalFieldMapping: {
      'District_Name': 'District.name',
      'Scheme_Code': 'Scheme.code',
      'Allocated_Cr': 'EvidenceRecord.allocatedCr',
      'Utilized_Cr': 'EvidenceRecord.utilizedCr',
      'Beneficiaries_Count': 'EvidenceRecord.beneficiaries',
      'State_Code': 'EvidenceRecord.state',
    },
    fieldTypes: {
      'District_Name': 'string',
      'Scheme_Code': 'string',
      'Allocated_Cr': 'currency',
      'Utilized_Cr': 'currency',
      'Beneficiaries_Count': 'number',
      'State_Code': 'string',
      'Sanction_ID': 'string',
    },
    requiredFields: ['District_Name', 'Scheme_Code', 'Allocated_Cr', 'Utilized_Cr'],
  },
  'DS-03': {
    id: 'SCHEMA-DS-03',
    datasetSourceId: 'DS-03',
    sourceFields: [
      { name: 'project_id', dataType: 'string', required: true, description: 'Ground project identifier' },
      { name: 'scheme_id', dataType: 'string', required: true, description: 'Scheme code' },
      { name: 'district_code', dataType: 'string', required: true, description: 'LGD or district code' },
      { name: 'milestones_total', dataType: 'number', required: true, description: 'Total milestones' },
      { name: 'milestones_completed', dataType: 'number', required: true, description: 'Verified completed milestones' },
      { name: 'outcome_index', dataType: 'number', required: false, description: 'Quality outcome metric' },
      { name: 'geo_coordinate', dataType: 'geo', required: false, description: 'Lat/Lng location' },
      { name: 'verification_status', dataType: 'string', required: false, description: 'Inspection status' },
    ],
    canonicalFieldMapping: {
      'project_id': 'Project.code',
      'scheme_id': 'Scheme.code',
      'district_code': 'District.lgdCode',
      'milestones_total': 'Project.milestonesTotal',
      'milestones_completed': 'Project.milestonesCompleted',
      'outcome_index': 'EvidenceRecord.outcomeScore',
      'geo_coordinate': 'Project.coordinates',
    },
    fieldTypes: {
      'project_id': 'string',
      'scheme_id': 'string',
      'district_code': 'string',
      'milestones_total': 'number',
      'milestones_completed': 'number',
      'outcome_index': 'number',
      'geo_coordinate': 'geo',
      'verification_status': 'string',
    },
    requiredFields: ['project_id', 'scheme_id', 'district_code', 'milestones_total', 'milestones_completed'],
  },
  'DS-04': {
    id: 'SCHEMA-DS-04',
    datasetSourceId: 'DS-04',
    sourceFields: [
      { name: 'beneficiary_hash', dataType: 'string', required: true, description: 'Pseudonymized beneficiary UID' },
      { name: 'scheme_id', dataType: 'string', required: true, description: 'Scheme code' },
      { name: 'district_code', dataType: 'string', required: true, description: 'District identifier' },
      { name: 'category', dataType: 'string', required: false, description: 'Social or economic category' },
      { name: 'dbt_status', dataType: 'string', required: false, description: 'DBT bank credit status' },
      { name: 'aadhaar_seeded', dataType: 'boolean', required: false, description: 'Aadhaar authentication status' },
      { name: 'last_payment_date', dataType: 'date', required: false, description: 'Disbursement timestamp' },
    ],
    canonicalFieldMapping: {
      'beneficiary_hash': 'Beneficiary.id',
      'scheme_id': 'Scheme.code',
      'district_code': 'District.lgdCode',
      'category': 'Beneficiary.category',
      'dbt_status': 'Beneficiary.dbtStatus',
    },
    fieldTypes: {
      'beneficiary_hash': 'string',
      'scheme_id': 'string',
      'district_code': 'string',
      'category': 'string',
      'dbt_status': 'string',
      'aadhaar_seeded': 'boolean',
      'last_payment_date': 'date',
    },
    requiredFields: ['beneficiary_hash', 'scheme_id', 'district_code'],
  },
};

export class DatasetRegistry {
  private static sourcesMap = new Map<string, DatasetSource>(
    CANONICAL_DATASET_SOURCES.map((s) => [s.id, s])
  );
  private static schemasMap = new Map<string, DatasetSchema>(
    Object.entries(CANONICAL_DATASET_SCHEMAS)
  );

  static getSourceById(id: string): DatasetSource | undefined {
    return this.sourcesMap.get(id);
  }

  static getSchemaBySourceId(sourceId: string): DatasetSchema | undefined {
    return this.schemasMap.get(sourceId);
  }

  static getAllSources(): DatasetSource[] {
    return CANONICAL_DATASET_SOURCES;
  }

  static registerSource(source: DatasetSource, schema?: DatasetSchema) {
    this.sourcesMap.set(source.id, source);
    if (schema) {
      this.schemasMap.set(source.id, schema);
    }
  }
}
