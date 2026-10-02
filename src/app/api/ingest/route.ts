import { NextResponse } from 'next/server';
import { EntityResolutionEngine } from '@/lib/engines/entity-resolution';
import { DataFabricPipeline } from '@/lib/fabric/pipeline/ingestion-pipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support CSV stream batch ingestion
    if (body?.csvContent) {
      const sourceId = body?.sourceId || 'DS-02';
      const summary = DataFabricPipeline.ingestCsv(sourceId, body.csvContent);
      return NextResponse.json({
        success: true,
        mode: 'BATCH_CSV',
        sourceId,
        summary,
      });
    }

    // Support Structured Records Batch ingestion
    if (Array.isArray(body?.records)) {
      const sourceId = body?.sourceId || 'DS-02';
      const summary = DataFabricPipeline.ingestBatch(sourceId, body.records);
      return NextResponse.json({
        success: true,
        mode: 'BATCH_RECORDS',
        sourceId,
        summary,
      });
    }

    // Single Entity Resolution mode
    const rawEntity = body?.entity || '';
    const entityType = (body?.type || 'STATE').toUpperCase();

    if (!rawEntity) {
      return NextResponse.json(
        { success: false, error: 'Entity name or records batch is required' },
        { status: 400 }
      );
    }

    let resolved;
    if (entityType === 'DISTRICT') {
      resolved = EntityResolutionEngine.resolveDistrict(rawEntity);
    } else if (entityType === 'SCHEME') {
      resolved = EntityResolutionEngine.resolveScheme(rawEntity);
    } else if (entityType === 'MINISTRY') {
      resolved = EntityResolutionEngine.resolveMinistry(rawEntity);
    } else {
      resolved = EntityResolutionEngine.resolveState(rawEntity);
    }

    return NextResponse.json({
      success: true,
      mode: 'SINGLE_ENTITY',
      input: rawEntity,
      type: entityType,
      resolved,
      resolvedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Entity resolution / Ingestion failed', details: String(error) },
      { status: 500 }
    );
  }
}
