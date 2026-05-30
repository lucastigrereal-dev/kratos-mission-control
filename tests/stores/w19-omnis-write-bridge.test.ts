/**
 * W19 — OMNIS Write Bridge Tests
 * Testa: schema, adapter, risk assessment, gate, dry-run
 * Sem chamadas externas. Sem mocks de módulo. Lógica pura.
 */

import { describe, it, expect, beforeEach } from "bun:test";
import {
  MissionCommandSchema,
  ExecutionRequestSchema,
  HumanApprovalGateSchema,
  ExecutionResponseSchema,
  WriteBridgeConfigSchema,
  QUICK_COMMANDS,
} from "../../api-contract/omnis-write-bridge.schema";
import {
  WRITE_BRIDGE_CONFIG,
  assessRisk,
  buildChecklist,
  generateMockResponse,
  buildPayloadPreview,
  previewCommand,
  sendDryRun,
  getWriteBridgeConfig,
  resolveExecutionMode,
  _resetIdCounter,
} from "../../src/lib/omnis-write-bridge";

beforeEach(() => {
  _resetIdCounter();
});

// ── Schema Tests ──────────────────────────────────────────────────────────────

describe("MissionCommandSchema", () => {
  it("aceita comando válido mínimo", () => {
    const r = MissionCommandSchema.safeParse({ command: "abc", requested_mode: "dry_run" });
    expect(r.success).toBe(true);
  });

  it("rejeita comando muito curto (< 3 chars)", () => {
    const r = MissionCommandSchema.safeParse({ command: "ab" });
    expect(r.success).toBe(false);
  });

  it("rejeita comando muito longo (> 500 chars)", () => {
    const r = MissionCommandSchema.safeParse({ command: "x".repeat(501) });
    expect(r.success).toBe(false);
  });

  it("default requested_mode é dry_run", () => {
    const r = MissionCommandSchema.safeParse({ command: "Teste comando" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.requested_mode).toBe("dry_run");
  });

  it("aceita todos os modos válidos", () => {
    for (const mode of ["dry_run", "human_gate", "mock", "live_unavailable"] as const) {
      const r = MissionCommandSchema.safeParse({ command: "Teste", requested_mode: mode });
      expect(r.success).toBe(true);
    }
  });
});

describe("WriteBridgeConfigSchema", () => {
  it("valida config local corretamente", () => {
    const r = WriteBridgeConfigSchema.safeParse(WRITE_BRIDGE_CONFIG);
    expect(r.success).toBe(true);
  });

  it("live_enabled é sempre false", () => {
    expect(WRITE_BRIDGE_CONFIG.live_enabled).toBe(false);
  });

  it("dry_run_available é sempre true", () => {
    expect(WRITE_BRIDGE_CONFIG.dry_run_available).toBe(true);
  });

  it("human_gate_required é sempre true", () => {
    expect(WRITE_BRIDGE_CONFIG.human_gate_required).toBe(true);
  });

  it("rejeita live_enabled: true", () => {
    const r = WriteBridgeConfigSchema.safeParse({ ...WRITE_BRIDGE_CONFIG, live_enabled: true });
    expect(r.success).toBe(false);
  });
});

// ── Risk Assessment ───────────────────────────────────────────────────────────

describe("assessRisk", () => {
  it("comando simples de leitura → risco low", () => {
    const { level } = assessRisk({ command: "Listar checkpoints", requested_mode: "dry_run" });
    expect(level).toBe("low");
  });

  it("comando com 'escrever' → risco medium ou mais", () => {
    const { level } = assessRisk({ command: "Escrever insight no vault", requested_mode: "dry_run" });
    expect(["medium", "high", "critical"]).toContain(level);
  });

  it("comando com 'deletar' → risco high ou critical", () => {
    const { level } = assessRisk({ command: "Deletar todos os dados", requested_mode: "dry_run" });
    expect(["high", "critical"]).toContain(level);
  });

  it("skill jarvis-memory-write → risco high ou critical", () => {
    const { level } = assessRisk({
      command: "Executar skill",
      target_skill: "jarvis-memory-write",
      requested_mode: "dry_run",
    });
    expect(["high", "critical"]).toContain(level);
  });

  it("retorna reasons não vazia", () => {
    const { reasons } = assessRisk({ command: "Criar post", requested_mode: "dry_run" });
    expect(reasons.length).toBeGreaterThan(0);
  });
});

// ── Checklist ─────────────────────────────────────────────────────────────────

describe("buildChecklist", () => {
  it("risco low tem pelo menos 2 itens", () => {
    const cl = buildChecklist("low");
    expect(cl.length).toBeGreaterThanOrEqual(2);
  });

  it("risco high tem mais itens que low", () => {
    const low = buildChecklist("low");
    const high = buildChecklist("high");
    expect(high.length).toBeGreaterThan(low.length);
  });

  it("risco critical tem mais itens que high", () => {
    const high = buildChecklist("high");
    const critical = buildChecklist("critical");
    expect(critical.length).toBeGreaterThanOrEqual(high.length);
  });

  it("todos os itens required têm id e label", () => {
    for (const level of ["low", "medium", "high", "critical"] as const) {
      const cl = buildChecklist(level);
      for (const item of cl) {
        expect(item.id).toBeTruthy();
        expect(item.label).toBeTruthy();
        expect(typeof item.required).toBe("boolean");
      }
    }
  });
});

// ── Mock Response ─────────────────────────────────────────────────────────────

describe("generateMockResponse", () => {
  it("retorna estimated_duration_ms positivo", () => {
    const r = generateMockResponse({ command: "Briefing", requested_mode: "dry_run" });
    expect(r!.estimated_duration_ms).toBeGreaterThan(0);
  });

  it("sempre inclui warnings sobre dry-run", () => {
    const r = generateMockResponse({ command: "Teste", requested_mode: "dry_run" });
    const hasWarning = r!.warnings.some((w) => w.toLowerCase().includes("dry-run") || w.toLowerCase().includes("mock"));
    expect(hasWarning).toBe(true);
  });

  it("inclui target_skill nos affected_skills quando fornecida", () => {
    const r = generateMockResponse({
      command: "Executar",
      target_skill: "jarvis-morning",
      requested_mode: "dry_run",
    });
    expect(r!.affected_skills).toContain("jarvis-morning");
  });

  it("affected_skills vazio quando skill não fornecida", () => {
    const r = generateMockResponse({ command: "Teste genérico", requested_mode: "dry_run" });
    expect(r!.affected_skills).toHaveLength(0);
  });
});

// ── Payload Preview ───────────────────────────────────────────────────────────

describe("buildPayloadPreview", () => {
  it("inclui kratos_request_id", () => {
    const preview = buildPayloadPreview({
      request_id: "req_test_001",
      command: { command: "Teste", requested_mode: "dry_run" },
      initiated_by: "lucas",
    });
    expect(preview.kratos_request_id).toBe("req_test_001");
  });

  it("inclui nota de que endpoint não foi chamado", () => {
    const preview = buildPayloadPreview({
      request_id: "req_test_002",
      command: { command: "Teste", requested_mode: "dry_run" },
      initiated_by: "lucas",
    });
    expect(String(preview.omnis_endpoint)).toContain("NÃO CHAMADO");
  });

  it("modo é sempre dry_run", () => {
    const preview = buildPayloadPreview({
      request_id: "req_test_003",
      command: { command: "Teste", requested_mode: "mock" },
      initiated_by: "lucas",
    });
    expect(preview.mode).toBe("dry_run");
  });
});

// ── Preview Command ───────────────────────────────────────────────────────────

describe("previewCommand", () => {
  it("retorna ok: true para comando válido", () => {
    const result = previewCommand({ command: "Gerar briefing matinal", requested_mode: "dry_run" });
    expect(result.ok).toBe(true);
  });

  it("retorna gate com status pending", () => {
    const result = previewCommand({ command: "Listar projetos ativos", requested_mode: "dry_run" });
    expect(result.gate?.status).toBe("pending");
  });

  it("retorna response com status pending_approval", () => {
    const result = previewCommand({ command: "Briefing do dia", requested_mode: "dry_run" });
    expect(result.response.status).toBe("pending_approval");
  });

  it("retorna ok: false para comando inválido (muito curto)", () => {
    const result = previewCommand({ command: "ab", requested_mode: "dry_run" });
    expect(result.ok).toBe(false);
  });

  it("payload_preview contém o comando", () => {
    const result = previewCommand({ command: "Verificar saúde do OMNIS", requested_mode: "dry_run" });
    expect(result.response.payload_preview?.command).toBe("Verificar saúde do OMNIS");
  });

  it("source é sempre dry_run", () => {
    const result = previewCommand({ command: "Teste de source badge", requested_mode: "dry_run" });
    expect(result.response.source).toBe("dry_run");
  });
});

// ── Send Dry Run ──────────────────────────────────────────────────────────────

describe("sendDryRun", () => {
  it("retorna ok: false se gate não aprovado", () => {
    const gate = HumanApprovalGateSchema.parse({
      gate_id: "gate_001",
      request_id: "req_001",
      command_summary: "Teste",
      risk_level: "low",
      status: "pending",
    });
    const result = sendDryRun({ command: "Teste", requested_mode: "dry_run" }, gate);
    expect(result.ok).toBe(false);
    expect(result.response.status).toBe("rejected");
  });

  it("retorna ok: true se gate aprovado", () => {
    const gate = HumanApprovalGateSchema.parse({
      gate_id: "gate_002",
      request_id: "req_002",
      command_summary: "Briefing",
      risk_level: "low",
      status: "approved",
    });
    const result = sendDryRun({ command: "Briefing matinal", requested_mode: "dry_run" }, gate);
    expect(result.ok).toBe(true);
    expect(result.response.status).toBe("dry_run_complete");
  });

  it("resultado inclui mock_response", () => {
    const gate = HumanApprovalGateSchema.parse({
      gate_id: "gate_003",
      request_id: "req_003",
      command_summary: "Qualificar lead",
      risk_level: "medium",
      status: "approved",
    });
    const result = sendDryRun({
      command: "Qualificar lead",
      target_skill: "lead-qualifier",
      requested_mode: "dry_run",
    }, gate);
    expect(result.response.mock_response).toBeDefined();
    expect(result.response.mock_response!.warnings.length).toBeGreaterThan(0);
  });

  it("mode é sempre dry_run", () => {
    const gate = HumanApprovalGateSchema.parse({
      gate_id: "gate_004",
      request_id: "req_004",
      command_summary: "Teste",
      risk_level: "low",
      status: "approved",
    });
    const result = sendDryRun({ command: "Teste completo", requested_mode: "dry_run" }, gate);
    expect(result.response.mode).toBe("dry_run");
  });

  it("source é sempre dry_run", () => {
    const gate = HumanApprovalGateSchema.parse({
      gate_id: "gate_005",
      request_id: "req_005",
      command_summary: "Teste source",
      risk_level: "low",
      status: "approved",
    });
    const result = sendDryRun({ command: "Checar saúde", requested_mode: "dry_run" }, gate);
    expect(result.response.source).toBe("dry_run");
  });
});

// ── Config ────────────────────────────────────────────────────────────────────

describe("getWriteBridgeConfig", () => {
  it("sempre retorna live_enabled: false", () => {
    expect(getWriteBridgeConfig().live_enabled).toBe(false);
  });

  it("sempre retorna human_gate_required: true", () => {
    expect(getWriteBridgeConfig().human_gate_required).toBe(true);
  });

  it("resolveExecutionMode retorna dry_run", () => {
    expect(resolveExecutionMode()).toBe("dry_run");
  });
});

// ── Quick Commands ────────────────────────────────────────────────────────────

describe("QUICK_COMMANDS", () => {
  it("tem 5 comandos pré-definidos", () => {
    expect(QUICK_COMMANDS).toHaveLength(5);
  });

  it("todos têm id, label, skill e risk", () => {
    for (const cmd of QUICK_COMMANDS) {
      expect(cmd.id).toBeTruthy();
      expect(cmd.label).toBeTruthy();
      expect(cmd.skill).toBeTruthy();
      expect(["low", "medium", "high"]).toContain(cmd.risk);
    }
  });

  it("ids são únicos", () => {
    const ids = QUICK_COMMANDS.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ── ExecutionResponse Schema ──────────────────────────────────────────────────

describe("ExecutionResponseSchema", () => {
  it("valida resposta dry_run_complete", () => {
    const r = ExecutionResponseSchema.safeParse({
      request_id: "req_test",
      status: "dry_run_complete",
      mode: "dry_run",
      source: "dry_run",
      processed_at: new Date(0).toISOString(),
    });
    expect(r.success).toBe(true);
  });

  it("rejeita status inválido", () => {
    const r = ExecutionResponseSchema.safeParse({
      request_id: "req_test",
      status: "live_sent",  // não existe
      mode: "dry_run",
      source: "dry_run",
      processed_at: new Date(0).toISOString(),
    });
    expect(r.success).toBe(false);
  });
});
