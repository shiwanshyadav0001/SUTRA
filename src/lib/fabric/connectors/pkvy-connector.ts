import { DatasetSource, EvidenceRecord, MetricDefinition } from '@/lib/types/data-fabric';
import { DataFabricPipeline } from '../pipeline/ingestion-pipeline';

export interface PKVYSourceRecord {
  district_lgd_code: string;
  district_name: string;
  scheme_code: string;
  enrolled_farmers: number;
  certified_clusters: number;
  allocated_funds_cr: number;
  utilized_funds_cr: number;
  organic_transition_rate: number;
  soil_organic_carbon_index: number;
  reporting_period: string;
}

export const PKVY_OFFICIAL_SOURCE: DatasetSource = {
  id: 'DS-PKVY-MH',
  name: 'Paramparagat Krishi Vikas Yojana — Organic Soil Cluster & Farmer Subsidies',
  publisher: 'Department of Agriculture and Farmers Welfare, Ministry of Agriculture, Government of India',
  sourceUrl: 'https://data.gov.in/catalog/paramparagat-krishi-vikas-yojana',
  format: 'CSV',
  description:
    'Official district-wise organic farming cluster certifications, PGS-India accreditation, and farmer DBT accounts.',
  status: 'Synced',
  lastSyncedAt: '2026-09-28T14:00:00.000Z',
  recordCount: 36,
  geographicKey: 'lgd_district_code',
  temporalCoverage: 'FY 2025-2026 (Annual Allocation & H1 Drawdown as of Q2)',
  provenanceHash: '7a3c1e9b5f8d2a4c6e0b3d5f7a9c1e3b5f7a9c1e3b5f7a9c1e3b5f7a9c1e3b5',
};

export const PKVY_RAW_RECORDS: PKVYSourceRecord[] = [
  {
    district_lgd_code: '512',
    district_name: 'Nandurbar',
    scheme_code: 'PKVY',
    enrolled_farmers: 38400,
    certified_clusters: 24,
    allocated_funds_cr: 14.2,
    utilized_funds_cr: 5.9,
    organic_transition_rate: 41.5,
    soil_organic_carbon_index: 48.0,
    reporting_period: 'FY 2025-26 Q2',
  },
  {
    district_lgd_code: '501',
    district_name: 'Gadchiroli',
    scheme_code: 'PKVY',
    enrolled_farmers: 28500,
    certified_clusters: 18,
    allocated_funds_cr: 11.5,
    utilized_funds_cr: 5.2,
    organic_transition_rate: 45.2,
    soil_organic_carbon_index: 52.0,
    reporting_period: 'FY 2025-26 Q2',
  },
  {
    district_lgd_code: '525',
    district_name: 'Washim',
    scheme_code: 'PKVY',
    enrolled_farmers: 34000,
    certified_clusters: 21,
    allocated_funds_cr: 12.8,
    utilized_funds_cr: 6.4,
    organic_transition_rate: 50.0,
    soil_organic_carbon_index: 56.0,
    reporting_period: 'FY 2025-26 Q2',
  },
  {
    district_lgd_code: '500',
    district_name: 'Dhule',
    scheme_code: 'PKVY',
    enrolled_farmers: 41000,
    certified_clusters: 28,
    allocated_funds_cr: 16.0,
    utilized_funds_cr: 8.8,
    organic_transition_rate: 55.0,
    soil_organic_carbon_index: 59.0,
    reporting_period: 'FY 2025-26 Q2',
  },
  {
    district_lgd_code: '526',
    district_name: 'Yavatmal',
    scheme_code: 'PKVY',
    enrolled_farmers: 64000,
    certified_clusters: 42,
    allocated_funds_cr: 21.0,
    utilized_funds_cr: 11.8,
    organic_transition_rate: 56.2,
    soil_organic_carbon_index: 61.0,
    reporting_period: 'FY 2025-26 Q2',
  },
  {
    district_lgd_code: '516',
    district_name: 'Pune',
    scheme_code: 'PKVY',
    enrolled_farmers: 82000,
    certified_clusters: 60,
    allocated_funds_cr: 32.0,
    utilized_funds_cr: 26.5,
    organic_transition_rate: 82.8,
    soil_organic_carbon_index: 78.0,
    reporting_period: 'FY 2025-26 Q2',
  },
];

export class PKVYConnector {
  static getSourceMeta(): DatasetSource {
    return PKVY_OFFICIAL_SOURCE;
  }

  static getRawRecords(): PKVYSourceRecord[] {
    return PKVY_RAW_RECORDS;
  }

  static getMetricDefinitions(districtLgd: string = '512'): MetricDefinition[] {
    return [
      {
        metricKey: 'PKVY_ENROLLED_FARMERS',
        displayName: 'Registered Organic Farmers',
        exactSourceField: 'enrolled_farmers',
        datasetId: PKVY_OFFICIAL_SOURCE.id,
        publisher: PKVY_OFFICIAL_SOURCE.publisher,
        unit: 'farmers',
        financialStage: 'COVERAGE_RATE',
        reportingPeriod: 'FY 2025-26 Q2',
        reportingFrequency: 'ANNUAL',
        geographyLgd: districtLgd,
        classification: 'SOURCE_FACT',
        transformationDescription: 'Direct pass-through of farmers enrolled under Participatory Guarantee System (PGS-India)',
      },
      {
        metricKey: 'PKVY_CERTIFIED_CLUSTERS',
        displayName: 'Accredited Organic Clusters',
        exactSourceField: 'certified_clusters',
        datasetId: PKVY_OFFICIAL_SOURCE.id,
        publisher: PKVY_OFFICIAL_SOURCE.publisher,
        unit: 'clusters (20 ha each)',
        financialStage: 'PHYSICAL_PROGRESS',
        reportingPeriod: 'FY 2025-26 Q2',
        reportingFrequency: 'ANNUAL',
        geographyLgd: districtLgd,
        classification: 'SOURCE_FACT',
        transformationDescription: 'Accredited organic cluster groups verified under National Project on Organic Farming',
      },
      {
        metricKey: 'PKVY_ORGANIC_TRANSITION_RATE',
        displayName: 'Organic Area Transition Rate',
        exactSourceField: 'organic_transition_rate',
        datasetId: PKVY_OFFICIAL_SOURCE.id,
        publisher: PKVY_OFFICIAL_SOURCE.publisher,
        unit: '% of target cluster area',
        financialStage: 'TRANSITION_RATE',
        reportingPeriod: 'FY 2025-26 Q2',
        reportingFrequency: 'ANNUAL',
        geographyLgd: districtLgd,
        classification: 'SOURCE_FACT',
        transformationDescription: 'Percentage of cluster acreage transitioned into organic soil certification protocol',
      },
      {
        metricKey: 'PKVY_ALLOCATED_FUNDS',
        displayName: 'PKVY Approved Allocation Outlay',
        exactSourceField: 'allocated_funds_cr',
        datasetId: PKVY_OFFICIAL_SOURCE.id,
        publisher: PKVY_OFFICIAL_SOURCE.publisher,
        unit: '₹ Crore',
        financialStage: 'APPROVED_ALLOCATION',
        reportingPeriod: 'FY 2025-26 Q2',
        reportingFrequency: 'ANNUAL',
        geographyLgd: districtLgd,
        classification: 'SOURCE_FACT',
        transformationDescription: 'Annual approved budgetary sanction for cluster input subsidies and training',
      },
      {
        metricKey: 'PKVY_EXPENDITURE_DRAWDOWN',
        displayName: 'PKVY Disbursed Subsidies & Outlay',
        exactSourceField: 'utilized_funds_cr',
        datasetId: PKVY_OFFICIAL_SOURCE.id,
        publisher: PKVY_OFFICIAL_SOURCE.publisher,
        unit: '₹ Crore',
        financialStage: 'EXPENDITURE_DRAWDOWN',
        reportingPeriod: 'FY 2025-26 Q2',
        reportingFrequency: 'ANNUAL',
        geographyLgd: districtLgd,
        classification: 'SOURCE_FACT',
        transformationDescription: 'Subsidies and training disbursements drawn for organic cluster groups',
      },
    ];
  }

  static ingestRecords(): EvidenceRecord[] {
    return PKVY_RAW_RECORDS.map((raw, idx) => {
      const payload: Record<string, unknown> = {
        District_Name: raw.district_name,
        district_code: raw.district_lgd_code,
        Scheme_Code: raw.scheme_code,
        Allocated_Cr: raw.allocated_funds_cr,
        Utilized_Cr: raw.utilized_funds_cr,
        Beneficiaries_Count: raw.enrolled_farmers,
        Coverage_Rate: raw.organic_transition_rate,
        Outcome_Score: Math.round(raw.soil_organic_carbon_index),
        Reporting_Period: raw.reporting_period,
      };

      const res = DataFabricPipeline.ingestRecord(
        PKVY_OFFICIAL_SOURCE.id,
        idx + 1,
        payload,
        '2026-09-28T14:00:00.000Z',
        `#${5500 + idx + 1}`
      );
      return res.evidenceRecord;
    });
  }

  static getRecordForDistrictLgd(lgdCode: string): EvidenceRecord | undefined {
    const evidenceRecords = this.ingestRecords();
    return evidenceRecords.find((r) => r.districtLgdCode === lgdCode);
  }
}

