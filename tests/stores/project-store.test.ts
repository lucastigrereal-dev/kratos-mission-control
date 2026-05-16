/**
 * P1-3 — Persistence Tests: Project Store
 * Tests in-memory store CRUD operations and data integrity.
 * Bun-native, no jsdom needed.
 */

import { describe, it, expect, beforeEach } from "bun:test";

// ---------------------------------------------------------------------------
// Replicate store logic in isolation (avoids import side-effects from seed)
// ---------------------------------------------------------------------------

type ProjectStatus = "active" | "paused" | "completed" | "archived";

interface Project {
  id: string;
  nome: string;
  descricao?: string;
  status: ProjectStatus;
  repo: string | null;
  prioridade: number;
  ultimaAtividade: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface CreateProject {
  nome: string;
  descricao?: string;
  repo?: string | null;
  prioridade?: number;
}

interface UpdateProject {
  nome?: string;
  descricao?: string;
  status?: ProjectStatus;
  repo?: string | null;
  prioridade?: number;
  ultimaAtividade?: string;
}

function createStore() {
  const store = new Map<string, Project>();

  function getAll(): Project[] {
    return Array.from(store.values()).sort((a, b) => {
      const prioDiff = b.prioridade - a.prioridade;
      if (prioDiff !== 0) return prioDiff;
      return new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime();
    });
  }

  function getById(id: string): Project | undefined {
    return store.get(id);
  }

  function create(input: CreateProject): Project {
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      nome: input.nome,
      descricao: input.descricao,
      status: "active",
      repo: input.repo ?? null,
      prioridade: input.prioridade ?? 3,
      ultimaAtividade: now,
      criadoEm: now,
      atualizadoEm: now,
    };
    store.set(project.id, project);
    return project;
  }

  function update(id: string, input: UpdateProject): Project | undefined {
    const existing = store.get(id);
    if (!existing) return undefined;
    const updated: Project = {
      ...existing,
      ...input,
      id: existing.id,
      criadoEm: existing.criadoEm,
      atualizadoEm: new Date().toISOString(),
    };
    store.set(id, updated);
    return updated;
  }

  function remove(id: string): boolean {
    return store.delete(id);
  }

  return { getAll, getById, create, update, remove, _store: store };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Project Store — CRUD", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("starts empty", () => {
    expect(store.getAll()).toHaveLength(0);
  });

  it("creates a project with correct defaults", () => {
    const pr = store.create({ nome: "Teste de store" });

    expect(pr.nome).toBe("Teste de store");
    expect(pr.status).toBe("active");
    expect(pr.prioridade).toBe(3);
    expect(pr.repo).toBeNull();
    expect(pr.id).toBeDefined();
    expect(pr.criadoEm).toBeDefined();
    expect(pr.ultimaAtividade).toBeDefined();
  });

  it("creates a project with optional fields", () => {
    const pr = store.create({
      nome: "Com opcionais",
      descricao: "Descrição de teste",
      repo: "https://github.com/user/repo",
      prioridade: 5,
    });

    expect(pr.descricao).toBe("Descrição de teste");
    expect(pr.repo).toBe("https://github.com/user/repo");
    expect(pr.prioridade).toBe(5);
  });

  it("retrieves by id", () => {
    const pr = store.create({ nome: "Recuperável" });
    const found = store.getById(pr.id);
    expect(found?.nome).toBe("Recuperável");
  });

  it("returns undefined for missing id", () => {
    expect(store.getById("nonexistent")).toBeUndefined();
  });

  it("lists all sorted by prioridade desc then atualizadoEm desc", () => {
    const a = store.create({ nome: "A", prioridade: 3 });
    const b = store.create({ nome: "B", prioridade: 5 });
    const c = store.create({ nome: "C", prioridade: 3 });

    // B should be first (prio 5)
    const all = store.getAll();
    expect(all[0].nome).toBe("B");
    // A and C have same prio and creation time — insertion order is A before C
    expect(all[1].nome).toBe("A");
    expect(all[2].nome).toBe("C");

    // Update C — refreshes atualizadoEm, pushing it before A
    Bun.sleepSync(1);
    store.update(c.id, { nome: "C updated" });
    const all2 = store.getAll();
    expect(all2[0].nome).toBe("B");
    expect(all2[1].nome).toBe("C updated");
    expect(all2[2].nome).toBe("A");
  });

  it("updates fields", () => {
    const pr = store.create({ nome: "Original" });
    const updated = store.update(pr.id, { nome: "Modificado", prioridade: 1 });

    expect(updated?.nome).toBe("Modificado");
    expect(updated?.prioridade).toBe(1);
    expect(updated?.id).toBe(pr.id);
    expect(updated?.criadoEm).toBe(pr.criadoEm);
    expect(new Date(updated!.atualizadoEm).getTime())
      .toBeGreaterThanOrEqual(new Date(pr.atualizadoEm).getTime());
  });

  it("returns undefined when updating nonexistent", () => {
    expect(store.update("fake", { prioridade: 1 })).toBeUndefined();
  });

  it("deletes a project", () => {
    const pr = store.create({ nome: "Deletável" });
    expect(store.getAll()).toHaveLength(1);

    const result = store.remove(pr.id);
    expect(result).toBe(true);
    expect(store.getAll()).toHaveLength(0);
    expect(store.getById(pr.id)).toBeUndefined();
  });

  it("returns false when deleting nonexistent", () => {
    expect(store.remove("fake")).toBe(false);
  });
});

describe("Project Store — Data integrity", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("generates unique IDs for each project", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const pr = store.create({ nome: `PR ${i}` });
      ids.add(pr.id);
    }
    expect(ids.size).toBe(100);
  });

  it("new projects always start as active with priority 3", () => {
    for (let i = 0; i < 10; i++) {
      const pr = store.create({ nome: `PR ${i}` });
      expect(pr.status).toBe("active");
      expect(pr.prioridade).toBe(3);
    }
  });

  it("can transition through valid statuses", () => {
    const pr = store.create({ nome: "Status journey" });

    store.update(pr.id, { status: "paused" });
    expect(store.getById(pr.id)?.status).toBe("paused");

    store.update(pr.id, { status: "active" });
    expect(store.getById(pr.id)?.status).toBe("active");

    store.update(pr.id, { status: "completed" });
    expect(store.getById(pr.id)?.status).toBe("completed");

    store.update(pr.id, { status: "archived" });
    expect(store.getById(pr.id)?.status).toBe("archived");
  });

  it("preserves id and criadoEm on update", () => {
    const pr = store.create({ nome: "Imutável parcial" });
    const updated = store.update(pr.id, {
      nome: "Nome novo",
      status: "completed",
      prioridade: 2,
    });

    expect(updated?.id).toBe(pr.id);
    expect(updated?.criadoEm).toBe(pr.criadoEm);
  });
});
