import { GovernanceEvent, SourceHealthStatus } from '@/lib/types/events';
import { ChangeDetector } from './change-detector';

export const INITIAL_SOURCE_HEALTH: SourceHealthStatus[] = [
  {
    id: 'SRC-JJM-IMIS',
    datasetId: 'DS-JJM-MH',
    name: 'Jal Jeevan Mission (JJM IMIS)',
    schemeName: 'Jal Jeevan Mission',
    publisher: 'Department of Drinking Water and Sanitation, Ministry of Jal Shakti',
    status: 'ONLINE',
    lastRefresh: '2026-10-02T22:00:00.000Z',
    recordCount: 36,
    freshness: '12m ago',
    reportingFrequency: 'MONTHLY',
    updateFrequency: 'Monthly Cadence',
    verifiedSourceUrl: 'https://ejalshakti.gov.in/jjmreport/JJMIndia.aspx',
    verificationLevel: 'OFFICIAL_SOURCE',
  },
  {
    id: 'SRC-PMAYG-AWAAS',
    datasetId: 'DS-PMAYG-MH',
    name: 'PMAY-G Rural Housing (AwaasSoft)',
    schemeName: 'PMAY-Gramin',
    publisher: 'Ministry of Rural Development, Government of India',
    status: 'ONLINE',
    lastRefresh: '2026-10-02T22:00:00.000Z',
    recordCount: 36,
    freshness: '45m ago',
    reportingFrequency: 'QUARTERLY',
    updateFrequency: 'Quarterly Audit',
    verifiedSourceUrl: 'https://rhreporting.nic.in/netiay/PhysicalProgressReports/',
    verificationLevel: 'OFFICIAL_SOURCE',
  },
  {
    id: 'SRC-PKVY-OPEN',
    datasetId: 'DS-PKVY-MH',
    name: 'PKVY Organic Soil Health (Open Data)',
    schemeName: 'PKVY Organic Farming',
    publisher: 'Department of Agriculture & Farmers Welfare, Ministry of Agriculture',
    status: 'ONLINE',
    lastRefresh: '2026-10-02T22:00:00.000Z',
    recordCount: 36,
    freshness: '2h ago',
    reportingFrequency: 'ANNUAL',
    updateFrequency: 'Annual Cluster Review',
    verifiedSourceUrl: 'https://data.gov.in/catalog/paramparagat-krishi-vikas-yojana',
    verificationLevel: 'OFFICIAL_SOURCE',
  },
];

/**
 * Baseline real-data verified events anchored to Maharashtra LGD districts.
 */
export const BASELINE_VERIFIED_EVENTS: GovernanceEvent[] = [
  ChangeDetector.detectMetricChange({
    id: 'EVT-NDB-JJM-BASE',
    previousValue: 17.5,
    currentValue: 20.1,
    metricKey: 'utilized_funds_cr',
    metricLabel: 'JJM Disbursed Expenditure',
    unit: '₹ Crore',
    districtName: 'Nandurbar',
    lgdCode: '512',
    schemeId: 'JJM',
    datasetId: 'DS-JJM-MH',
    evidenceIds: ['#7201'],
    findingId: 'SUTRA-FND-0001',
    investigationId: 'INV-NDB-CONV-001',
    mode: 'VERIFIED_SOURCE',
    customTimestamp: '2026-10-02T21:40:00.000Z',
  }),
  ChangeDetector.detectMetricChange({
    id: 'EVT-NDB-PMAYG-BASE',
    previousValue: 19800,
    currentValue: 21902,
    metricKey: 'completed_pucca_houses',
    metricLabel: 'PMAY-G Completed Pucca Units',
    unit: 'houses',
    districtName: 'Nandurbar',
    lgdCode: '512',
    schemeId: 'PMAY-G',
    datasetId: 'DS-PMAYG-MH',
    evidenceIds: ['#4401'],
    findingId: 'SUTRA-FND-0002',
    investigationId: 'INV-NDB-CONV-001',
    mode: 'VERIFIED_SOURCE',
    customTimestamp: '2026-10-02T21:45:00.000Z',
  }),
  ChangeDetector.detectMetricChange({
    id: 'EVT-GDC-PMAYG-BASE',
    previousValue: 18100,
    currentValue: 20270,
    metricKey: 'completed_pucca_houses',
    metricLabel: 'PMAY-G Completed Pucca Units',
    unit: 'houses',
    districtName: 'Gadchiroli',
    lgdCode: '501',
    schemeId: 'PMAY-G',
    datasetId: 'DS-PMAYG-MH',
    evidenceIds: ['#4402'],
    mode: 'VERIFIED_SOURCE',
    customTimestamp: '2026-10-02T21:50:00.000Z',
  }),
  ChangeDetector.detectMetricChange({
    id: 'EVT-WSM-JJM-BASE',
    previousValue: 80000,
    currentValue: 86000,
    metricKey: 'fhtc_provided_households',
    metricLabel: 'JJM Tap Water Connections',
    unit: 'connections',
    districtName: 'Washim',
    lgdCode: '525',
    schemeId: 'JJM',
    datasetId: 'DS-JJM-MH',
    evidenceIds: ['#7203'],
    mode: 'VERIFIED_SOURCE',
    customTimestamp: '2026-10-02T21:55:00.000Z',
  }),
];

export const VERIFIED_BASELINE_EVENTS = BASELINE_VERIFIED_EVENTS;

/**
 * Signature Demonstration Live Scenarios
 */
export const DEMO_SCENARIO_NANDURBAR_JJM_DRAWDOWN = ChangeDetector.detectMetricChange({
  id: 'EVT-NDB-JJM-LIVE',
  previousValue: 22.1,
  currentValue: 24.7,
  metricKey: 'utilized_funds_cr',
  metricLabel: 'JJM Expenditure Drawdown',
  unit: '₹ Crore',
  districtName: 'Nandurbar',
  lgdCode: '512',
  schemeId: 'JJM',
  datasetId: 'DS-JJM-MH',
  evidenceIds: ['#7201', '#4401', '#5501'],
  findingId: 'SUTRA-FND-0001',
  investigationId: 'INV-NDB-CONV-001',
  mode: 'LIVE_SIMULATION',
  customTimestamp: '2026-10-03T06:15:00.000Z',
});

export const DEMO_SCENARIO_GADCHIROLI_PMAYG_ACCELERATION = ChangeDetector.detectMetricChange({
  id: 'EVT-GDC-PMAYG-LIVE',
  previousValue: 20270,
  currentValue: 23800,
  metricKey: 'completed_pucca_houses',
  metricLabel: 'PMAY-G Completed Pucca Units',
  unit: 'houses',
  districtName: 'Gadchiroli',
  lgdCode: '501',
  schemeId: 'PMAY-G',
  datasetId: 'DS-PMAYG-MH',
  evidenceIds: ['#4402', '#7202'],
  mode: 'LIVE_SIMULATION',
  customTimestamp: '2026-10-03T06:16:00.000Z',
});

export const DEMO_SCENARIO_WASHIM_TAP_WATER_LAG = ChangeDetector.detectMetricChange({
  id: 'EVT-WSM-PACE-LIVE',
  previousValue: 40.0,
  currentValue: 46.2,
  metricKey: 'coverage_percentage',
  metricLabel: 'JJM FHTC Coverage Rate',
  unit: '%',
  districtName: 'Washim',
  lgdCode: '525',
  schemeId: 'JJM',
  datasetId: 'DS-JJM-MH',
  evidenceIds: ['#7203'],
  mode: 'LIVE_SIMULATION',
  customTimestamp: '2026-10-03T06:17:00.000Z',
});

export const DEMO_SCENARIOS: Record<string, { title: string; description: string; event: GovernanceEvent }> = {
  nandurbar_drawdown: {
    title: 'Nandurbar JJM Drawdown Surge (+11.8%)',
    description: 'Triggers cross-programme correlation against PMAY-G housing progress across LGD 512.',
    event: DEMO_SCENARIO_NANDURBAR_JJM_DRAWDOWN,
  },
  gadchiroli_pmayg: {
    title: 'Gadchiroli PMAY-G Housing Acceleration (+17.4%)',
    description: 'Triggers multi-scheme capital absorption review in tribal border block.',
    event: DEMO_SCENARIO_GADCHIROLI_PMAYG_ACCELERATION,
  },
  washim_pace: {
    title: 'Washim Physical Delivery Pace Spread (15.2 pp)',
    description: 'Detects delivery pace divergence between rural tap water and housing DBT milestones.',
    event: DEMO_SCENARIO_WASHIM_TAP_WATER_LAG,
  },
};

export const SIMULATED_SCENARIOS = DEMO_SCENARIOS;
