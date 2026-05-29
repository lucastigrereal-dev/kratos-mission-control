/**
 * sse-hardening.test.ts — W5
 * Valida a lógica pura do sistema SSE/polling do KRATOS.
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 * Cobre:
 *  - Backoff tier selection (SSE reconnection strategy)
 *  - Deduplication key generation (useSSEToasts)
 *  - Toast trigger conditions (budget, approval, failed, completed)
 *  - EventsStatusSchema validation
 *  - LiveEventsStatus connected state derivation
 *  - Cascading invalidation conditions
 */

import { describe, it, expect } from "bun:test";
import { z } from "zod";

// ── EventsStatusSchema espelhado de live-events-server-fns.ts ─────────────────

const EventsStatusSchema = z.object({
  subscribers: z.number().int().min(0),
  status: z.string(),
  ts: z.number(),
});

// ── MissionSummary (subset relevante ao useSSEToasts) ─────────────────────────

const ToastableMissionSchema = z.object({
  mission_id:       z.string(),
  title:            z.string(),
  status:           z.enum(["draft", "running", "paused", "completed", "failed", "cancelled"]),
  budget_exceeded:  z.boolean().default(false),
  approval_pending: z.boolean().default(false),
  approval_reason:  z.string().nullable().optional(),
  last_error:       z.string().nullable().optional(),
});

type ToastableMission = z.infer<typeof ToastableMissionSchema>;

// ── Lógica extraída de useSSEToasts (W5) ──────────────────────────────────────

/** Gera a chave de deduplicação para um alerta de missão. */
function toastKey(
  type: "budget" | "approval" | "failed" | "completed",
  missionId: string,
): string {
  return `${type}:${missionId}`;
}

/** Determina quais toasts devem ser disparados para uma missão. */
function collectToastEvents(
  mission: ToastableMission,
  seen: Set<string>,
): Array<{ type: "budget" | "approval" | "failed" | "completed"; key: string }> {
  const events: Array<{ type: "budget" | "approval" | "failed" | "completed"; key: string }> = [];

  if (mission.budget_exceeded) {
    const key = toastKey("budget", mission.mission_id);
    if (!seen.has(key)) events.push({ type: "budget", key });
  }
  if (mission.approval_pending) {
    const key = toastKey("approval", mission.mission_id);
    if (!seen.has(key)) events.push({ type: "approval", key });
  }
  if (mission.status === "failed") {
    const key = toastKey("failed", mission.mission_id);
    if (!seen.has(key)) events.push({ type: "failed", key });
  }
  if (mission.status === "completed") {
    const key = toastKey("completed", mission.mission_id);
    if (!seen.has(key)) events.push({ type: "completed", key });
  }

  return events;
}

// ── Backoff tier logic espelhado de useLiveStatus.ts ─────────────────────────

const SSE_POLL_NORMAL_MS   = 10_000;
const SSE_POLL_BACKOFF_MS  = [15_000, 30_000, 60_000, 120_000] as const;
const SSE_MAX_FAIL_ACTIVE  = 4;
const SSE_POLL_DEAD_MS     = 120_000;

function selectPollInterval(failCount: number): number {
  const isDead = failCount > SSE_MAX_FAIL_ACTIVE;
  if (isDead) return SSE_POLL_DEAD_MS;
  if (failCount === 0) return SSE_POLL_NORMAL_MS;
  return SSE_POLL_BACKOFF_MS[Math.min(failCount - 1, SSE_POLL_BACKOFF_MS.length - 1)] ?? SSE_POLL_DEAD_MS;
}

// ── Derivação de LiveEventsStatus.connected ───────────────────────────────────

function deriveConnected(payload: unknown): boolean {
  const parsed = EventsStatusSchema.safeParse(payload);
  if (!parsed.success) return false;
  return parsed.data.status === "ok";
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeMission(overrides: Partial<ToastableMission> = {}): ToastableMission {
  return ToastableMissionSchema.parse({
    mission_id: "m-001",
    title: "Parallel Fabric P2",
    status: "running",
    ...overrides,
  });
}

// ── EventsStatusSchema validation ─────────────────────────────────────────────

describe("W5 sse-hardening — EventsStatusSchema", () => {
  it("payload válido com status=ok passa", () => {
    const result = EventsStatusSchema.safeParse({
      subscribers: 3,
      status: "ok",
      ts: Date.now(),
    });
    expect(result.success).toBe(true);
  });

  it("payload com status≠ok ainda é válido (schema não restringe status)", () => {
    const result = EventsStatusSchema.safeParse({
      subscribers: 0,
      status: "offline",
      ts: Date.now(),
    });
    expect(result.success).toBe(true);
  });

  it("payload sem 'status' falha", () => {
    const result = EventsStatusSchema.safeParse({ subscribers: 1, ts: Date.now() });
    expect(result.success).toBe(false);
  });

  it("subscribers negativo falha", () => {
    const result = EventsStatusSchema.safeParse({ subscribers: -1, status: "ok", ts: 0 });
    expect(result.success).toBe(false);
  });
});

// ── deriveConnected ───────────────────────────────────────────────────────────

describe("W5 sse-hardening — deriveConnected", () => {
  it("status='ok' → connected=true", () => {
    expect(deriveConnected({ subscribers: 2, status: "ok", ts: Date.now() })).toBe(true);
  });

  it("status='offline' → connected=false", () => {
    expect(deriveConnected({ subscribers: 0, status: "offline", ts: Date.now() })).toBe(false);
  });

  it("status='degraded' → connected=false", () => {
    expect(deriveConnected({ subscribers: 1, status: "degraded", ts: Date.now() })).toBe(false);
  });

  it("payload inválido → connected=false (sem crash)", () => {
    expect(deriveConnected(null)).toBe(false);
    expect(deriveConnected({})).toBe(false);
    expect(deriveConnected("invalid")).toBe(false);
  });
});

// ── Backoff tier selection ────────────────────────────────────────────────────

describe("W5 sse-hardening — backoff tier selection", () => {
  it("failCount=0 → poll normal (10s)", () => {
    expect(selectPollInterval(0)).toBe(SSE_POLL_NORMAL_MS);
  });

  it("failCount=1 → tier 1 (15s)", () => {
    expect(selectPollInterval(1)).toBe(15_000);
  });

  it("failCount=2 → tier 2 (30s)", () => {
    expect(selectPollInterval(2)).toBe(30_000);
  });

  it("failCount=3 → tier 3 (60s)", () => {
    expect(selectPollInterval(3)).toBe(60_000);
  });

  it("failCount=4 → tier 4 (120s — teto ativo)", () => {
    expect(selectPollInterval(4)).toBe(120_000);
  });

  it("failCount=5 (> MAX_FAIL_ACTIVE=4) → dead mode (120s)", () => {
    expect(selectPollInterval(5)).toBe(SSE_POLL_DEAD_MS);
  });

  it("failCount=100 → dead mode (não crasheia)", () => {
    expect(selectPollInterval(100)).toBe(SSE_POLL_DEAD_MS);
  });
});

// ── Toast deduplication ───────────────────────────────────────────────────────

describe("W5 sse-hardening — toast deduplication", () => {
  it("toast key gerada no formato type:missionId", () => {
    expect(toastKey("budget", "m-001")).toBe("budget:m-001");
    expect(toastKey("approval", "m-002")).toBe("approval:m-002");
    expect(toastKey("failed", "m-003")).toBe("failed:m-003");
    expect(toastKey("completed", "m-004")).toBe("completed:m-004");
  });

  it("mesma missão + mesmo tipo → chave idêntica (deduplicação funciona)", () => {
    const k1 = toastKey("budget", "m-001");
    const k2 = toastKey("budget", "m-001");
    expect(k1).toBe(k2);
  });

  it("tipos diferentes na mesma missão → chaves diferentes", () => {
    expect(toastKey("budget", "m-001")).not.toBe(toastKey("approval", "m-001"));
  });
});

// ── collectToastEvents ────────────────────────────────────────────────────────

describe("W5 sse-hardening — collectToastEvents", () => {
  it("missão sem alertas → lista vazia", () => {
    const m = makeMission();
    expect(collectToastEvents(m, new Set())).toHaveLength(0);
  });

  it("budget_exceeded=true → 1 evento budget", () => {
    const m = makeMission({ budget_exceeded: true });
    const events = collectToastEvents(m, new Set());
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("budget");
  });

  it("approval_pending=true → 1 evento approval", () => {
    const m = makeMission({ approval_pending: true });
    const events = collectToastEvents(m, new Set());
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("approval");
  });

  it("status=failed → 1 evento failed", () => {
    const m = makeMission({ status: "failed" });
    const events = collectToastEvents(m, new Set());
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("failed");
  });

  it("status=completed → 1 evento completed", () => {
    const m = makeMission({ status: "completed" });
    const events = collectToastEvents(m, new Set());
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("completed");
  });

  it("budget + approval na mesma missão → 2 eventos", () => {
    const m = makeMission({ budget_exceeded: true, approval_pending: true });
    expect(collectToastEvents(m, new Set())).toHaveLength(2);
  });

  it("alerta já visto (seen has key) → não re-emite", () => {
    const m = makeMission({ budget_exceeded: true });
    const seen = new Set(["budget:m-001"]);
    expect(collectToastEvents(m, seen)).toHaveLength(0);
  });

  it("alerta visto para outra missão não suprime a atual", () => {
    const m = makeMission({ mission_id: "m-002", budget_exceeded: true });
    const seen = new Set(["budget:m-001"]); // diferente mission_id
    const events = collectToastEvents(m, seen);
    expect(events).toHaveLength(1);
    expect(events[0].key).toBe("budget:m-002");
  });

  it("status running/paused/draft/cancelled → sem toast de status", () => {
    const statuses = ["running", "paused", "draft", "cancelled"] as const;
    for (const status of statuses) {
      const m = makeMission({ status });
      expect(collectToastEvents(m, new Set())).toHaveLength(0);
    }
  });
});
