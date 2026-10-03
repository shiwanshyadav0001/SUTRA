import {
  GovernanceEvent,
  GovernanceEventType,
  EventSeverity,
  DirectionType,
  EventProcessingMode,
} from '@/lib/types/events';
import { computeDeterministicSha256 } from '../pipeline/provenance';
import { DistrictNormalizer } from '../normalization/district-normalizer';

export interface DetectMetricChangeParams {
  id?: string;
  previousValue: number;
  currentValue: number;
  metricKey: string;
  metricLabel: string;
  unit: string;
  districtId?: string;
  districtName: string;
  lgdCode?: string | number;
  state?: string;
  schemeId: string;
  schemeName?: string;
  ministry?: string;
  datasetId: string;
  datasetName?: string;
  source?: string;
  evidenceIds?: string[];
  findingId?: string;
  investigationId?: string;
  mode?: EventProcessingMode;
  customTimestamp?: string;
}

export interface CreateGovernanceEventParams {
  id?: string;
  datasetId: string;
  source: string;
  districtId: string;
  schemeId: string;
  eventType: GovernanceEventType;
  previousValue: number;
  currentValue: number;
  unit?: string;
  mode?: EventProcessingMode;
  evidenceIds?: string[];
  findingId?: string;
  customTimestamp?: string;
}

export class ChangeDetector {
  /**
   * Deterministically calculates arithmetic difference between previous and current values.
   */
  static calculateDelta(previousValue: number, currentValue: number): number {
    if (isNaN(previousValue) || isNaN(currentValue)) return 0;
    return Number((currentValue - previousValue).toFixed(2));
  }

  /**
   * Deterministically calculates percentage change. Handles zero-baseline safely.
   */
  static calculateDeltaPercent(previousValue: number, currentValue: number): number {
    if (isNaN(previousValue) || isNaN(currentValue)) return 0;
    if (previousValue === 0) {
      return currentValue === 0 ? 0 : 100.0;
    }
    const pct = ((currentValue - previousValue) / previousValue) * 100;
    return Number(pct.toFixed(2));
  }

  /**
   * Classifies deviation severity based on statutory percentage thresholds.
   */
  static classifySeverity(deltaPercent: number, delta = 0): EventSeverity {
    const absPct = Math.abs(deltaPercent);
    const absDelta = Math.abs(delta);

    if (absPct >= 30 || absDelta >= 30) return 'CRITICAL';
    if (absPct >= 15 || absDelta >= 15) return 'HIGH';
    if (absPct >= 5 || absDelta >= 2) return 'MEDIUM';
    if (absPct > 0 || absDelta > 0) return 'LOW';
    return 'INFO';
  }

  /**
   * Deterministically evaluates whether a metric crossed a prescribed threshold.
   */
  static evaluateThreshold(params: {
    metricName: string;
    currentValue: number;
    thresholdValue: number;
    direction: 'ABOVE' | 'BELOW';
  }): boolean {
    if (params.direction === 'ABOVE') {
      return params.currentValue > params.thresholdValue;
    }
    return params.currentValue < params.thresholdValue;
  }

  /**
   * Deterministically creates a canonical governance event from basic telemetry.
   */
  static createGovernanceEvent(params: CreateGovernanceEventParams): GovernanceEvent {
    // Resolve LGD deterministically
    const resolvedLgd = DistrictNormalizer.resolve(params.districtId);
    const lgdCodeStr = resolvedLgd && resolvedLgd.lgdCode ? resolvedLgd.lgdCode : '0';
    const districtName = resolvedLgd && resolvedLgd.canonicalName ? resolvedLgd.canonicalName : params.districtId;

    return this.detectMetricChange({
      id: params.id,
      previousValue: params.previousValue,
      currentValue: params.currentValue,
      metricKey: params.eventType.toLowerCase(),
      metricLabel: params.eventType.replace(/_/g, ' '),
      unit: params.unit || 'Cr',
      districtId: params.districtId,
      districtName,
      lgdCode: lgdCodeStr,
      schemeId: params.schemeId,
      datasetId: params.datasetId,
      source: params.source,
      evidenceIds: params.evidenceIds,
      findingId: params.findingId,
      mode: params.mode || 'VERIFIED_SOURCE',
      customTimestamp: params.customTimestamp,
    });
  }

  /**
   * Deterministically calculates change metrics, thresholds, and severity for a metric transition.
   */
  static detectMetricChange(params: DetectMetricChangeParams): GovernanceEvent {
    const {
      previousValue,
      currentValue,
      metricKey,
      metricLabel,
      unit,
      districtName,
      state = 'Maharashtra',
      schemeId,
      datasetId,
      evidenceIds = [],
      findingId,
      investigationId,
      mode = 'VERIFIED_SOURCE',
      customTimestamp,
    } = params;

    // Resolve LGD if not provided
    let lgdCode = params.lgdCode !== undefined ? String(params.lgdCode) : '';
    if (!lgdCode || lgdCode === '0') {
      const resolved = DistrictNormalizer.resolve(districtName);
      if (resolved && resolved.lgdCode) {
        lgdCode = String(resolved.lgdCode);
      } else {
        lgdCode = '0';
      }
    }

    const timestamp = customTimestamp || new Date().toISOString();
    const id = params.id || `EVT-${lgdCode}-${schemeId}-${Date.now().toString(36).toUpperCase()}`;

    // Deterministic arithmetic calculation
    const delta = this.calculateDelta(previousValue, currentValue);
    const deltaPercent = this.calculateDeltaPercent(previousValue, currentValue);

    let direction: DirectionType = 'NEUTRAL';
    if (delta > 0) direction = 'INCREASE';
    if (delta < 0) direction = 'DECREASE';

    // Map Event Type
    let eventType: GovernanceEventType = 'FUND_DRAW_DOWN_CHANGED';
    const lowerKey = metricKey.toLowerCase();
    if (lowerKey.includes('drawdown') || lowerKey.includes('util') || lowerKey.includes('fund') || lowerKey.includes('alloc')) {
      eventType = 'FUND_DRAW_DOWN_CHANGED';
    } else if (lowerKey.includes('fhtc') || lowerKey.includes('tap') || lowerKey.includes('coverage')) {
      eventType = 'COVERAGE_CHANGED';
    } else if (lowerKey.includes('house') || lowerKey.includes('pucca') || lowerKey.includes('completion') || lowerKey.includes('physical')) {
      eventType = 'PHYSICAL_PROGRESS_CHANGED';
    } else if (lowerKey.includes('cluster') || lowerKey.includes('farmer') || lowerKey.includes('organic')) {
      eventType = 'PHYSICAL_PROGRESS_CHANGED';
    }

    // Determine Threshold & Severity
    const severity = this.classifySeverity(deltaPercent, delta);
    const thresholdExceeded = severity === 'HIGH' || severity === 'CRITICAL';

    // Scheme & Ministry details resolution
    let schemeName = params.schemeName || schemeId;
    let ministry = params.ministry || 'Government of India';
    let datasetName = params.datasetName || datasetId;
    let source = params.source || 'Official Ministerial MIS Portal';

    if (schemeId === 'JJM') {
      schemeName = 'Jal Jeevan Mission';
      ministry = 'Ministry of Jal Shakti';
      datasetName = 'JJM IMIS Telemetry Register';
      source = 'Department of Drinking Water & Sanitation';
    } else if (schemeId === 'PMAY-G') {
      schemeName = 'Pradhan Mantri Awaas Yojana (Gramin)';
      ministry = 'Ministry of Rural Development';
      datasetName = 'PMAY-G AwaasSoft Register';
      source = 'Ministry of Rural Development';
    } else if (schemeId === 'PKVY') {
      schemeName = 'Paramparagat Krishi Vikas Yojana';
      ministry = 'Ministry of Agriculture & Farmers Welfare';
      datasetName = 'PKVY Organic Soil Health Register';
      source = 'Department of Agriculture & Farmers Welfare';
    }

    const sign = delta > 0 ? '+' : '';
    const explanation = `In ${districtName} (LGD: ${lgdCode}), ${schemeName} ${metricLabel} shifted from ${previousValue} ${unit} to ${currentValue} ${unit} (${sign}${delta} ${unit}, ${sign}${deltaPercent}%).`;

    const provenanceHash = computeDeterministicSha256({
      id,
      timestamp,
      lgdCode,
      schemeId,
      metricKey,
      previousValue,
      currentValue,
      delta,
      deltaPercent,
      severity,
      mode,
    });

    return {
      id,
      timestamp,
      source,
      datasetId,
      datasetName,
      districtId: params.districtId || `dist_${lgdCode}`,
      districtName,
      lgdCode,
      state,
      schemeId,
      schemeName,
      ministry,
      eventType,
      metricKey,
      metricLabel,
      unit,
      previousValue,
      currentValue,
      delta,
      deltaPercent,
      direction,
      thresholdExceeded,
      severity,
      status: 'ACTIVE',
      mode,
      evidenceIds,
      findingId: findingId || (severity === 'CRITICAL' || severity === 'HIGH' ? 'SUTRA-FND-0001' : undefined),
      findingType: severity === 'HIGH' ? 'FINANCIAL_DRAWDOWN_DIVERGENCE' : undefined,
      investigationId: investigationId || 'INV-NDB-CONV-001',
      explanation,
      generatedAt: timestamp,
      processingPipelineStep: 'INVESTIGATED',
      provenanceHash,
    };
  }
}
