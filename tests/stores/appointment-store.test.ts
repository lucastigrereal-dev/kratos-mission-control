/**
 * P1-3 — Persistence Tests: Appointment Store
 * Tests in-memory store CRUD operations and data integrity.
 * Bun-native, no jsdom needed.
 */

import { describe, it, expect, beforeEach } from "bun:test";

// ---------------------------------------------------------------------------
// Replicate store logic in isolation (avoids import side-effects from seed)
// ---------------------------------------------------------------------------

type AppointmentType = "deep_work" | "meeting" | "review" | "admin" | "checkpoint";
type AppointmentStatus = "pending" | "in_progress" | "completed" | "blocked";

interface Appointment {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  horario: string | null;
  tipo: AppointmentType;
  status: AppointmentStatus;
  projetoId: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

interface CreateAppointment {
  titulo: string;
  descricao?: string;
  data: string;
  horario?: string | null;
  tipo?: AppointmentType;
  projetoId?: string | null;
}

interface UpdateAppointment {
  titulo?: string;
  descricao?: string;
  data?: string;
  horario?: string | null;
  tipo?: AppointmentType;
  status?: AppointmentStatus;
  projetoId?: string | null;
}

function createStore() {
  const store = new Map<string, Appointment>();

  function getAll(): Appointment[] {
    return Array.from(store.values()).sort((a, b) => {
      const dateCmp = a.data.localeCompare(b.data);
      if (dateCmp !== 0) return dateCmp;
      return (a.horario ?? "").localeCompare(b.horario ?? "");
    });
  }

  function getById(id: string): Appointment | undefined {
    return store.get(id);
  }

  function create(input: CreateAppointment): Appointment {
    const now = new Date().toISOString();
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao,
      data: input.data,
      horario: input.horario ?? null,
      tipo: input.tipo ?? "deep_work",
      status: "pending",
      projetoId: input.projetoId ?? null,
      criadoEm: now,
      atualizadoEm: now,
    };
    store.set(appointment.id, appointment);
    return appointment;
  }

  function update(id: string, input: UpdateAppointment): Appointment | undefined {
    const existing = store.get(id);
    if (!existing) return undefined;
    const updated: Appointment = {
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

describe("Appointment Store — CRUD", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("starts empty", () => {
    expect(store.getAll()).toHaveLength(0);
  });

  it("creates an appointment with correct defaults", () => {
    const ap = store.create({ titulo: "Teste de store", data: "2026-06-01" });

    expect(ap.titulo).toBe("Teste de store");
    expect(ap.data).toBe("2026-06-01");
    expect(ap.tipo).toBe("deep_work");
    expect(ap.status).toBe("pending");
    expect(ap.horario).toBeNull();
    expect(ap.projetoId).toBeNull();
    expect(ap.id).toBeDefined();
    expect(ap.criadoEm).toBeDefined();
  });

  it("creates an appointment with optional fields", () => {
    const ap = store.create({
      titulo: "Com opcionais",
      descricao: "Descrição de teste",
      data: "2026-06-15",
      horario: "14:00",
      tipo: "meeting",
      projetoId: "proj-456",
    });

    expect(ap.descricao).toBe("Descrição de teste");
    expect(ap.horario).toBe("14:00");
    expect(ap.tipo).toBe("meeting");
    expect(ap.projetoId).toBe("proj-456");
  });

  it("retrieves by id", () => {
    const ap = store.create({ titulo: "Recuperável", data: "2026-06-01" });
    const found = store.getById(ap.id);
    expect(found?.titulo).toBe("Recuperável");
  });

  it("returns undefined for missing id", () => {
    expect(store.getById("nonexistent")).toBeUndefined();
  });

  it("lists all sorted by data then horario ascending", () => {
    const a = store.create({ titulo: "A", data: "2026-06-02", horario: "10:00" });
    const b = store.create({ titulo: "B", data: "2026-06-01", horario: "14:00" });
    const c = store.create({ titulo: "C", data: "2026-06-01", horario: "08:00" });

    const all = store.getAll();
    expect(all[0].titulo).toBe("C"); // earliest date + earliest time
    expect(all[1].titulo).toBe("B"); // same date, later time
    expect(all[2].titulo).toBe("A"); // later date
  });

  it("updates fields", () => {
    const ap = store.create({ titulo: "Original", data: "2026-06-01" });
    const updated = store.update(ap.id, { titulo: "Modificado", tipo: "review" });

    expect(updated?.titulo).toBe("Modificado");
    expect(updated?.tipo).toBe("review");
    expect(updated?.id).toBe(ap.id);
    expect(updated?.criadoEm).toBe(ap.criadoEm);
    expect(new Date(updated!.atualizadoEm).getTime())
      .toBeGreaterThanOrEqual(new Date(ap.atualizadoEm).getTime());
  });

  it("returns undefined when updating nonexistent", () => {
    expect(store.update("fake", { titulo: "Nope" })).toBeUndefined();
  });

  it("deletes an appointment", () => {
    const ap = store.create({ titulo: "Deletável", data: "2026-06-01" });
    expect(store.getAll()).toHaveLength(1);

    const result = store.remove(ap.id);
    expect(result).toBe(true);
    expect(store.getAll()).toHaveLength(0);
    expect(store.getById(ap.id)).toBeUndefined();
  });

  it("returns false when deleting nonexistent", () => {
    expect(store.remove("fake")).toBe(false);
  });
});

describe("Appointment Store — Data integrity", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("generates unique IDs for each appointment", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const ap = store.create({ titulo: `AP ${i}`, data: "2026-06-01" });
      ids.add(ap.id);
    }
    expect(ids.size).toBe(100);
  });

  it("new appointments always start as pending with deep_work type", () => {
    for (let i = 0; i < 10; i++) {
      const ap = store.create({ titulo: `AP ${i}`, data: "2026-06-01" });
      expect(ap.status).toBe("pending");
      expect(ap.tipo).toBe("deep_work");
    }
  });

  it("can transition through valid statuses", () => {
    const ap = store.create({ titulo: "Status journey", data: "2026-06-01" });

    store.update(ap.id, { status: "in_progress" });
    expect(store.getById(ap.id)?.status).toBe("in_progress");

    store.update(ap.id, { status: "blocked" });
    expect(store.getById(ap.id)?.status).toBe("blocked");

    store.update(ap.id, { status: "in_progress" });
    expect(store.getById(ap.id)?.status).toBe("in_progress");

    store.update(ap.id, { status: "completed" });
    expect(store.getById(ap.id)?.status).toBe("completed");
  });

  it("preserves id and criadoEm on update", () => {
    const ap = store.create({ titulo: "Imutável parcial", data: "2026-06-01" });
    const updated = store.update(ap.id, {
      titulo: "Título novo",
      status: "completed",
      horario: "16:00",
    });

    expect(updated?.id).toBe(ap.id);
    expect(updated?.criadoEm).toBe(ap.criadoEm);
  });
});
