import { z } from "zod";
import { SourceBadgeMetaSchema } from "./source-badge.schema";

// ═══════════════════════════════════════════════════════════════════════════════
// KRATOS HUD Contract — ABA 6
// Contrato operacional puro. Zero UI. Zero implementação visual.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Shared enums ────────────────────────────────────────────────────────────────

export const HudHealthTierSchema = z.enum(["OK", "WARN", "BLOCKED", "FAILED", "UNKNOWN"]);
export type HudHealthTier = z.infer<typeof HudHealthTierSchema>;

export const HudPrioritySchema = z.enum(["P0_critical", "P1_degraded", "P2_warning", "P3_info"]);
export type HudPriority = z.infer<typeof HudPrioritySchema>;

export const HudMissionStatusSchema = z.enum([
  "idle",
  "observing",
  "planning",
  "executing",
  "degraded",
  "failed",
  "waiting_approval",
]);
export type HudMissionStatus = z.infer<typeof HudMissionStatusSchema>;

export const HudRiskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export type HudRiskLevel = z.infer<typeof HudRiskLevelSchema>;

// ── 1. MissionCard ──────────────────────────────────────────────────────────────

export const MissionCardSchema = z.object({
  mission_id: z.string(),
  title: z.string(),
  status: HudMissionStatusSchema,
  priority: HudPrioritySchema,
  progress: z.number().min(0).max(100),
  next_action: z.string(),
  risk_level: HudRiskLevelSchema,
  owner: z.string(),
  updated_at: z.string().datetime(),
  blockers_count: z.number().int().min(0),
});
export type MissionCard = z.infer<typeof MissionCardSchema>;

// ── 2. ApprovalCard ─────────────────────────────────────────────────────────────

export const DecisionOptionSchema = z.object({
  label: z.string(),
  action: z.string(),
  risk: HudRiskLevelSchema.optional(),
});

export const ApprovalCardSchema = z.object({
  approval_id: z.string(),
  mission_id: z.string(),
  action: z.string(),
  risk_level: HudRiskLevelSchema,
  preview: z.string(),
  gates: z.array(z.string()),
  decision_options: z.array(DecisionOptionSchema),
  rejection_reasons: z.array(z.string()),
});
export type ApprovalCard = z.infer<typeof ApprovalCardSchema>;

// ── 3. SummaryCard ──────────────────────────────────────────────────────────────

export const SummaryCardSchema = z.object({
  mission_id: z.string(),
  duration: z.string(),
  cost_estimate: z.string(),
  outputs: z.array(z.string()).max(5),
  artifacts: z.array(z.string()),
  next_recommended_action: z.string(),
  learnings: z.array(z.string()),
});
export type SummaryCard = z.infer<typeof SummaryCardSchema>;

// ── 4. HealthPanel ──────────────────────────────────────────────────────────────

export const HealthComponentSchema = z.object({
  status: HudHealthTierSchema,
  detail: z.string().optional(),
  last_checked: z.string().datetime().optional(),
});

export const HealthPanelSchema = z.object({
  mission_runtime: HealthComponentSchema,
  bus_health: HealthComponentSchema,
  memory_health: HealthComponentSchema,
  registry_health: HealthComponentSchema,
  governance_health: HealthComponentSchema,
  lego_health: HealthComponentSchema,
  agentic_core_health: HealthComponentSchema,
});
export type HealthPanel = z.infer<typeof HealthPanelSchema>;

// ── 5. NeedsYouNow ──────────────────────────────────────────────────────────────

export const NeedsYouNowItemSchema = z.object({
  id: z.string(),
  type: z.enum(["approval", "blocker", "critical_decision", "emergency_alert"]),
  title: z.string(),
  priority: HudPrioritySchema,
  mission_id: z.string().optional(),
  created_at: z.string().datetime(),
});

export const NeedsYouNowSchema = z.object({
  approvals: z.array(NeedsYouNowItemSchema),
  blockers: z.array(NeedsYouNowItemSchema),
  critical_decisions: z.array(NeedsYouNowItemSchema),
  emergency_alerts: z.array(NeedsYouNowItemSchema),
});
export type NeedsYouNow = z.infer<typeof NeedsYouNowSchema>;

// ── 6. EventTimeline ────────────────────────────────────────────────────────────

export const EventTimelineEntrySchema = z.object({
  event_type: z.string(),
  timestamp: z.string().datetime(),
  actor: z.string(),
  status: HudMissionStatusSchema,
  decision_chain: z.array(z.string()),
  artifact_link: z.string().optional(),
});
export type EventTimelineEntry = z.infer<typeof EventTimelineEntrySchema>;

export const EventTimelineSchema = z.object({
  entries: z.array(EventTimelineEntrySchema),
  oldest: z.string().datetime().optional(),
  newest: z.string().datetime().optional(),
  collapsed_by_default: z.boolean().default(true),
});
export type EventTimeline = z.infer<typeof EventTimelineSchema>;

// ── 7. BlockerPanel ─────────────────────────────────────────────────────────────

export const BlockerSeveritySchema = z.enum(["blocking", "warning", "info"]);

export const BlockerEntrySchema = z.object({
  blocker_id: z.string(),
  severity: BlockerSeveritySchema,
  source: z.string(),
  title: z.string(),
  description: z.string(),
  recommended_action: z.string(),
  created_at: z.string().datetime(),
});
export type BlockerEntry = z.infer<typeof BlockerEntrySchema>;

export const BlockerPanelSchema = z.object({
  blockers: z.array(BlockerEntrySchema),
  blocking_count: z.number().int().min(0),
  total_count: z.number().int().min(0),
});
export type BlockerPanel = z.infer<typeof BlockerPanelSchema>;

// ── 8. EmergencyStop ────────────────────────────────────────────────────────────

export const EmergencyStopSchema = z.object({
  enabled: z.boolean(),
  reason: z.string(),
  impact_summary: z.string(),
  requires_confirmation: z.boolean().default(true),
  affected_missions: z.array(z.string()),
});
export type EmergencyStop = z.infer<typeof EmergencyStopSchema>;

// ── 9. LatestDeliveries (referenced by Snapshot) ────────────────────────────────

export const LatestDeliverySchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  delivered_at: z.string().datetime(),
  source: z.string(),
});
export type LatestDelivery = z.infer<typeof LatestDeliverySchema>;

// ── 10. KratosHudSnapshot — composição geral ────────────────────────────────────

export const KratosHudSnapshotSchema = z.object({
  now: MissionCardSchema.nullable(),
  next: MissionCardSchema.nullable(),
  needs_you_now: NeedsYouNowSchema,
  blockers: BlockerPanelSchema,
  health: HealthPanelSchema,
  latest_deliveries: z.array(LatestDeliverySchema),
  event_timeline: EventTimelineSchema,
  emergency_stop: EmergencyStopSchema,
});
export type KratosHudSnapshot = z.infer<typeof KratosHudSnapshotSchema>;

// ── Envelope ────────────────────────────────────────────────────────────────────

export const KratosHudEnvelopeSchema = z.object({
  data: KratosHudSnapshotSchema.nullable(),
  error: z.string().nullable(),
  meta: SourceBadgeMetaSchema.optional(),
});
export type KratosHudEnvelope = z.infer<typeof KratosHudEnvelopeSchema>;
