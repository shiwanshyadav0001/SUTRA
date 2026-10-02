import { Ministry, Department } from '@/lib/types/data-fabric';

export interface CanonicalMinistryEntry extends Ministry {
  departments: Department[];
  aliases: string[];
}

export const CANONICAL_MINISTRIES_REGISTRY: CanonicalMinistryEntry[] = [
  {
    id: 'MIN-01',
    code: 'MoA&FW',
    name: 'Ministry of Agriculture and Farmers Welfare',
    shortName: 'Agriculture',
    departmentCount: 2,
    schemeCount: 14,
    totalAllocationCr: 6850,
    totalUtilizedCr: 4932,
    headMinister: 'Union Minister for Agriculture & Farmers Welfare',
    aliases: [
      'MoA&FW',
      'MoAFW',
      'Ministry of Agriculture',
      'Agriculture Ministry',
      'Ministry of Agriculture and Farmers Welfare',
      'MIN-01',
    ],
    departments: [
      {
        id: 'DEP-01',
        code: 'DoA&FW',
        name: 'Department of Agriculture & Farmers Welfare',
        ministryId: 'MIN-01',
        ministryCode: 'MoA&FW',
        schemeCount: 10,
        description: 'Formulates and implements national policies on crop production, credit, organic farming, and price support.',
        aliases: ['DoA&FW', 'DoAFW', 'Dept of Agriculture', 'Dept of Agri & Farmers Welfare', 'DEP-01'],
      },
      {
        id: 'DEP-02',
        code: 'DARE',
        name: 'Department of Agricultural Research and Education',
        ministryId: 'MIN-01',
        ministryCode: 'MoA&FW',
        schemeCount: 4,
        description: 'Oversees ICAR and agricultural research institutes and value chain technology.',
        aliases: ['DARE', 'Dept of Agricultural Research', 'DEP-02'],
      },
    ],
  },
  {
    id: 'MIN-02',
    code: 'MoRD',
    name: 'Ministry of Rural Development',
    shortName: 'Rural Development',
    departmentCount: 2,
    schemeCount: 18,
    totalAllocationCr: 8420,
    totalUtilizedCr: 6315,
    headMinister: 'Union Minister for Rural Development',
    aliases: [
      'MoRD',
      'Ministry of Rural Development',
      'Rural Development Ministry',
      'Gramin Vikas Mantralaya',
      'MIN-02',
    ],
    departments: [
      {
        id: 'DEP-03',
        code: 'DoRD',
        name: 'Department of Rural Development',
        ministryId: 'MIN-02',
        ministryCode: 'MoRD',
        schemeCount: 14,
        description: 'Implements rural housing, road connectivity, and poverty alleviation missions.',
        aliases: ['DoRD', 'Dept of Rural Development', 'DEP-03'],
      },
      {
        id: 'DEP-04',
        code: 'DoLR',
        name: 'Department of Land Resources',
        ministryId: 'MIN-02',
        ministryCode: 'MoRD',
        schemeCount: 4,
        description: 'Coordinates digital land records modernization and watershed management.',
        aliases: ['DoLR', 'Dept of Land Resources', 'Land Resources', 'DEP-04'],
      },
    ],
  },
  {
    id: 'MIN-03',
    code: 'MoJS',
    name: 'Ministry of Jal Shakti',
    shortName: 'Jal Shakti',
    departmentCount: 2,
    schemeCount: 9,
    totalAllocationCr: 4120,
    totalUtilizedCr: 2966,
    headMinister: 'Union Minister for Jal Shakti',
    aliases: [
      'MoJS',
      'Ministry of Jal Shakti',
      'Jal Shakti Ministry',
      'Ministry of Water Resources',
      'MIN-03',
    ],
    departments: [
      {
        id: 'DEP-05',
        code: 'DDWS',
        name: 'Department of Drinking Water and Sanitation',
        ministryId: 'MIN-03',
        ministryCode: 'MoJS',
        schemeCount: 5,
        description: 'Executes Jal Jeevan Mission and Swachh Bharat Mission (Gramin).',
        aliases: ['DDWS', 'Dept of Drinking Water', 'Dept of Drinking Water and Sanitation', 'DEP-05'],
      },
      {
        id: 'DEP-06',
        code: 'DoWR',
        name: 'Department of Water Resources, River Development and Ganga Rejuvenation',
        ministryId: 'MIN-03',
        ministryCode: 'MoJS',
        schemeCount: 4,
        description: 'Executes Atal Bhujal Yojana, major irrigation command, and groundwater regulation.',
        aliases: ['DoWR', 'Dept of Water Resources', 'Ganga Rejuvenation', 'DEP-06'],
      },
    ],
  },
  {
    id: 'MIN-04',
    code: 'MoHFW',
    name: 'Ministry of Health and Family Welfare',
    shortName: 'Health',
    departmentCount: 2,
    schemeCount: 16,
    totalAllocationCr: 5200,
    totalUtilizedCr: 3796,
    headMinister: 'Union Minister for Health & Family Welfare',
    aliases: [
      'MoHFW',
      'Ministry of Health',
      'Ministry of Health and Family Welfare',
      'Health Ministry',
      'Swasthya Mantralaya',
      'MIN-04',
    ],
    departments: [
      {
        id: 'DEP-07',
        code: 'DoHFW',
        name: 'Department of Health & Family Welfare',
        ministryId: 'MIN-04',
        ministryCode: 'MoHFW',
        schemeCount: 12,
        description: 'Administers Ayushman Bharat PM-JAY and National Health Mission.',
        aliases: ['DoHFW', 'Dept of Health', 'DEP-07'],
      },
      {
        id: 'DEP-08',
        code: 'DHR',
        name: 'Department of Health Research',
        ministryId: 'MIN-04',
        ministryCode: 'MoHFW',
        schemeCount: 4,
        description: 'Oversees ICMR and epidemiological surveillance.',
        aliases: ['DHR', 'Dept of Health Research', 'DEP-08'],
      },
    ],
  },
  {
    id: 'MIN-05',
    code: 'MoE',
    name: 'Ministry of Education',
    shortName: 'Education',
    departmentCount: 2,
    schemeCount: 12,
    totalAllocationCr: 3810,
    totalUtilizedCr: 2857,
    headMinister: 'Union Minister for Education',
    aliases: [
      'MoE',
      'Ministry of Education',
      'MHRD',
      'Ministry of Human Resource Development',
      'Education Ministry',
      'MIN-05',
    ],
    departments: [
      {
        id: 'DEP-09',
        code: 'DoSE&L',
        name: 'Department of School Education and Literacy',
        ministryId: 'MIN-05',
        ministryCode: 'MoE',
        schemeCount: 8,
        description: 'Implements Samagra Shiksha and PM POSHAN.',
        aliases: ['DoSE&L', 'School Education', 'DEP-09'],
      },
      {
        id: 'DEP-10',
        code: 'DoHE',
        name: 'Department of Higher Education',
        ministryId: 'MIN-05',
        ministryCode: 'MoE',
        schemeCount: 4,
        description: 'Oversees university grants and technical institutes.',
        aliases: ['DoHE', 'Higher Education', 'DEP-10'],
      },
    ],
  },
];

export class MinistryRegistry {
  private static ministryCodeMap = new Map<string, CanonicalMinistryEntry>(
    CANONICAL_MINISTRIES_REGISTRY.map((m) => [m.code.toUpperCase(), m])
  );
  private static ministryIdMap = new Map<string, CanonicalMinistryEntry>(
    CANONICAL_MINISTRIES_REGISTRY.map((m) => [m.id.toUpperCase(), m])
  );

  static getMinistryByCode(code: string): CanonicalMinistryEntry | undefined {
    return this.ministryCodeMap.get(code.toUpperCase().trim());
  }

  static getMinistryById(id: string): CanonicalMinistryEntry | undefined {
    return this.ministryIdMap.get(id.toUpperCase().trim());
  }

  static getAllMinistries(): CanonicalMinistryEntry[] {
    return CANONICAL_MINISTRIES_REGISTRY;
  }

  static getAllDepartments(): Department[] {
    return CANONICAL_MINISTRIES_REGISTRY.flatMap((m) => m.departments);
  }

  static getDepartmentByCode(code: string): Department | undefined {
    const clean = code.toUpperCase().trim();
    return this.getAllDepartments().find((d) => d.code.toUpperCase() === clean);
  }

  static getDepartmentById(id: string): Department | undefined {
    const clean = id.toUpperCase().trim();
    return this.getAllDepartments().find((d) => d.id.toUpperCase() === clean);
  }
}
