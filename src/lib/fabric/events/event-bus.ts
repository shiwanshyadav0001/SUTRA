import {
  GovernanceEvent,
  SourceHealthStatus,
  LiveTelemetrySummary,
  EventProcessingMode,
  EventSeverity,
} from '@/lib/types/events';
import {
  BASELINE_VERIFIED_EVENTS,
  INITIAL_SOURCE_HEALTH,
} from './event-scenarios';

type EventListener = (event: GovernanceEvent) => void;

export class GovernanceEventBus {
  private events: GovernanceEvent[] = [...BASELINE_VERIFIED_EVENTS];
  private listeners: Set<EventListener> = new Set();
  private sources: SourceHealthStatus[] = [...INITIAL_SOURCE_HEALTH];
  private mode: EventProcessingMode = 'VERIFIED_SOURCE';
  private maxBufferSize = 60;

  constructor() {
    // Sort initial events by timestamp descending
    this.events.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Dispatches a new governance event through the event bus.
   */
  dispatch(event: GovernanceEvent): GovernanceEvent {
    // Ensure pipeline step is tracked
    const processedEvent: GovernanceEvent = {
      ...event,
      processingPipelineStep: 'INVESTIGATED',
    };

    // Prepend to event buffer (newest first)
    this.events = [processedEvent, ...this.events.slice(0, this.maxBufferSize - 1)];

    if (processedEvent.mode === 'DEMO_STREAM' || processedEvent.mode === 'LIVE_SIMULATION') {
      this.mode = 'DEMO_STREAM';
    }

    // Notify all active subscribers
    this.listeners.forEach((listener) => {
      try {
        listener(processedEvent);
      } catch (err) {
        console.error('Error in event listener callback:', err);
      }
    });

    return processedEvent;
  }

  /**
   * Alias for dispatch.
   */
  publish(event: GovernanceEvent): GovernanceEvent {
    return this.dispatch(event);
  }

  /**
   * Subscribes a listener callback to real-time events.
   * Returns an unsubscribe cleanup function.
   */
  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Returns all events in the buffer.
   */
  getEvents(limit = 30): GovernanceEvent[] {
    return this.events.slice(0, limit);
  }

  /**
   * Alias for getEvents.
   */
  getHistory(limit = 30): GovernanceEvent[] {
    return this.getEvents(limit);
  }

  /**
   * Returns a single event by ID.
   */
  getEventById(id: string): GovernanceEvent | undefined {
    return this.events.find((e) => e.id === id);
  }

  /**
   * Returns events filtered by district LGD code.
   */
  getEventsForDistrict(lgdCode: string): GovernanceEvent[] {
    return this.events.filter((e) => e.lgdCode === lgdCode);
  }

  /**
   * Returns the current source health telemetry.
   */
  getSourceHealth(): SourceHealthStatus[] {
    return this.sources;
  }

  /**
   * Updates health status for a specific dataset source.
   */
  updateSourceHealth(datasetId: string, updates: Partial<SourceHealthStatus>): void {
    this.sources = this.sources.map((s) =>
      s.datasetId === datasetId || s.id === datasetId ? { ...s, ...updates } : s
    );
  }

  /**
   * Generates a comprehensive real-time telemetry summary snapshot.
   */
  getTelemetrySummary(): LiveTelemetrySummary & { totalEventsProcessed: number; sourceHealthSummary: SourceHealthStatus[]; affectedDistrictsCount: number } {
    const affectedDistrictMap = new Map<
      string,
      { lgdCode: string; name: string; count: number; maxSeverity: EventSeverity }
    >();

    this.events.forEach((e) => {
      const existing = affectedDistrictMap.get(e.districtName);
      if (existing) {
        existing.count++;
      } else {
        affectedDistrictMap.set(e.districtName, {
          lgdCode: e.lgdCode,
          name: e.districtName,
          count: 1,
          maxSeverity: e.severity,
        });
      }
    });

    const affectedDistricts = Array.from(affectedDistrictMap.values()).map((d) => ({
      lgdCode: d.lgdCode,
      name: d.name,
      activeEventCount: d.count,
      severity: d.maxSeverity || 'HIGH',
    }));

    const latestEvent = this.events[0];

    return {
      connected: true,
      connectionStatus: 'STREAMING',
      eventsPerMinute: Math.min(18, Math.max(4, this.events.length * 2)),
      totalEventsReceived: this.events.length,
      totalEventsProcessed: this.events.length,
      activeSignalsCount: this.events.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length,
      affectedDistricts,
      affectedDistrictsCount: affectedDistricts.length,
      sources: this.sources,
      sourceHealthSummary: this.sources,
      latestInvestigationId: latestEvent?.investigationId || 'INV-NDB-CONV-001',
      latestEvent,
      lastEventTimestamp: latestEvent?.timestamp || new Date().toISOString(),
    };
  }

  /**
   * Alias for getTelemetrySummary.
   */
  getSummary(): LiveTelemetrySummary {
    return this.getTelemetrySummary();
  }

  /**
   * Resets to initial baseline state.
   */
  reset(): void {
    this.events = [...BASELINE_VERIFIED_EVENTS];
    this.mode = 'VERIFIED_SOURCE';
    this.sources = [...INITIAL_SOURCE_HEALTH];
  }
}

// Canonical Event Bus Alias
export { GovernanceEventBus as CanonicalEventBus };

// Global Singleton for in-app server state
export const EventBus = new GovernanceEventBus();
export const eventBus = EventBus;
