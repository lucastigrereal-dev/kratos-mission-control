/**
 * KRATOS → OMNIS Write Bridge Contract
 * W19 — Local/Mock/Dry-Run only
 *
 * Este contrato define a interface de ENVIO de comandos do KRATOS ao OMNIS.
 * IMPORTANTE: Em modo local, NENHUMA chamada real ao OMNIS é executada.
 * Toda execução real requer Human Approval Gate explícito (HumanApprovalGateSchema).
 *
 * Boundary imutável:
 *   KRATOS vê. Aurora interpreta. OMNIS/HOMINIS age. Lucas decide.
 */

import { z } from "zod";

// ── Execution Mode ────────────────────────────────────────────────────────────

export const ExecutionModeSchema = z.enum([
  "dry_run",           // Simula sem executar — SEMPRE disponível
  "human_gate",        // Aguarda aprovação humana antes de executar
  "mock",              // Resposta mock, nunca chega ao OMNIS real
  "live_unavailable",  // OMNIS não está acessível
]);
export type ExecutionMode = z.infer<typeof ExecutionModeSchema>;

// ── Mission Command ───────────────────────────────────────────────────────────

export const MissionCommandSchema = z.object({
  /** Texto livre do comando de missão */
  command: z.string().min(3).max(500),
  /** Skill/crew alvo opcional */
  target_skill: z.string().optional(),
  /** Contexto adicional para o OMNIS */
  context: z.record(z.unknown()).optional(),
  /** Modo de execução solicitado */
  requested_mode: ExecutionModeSchema.default("dry_run"),
  /** Timestamp do lado cliente */
  requested_at: z.string().datetime().optional(),
});
export type MissionCommand = z.infer<typeof MissionCommandSchema>;

// ── Execution Request ─────────────────────────────────────────────────────────

export const ExecutionRequestSchema = z.object({
  /** ID único gerado pelo KRATOS (uuid-like) */
  request_id: z.string(),
  command: MissionCommandSchema,
  /** Qual operador iniciou (sempre "lucas" em modo local) */
  initiated_by: z.string().default("lucas"),
  /** Token de aprovação humana (gerado pelo HumanApprovalGate) */
  approval_token: z.string().optional(),
});
export type ExecutionRequest = z.infer<typeof ExecutionRequestSchema>;

// ── Execution Status ──────────────────────────────────────────────────────────

export const ExecutionStatusSchema = z.enum([
  "pending_approval",  // Aguardando Lucas aprovar
  "approved",          // Aprovado, aguardando envio
  "dry_run_complete",  // Dry-run concluído (mock)
  "sent",              // Enviado ao OMNIS (apenas quando live disponível)
  "rejected",          // Rejeitado pelo gate de aprovação
  "error",             // Erro no processamento
  "live_unavailable",  // OMNIS não acessível
]);
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;

// ── Execution Response ────────────────────────────────────────────────────────

export const ExecutionResponseSchema = z.object({
  request_id: z.string(),
  status: ExecutionStatusSchema,
  mode: ExecutionModeSchema,
  /** Payload exato que seria enviado ao OMNIS */
  payload_preview: z.record(z.unknown()).optional(),
  /** Resposta mock do OMNIS (dry_run / mock modes) */
  mock_response: z.object({
    estimated_duration_ms: z.number().optional(),
    estimated_tokens: z.number().optional(),
    affected_skills: z.array(z.string()).default([]),
    warnings: z.array(z.string()).default([]),
    note: z.string().optional(),
  }).optional(),
  /** Mensagem de erro se status = error */
  error_message: z.string().optional(),
  /** Source para SourceBadge */
  source: z.enum(["dry_run", "mock", "live_unavailable", "human_gate"]),
  processed_at: z.string().datetime(),
});
export type ExecutionResponse = z.infer<typeof ExecutionResponseSchema>;

// ── Human Approval Gate ───────────────────────────────────────────────────────

export const HumanApprovalGateSchema = z.object({
  gate_id: z.string(),
  request_id: z.string(),
  command_summary: z.string(),
  risk_level: z.enum(["low", "medium", "high", "critical"]),
  risk_reasons: z.array(z.string()).default([]),
  requires_confirmation: z.boolean().default(true),
  /** Checklist de confirmação que Lucas deve marcar */
  checklist: z.array(z.object({
    id: z.string(),
    label: z.string(),
    required: z.boolean().default(true),
  })).default([]),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  decided_at: z.string().datetime().optional(),
  decided_by: z.string().optional(),
});
export type HumanApprovalGate = z.infer<typeof HumanApprovalGateSchema>;

// ── Write Bridge Config ───────────────────────────────────────────────────────

export const WriteBridgeConfigSchema = z.object({
  /** Sempre false em modo local */
  live_enabled: z.literal(false),
  /** Sempre true em W19 */
  dry_run_available: z.literal(true),
  /** Sempre true — gate nunca pode ser desligado */
  human_gate_required: z.literal(true),
  omnis_base_url_configured: z.boolean(),
  mode: ExecutionModeSchema,
});
export type WriteBridgeConfig = z.infer<typeof WriteBridgeConfigSchema>;

// ── Constants ─────────────────────────────────────────────────────────────────

/** Skills pré-definidas disponíveis para envio dry-run */
export const QUICK_COMMANDS = [
  { id: "jarvis-morning", label: "Briefing Matinal", skill: "jarvis-morning", risk: "low" as const },
  { id: "jarvis-router", label: "Classificar Intenção", skill: "jarvis-router", risk: "low" as const },
  { id: "content-create", label: "Criar Conteúdo", skill: "content-creator", risk: "medium" as const },
  { id: "lead-qualify", label: "Qualificar Lead", skill: "lead-qualifier", risk: "medium" as const },
  { id: "memory-write", label: "Escrever Memória", skill: "jarvis-memory-write", risk: "high" as const },
] as const;

export type QuickCommandId = (typeof QUICK_COMMANDS)[number]["id"];
