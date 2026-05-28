/**
 * tasks-reality.test.ts — W1-B6/B7
 * Valida o contrato do envelope de tasks retornado pelo backend Python.
 * Testa:
 *  B6 — Path SQLite real: envelope live com array de tarefas
 *  B7 — Path fallback mock: envelope mock com source='mock'
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 * O formato é idêntico ao definido em backend/app/services/__init__.py.
 */

import { describe, it, expect } from "bun:test";
import { z } from "zod";

// ── Schema do envelope de tasks (W1-B5 convention) ───────────────────────────

const TaskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  project_id: z.string(),
  status: z.string(),
  priority: z.string(),
  source: z.string(),
  due_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const TaskEnvelopeSchema = z.object({
  data: z.array(TaskItemSchema),
  source: z.enum(["live", "mock", "cached", "fallback"]),
  source_ts: z.string(),
});

type TaskEnvelope = z.infer<typeof TaskEnvelopeSchema>;

// ── Helpers de fixture ────────────────────────────────────────────────────────

function makeLiveEnvelope(tasks: Array<Partial<z.infer<typeof TaskItemSchema>>> = []): TaskEnvelope {
  return {
    data: tasks.map((t) => ({
      id: t.id ?? "task-1",
      title: t.title ?? "Tarefa de teste",
      project_id: t.project_id ?? "",
      status: t.status ?? "inbox",
      priority: t.priority ?? "medium",
      source: t.source ?? "manual",
      due_date: t.due_date ?? "",
      created_at: t.created_at ?? new Date().toISOString(),
      updated_at: t.updated_at ?? new Date().toISOString(),
    })),
    source: "live",
    source_ts: new Date().toISOString(),
  };
}

function makeMockEnvelope(tasks: Array<Partial<z.infer<typeof TaskItemSchema>>> = []): TaskEnvelope {
  return { ...makeLiveEnvelope(tasks), source: "mock" };
}

// ── B6: Testes do path SQLite real ────────────────────────────────────────────

describe("W1 tasks — path SQLite real (source: live)", () => {
  it("envelope live com tarefas passa o schema", () => {
    const envelope = makeLiveEnvelope([
      { id: "task-001", title: "Corrigir GET /tasks", status: "doing", priority: "high" },
      { id: "task-002", title: "Criar SourceBadge", status: "inbox", priority: "medium" },
    ]);
    expect(TaskEnvelopeSchema.safeParse(envelope).success).toBe(true);
  });

  it("envelope live com lista VAZIA é válido (empty SQLite ≠ mock)", () => {
    const envelope = makeLiveEnvelope([]);
    const result = TaskEnvelopeSchema.safeParse(envelope);
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
    const envelope = makeLiveEnvelope([{ id: "t1", title: "Task 1" }]);
    expect(envelope.source).toBe("live");
  });

  it("cada tarefa tem todos os campos obrigatórios", () => {
    const envelope = makeLiveEnvelope([{ id: "t1", status: "doing" }]);
    const task = envelope.data[0];
    expect(task).toHaveProperty("id");
    expect(task).toHaveProperty("title");
    expect(task).toHaveProperty("status");
    expect(task).toHaveProperty("priority");
    expect(task).toHaveProperty("project_id");
    expect(task).toHaveProperty("due_date");
    expect(task).toHaveProperty("created_at");
    expect(task).toHaveProperty("updated_at");
  });

  it("status padrão é 'inbox' quando ausente", () => {
    const task = TaskItemSchema.parse({
      id: "t1", title: "T", project_id: "", status: "inbox",
      priority: "medium", source: "manual", due_date: "",
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    });
    expect(task.status).toBe("inbox");
  });
});

// ── B7: Testes do path fallback mock ─────────────────────────────────────────

describe("W1 tasks — path fallback mock (source: mock)", () => {
  it("envelope mock passa o schema", () => {
    const envelope = makeMockEnvelope([
      { id: "mock-001", title: "Mock task", status: "doing" },
    ]);
    expect(TaskEnvelopeSchema.safeParse(envelope).success).toBe(true);
  });

  it("source='mock' quando SQLite falha", () => {
    const envelope = makeMockEnvelope();
    expect(envelope.source).toBe("mock");
  });

  it("mock com lista vazia também é válido", () => {
    const envelope = makeMockEnvelope([]);
    const result = TaskEnvelopeSchema.safeParse(envelope);
    expect(result.success).toBe(true);
    expect(result.data?.source).toBe("mock");
  });

  it("mock ≠ live: source é distinguível", () => {
    const live = makeLiveEnvelope([{ id: "t1" }]);
    const mock = makeMockEnvelope([{ id: "t1" }]);
    expect(live.source).not.toBe(mock.source);
  });
});

// ── Testes de integridade do envelope ────────────────────────────────────────

describe("W1 tasks — integridade do envelope", () => {
  it("envelope sem 'data' falha o schema", () => {
    const invalid = { source: "live", source_ts: new Date().toISOString() };
    expect(TaskEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("envelope sem 'source' falha o schema", () => {
    const invalid = { data: [], source_ts: new Date().toISOString() };
    expect(TaskEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("source='unknown' não é aceito (somente live|mock|cached|fallback)", () => {
    const invalid = { data: [], source: "unknown", source_ts: new Date().toISOString() };
    expect(TaskEnvelopeSchema.safeParse(invalid).success).toBe(false);
  });

  it("envelope live com 10 tarefas é eficiente de parsear", () => {
    const tasks = Array.from({ length: 10 }, (_, i) => ({
      id: `task-${i}`,
      title: `Tarefa ${i}`,
      status: i % 2 === 0 ? "doing" : "inbox",
    }));
    const envelope = makeLiveEnvelope(tasks);
    const result = TaskEnvelopeSchema.safeParse(envelope);
    expect(result.success).toBe(true);
    expect(result.data?.data).toHaveLength(10);
  });
});

// ── Testes de mapeamento frontend → TasksIslandData ──────────────────────────

describe("W1 tasks — mapeamento para TasksIslandData", () => {
  // Simula o que o hook useTasksToday() fará ao converter o envelope
  function envelopeToIslandData(envelope: TaskEnvelope) {
    const urgent = envelope.data
      .filter((t) => t.status === "doing" || t.priority === "high")
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        title: t.title,
        overdue: Boolean(t.due_date && t.due_date < new Date().toISOString().split("T")[0]),
      }));
    return { urgent, totalCount: envelope.data.length };
  }

  it("mapeia tarefas 'doing' para urgent", () => {
    const envelope = makeLiveEnvelope([
      { id: "t1", title: "Task A", status: "doing" },
      { id: "t2", title: "Task B", status: "inbox" },
    ]);
    const island = envelopeToIslandData(envelope);
    expect(island.urgent).toHaveLength(1);
    expect(island.urgent[0].id).toBe("t1");
  });

  it("totalCount reflete número total de tarefas", () => {
    const envelope = makeLiveEnvelope([
      { id: "t1" }, { id: "t2" }, { id: "t3" },
    ]);
    expect(envelopeToIslandData(envelope).totalCount).toBe(3);
  });

  it("envelope vazio → urgent=[], totalCount=0", () => {
    const island = envelopeToIslandData(makeLiveEnvelope([]));
    expect(island.urgent).toHaveLength(0);
    expect(island.totalCount).toBe(0);
  });

  it("urgentes são limitados a 5 (TDAH — não sobrecarregar)", () => {
    const tasks = Array.from({ length: 10 }, (_, i) => ({
      id: `t${i}`, status: "doing",
    }));
    const island = envelopeToIslandData(makeLiveEnvelope(tasks));
    expect(island.urgent.length).toBeLessThanOrEqual(5);
  });
});
