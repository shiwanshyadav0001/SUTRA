import { NextResponse } from 'next/server';
import { SCHEMES_DATA, MINISTRIES_DATA } from '@/lib/data/governance-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const ministry = searchParams.get('ministry') || 'all';
  const status = searchParams.get('status') || 'all';

  let results = [...SCHEMES_DATA];

  if (search) {
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.code.toLowerCase().includes(search) ||
        s.sector.toLowerCase().includes(search)
    );
  }

  if (ministry !== 'all') {
    results = results.filter((s) => s.ministryId === ministry);
  }

  if (status !== 'all') {
    results = results.filter((s) => s.status === status);
  }

  return NextResponse.json({
    success: true,
    total: results.length,
    timestamp: new Date().toISOString(),
    schemes: results,
    ministries: MINISTRIES_DATA,
  });
}
