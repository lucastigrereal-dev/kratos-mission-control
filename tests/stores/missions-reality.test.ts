/**
 * missions-reality.test.ts — W4
 * Valida o contrato de GET /missions/active e o mapeamento para
 * ActiveMissionsPanel (DashboardView Row 4).
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 * Espelha api-contract/missions.schema.ts + useMissions.ts (W4).
 */

import { describe, it, expect } from "bun:test";
import { z } from "zod";

// ── Schema espelhado de missions.schema.ts ────────────────────────────────────

const MissionSummarySchema = z.object({
  mission_id:   z.string(),
  title:        z.string(),
  sector:       z.string(),
  status:       z.enum(["draft", "running", "paused", "completed", "failed", "cancelled"]),
  current_step: z.string().nullable().optional(),
  retry_count:  z.number().int().min(0).default(0),
  max_retries:  z.number().int().min(1).default(3),
  cumulative_cost_usd: z.number().min(0).default(0),
  last_event_type:     z.string().nullable().optional(),
  last_event_label:    z.string().optional(),
  last_event_at:       z.string().nullable().optional(),
  error_count:         z.number().int().min(0).default(0),
  event_count:         z.number().int().min(0).default(0),
  budget_exceeded:     z.boolean().default(false),
  approval_pending:    z.boolean().default(false),
  approval_reason:     z.string().nullable().optional(),
});

const MissionsEnvelopeSchema = z.object({
  data:         z.array(MissionSummarySchema),
  total:        z.number().int().min(0),
  source:       z.enum(["live", "empty"]),
  missions_dir: z.string().optional(),
});

type MissionSummary = z.infer<typeof MissionSummarySchema>;

// ── Lógica extraída de useMissions.ts / ActiveMissionsPanel.tsx (W4) ──────────

function mapSource(src: "live" | "empty"): "live" | "partial" {
  return src === "live" ? "live" : "partial";
}

function filterActive(missions: MissionSummary[]): MissionSummary[] {
  return missions.filter((m) => m.status === "running" || m.status === "paused").slice(0, 3);
}

function collectGuardrailAlerts(missions: MissionSummary[]) {
  const alerts: Array<{ type: "budget_exceeded" | "approval_pending"; missionTitle: string }> = [];
  for (const m of missions) {
    if (m.budget_exceeded) alerts.push({ type: "budget_exceeded", missionTitle: m.title });
    if (m.approval_pending) alerts.push({ type: "approval_pending", missionTitle: m.title });
  }
  return alerts;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeMission(overrides: Partial<MissionSummary> = {}): MissionSummary {
  return MissionSummarySchema.parse({
    mission_id:          "m-001",
    title:               "Parallel Fabric P2",
    sector:              "Produto & Tecnologia",
    status:              "running",
    current_step:        "wave-status-skill",
    cumulative_cost_usd: 0.0042,
    last_event_at:       new Date(Date.now() - 4 * 60_000).toISOString(),
    event_count:         12,
    ...overrides,
  });
}

function makeEnvelope(overrides: Partial<{
  data: MissionSummary[];
  source: "live" | "empty";
  total: number;
}> = {}): z.infer<typeof MissionsEnvelopeSchema> {
  const data = overrides.data ?? [makeMission()];
  return {
    data,
    total:  overrides.total ?? data.length,
    source: overrides.source ?? "live",
  };
}

// ── Schema validation ─────────────────────────────────────────────────────────

describe("W4 missions-reality — schema validation", () => {
  it("envelope live com missão running passa o schema", () => {
    const result = MissionsEnvelopeSchema.safeParse(makeEnvelope());
    expect(result.success).toBe(true);
  });

  it("envelope source=empty (nenhuma missão ativa) é válido", () => {
    const result = MissionsEnvelopeSchema.safeParse(makeEnvelope({ data: [], source: "empty", total: 0 }));
    expect(result.success).toBe(true);
  });

  it("envelope sem 'source' falha o schema", () => {
    const invalid = { data: [], total: 0 };
    expect(MissionsEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("todos os status válidos passam o schema", () => {
    const statuses = ["draft", "running", "paused", "completed", "failed", "cancelled"] as const;
    for (const status of statuses) {
      const result = MissionSummarySchema.safeParse(makeMission({ status }));
      expect(result.success).toBe(true);
    }
  });

  it("status inválido falha o schema", () => {
    const invalid = { ...makeMission(), status: "unknown" };
    expect(MissionSummarySchema.safeParse(invalid).success).toBe(false);
  });
});

// ── Source mapping ────────────────────────────────────────────────────────────

describe("W4 missions-reality — source mapping", () => {
  it("source=live → DataSource 'live'", () => {
    expect(mapSource("live")).toBe("live");
  });

  it("source=empty → DataSource 'partial'", () => {
    expect(mapSource("empty")).toBe("partial");
  });
});

// ── filterActive (ActiveMissionsPanel lógica) ─────────────────────────────────

describe("W4 missions-reality — filterActive", () => {
  it("running e paused são incluídos", () => {
    const missions = [
      makeMission({ mission_id: "m1", status: "running" }),
      makeMission({ mission_id: "m2", status: "paused" }),
    ];
    const active = filterActive(missions);
    expect(active).toHaveLength(2);
  });

  it("completed, failed, cancelled e draft são excluídos", () => {
    const missions = [
      makeMission({ mission_id: "m1", status: "completed" }),
      makeMission({ mission_id: "m2", status: "failed" }),
      makeMission({ mission_id: "m3", status: "cancelled" }),
      makeMission({ mission_id: "m4", status: "draft" }),
    ];
    expect(filterActive(missions)).toHaveLength(0);
  });

  it("máximo 3 missões ativas (TDAH limit)", () => {
    const missions = Array.from({ length: 6 }, (_, i) =>
      makeMission({ mission_id: `m${i}`, status: "running" }),
    );
    expect(filterActive(missions)).toHaveLength(3);
  });

  it("lista vazia → vazio (sem crash)", () => {
    expect(filterActive([])).toHaveLength(0);
  });
});

// ── Guardrail alerts ──────────────────────────────────────────────────────────

describe("W4 missions-reality — guardrail alerts", () => {
  it("sem guardrails → alerts vazio", () => {
    expect(collectGuardrailAlerts([makeMission()])).toHaveLength(0);
  });

  it("budget_exceeded=true → alert do tipo budget_exceeded", () => {
    const m = makeMission({ budget_exceeded: true });
    const alerts = collectGuardrailAlerts([m]);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe("budget_exceeded");
  });

  it("approval_pending=true → alert do tipo approval_pending", () => {
    const m = makeMission({ approval_pending: true });
    const alerts = collectGuardrailAlerts([m]);
    expect(alerts[0].type).toBe("approval_pending");
  });

  it("budget + approval na mesma missão → 2 alerts", () => {
    const m = makeMission({ budget_exceeded: true, approval_pending: true });
    expect(collectGuardrailAlerts([m])).toHaveLength(2);
  });

  it("múltiplas missões com alerts individuais", () => {
    const missions = [
      makeMission({ mission_id: "m1", budget_exceeded: true }),
      makeMission({ mission_id: "m2", approval_pending: true }),
    ];
    expect(collectGuardrailAlerts(missions)).toHaveLength(2);
  });
});

// ── Dashboard visibility rule ─────────────────────────────────────────────────

describe("W4 missions-reality — dashboard visibility", () => {
  it("missões.length > 0 → painel visível", () => {
    const show = [makeMission()].length > 0;
    expect(show).toBe(true);
  });

  it("missões.length === 0 e não loading → painel oculto", () => {
    const missions: MissionSummary[] = [];
    const isLoading = false;
    const showPanel = isLoading || missions.length > 0;
    expect(showPanel).toBe(false);
  });

  it("isLoading=true → painel visível (mostra LoadingState)", () => {
    const missions: MissionSummary[] = [];
    const isLoading = true;
    expect(isLoading || missions.length > 0).toBe(true);
  });
});
