import { NextRequest, NextResponse } from 'next/server';
import { EventBus } from '@/lib/fabric/events/event-bus';
import { DEMO_SCENARIOS } from '@/lib/fabric/events/event-scenarios';
import { ChangeDetector } from '@/lib/fabric/events/change-detector';
import { LiveGovernanceEventMesh } from '@/lib/fabric/mesh/event-mesh';
import { WatcherRegistry } from '@/lib/fabric/watchers/watcher-registry';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode');
  const scenarioKey = searchParams.get('scenario');
  const lgd = searchParams.get('lgd');

  const mesh = LiveGovernanceEventMesh.getInstance();

  // Trigger scenario if specified in query param
  if (scenarioKey && DEMO_SCENARIOS[scenarioKey]) {
    EventBus.dispatch(DEMO_SCENARIOS[scenarioKey].event);
  }

  // If JSON mode requested, return snapshot with mesh state
  if (mode === 'json') {
    const events = lgd ? EventBus.getEventsForDistrict(lgd) : EventBus.getEvents(30);
    const meshState = mesh.getMeshState();
    return NextResponse.json({
      success: true,
      summary: EventBus.getSummary(),
      meshState,
      events,
      sources: WatcherRegistry.getSourceHealthList(),
    });
  }

  // Server-Sent Events (SSE) Streaming Response
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial handshake and current state
      const initialPayload = JSON.stringify({
        type: 'INITIAL_STATE',
        summary: EventBus.getSummary(),
        meshState: mesh.getMeshState(),
        events: lgd ? EventBus.getEventsForDistrict(lgd) : EventBus.getEvents(20),
        sources: WatcherRegistry.getSourceHealthList(),
      });
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      // 2. Subscribe to new events from EventBus
      const unsubscribe = EventBus.subscribe((newEvent) => {
        if (!lgd || newEvent.lgdCode === lgd) {
          try {
            const eventPayload = JSON.stringify({
              type: 'NEW_EVENT',
              event: newEvent,
              summary: EventBus.getSummary(),
              meshState: mesh.getMeshState(),
            });
            controller.enqueue(encoder.encode(`data: ${eventPayload}\n\n`));
          } catch {
            // Stream closed
            unsubscribe();
          }
        }
      });

      // 3. Heartbeat every 15s to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
          unsubscribe();
        }
      }, 15000);

      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // ignore
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mesh = LiveGovernanceEventMesh.getInstance();

    if (body.action === 'run_watch_cycle') {
      const cycleResult = await mesh.runWatchCycle(body.mode || 'VERIFIED_SOURCE');
      return NextResponse.json({
        success: true,
        action: 'WATCH_CYCLE_COMPLETED',
        cycleResult,
        meshState: mesh.getMeshState(),
        summary: EventBus.getSummary(),
      });
    }

    if (body.action === 'reconstruct_district' && body.lgdCode) {
      const timeline = mesh.reconstructDistrictState(body.lgdCode);
      return NextResponse.json({
        success: true,
        action: 'DISTRICT_RECONSTRUCTED',
        timeline,
      });
    }

    if (body.action === 'trigger_scenario' && body.scenarioId) {
      const scenario = DEMO_SCENARIOS[body.scenarioId];
      if (scenario) {
        const dispatched = EventBus.dispatch(scenario.event);
        return NextResponse.json({
          success: true,
          action: 'SCENARIO_TRIGGERED',
          event: dispatched,
          summary: EventBus.getSummary(),
        });
      }
    }

    if (body.action === 'reset') {
      EventBus.reset();
      return NextResponse.json({
        success: true,
        action: 'RESET_COMPLETED',
        summary: EventBus.getSummary(),
      });
    }

    // Custom metric change detection
    if (body.previousValue !== undefined && body.currentValue !== undefined) {
      const event = ChangeDetector.detectMetricChange({
        previousValue: Number(body.previousValue),
        currentValue: Number(body.currentValue),
        metricKey: body.metricKey || 'utilized_funds_cr',
        metricLabel: body.metricLabel || 'Disbursed Expenditure',
        unit: body.unit || '₹ Crore',
        districtName: body.districtName || 'Nandurbar',
        lgdCode: body.lgdCode || '512',
        schemeId: body.schemeId || 'JJM',
        datasetId: body.datasetId || 'DS-JJM-MH',
        mode: body.mode || 'DEMO_STREAM',
      });

      const dispatched = EventBus.dispatch(event);
      return NextResponse.json({
        success: true,
        event: dispatched,
        summary: EventBus.getSummary(),
      });
    }

    return NextResponse.json({ error: 'Invalid action or payload' }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
