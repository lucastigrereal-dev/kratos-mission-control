/**
 * OMNIS Write Bridge — Mocked Adapter
 * W19 — Local/Mock/Dry-Run ONLY
 *
 * Implementa a interface de envio de comandos KRATOS → OMNIS em modo local.
 * NUNCA chama o backend OMNIS real.
 * NUNCA armazena secrets.
 * SEMPRE requer Human Approval Gate para qualquer execução.
 *
 * Boundary: KRATOS vê. Aurora interpreta. OMNIS age. Lucas decide.
 */

import type {
  MissionCommand,
  ExecutionRequest,
  ExecutionResponse,
  HumanApprovalGate,
  WriteBridgeConfig,
  ExecutionMode,
} from "../../api-contract/omnis-write-bridge.schema";
import {
  MissionCommandSchema,
  ExecutionRequestSchema,
  QUICK_COMMANDS,
} from "../../api-contract/omnis-write-bridge.schema";

// ── Config ────────────────────────────────────────────────────────────────────

/** Configuração local — live sempre desabilitado */
export const WRITE_BRIDGE_CONFIG: WriteBridgeConfig = {
  live_enabled: false,
  dry_run_available: true,
  human_gate_required: true,
  omnis_base_url_configured: false, // nunca configurado em modo local
  mode: "dry_run",
};

// ── ID Generator (sem Date.now() para determinismo em testes) ─────────────────

let _seqCounter = 0;
export function generateRequestId(prefix = "req"): string {
  _seqCounter += 1;
  return `${prefix}_w19_${String(_seqCounter).padStart(4, "0")}`;
}

export function generateGateId(): string {
  _seqCounter += 1;
  return `gate_w19_${String(_seqCounter).padStart(4, "0")}`;
}

// Para testes: reset do contador
export function _resetIdCounter(): void {
  _seqCounter = 0;
}

// ── Risk Assessment ───────────────────────────────────────────────────────────

export function assessRisk(command: MissionCommand): {
  level: HumanApprovalGate["risk_level"];
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  // Palavras de alto risco
  const highRisk = ["deletar", "remover", "apagar", "resetar", "migrar", "produção", "deploy", "secret"];
  const mediumRisk = ["escrever", "criar", "gerar", "publicar", "enviar", "postar"];

  const lowerCommand = command.command.toLowerCase();

  for (const word of highRisk) {
    if (lowerCommand.includes(word)) {
      score += 3;
      reasons.push(`Palavra de alto risco detectada: "${word}"`);
    }
  }
  for (const word of mediumRisk) {
    if (lowerCommand.includes(word)) {
      score += 1;
      reasons.push(`Ação de escrita detectada: "${word}"`);
    }
  }

  // Skill de escrita de memória é sempre high
  if (command.target_skill === "jarvis-memory-write") {
    score += 3;
    reasons.push("Skill de escrita em memória — verificação extra necessária");
  }

  if (score === 0) reasons.push("Comando de leitura/consulta — risco baixo");

  const level =
    score >= 6 ? "critical"
    : score >= 3 ? "high"
    : score >= 1 ? "medium"
    : "low";

  return { level, reasons };
}

// ── Checklist por Risco ───────────────────────────────────────────────────────

export function buildChecklist(
  riskLevel: HumanApprovalGate["risk_level"],
): HumanApprovalGate["checklist"] {
  const base = [
    { id: "read_command", label: "Li o comando e entendi o que ele faz", required: true },
    { id: "confirm_scope", label: "O escopo está correto (não é mais amplo que necessário)", required: true },
  ];

  if (riskLevel === "high" || riskLevel === "critical") {
    base.push(
      { id: "no_prod", label: "Esta ação NÃO afeta produção ou dados reais", required: true },
      { id: "reversible", label: "A ação é reversível se necessário", required: true },
    );
  }

  if (riskLevel === "critical") {
    base.push(
      { id: "last_resort", label: "Não há forma menos arriscada de fazer isso agora", required: true },
    );
  }

  return base;
}

// ── Mock Response Generator ───────────────────────────────────────────────────

export function generateMockResponse(command: MissionCommand): ExecutionResponse["mock_response"] {
  const quickCmd = QUICK_COMMANDS.find((q) => q.skill === command.target_skill);
  const baseMs = quickCmd ? (quickCmd.risk === "high" ? 8000 : quickCmd.risk === "medium" ? 4000 : 1500) : 3000;

  return {
    estimated_duration_ms: baseMs + Math.floor(baseMs * 0.2),
    estimated_tokens: Math.floor(baseMs / 10),
    affected_skills: command.target_skill ? [command.target_skill] : [],
    warnings: [
      "MODO DRY-RUN: nenhuma ação real foi executada",
      "Conecte o OMNIS backend para execução real (requer Human Gate)",
    ],
    note: `Comando "${command.command.slice(0, 60)}${command.command.length > 60 ? "…" : ""}" processado em modo mock`,
  };
}

// ── Build Payload Preview ─────────────────────────────────────────────────────

export function buildPayloadPreview(request: ExecutionRequest): Record<string, unknown> {
  return {
    kratos_request_id: request.request_id,
    command: request.command.command,
    target_skill: request.command.target_skill ?? null,
    context: request.command.context ?? {},
    initiated_by: request.initiated_by,
    mode: "dry_run",
    omnis_endpoint: "POST /api/execute  [NÃO CHAMADO EM MODO LOCAL]",
    timestamp: request.command.requested_at ?? new Date(0).toISOString(),
    _note: "Este payload seria enviado ao OMNIS se live estivesse habilitado",
  };
}

// ── Main Adapter ──────────────────────────────────────────────────────────────

export interface WriteBridgeResult {
  ok: boolean;
  response: ExecutionResponse;
  gate?: HumanApprovalGate;
  error?: string;
}

/**
 * preview() — Valida comando e retorna preview do payload sem executar nada.
 * Sempre disponível, sem human gate.
 */
export function previewCommand(raw: MissionCommand): WriteBridgeResult {
  const parsed = MissionCommandSchema.safeParse(raw);
  if (!parsed.success) {
    const requestId = generateRequestId("err");
    return {
      ok: false,
      response: {
        request_id: requestId,
        status: "error",
        mode: "dry_run",
        error_message: parsed.error.issues[0]?.message ?? "Comando inválido",
        source: "dry_run",
        processed_at: new Date(0).toISOString(),
      },
      error: parsed.error.issues[0]?.message ?? "Comando inválido",
    };
  }

  const command = parsed.data;
  const requestId = generateRequestId();
  const request: ExecutionRequest = {
    request_id: requestId,
    command,
    initiated_by: "lucas",
  };

  const parsed2 = ExecutionRequestSchema.safeParse(request);
  if (!parsed2.success) {
    return {
      ok: false,
      response: {
        request_id: requestId,
        status: "error",
        mode: "dry_run",
        error_message: "Request inválida",
        source: "dry_run",
        processed_at: new Date(0).toISOString(),
      },
    };
  }

  const payloadPreview = buildPayloadPreview(parsed2.data);
  const { level, reasons } = assessRisk(command);
  const checklist = buildChecklist(level);
  const gateId = generateGateId();

  const gate: HumanApprovalGate = {
    gate_id: gateId,
    request_id: requestId,
    command_summary: command.command.slice(0, 120),
    risk_level: level,
    risk_reasons: reasons,
    requires_confirmation: true,
    checklist,
    status: "pending",
  };

  return {
    ok: true,
    response: {
      request_id: requestId,
      status: "pending_approval",
      mode: "dry_run",
      payload_preview: payloadPreview,
      source: "dry_run",
      processed_at: new Date(0).toISOString(),
    },
    gate,
  };
}

/**
 * sendDryRun() — Simula execução após aprovação humana.
 * Nunca chama o OMNIS real. Retorna mock response.
 */
export function sendDryRun(
  command: MissionCommand,
  gate: HumanApprovalGate,
): WriteBridgeResult {
  if (gate.status !== "approved") {
    const requestId = generateRequestId("rej");
    return {
      ok: false,
      response: {
        request_id: requestId,
        status: "rejected",
        mode: "dry_run",
        error_message: "Gate não aprovado — execução bloqueada",
        source: "dry_run",
        processed_at: new Date(0).toISOString(),
      },
      error: "Gate não aprovado",
    };
  }

  const requestId = generateRequestId("dry");
  const request: ExecutionRequest = {
    request_id: requestId,
    command,
    initiated_by: "lucas",
    approval_token: gate.gate_id,
  };

  const mockResponse = generateMockResponse(command);
  const payloadPreview = buildPayloadPreview(request);

  return {
    ok: true,
    response: {
      request_id: requestId,
      status: "dry_run_complete",
      mode: "dry_run",
      payload_preview: payloadPreview,
      mock_response: mockResponse,
      source: "dry_run",
      processed_at: new Date(0).toISOString(),
    },
    gate: { ...gate, status: "approved" },
  };
}

/**
 * getConfig() — Retorna config atual do bridge.
 * Sempre retorna live_enabled: false em modo local.
 */
export function getWriteBridgeConfig(): WriteBridgeConfig {
  return { ...WRITE_BRIDGE_CONFIG };
}

/** Determina o modo efetivo de execução */
export function resolveExecutionMode(): ExecutionMode {
  // Em modo local, sempre dry_run
  return "dry_run";
}
