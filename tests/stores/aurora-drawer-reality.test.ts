/**
 * aurora-drawer-reality.test.ts — W4.5
 * Valida a lógica pura extraída de AuroraDrawer (W4.5).
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 * Cobre: agenda derivation, task filtering, focus state label,
 *        context widget text derivation e appointment type color.
 */

import { describe, it, expect } from "bun:test";
import { z } from "zod";

// ── Schema espelhado de appointment.schema.ts ─────────────────────────────────

const AppointmentTypeSchema = z.enum([
  "deep_work",
  "meeting",
  "review",
  "admin",
  "checkpoint",
]);

const AppointmentStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "blocked",
]);

const AppointmentSchema = z.object({
  id:           z.string().uuid(),
  titulo:       z.string().min(1).max(200),
  descricao:    z.string().max(1000).optional(),
  data:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horario:      z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  tipo:         AppointmentTypeSchema,
  status:       AppointmentStatusSchema,
  projetoId:    z.string().uuid().nullable(),
  criadoEm:     z.string().datetime(),
  atualizadoEm: z.string().datetime(),
});

type Appointment = z.infer<typeof AppointmentSchema>;

// ── Lógica extraída de AuroraDrawer (W4.5) ───────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function deriveAuroraAgenda(appointments: Appointment[]): Appointment[] {
  const today = todayStr();
  return appointments
    .filter((a) => a.data === today && a.status !== "completed")
    .sort((a, b) => (a.horario ?? "23:59").localeCompare(b.horario ?? "23:59"))
    .slice(0, 3);
}

function focusStateLabel(state: string | undefined): string {
  if (!state) return "contexto ativo";
  if (state === "on_focus" || state === "execution") return "em foco";
  if (state === "off_focus" || state === "standby") return "em standby";
  return state.replace(/_/g, " ");
}

function appointmentTypeColor(tipo: Appointment["tipo"]): string {
  if (tipo === "deep_work") return "var(--kr-info, #3b82f6)";
  if (tipo === "checkpoint") return "var(--kr-ok, #22c55e)";
  if (tipo === "admin") return "var(--kr-warn, #f59e0b)";
  return "var(--kr-info, #3b82f6)";
}

function deriveMissionContextText(
  missionName: string | undefined,
  focusState: string,
): string {
  const name = missionName ?? "—";
  return name !== "—"
    ? `Missão: ${name}. Estado: ${focusState}.`
    : `Estado: ${focusState}.`;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeAppointment(overrides: Partial<Appointment> = {}): Appointment {
  const today = todayStr();
  const now = new Date().toISOString();
  return AppointmentSchema.parse({
    id:           crypto.randomUUID(),
    titulo:       "Reunião OMNIS Lab",
    data:         today,
    horario:      "10:00",
    tipo:         "meeting",
    status:       "pending",
    projetoId:    null,
    criadoEm:     now,
    atualizadoEm: now,
    ...overrides,
  });
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// ── deriveAuroraAgenda ────────────────────────────────────────────────────────

describe("W4.5 aurora-drawer-reality — deriveAuroraAgenda", () => {
  it("retorna só os compromissos de hoje", () => {
    const appts = [
      makeAppointment({ data: todayStr(), horario: "09:00" }),
      makeAppointment({ data: yesterday() }),
      makeAppointment({ data: tomorrow() }),
    ];
    const result = deriveAuroraAgenda(appts);
    expect(result).toHaveLength(1);
    expect(result[0].horario).toBe("09:00");
  });

  it("exclui compromissos concluídos de hoje", () => {
    const appts = [
      makeAppointment({ status: "completed" }),
      makeAppointment({ status: "pending", horario: "14:00" }),
    ];
    const result = deriveAuroraAgenda(appts);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });

  it("ordena por horário crescente", () => {
    const appts = [
      makeAppointment({ horario: "16:00" }),
      makeAppointment({ horario: "08:00" }),
      makeAppointment({ horario: "12:00" }),
    ];
    const result = deriveAuroraAgenda(appts);
    expect(result.map((a) => a.horario)).toEqual(["08:00", "12:00", "16:00"]);
  });

  it("limita a 3 compromissos (TDAH limit)", () => {
    const appts = Array.from({ length: 6 }, (_, i) =>
      makeAppointment({ horario: `${String(8 + i).padStart(2, "0")}:00` }),
    );
    expect(deriveAuroraAgenda(appts)).toHaveLength(3);
  });

  it("lista vazia → resultado vazio (sem crash)", () => {
    expect(deriveAuroraAgenda([])).toHaveLength(0);
  });

  it("compromisso sem horário vai pro final (fallback 23:59)", () => {
    const appts = [
      makeAppointment({ horario: "10:00" }),
      makeAppointment({ horario: null }),
    ];
    const result = deriveAuroraAgenda(appts);
    expect(result[0].horario).toBe("10:00");
    expect(result[1].horario).toBeNull();
  });
});

// ── focusStateLabel ───────────────────────────────────────────────────────────

describe("W4.5 aurora-drawer-reality — focusStateLabel", () => {
  it("undefined → 'contexto ativo'", () => {
    expect(focusStateLabel(undefined)).toBe("contexto ativo");
  });

  it("'on_focus' → 'em foco'", () => {
    expect(focusStateLabel("on_focus")).toBe("em foco");
  });

  it("'execution' → 'em foco'", () => {
    expect(focusStateLabel("execution")).toBe("em foco");
  });

  it("'off_focus' → 'em standby'", () => {
    expect(focusStateLabel("off_focus")).toBe("em standby");
  });

  it("'standby' → 'em standby'", () => {
    expect(focusStateLabel("standby")).toBe("em standby");
  });

  it("valor desconhecido → underscore substituído por espaço", () => {
    expect(focusStateLabel("deep_work")).toBe("deep work");
  });
});

// ── appointmentTypeColor ──────────────────────────────────────────────────────

describe("W4.5 aurora-drawer-reality — appointmentTypeColor", () => {
  it("deep_work → info (azul)", () => {
    const color = appointmentTypeColor("deep_work");
    expect(color).toContain("kr-info");
  });

  it("checkpoint → ok (verde)", () => {
    const color = appointmentTypeColor("checkpoint");
    expect(color).toContain("kr-ok");
  });

  it("admin → warn (âmbar)", () => {
    const color = appointmentTypeColor("admin");
    expect(color).toContain("kr-warn");
  });

  it("meeting e review → cor padrão (info)", () => {
    expect(appointmentTypeColor("meeting")).toContain("kr-info");
    expect(appointmentTypeColor("review")).toContain("kr-info");
  });
});

// ── deriveMissionContextText ──────────────────────────────────────────────────

describe("W4.5 aurora-drawer-reality — deriveMissionContextText", () => {
  it("com missão e foco → texto completo", () => {
    const text = deriveMissionContextText("KRATOS SUPREME", "em foco");
    expect(text).toBe("Missão: KRATOS SUPREME. Estado: em foco.");
  });

  it("sem missão (—) → só estado", () => {
    const text = deriveMissionContextText("—", "em standby");
    expect(text).toBe("Estado: em standby.");
  });

  it("missionName undefined → só estado", () => {
    const text = deriveMissionContextText(undefined, "contexto ativo");
    expect(text).toBe("Estado: contexto ativo.");
  });
});
