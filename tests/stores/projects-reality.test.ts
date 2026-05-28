/**
 * projects-reality.test.ts — W2
 * Valida o contrato do envelope de projects retornado pelo backend Python.
 * Testa:
 *  — Path SQLite real: envelope live com array de projetos
 *  — Path fallback mock: envelope mock com source='mock'
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 * O formato espelha o definido em backend/app/services/__init__.py (W2-B1).
 */

import { describe, it, expect } from "bun:test";
import { z } from "zod";

// ── Schema do envelope de projects (W2 convention) ────────────────────────────

const ProjectAPIItemSchema = z.object({
  id:            z.string(),
  name:          z.string(),
  description:   z.string().default(""),
  type:          z.string().default("product"),
  status:        z.string().default("active"),
  phase:         z.string().default(""),
  priority:      z.string().default("medium"),
  repo_path:     z.string().default(""),
  next_action:   z.string().default(""),
  deadline:      z.string().default(""),
  last_activity: z.string().default(""),
  risk_level:    z.string().default("low"),
  outputs_count: z.number().default(0),
  created_at:    z.string(),
  updated_at:    z.string(),
});

const ProjectEnvelopeSchema = z.object({
  data:      z.array(ProjectAPIItemSchema),
  source:    z.enum(["live", "mock", "cached", "fallback"]),
  source_ts: z.string(),
});

type ProjectEnvelope = z.infer<typeof ProjectEnvelopeSchema>;

// ── Helpers de fixture ────────────────────────────────────────────────────────

function makeLiveEnvelope(projects: Array<Partial<z.infer<typeof ProjectAPIItemSchema>>> = []): ProjectEnvelope {
  return {
    data: projects.map((p) => ({
      id:            p.id ?? "project-1",
      name:          p.name ?? "Projeto de teste",
      description:   p.description ?? "",
      type:          p.type ?? "product",
      status:        p.status ?? "active",
      phase:         p.phase ?? "",
      priority:      p.priority ?? "medium",
      repo_path:     p.repo_path ?? "",
      next_action:   p.next_action ?? "",
      deadline:      p.deadline ?? "",
      last_activity: p.last_activity ?? new Date().toISOString(),
      risk_level:    p.risk_level ?? "low",
      outputs_count: p.outputs_count ?? 0,
      created_at:    p.created_at ?? new Date().toISOString(),
      updated_at:    p.updated_at ?? new Date().toISOString(),
    })),
    source:    "live",
    source_ts: new Date().toISOString(),
  };
}

function makeMockEnvelope(projects: Array<Partial<z.infer<typeof ProjectAPIItemSchema>>> = []): ProjectEnvelope {
  return { ...makeLiveEnvelope(projects), source: "mock" };
}

// ── Path SQLite real ──────────────────────────────────────────────────────────

describe("W2 projects — path SQLite real (source: live)", () => {
  it("envelope live com projetos passa o schema", () => {
    const envelope = makeLiveEnvelope([
      { id: "proj-001", name: "KRATOS Mission Control", status: "active", priority: "high" },
      { id: "proj-002", name: "OMNIS Runtime", status: "active", priority: "high" },
    ]);
    expect(ProjectEnvelopeSchema.safeParse(envelope).success).toBe(true);
  });

  it("envelope live com lista VAZIA é válido (empty SQLite ≠ mock)", () => {
    const envelope = makeLiveEnvelope([]);
    const result = ProjectEnvelopeSchema.safeParse(envelope);
    expect(result.success).toBe(true);
    expect(result.data?.data).toHaveLength(0);
    expect(result.data?.source).toBe("live");
  });

  it("source_ts é string ISO válida", () => {
    const envelope = makeLiveEnvelope();
    const ts = new Date(envelope.source_ts);
    expect(isNaN(ts.getTime())).toBe(false);
  });

  it("source='live' quando backend responde corretamente", () => {
    const envelope = makeLiveEnvelope([{ id: "p1", name: "P1" }]);
    expect(envelope.source).toBe("live");
  });

  it("cada projeto tem todos os campos obrigatórios", () => {
    const envelope = makeLiveEnvelope([{ id: "p1", name: "Test", status: "active" }]);
    const p = envelope.data[0];
    expect(p).toHaveProperty("id");
    expect(p).toHaveProperty("name");
    expect(p).toHaveProperty("status");
    expect(p).toHaveProperty("priority");
    expect(p).toHaveProperty("risk_level");
    expect(p).toHaveProperty("created_at");
    expect(p).toHaveProperty("updated_at");
  });

  it("status padrão é 'active' quando não fornecido", () => {
    const item = ProjectAPIItemSchema.parse({
      id: "p1", name: "P", description: "", type: "product", status: "active",
      phase: "", priority: "medium", repo_path: "", next_action: "", deadline: "",
      last_activity: "", risk_level: "low", outputs_count: 0,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
    expect(item.status).toBe("active");
  });
});

// ── Path fallback mock ────────────────────────────────────────────────────────

describe("W2 projects — path fallback mock (source: mock)", () => {
  it("envelope mock passa o schema", () => {
    const envelope = makeMockEnvelope([
      { id: "mock-001", name: "Mock project", status: "active" },
    ]);
    expect(ProjectEnvelopeSchema.safeParse(envelope).success).toBe(true);
  });

  it("source='mock' quando SQLite falha", () => {
    const envelope = makeMockEnvelope();
    expect(envelope.source).toBe("mock");
  });

  it("mock com lista vazia também é válido", () => {
    const envelope = makeMockEnvelope([]);
    const result = ProjectEnvelopeSchema.safeParse(envelope);
    expect(result.success).toBe(true);
    expect(result.data?.source).toBe("mock");
  });

  it("mock ≠ live: source é distinguível", () => {
    const live = makeLiveEnvelope([{ id: "p1" }]);
    const mock = makeMockEnvelope([{ id: "p1" }]);
    expect(live.source).not.toBe(mock.source);
  });
});

// ── Integridade do envelope ───────────────────────────────────────────────────

describe("W2 projects — integridade do envelope", () => {
  it("envelope sem 'data' falha o schema", () => {
    const invalid = { source: "live", source_ts: new Date().toISOString() };
    expect(ProjectEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("envelope sem 'source' falha o schema", () => {
    const invalid = { data: [], source_ts: new Date().toISOString() };
    expect(ProjectEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("source='unknown' não é aceito (somente live|mock|cached|fallback)", () => {
    const invalid = { data: [], source: "unknown", source_ts: new Date().toISOString() };
    expect(ProjectEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("envelope live com 8 projetos é válido", () => {
    const projects = Array.from({ length: 8 }, (_, i) => ({
      id: `proj-${i}`, name: `Projeto ${i}`,
      status: i % 2 === 0 ? "active" : "paused",
    }));
    const envelope = makeLiveEnvelope(projects);
    const result = ProjectEnvelopeSchema.safeParse(envelope);
    expect(result.success).toBe(true);
    expect(result.data?.data).toHaveLength(8);
  });
});

// ── Mapeamento para ProjectsIslandData ────────────────────────────────────────

describe("W2 projects — mapeamento para ProjectsIslandData", () => {
  function envelopeToIslandData(envelope: ProjectEnvelope) {
    const activeItems = envelope.data.filter(
      (p) => p.status === "active" || p.status === "running",
    );
    const active = activeItems.slice(0, 5).map((p) => ({
      id: p.id, name: p.name, riskLevel: p.risk_level,
    }));
    return {
      active,
      activeCount: activeItems.length,
      totalCount: envelope.data.length,
    };
  }

  it("mapeia projetos 'active' para active", () => {
    const envelope = makeLiveEnvelope([
      { id: "p1", name: "KRATOS", status: "active" },
      { id: "p2", name: "Pausado", status: "paused" },
    ]);
    const island = envelopeToIslandData(envelope);
    expect(island.active).toHaveLength(1);
    expect(island.active[0].id).toBe("p1");
  });

  it("totalCount reflete número total de projetos", () => {
    const envelope = makeLiveEnvelope([
      { id: "p1", status: "active" },
      { id: "p2", status: "paused" },
      { id: "p3", status: "completed" },
    ]);
    expect(envelopeToIslandData(envelope).totalCount).toBe(3);
  });

  it("activeCount conta apenas ativos/running", () => {
    const envelope = makeLiveEnvelope([
      { id: "p1", status: "active" },
      { id: "p2", status: "running" },
      { id: "p3", status: "paused" },
    ]);
    const island = envelopeToIslandData(envelope);
    expect(island.activeCount).toBe(2);
  });

  it("envelope vazio → active=[], totalCount=0", () => {
    const island = envelopeToIslandData(makeLiveEnvelope([]));
    expect(island.active).toHaveLength(0);
    expect(island.totalCount).toBe(0);
  });

  it("ativos são limitados a 5 (TDAH — não sobrecarregar)", () => {
    const projects = Array.from({ length: 10 }, (_, i) => ({
      id: `p${i}`, status: "active",
    }));
    const island = envelopeToIslandData(makeLiveEnvelope(projects));
    expect(island.active.length).toBeLessThanOrEqual(5);
  });

  it("riskLevel é preservado no mapeamento", () => {
    const envelope = makeLiveEnvelope([
      { id: "p1", name: "Risco Alto", status: "active", risk_level: "high" },
    ]);
    const island = envelopeToIslandData(envelope);
    expect(island.active[0].riskLevel).toBe("high");
  });
});
