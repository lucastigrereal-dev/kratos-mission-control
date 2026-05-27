import { z } from "zod";

export const CaptionDraftSchema = z.object({
  draft_id: z.string(),
  queue_id: z.string().optional(),
  account_handle: z.string(),
  caption_text: z.string(),
  hashtags: z.array(z.string()).default([]),
  cta: z.string().optional(),
  status: z.enum(["draft", "needs_review", "approved", "rejected"]),
  version: z.number().int().min(1).default(1),
  objective: z.string().optional(),
  format: z.string().optional(),
  notes: z.string().optional(),
  rejection_reason: z.string().nullable().optional(),
  asset_id: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export const ContentDraftsEnvelopeSchema = z.object({
  data: z.array(CaptionDraftSchema),
  total_filtered: z.number().int().min(0),
  por_status: z.record(z.number().int().min(0)),
  source: z.enum(["live", "empty"]),
  drafts_path: z.string().optional(),
});

export type CaptionDraft = z.infer<typeof CaptionDraftSchema>;
export type ContentDraftsEnvelope = z.infer<typeof ContentDraftsEnvelopeSchema>;
