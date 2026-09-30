import { NextResponse } from 'next/server';
import { SIGNALS_DATA, OVERLAPS_DATA } from '@/lib/data/governance-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    signals: SIGNALS_DATA,
    overlaps: OVERLAPS_DATA,
  });
}
