/**
 * KRATOS Akasha Memory API Contract — W13
 *
 * Akasha = memória vetorial (pgvector, 20K docs, 606K chunks)
 * Backend: Python FastAPI em localhost:5100
 * Endpoints: POST /akasha/search, GET /akasha/status
 */

import { z } from "zod";

// ── Search ────────────────────────────────────────────────────────────────────

export const AkashaSearchRequestSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(20).default(5),
  collection: z.string().optional(), // filter by memory collection
});

export type AkashaSearchRequest = z.infer<typeof AkashaSearchRequestSchema>;

export const AkashaSearchResultSchema = z.object({
  id: z.string(),
  content: z.string(),
  score: z.number().min(0).max(1),
  source: z.string().optional(),
  collection: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AkashaSearchResult = z.infer<typeof AkashaSearchResultSchema>;

export const AkashaSearchResponseSchema = z.object({
  results: z.array(AkashaSearchResultSchema),
  query: z.string(),
  total: z.number().int().min(0),
  latency_ms: z.number().optional(),
});

export type AkashaSearchResponse = z.infer<typeof AkashaSearchResponseSchema>;

// ── Collections ───────────────────────────────────────────────────────────────

export const AkashaCollectionSchema = z.object({
  name: z.string(),
  count: z.number().int().min(0),
  description: z.string().optional(),
});

export type AkashaCollection = z.infer<typeof AkashaCollectionSchema>;

export const AkashaCollectionsResponseSchema = z.object({
  collections: z.array(AkashaCollectionSchema),
  total_chunks: z.number().int().optional(),
  total_docs: z.number().int().optional(),
});

export type AkashaCollectionsResponse = z.infer<typeof AkashaCollectionsResponseSchema>;
