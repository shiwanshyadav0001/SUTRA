import { FreshnessStatus } from './types';

export class FreshnessManager {
  /**
   * Computes the human-readable freshness label (e.g. "12m ago", "2h ago", "1d ago").
   */
  static computeFreshnessLabel(timestamp: string): string {
    const fetchTime = new Date(timestamp).getTime();
    if (isNaN(fetchTime)) return 'unknown';

    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - fetchTime) / 1000));

    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  /**
   * Computes next expected refresh ISO string based on reporting frequency.
   */
  static computeNextExpectedRefresh(
    lastFetchTimestamp: string,
    frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'DAILY'
  ): string {
    const baseDate = new Date(lastFetchTimestamp);
    if (isNaN(baseDate.getTime())) return new Date().toISOString();

    const next = new Date(baseDate);
    switch (frequency) {
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'QUARTERLY':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'ANNUAL':
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        next.setMonth(next.getMonth() + 1);
    }
    return next.toISOString();
  }

  /**
   * Determines freshness status based on reporting frequency and last successful fetch.
   */
  static evaluateFreshnessStatus(params: {
    lastSuccessfulFetch: string;
    reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'DAILY';
    errorCount: number;
    isSimulated?: boolean;
  }): FreshnessStatus {
    if (params.isSimulated) return 'SIMULATION';
    if (params.errorCount >= 3) return 'ERROR';
    if (params.errorCount > 0) return 'DEGRADED';

    const lastTime = new Date(params.lastSuccessfulFetch).getTime();
    if (isNaN(lastTime)) return 'STALE';

    const now = Date.now();
    const diffDays = (now - lastTime) / (1000 * 60 * 60 * 24);

    let maxAcceptableDays = 35; // Default monthly tolerance
    if (params.reportingFrequency === 'DAILY') maxAcceptableDays = 2;
    if (params.reportingFrequency === 'QUARTERLY') maxAcceptableDays = 100;
    if (params.reportingFrequency === 'ANNUAL') maxAcceptableDays = 380;

    if (diffDays > maxAcceptableDays * 1.5) return 'STALE';
    if (diffDays > maxAcceptableDays) return 'DEGRADED';

    return 'HEALTHY';
  }
}
