/**
 * SUTRA Data Fabric v1
 * Canonical Dataset Registry, Deterministic Normalization, LGD Entity Resolution, and Provenance Architecture.
 */

// Registry exports
export * from './registry/lgd-registry';
export * from './registry/scheme-registry';
export * from './registry/ministry-registry';
export * from './registry/dataset-registry';
export * from './registry/canonical-entities';

// Normalization exports
export * from './normalization/normalizer';
export * from './normalization/district-normalizer';
export * from './normalization/scheme-normalizer';
export * from './normalization/ministry-normalizer';

// Pipeline & Provenance exports
export * from './pipeline/provenance';
export * from './pipeline/ingestion-pipeline';
