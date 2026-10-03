/**
 * SUTRA Data Fabric v1.5
 * Canonical Dataset Registry, Connectors, Deterministic Joins, and Evidence-backed Investigation Engine.
 */

// Registry exports
export * from './registry/lgd-registry';
export * from './registry/scheme-registry';
export * from './registry/ministry-registry';
export * from './registry/dataset-registry';
export * from './registry/canonical-entities';

// Connectors exports
export * from './connectors';

// Normalization exports
export * from './normalization/normalizer';
export * from './normalization/district-normalizer';
export * from './normalization/scheme-normalizer';
export * from './normalization/ministry-normalizer';

// Join exports
export * from './join/cross-dataset-join';

// Pipeline & Provenance exports
export * from './pipeline/provenance';
export * from './pipeline/ingestion-pipeline';

// Investigation Engine exports
export * from './investigation';

// Live Events exports
export * from './events/change-detector';
export * from './events/event-bus';
export * from './events/event-scenarios';

// Watchers & Snapshot Store exports
export * from './watchers';

// Anomaly Engine & Event Mesh exports
export * from './anomaly/anomaly-engine';
export * from './mesh/event-mesh';

