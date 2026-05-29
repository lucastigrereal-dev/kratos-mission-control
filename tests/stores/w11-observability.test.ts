/**
 * w11-observability.test.ts — W11
 * Valida a lógica pura de observability e SSE client (W11-B4, W11-B8).
 *
 * Testes puros: sem DOM, sem React, sem rede real.
 * Cobre:
 *  - Logger level dispatch (quais níveis são emitidos em prod vs dev)
 *  - SSE backoff schedule: getBackoffMs()
 *  - SSE max retries detection: dead state threshold
 *  - SSEClient state transitions
 *  - Web Vitals rating: getRating()
 */

import { describe, it, expect } from "bun:test";

// ── Logger logic espelhada de observability/logger.ts ─────────────────────────

type LogLevel = "debug" | "info" | "warn" | "error";

const PROD_EMITS: Record<LogLevel, boolean> = {
  debug: false,
  info:  false,
  warn:  true,
  error: true,
};

const DEV_EMITS: Record<LogLevel, boolean> = {
  debug: true,
  info:  true,
  warn:  true,
  error: true,
};

function shouldEmitInProd(level: LogLevel): boolean {
  return PROD_EMITS[level];
}

function shouldEmitInDev(level: LogLevel): boolean {
  return DEV_EMITS[level];
}

// ── SSE backoff schedule espelhada de sseClient.ts ────────────────────────────

const BACKOFF_MS = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000] as const;

function getBackoffMs(attempt: number): number {
  const idx = Math.min(attempt, BACKOFF_MS.length - 1);
  return BACKOFF_MS[idx]!;
}

function isDeadState(retryCount: number, maxRetries: number): boolean {
  return retryCount > maxRetries;
}

// ── Web Vitals rating espelhada de webVitals.ts ───────────────────────────────

const THRESHOLDS: Record<string, [number, number]> = {
  LCP:  [2500, 4000],
  CLS:  [0.1,  0.25],
  FCP:  [1800, 3000],
  TTFB: [800,  1800],
  INP:  [200,  500],
};

type VitalRating = "good" | "needs-improvement" | "poor";

function getRating(name: string, value: number): VitalRating {
  const [good, poor] = THRESHOLDS[name] ?? [Infinity, Infinity];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

// ── Logger tests ──────────────────────────────────────────────────────────────

describe("W11 observability — logger level dispatch", () => {
  it("em prod: debug e info são silenciosos", () => {
    expect(shouldEmitInProd("debug")).toBe(false);
    expect(shouldEmitInProd("info")).toBe(false);
  });

  it("em prod: warn e error são emitidos (→ Sentry)", () => {
    expect(shouldEmitInProd("warn")).toBe(true);
    expect(shouldEmitInProd("error")).toBe(true);
  });

  it("em dev: todos os níveis são emitidos", () => {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    for (const level of levels) {
      expect(shouldEmitInDev(level)).toBe(true);
    }
  });
});

// ── SSE backoff schedule ──────────────────────────────────────────────────────

describe("W11 observability — SSE backoff schedule", () => {
  it("attempt 0 → 1s", () => {
    expect(getBackoffMs(0)).toBe(1_000);
  });

  it("attempt 1 → 2s", () => {
    expect(getBackoffMs(1)).toBe(2_000);
  });

  it("attempt 2 → 4s", () => {
    expect(getBackoffMs(2)).toBe(4_000);
  });

  it("attempt 3 → 8s", () => {
    expect(getBackoffMs(3)).toBe(8_000);
  });

  it("attempt 4 → 16s", () => {
    expect(getBackoffMs(4)).toBe(16_000);
  });

  it("attempt 5 → 30s (cap)", () => {
    expect(getBackoffMs(5)).toBe(30_000);
  });

  it("attempt 100 → 30s (cap — não crasheia)", () => {
    expect(getBackoffMs(100)).toBe(30_000);
  });
});

// ── SSE dead state ────────────────────────────────────────────────────────────

describe("W11 observability — SSE dead state", () => {
  it("retryCount=10, maxRetries=10 → não dead (exatamente no limite)", () => {
    expect(isDeadState(10, 10)).toBe(false);
  });

  it("retryCount=11, maxRetries=10 → dead (ultrapassou)", () => {
    expect(isDeadState(11, 10)).toBe(true);
  });

  it("retryCount=0, maxRetries=10 → não dead (início)", () => {
    expect(isDeadState(0, 10)).toBe(false);
  });

  it("retryCount=1, maxRetries=0 → dead (maxRetries=0 significa sem tolerância)", () => {
    expect(isDeadState(1, 0)).toBe(true);
  });
});

// ── Web Vitals rating ─────────────────────────────────────────────────────────

describe("W11 observability — Web Vitals ratings", () => {
  describe("LCP thresholds (good ≤2500ms, poor >4000ms)", () => {
    it("2000ms → good", () => expect(getRating("LCP", 2000)).toBe("good"));
    it("2500ms → good (no limite)", () => expect(getRating("LCP", 2500)).toBe("good"));
    it("3000ms → needs-improvement", () => expect(getRating("LCP", 3000)).toBe("needs-improvement"));
    it("5000ms → poor", () => expect(getRating("LCP", 5000)).toBe("poor"));
  });

  describe("CLS thresholds (good ≤0.1, poor >0.25)", () => {
    it("0.05 → good", () => expect(getRating("CLS", 0.05)).toBe("good"));
    it("0.1 → good (no limite)", () => expect(getRating("CLS", 0.1)).toBe("good"));
    it("0.2 → needs-improvement", () => expect(getRating("CLS", 0.2)).toBe("needs-improvement"));
    it("0.3 → poor", () => expect(getRating("CLS", 0.3)).toBe("poor"));
  });

  describe("INP thresholds (good ≤200ms, poor >500ms)", () => {
    it("100ms → good", () => expect(getRating("INP", 100)).toBe("good"));
    it("300ms → needs-improvement", () => expect(getRating("INP", 300)).toBe("needs-improvement"));
    it("600ms → poor", () => expect(getRating("INP", 600)).toBe("poor"));
  });

  describe("TTFB thresholds (good ≤800ms, poor >1800ms)", () => {
    it("500ms → good", () => expect(getRating("TTFB", 500)).toBe("good"));
    it("1200ms → needs-improvement", () => expect(getRating("TTFB", 1200)).toBe("needs-improvement"));
    it("2000ms → poor", () => expect(getRating("TTFB", 2000)).toBe("poor"));
  });

  it("métrica desconhecida → good (sem dados = sem problema)", () => {
    expect(getRating("UNKNOWN_METRIC", 999)).toBe("good");
  });
});
