import { NextResponse } from 'next/server';
import { MAHARASHTRA_DISTRICTS } from '@/lib/data/governance-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gapsOnly = searchParams.get('gapsOnly') === 'true';
  const districtId = searchParams.get('id');

  if (districtId) {
    const district = MAHARASHTRA_DISTRICTS.find(
      (d) => d.id === districtId || d.name.toLowerCase() === districtId.toLowerCase()
    );
    if (!district) {
      return NextResponse.json({ success: false, error: 'District not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, district });
  }

  let results = [...MAHARASHTRA_DISTRICTS];
  if (gapsOnly) {
    results = results.filter((d) => d.isGapFlagged);
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    state: 'Maharashtra',
    stateCode: 'MH',
    lgdHierarchyLevel: 'DISTRICT',
    districts: results,
  });
}
