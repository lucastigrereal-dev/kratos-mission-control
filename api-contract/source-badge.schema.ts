import { z } from "zod";

/**
 * Source badge metadata — used by all snapshot endpoints.
 * Tells the UI where data came from and whether it's stale.
 */
export const DataSourceSchema = z.enum(["live", "mock", "cache", "stale", "partial"]);
export type DataSource = z.infer<typeof DataSourceSchema>;

export const DataOriginSchema = z.enum(["akasha", "omnis", "github", "local", "mock"]);
export type DataOrigin = z.infer<typeof DataOriginSchema>;

export const SourceBadgeMetaSchema = z.object({
  source: DataSourceSchema,
  origin: DataOriginSchema.optional(),
  stale: z.boolean(),
  updated_at: z.string().datetime(),
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
