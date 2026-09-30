import { NextResponse } from 'next/server';
import { SutraIntelligenceEngine } from '@/lib/engines/intelligence-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body?.query || '';

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Execute SUTRA's deterministic cross-ministry intelligence engine
    const executionResult = SutraIntelligenceEngine.executeQuery(query);

    return NextResponse.json({
      success: true,
      query,
      timestamp: new Date().toISOString(),
      result: executionResult,
      engine: 'SUTRA-Deterministic-Apex-v2.6',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to execute governance query', details: String(error) },
      { status: 500 }
    );
  }
}
