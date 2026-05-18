import { z } from "zod";

/**
 * Source badge metadata — used by all snapshot endpoints.
 * Tells the UI where data came from and whether it's stale.
 */
export const DataSourceSchema = z.enum([
  "live",
  "mock",
  "cache",
  "stale",
  "partial",
  "error",
  "computed",
]);
export type DataSource = z.infer<typeof DataSourceSchema>;

export const DataOriginSchema = z.enum(["akasha", "omnis", "github", "local", "mock"]);
export type DataOrigin = z.infer<typeof DataOriginSchema>;

export const SourceBadgeMetaSchema = z.object({
  source: DataSourceSchema,
  origin: DataOriginSchema.optional(),
  source_kind: z.string().optional(),
  stale: z.boolean(),
  updated_at: z.string().datetime(),
  confidence: z.number().int().min(0).max(100).optional(),
  error_code: z.string().optional(),
  generated_by: z.string().optional(),
  errors: z.array(z.string()).default([]),
});
export type SourceBadgeMeta = z.infer<typeof SourceBadgeMetaSchema>;

/**
 * Standard API response envelope with source metadata.
 */
export function createSnapshotEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema.nullable(),
    error: z.string().nullable(),
    meta: SourceBadgeMetaSchema.optional(),
  });
}
