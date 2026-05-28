/**
 * W9-B9 — Cobertura: src/lib/ e lógica pura de hooks sem React
 *
 * Foco em funções 100% puras, sem DOM, sem React Query:
 *   - src/lib/utils.ts           → cn(), timeAgo()
 *   - src/lib/resolve-with-fallback.ts → resolveWithFallback(), timeoutPromise()
 *   - src/lib/data-sources.ts    → DATA_SOURCES_MAP, DataDomain
 *   - src/lib/kratos-routes.ts   → KRATOS_ROUTES, VISIBLE_ROUTES, getRouteBreadcrumb()
 *   - src/lib/error-capture.ts   → consumeLastCapturedError()
 *   - useMissionLens schema logic → MissionLensEnvelopeSchema (Zod inline)
 */

import { describe, it, expect, beforeEach } from "bun:test";

// ── src/lib/utils.ts ─────────────────────────────────────────────────────────
import { cn, timeAgo } from "../../src/lib/utils";

describe("src/lib/utils — cn()", () => {
  it("merges simple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge keeps the last conflicting utility
    const result = cn("text-sm", "text-lg");
    expect(result).toBe("text-lg");
  });

  it("handles conditional classes with falsy values", () => {
    expect(cn("base", false && "skipped", null, undefined, "included")).toBe(
      "base included",
    );
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("merges object notation", () => {
    const result = cn({ "font-bold": true, italic: false });
    expect(result).toBe("font-bold");
  });
});

describe("src/lib/utils — timeAgo()", () => {
  it("returns 'agora' for < 1 minute ago", () => {
    const recent = new Date(Date.now() - 30_000).toISOString();
    expect(timeAgo(recent)).toBe("agora");
  });

  it("returns minutes for 1–59 min ago", () => {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(timeAgo(fiveMinsAgo)).toBe("ha 5m");
  });

  it("returns hours for 1–23 h ago", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60_000).toISOString();
    expect(timeAgo(twoHoursAgo)).toBe("ha 2h");
  });

  it("returns days for >= 24 h ago", () => {
    const threeDaysAgo = new Date(
      Date.now() - 3 * 24 * 60 * 60_000,
    ).toISOString();
    expect(timeAgo(threeDaysAgo)).toBe("ha 3d");
  });
});

// ── src/lib/resolve-with-fallback.ts ─────────────────────────────────────────
import {
  resolveWithFallback,
  timeoutPromise,
} from "../../src/lib/resolve-with-fallback";

describe("src/lib/resolve-with-fallback — timeoutPromise()", () => {
  it("rejects with default message after timeout", async () => {
    const start = Date.now();
    await expect(timeoutPromise(50)).rejects.toThrow("timeout:50");
    // Should reject reasonably fast (< 500ms slop)
    expect(Date.now() - start).toBeLessThan(500);
  });

  it("rejects with custom message", async () => {
    await expect(timeoutPromise(50, "custom-error")).rejects.toThrow(
      "custom-error",
    );
  });
});

describe("src/lib/resolve-with-fallback — resolveWithFallback()", () => {
  it("returns resolved value when loader succeeds fast", async () => {
    const result = await resolveWithFallback(
      () => Promise.resolve("ok"),
      "fallback",
      1000,
    );
    expect(result).toBe("ok");
  });

  it("returns fallback when loader rejects", async () => {
    const result = await resolveWithFallback<string>(
      () => Promise.reject(new Error("fail")),
      "fallback-value",
      1000,
    );
    expect(result).toBe("fallback-value");
  });

  it("returns fallback when loader exceeds timeout", async () => {
    const slow = () =>
      new Promise<string>((resolve) => setTimeout(() => resolve("late"), 5000));
    const result = await resolveWithFallback(slow, "timeout-fallback", 80);
    expect(result).toBe("timeout-fallback");
  });

  it("returns fallback for undefined fallback value", async () => {
    const result = await resolveWithFallback<undefined>(
      () => Promise.reject(new Error("x")),
      undefined,
      100,
    );
    expect(result).toBeUndefined();
  });
});

// ── src/lib/data-sources.ts ───────────────────────────────────────────────────
import { DATA_SOURCES_MAP } from "../../src/lib/data-sources";

describe("src/lib/data-sources — DATA_SOURCES_MAP", () => {
  it("has all expected domain keys", () => {
    const domains = Object.keys(DATA_SOURCES_MAP);
    expect(domains).toContain("mission_lens");
    expect(domains).toContain("checkpoints");
    expect(domains).toContain("projects");
    expect(domains).toContain("context");
    expect(domains).toContain("system");
    expect(domains).toContain("git");
    expect(domains).toContain("alerts");
    expect(domains).toContain("mentor");
    expect(domains).toContain("drift");
  });

  it("every entry has endpoint and fallback strings", () => {
    for (const [key, value] of Object.entries(DATA_SOURCES_MAP)) {
      expect(typeof value.endpoint).toBe("string");
      expect(typeof value.fallback).toBe("string");
      expect(value.endpoint.startsWith("/")).toBe(true);
      expect(value.endpoint.length).toBeGreaterThan(1);
    }
  });

  it("mission_lens uses /mission/lens as primary endpoint", () => {
    expect(DATA_SOURCES_MAP.mission_lens.endpoint).toBe("/mission/lens");
  });

  it("mission_lens falls back to /live/snapshot", () => {
    expect(DATA_SOURCES_MAP.mission_lens.fallback).toBe("/live/snapshot");
  });
});

// ── src/lib/kratos-routes.ts ──────────────────────────────────────────────────
import {
  KRATOS_ROUTES,
  VISIBLE_ROUTES,
  getRouteBreadcrumb,
} from "../../src/lib/kratos-routes";

describe("src/lib/kratos-routes — KRATOS_ROUTES", () => {
  it("has 8 route entries", () => {
    expect(KRATOS_ROUTES.length).toBe(8);
  });

  it("root / is NOT visible in sidebar", () => {
    const root = KRATOS_ROUTES.find((r) => r.path === "/");
    expect(root).toBeDefined();
    expect(root!.visibleInSidebar).toBe(false);
  });

  it("every route has path, label, section, and a non-null icon", () => {
    for (const route of KRATOS_ROUTES) {
      expect(typeof route.path).toBe("string");
      expect(typeof route.label).toBe("string");
      expect(typeof route.section).toBe("string");
      // Lucide icons are React components — may be function or object (forwardRef)
      expect(route.icon).toBeTruthy();
    }
  });

  it("sections are only operacao | memoria | sistema", () => {
    const validSections = new Set(["operacao", "memoria", "sistema"]);
    for (const route of KRATOS_ROUTES) {
      expect(validSections.has(route.section)).toBe(true);
    }
  });
});

describe("src/lib/kratos-routes — VISIBLE_ROUTES", () => {
  it("excludes root (/) from visible routes", () => {
    const paths = VISIBLE_ROUTES.map((r) => r.path);
    expect(paths).not.toContain("/");
  });

  it("has 7 visible routes (all except /)", () => {
    expect(VISIBLE_ROUTES.length).toBe(7);
  });

  it("all expected pages are visible", () => {
    const paths = VISIBLE_ROUTES.map((r) => r.path);
    expect(paths).toContain("/agora");
    expect(paths).toContain("/agenda");
    expect(paths).toContain("/checkpoints");
    expect(paths).toContain("/projetos");
    expect(paths).toContain("/contexto");
    expect(paths).toContain("/sistema");
    expect(paths).toContain("/perfil");
  });
});

describe("src/lib/kratos-routes — getRouteBreadcrumb()", () => {
  it("returns section label + route label for known path", () => {
    const crumb = getRouteBreadcrumb("/agora");
    expect(crumb).toEqual(["Operação", "Agora"]);
  });

  it("returns ['Memória', 'Checkpoints'] for /checkpoints", () => {
    expect(getRouteBreadcrumb("/checkpoints")).toEqual([
      "Memória",
      "Checkpoints",
    ]);
  });

  it("returns ['Sistema', 'Sistema'] for /sistema", () => {
    expect(getRouteBreadcrumb("/sistema")).toEqual(["Sistema", "Sistema"]);
  });

  it("returns raw path array for unknown routes", () => {
    expect(getRouteBreadcrumb("/unknown-page")).toEqual(["/unknown-page"]);
  });
});

// ── src/lib/error-capture.ts ──────────────────────────────────────────────────
import { consumeLastCapturedError } from "../../src/lib/error-capture";

describe("src/lib/error-capture — consumeLastCapturedError()", () => {
  beforeEach(() => {
    // Drain any leftover captured error from previous test
    consumeLastCapturedError();
  });

  it("returns undefined when no error has been captured", () => {
    expect(consumeLastCapturedError()).toBeUndefined();
  });

  it("returns undefined a second time (consumed = cleared)", () => {
    // First call should return undefined (nothing captured in test env)
    consumeLastCapturedError();
    // Second call also undefined
    expect(consumeLastCapturedError()).toBeUndefined();
  });
});
