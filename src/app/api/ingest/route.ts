import { NextResponse } from 'next/server';
import { EntityResolutionEngine } from '@/lib/engines/entity-resolution';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEntity = body?.entity || '';
    const entityType = body?.type || 'STATE';

    if (!rawEntity) {
      return NextResponse.json(
        { success: false, error: 'Entity name is required' },
        { status: 400 }
      );
    }

    let resolved;
    if (entityType === 'DISTRICT') {
      resolved = EntityResolutionEngine.resolveDistrict(rawEntity);
    } else {
      resolved = EntityResolutionEngine.resolveState(rawEntity);
    }

    return NextResponse.json({
      success: true,
      input: rawEntity,
      type: entityType,
      resolved,
      resolvedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Entity resolution failed', details: String(error) },
      { status: 500 }
    );
  }
}
