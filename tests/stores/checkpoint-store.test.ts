/**
 * W08 — Persistence Tests: Checkpoint Store
 * Tests in-memory store CRUD operations and data integrity.
 * Bun-native, no jsdom needed.
 */

import { describe, it, expect, beforeEach } from "bun:test";

// ---------------------------------------------------------------------------
// Replicate store logic in isolation (avoids import side-effects from seed)
// ---------------------------------------------------------------------------

type CheckpointStatus = "pending" | "in_progress" | "completed" | "blocked" | "cancelled";

interface Checkpoint {
  id: string;
  projetoId: string | null;
  titulo: string;
  descricao?: string;
  progresso: number;
  status: CheckpointStatus;
  deadline: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

interface CreateCheckpoint {
  titulo: string;
  descricao?: string;
  projetoId?: string | null;
  deadline?: string | null;
}

interface UpdateCheckpoint {
  titulo?: string;
  descricao?: string;
  progresso?: number;
  status?: CheckpointStatus;
  projetoId?: string | null;
  deadline?: string | null;
}

function createStore() {
  const store = new Map<string, Checkpoint>();

  function getAll(): Checkpoint[] {
    return Array.from(store.values()).sort(
      (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
    );
  }

  function getById(id: string): Checkpoint | undefined {
    return store.get(id);
  }

  function create(input: CreateCheckpoint): Checkpoint {
    const now = new Date().toISOString();
    const checkpoint: Checkpoint = {
      id: crypto.randomUUID(),
      projetoId: input.projetoId ?? null,
      titulo: input.titulo,
      descricao: input.descricao,
      progresso: 0,
      status: "pending",
      deadline: input.deadline ?? null,
      criadoEm: now,
      atualizadoEm: now,
    };
    store.set(checkpoint.id, checkpoint);
    return checkpoint;
  }

  function update(id: string, input: UpdateCheckpoint): Checkpoint | undefined {
    const existing = store.get(id);
    if (!existing) return undefined;
    const updated: Checkpoint = {
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

describe("Checkpoint Store — CRUD", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("starts empty", () => {
    expect(store.getAll()).toHaveLength(0);
  });

  it("creates a checkpoint with correct defaults", () => {
    const cp = store.create({ titulo: "Teste de store" });

    expect(cp.titulo).toBe("Teste de store");
    expect(cp.progresso).toBe(0);
    expect(cp.status).toBe("pending");
    expect(cp.projetoId).toBeNull();
    expect(cp.deadline).toBeNull();
    expect(cp.id).toBeDefined();
    expect(cp.criadoEm).toBeDefined();
  });

  it("creates a checkpoint with optional fields", () => {
    const cp = store.create({
      titulo: "Com opcionais",
      descricao: "Descrição de teste",
      projetoId: "proj-123",
      deadline: "2026-06-01T00:00:00.000Z",
    });

    expect(cp.descricao).toBe("Descrição de teste");
    expect(cp.projetoId).toBe("proj-123");
    expect(cp.deadline).toBe("2026-06-01T00:00:00.000Z");
  });

  it("retrieves by id", () => {
    const cp = store.create({ titulo: "Recuperável" });
    const found = store.getById(cp.id);
    expect(found?.titulo).toBe("Recuperável");
  });

  it("returns undefined for missing id", () => {
    expect(store.getById("nonexistent")).toBeUndefined();
  });

  it("lists all sorted by atualizadoEm desc", () => {
    const a = store.create({ titulo: "A" });
    const b = store.create({ titulo: "B" });

    // Update A so its atualizadoEm is newer
    store.update(a.id, { progresso: 50 });

    const all = store.getAll();
    expect(all[0].titulo).toBe("A"); // A updated most recently
    expect(all[1].titulo).toBe("B");
  });

  it("updates fields", () => {
    const cp = store.create({ titulo: "Original" });
    const updated = store.update(cp.id, { titulo: "Modificado", progresso: 75 });

    expect(updated?.titulo).toBe("Modificado");
    expect(updated?.progresso).toBe(75);
    expect(updated?.id).toBe(cp.id);
    expect(updated?.criadoEm).toBe(cp.criadoEm);
    // atualizadoEm must be >= original (same ms is possible in fast tests)
    expect(new Date(updated!.atualizadoEm).getTime())
      .toBeGreaterThanOrEqual(new Date(cp.atualizadoEm).getTime());
  });

  it("returns undefined when updating nonexistent", () => {
    expect(store.update("fake", { progresso: 100 })).toBeUndefined();
  });

  it("deletes a checkpoint", () => {
    const cp = store.create({ titulo: "Deletável" });
    expect(store.getAll()).toHaveLength(1);

    const result = store.remove(cp.id);
    expect(result).toBe(true);
    expect(store.getAll()).toHaveLength(0);
    expect(store.getById(cp.id)).toBeUndefined();
  });

  it("returns false when deleting nonexistent", () => {
    expect(store.remove("fake")).toBe(false);
  });
});

describe("Checkpoint Store — Data integrity", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("generates unique IDs for each checkpoint", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const cp = store.create({ titulo: `CP ${i}` });
      ids.add(cp.id);
    }
    expect(ids.size).toBe(100);
  });

  it("new checkpoints always start as pending with 0 progress", () => {
    for (let i = 0; i < 10; i++) {
      const cp = store.create({ titulo: `CP ${i}` });
      expect(cp.status).toBe("pending");
      expect(cp.progresso).toBe(0);
    }
  });

  it("can transition through valid statuses", () => {
    const cp = store.create({ titulo: "Status journey" });

    store.update(cp.id, { status: "in_progress" });
    expect(store.getById(cp.id)?.status).toBe("in_progress");

    store.update(cp.id, { status: "blocked" });
    expect(store.getById(cp.id)?.status).toBe("blocked");

    store.update(cp.id, { status: "in_progress" });
    expect(store.getById(cp.id)?.status).toBe("in_progress");

    store.update(cp.id, { status: "completed" });
    expect(store.getById(cp.id)?.status).toBe("completed");
  });

  it("preserves id and criadoEm on update", () => {
    const cp = store.create({ titulo: "Imutável parcial" });
    const updated = store.update(cp.id, {
      titulo: "Título novo",
      progresso: 100,
      status: "completed",
    });

    expect(updated?.id).toBe(cp.id);
    expect(updated?.criadoEm).toBe(cp.criadoEm);
  });
});
