import { z } from "zod";

export const FocusStatusSchema = z.enum(["on_focus", "off_focus", "unknown"]);
export const DriftLevelSchema = z.enum(["none", "light", "high"]);
export const BrowserTabStatusSchema = z.enum(["active", "idle", "closed"]);

export const BrowserTabSchema = z.object({
  title: z.string(),
  domain: z.string(),
  project: z.string().optional(),
  status: BrowserTabStatusSchema,
});

export const ContextSnapshotSchema = z.object({
  id: z.string().uuid(),
  capturedAt: z.string().datetime(),
  project: z.string(),
  mission: z.string(),
  app: z.string(),
  window: z.string(),
  focusStatus: FocusStatusSchema,
  confidence: z.number().int().min(0).max(100),
  drift: DriftLevelSchema,
  driftMinutes: z.number().int().min(0).optional(),
  activeWindowApp: z.string(),
  activeWindowTitle: z.string(),
  activeWindowDomain: z.string().optional(),
  activeWindowDuration: z.string(),
  reasons: z.array(z.string()),
  browserTabs: z.array(BrowserTabSchema),
});

export type FocusStatus = z.infer<typeof FocusStatusSchema>;
export type DriftLevel = z.infer<typeof DriftLevelSchema>;
export type BrowserTab = z.infer<typeof BrowserTabSchema>;
export type ContextSnapshot = z.infer<typeof ContextSnapshotSchema>;
