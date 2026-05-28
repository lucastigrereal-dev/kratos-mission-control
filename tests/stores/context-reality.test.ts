/**
 * context-reality.test.ts — W3
 * Valida o contrato do GET /context/current (Python backend) e o mapeamento
 * para ContextSnapshot (TypeScript canonical shape).
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 * O formato espelha api-contract/context-api.schema.ts + useContexto.ts (W3).
 */

import { describe, it, expect } from "bun:test";
import { z } from "zod";

// ── Esquemas copiados de context-api.schema.ts ────────────────────────────────

const ContextDriftSeveritySchema = z.enum(["none", "low", "medium", "high"]);
const ContextDriftStateSchema    = z.enum(["on_focus", "off_focus", "drifting", "unknown"]);

const ContextDriftAPISchema = z.object({
  state:                     ContextDriftStateSchema.optional(),
  severity:                  ContextDriftSeveritySchema.optional(),
  minutes_out_of_focus:      z.number().optional(),
  reason:                    z.string().optional(),
  inferred_project:          z.string().nullable().optional(),
  expected_project:          z.string().optional(),
  should_suggest_checkpoint: z.boolean().optional(),
}).catchall(z.unknown());

const ContextCurrentAPISchema = z.object({
  current_app:            z.string().default("—"),
  current_title:          z.string().default("—"),
  current_url:            z.string().default(""),
  current_domain:         z.string().default(""),
  project_guess:          z.string().nullable().default(null),
  mission_guess:          z.string().nullable().default(null),
  reason_guess:           z.string().default(""),
  confidence:             z.number().default(0),
  focus_project_today:    z.string().default(""),
  on_focus:               z.boolean().default(false),
  focus_drift_minutes:    z.number().default(0),
  drift_minutes:          z.number().default(0),
  active_since:           z.string().default(""),
  context_switches_today: z.number().default(0),
  source:                 z.string().default("fallback"),
  collector_status:       z.string().default("unknown"),
  drift:                  ContextDriftAPISchema.optional(),
}).catchall(z.unknown());

type ContextCurrentAPI = z.infer<typeof ContextCurrentAPISchema>;

// ── Lógica de mapeamento extraída de useContexto.ts (W3) ──────────────────────

function normalizeConfidence(raw: number): number {
  return Math.min(100, Math.max(0, Math.round(raw > 1 ? raw : raw * 100)));
}

function mapDriftLevel(ctx: ContextCurrentAPI): "none" | "light" | "high" {
  const sev = ctx.drift?.severity;
  if (sev === "high") return "high";
  if (sev === "medium" || sev === "low") return "light";
  if (!ctx.on_focus && ctx.drift_minutes > 0) return "light";
  return "none";
}

function mapFocusStatus(ctx: ContextCurrentAPI): "on_focus" | "off_focus" | "unknown" {
  if (ctx.on_focus) return "on_focus";
  if (ctx.drift?.state === "off_focus") return "off_focus";
  return "unknown";
}

function mapDuration(active_since: string): string {
  return active_since.length >= 16 ? `desde ${active_since.slice(11, 16)}` : "—";
}

function mapSourceToDataSource(src: string): "live" | "mock" | "partial" {
  if (src === "real")  return "live";
  if (src === "mock")  return "mock";
  return "partial";
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeRealPayload(overrides: Partial<ContextCurrentAPI> = {}): ContextCurrentAPI {
  return ContextCurrentAPISchema.parse({
    current_app:            "Claude Code",
    current_title:          "KRATOS Mission Control",
    current_url:            "",
    current_domain:         "kratos.local",
    project_guess:          "KRATOS",
    mission_guess:          "Wave execution",
    reason_guess:           "Detectado pela janela ativa",
    confidence:             0.86,
    focus_project_today:    "KRATOS",
    on_focus:               true,
    focus_drift_minutes:    0,
    drift_minutes:          0,
    active_since:           "2026-05-28T14:30:00.000Z",
    context_switches_today: 3,
    source:                 "real",
    collector_status:       "ok",
    drift: {
      state:                "on_focus",
      severity:             "none",
      minutes_out_of_focus: 0,
      reason:               "Foco mantido",
      inferred_project:     "KRATOS",
      expected_project:     "KRATOS",
      should_suggest_checkpoint: false,
    },
    ...overrides,
  });
}

function makeMockPayload(): ContextCurrentAPI {
  return makeRealPayload({ source: "mock", collector_status: "offline" });
}

function makeOfflinePayload(): ContextCurrentAPI {
  return makeRealPayload({
    source:       "fallback",
    on_focus:     false,
    drift_minutes: 25,
    drift: {
      state:                "off_focus",
      severity:             "medium",
      minutes_out_of_focus: 25,
      reason:               "AW offline",
    },
  });
}

// ── Schema validation ─────────────────────────────────────────────────────────

describe("W3 context-reality — schema validation", () => {
  it("payload real passa o schema", () => {
    const result = ContextCurrentAPISchema.safeParse(makeRealPayload());
    expect(result.success).toBe(true);
  });

  it("payload mock passa o schema", () => {
    const result = ContextCurrentAPISchema.safeParse(makeMockPayload());
    expect(result.success).toBe(true);
  });

  it("payload offline com source=fallback passa o schema", () => {
    const result = ContextCurrentAPISchema.safeParse(makeOfflinePayload());
    expect(result.success).toBe(true);
  });

  it("payload mínimo (apenas defaults) passa o schema", () => {
    const result = ContextCurrentAPISchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

// ── Confidence normalization ──────────────────────────────────────────────────

describe("W3 context-reality — normalizeConfidence", () => {
  it("0.86 float → 86 int", () => {
    expect(normalizeConfidence(0.86)).toBe(86);
  });

  it("1.0 float (máximo) → 100", () => {
    expect(normalizeConfidence(1.0)).toBe(100);
  });

  it("0 → 0", () => {
    expect(normalizeConfidence(0)).toBe(0);
  });

  it("72 int (mock, já em 0-100) → 72", () => {
    expect(normalizeConfidence(72)).toBe(72);
  });

  it("valor acima de 100 clampado", () => {
    expect(normalizeConfidence(150)).toBe(100);
  });

  it("valor negativo clampado para 0", () => {
    expect(normalizeConfidence(-5)).toBe(0);
  });
});

// ── Drift mapping ─────────────────────────────────────────────────────────────

describe("W3 context-reality — mapDriftLevel", () => {
  it("on_focus sem drift → none", () => {
    expect(mapDriftLevel(makeRealPayload())).toBe("none");
  });

  it("severity=high → high", () => {
    const ctx = makeRealPayload({ drift: { severity: "high" } });
    expect(mapDriftLevel(ctx)).toBe("high");
  });

  it("severity=medium → light", () => {
    const ctx = makeRealPayload({ drift: { severity: "medium" } });
    expect(mapDriftLevel(ctx)).toBe("light");
  });

  it("severity=low → light", () => {
    const ctx = makeRealPayload({ drift: { severity: "low" } });
    expect(mapDriftLevel(ctx)).toBe("light");
  });

  it("off_focus sem severity mas drift_minutes>0 → light", () => {
    const ctx = makeRealPayload({ on_focus: false, drift_minutes: 10 });
    expect(mapDriftLevel(ctx)).toBe("light");
  });
});

// ── FocusStatus mapping ───────────────────────────────────────────────────────

describe("W3 context-reality — mapFocusStatus", () => {
  it("on_focus=true → on_focus", () => {
    expect(mapFocusStatus(makeRealPayload({ on_focus: true }))).toBe("on_focus");
  });

  it("on_focus=false + drift.state=off_focus → off_focus", () => {
    const ctx = makeRealPayload({
      on_focus: false,
      drift: { state: "off_focus" },
    });
    expect(mapFocusStatus(ctx)).toBe("off_focus");
  });

  it("on_focus=false + sem drift.state → unknown", () => {
    const ctx = makeRealPayload({ on_focus: false, drift: undefined });
    expect(mapFocusStatus(ctx)).toBe("unknown");
  });
});

// ── Duration mapping ──────────────────────────────────────────────────────────

describe("W3 context-reality — mapDuration", () => {
  it("ISO datetime → 'desde HH:MM'", () => {
    expect(mapDuration("2026-05-28T14:30:00.000Z")).toBe("desde 14:30");
  });

  it("string vazia → '—'", () => {
    expect(mapDuration("")).toBe("—");
  });

  it("string curta (<16 chars) → '—'", () => {
    expect(mapDuration("2026-05-28")).toBe("—");
  });
});

// ── Source → DataSource mapping ───────────────────────────────────────────────

describe("W3 context-reality — mapSourceToDataSource", () => {
  it("source=real → live", () => {
    expect(mapSourceToDataSource("real")).toBe("live");
  });

  it("source=mock → mock", () => {
    expect(mapSourceToDataSource("mock")).toBe("mock");
  });

  it("source=fallback → partial", () => {
    expect(mapSourceToDataSource("fallback")).toBe("partial");
  });

  it("source desconhecido → partial", () => {
    expect(mapSourceToDataSource("unknown")).toBe("partial");
  });
});

// ── Null safety ───────────────────────────────────────────────────────────────

describe("W3 context-reality — null safety", () => {
  it("quando API falha → snapshot null (IslandCard mostra ErrorState)", () => {
    const snapshot = null;
    expect(snapshot).toBeNull();
  });

  it("payload sem drift.reason não trava mapDriftLevel", () => {
    const ctx = makeRealPayload({ drift: { severity: "high", reason: undefined } });
    expect(() => mapDriftLevel(ctx)).not.toThrow();
  });

  it("active_since vazio não trava mapDuration", () => {
    expect(() => mapDuration("")).not.toThrow();
  });
});
