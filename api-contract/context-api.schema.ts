/**
 * context-api.schema.ts — W3
 * Layer 2: schema para a resposta bruta de GET /context/current (Python backend).
 * O Python retorna dados do ActivityWatch + análise de drift.
 *
 * Layer 1 (TypeScript context store / ContextSnapshot) não é alterada.
 */

import { z } from "zod";

// ── Drift (sub-object do context/current) ─────────────────────────────────────

export const ContextDriftStateSchema = z.enum([
  "on_focus",
  "off_focus",
  "drifting",
  "unknown",
]);

export const ContextDriftSeveritySchema = z.enum(["none", "low", "medium", "high"]);

export const ContextDriftAPISchema = z
  .object({
    state:                     ContextDriftStateSchema.optional(),
    severity:                  ContextDriftSeveritySchema.optional(),
    minutes_out_of_focus:      z.number().optional(),
    reason:                    z.string().optional(),
    current_app:               z.string().optional(),
    current_title:             z.string().optional(),
    inferred_project:          z.string().nullable().optional(),
    expected_project:          z.string().optional(),
    should_suggest_checkpoint: z.boolean().optional(),
    recovery_action: z
      .object({
        title:     z.string().optional(),
        cta_label: z.string().optional(),
      })
      .optional(),
  })
  .catchall(z.unknown());

// ── Python /context/current envelope ─────────────────────────────────────────

export const ContextCurrentAPISchema = z.object({
  current_app:            z.string().default("—"),
  current_title:          z.string().default("—"),
  current_url:            z.string().default(""),
  current_domain:         z.string().default(""),
  project_guess:          z.string().nullable().default(null),
  mission_guess:          z.string().nullable().default(null),
  reason_guess:           z.string().default(""),
  confidence:             z.number().default(0),
  focus_project_today:    z.string().default(""),
  on_focus:               z.boolean().default(false),
  focus_drift_minutes:    z.number().default(0),
  drift_minutes:          z.number().default(0),
  active_since:           z.string().default(""),
  context_switches_today: z.number().default(0),
  source:                 z.string().default("fallback"),
  collector_status:       z.string().default("unknown"),
  drift:                  ContextDriftAPISchema.optional(),
}).catchall(z.unknown());

export type ContextCurrentAPI = z.infer<typeof ContextCurrentAPISchema>;
export type ContextDriftAPI   = z.infer<typeof ContextDriftAPISchema>;
