/**
 * W13 — Memory Search UI: unit tests for pure logic
 *
 * Scope:
 *  - ScoreBadge thresholds
 *  - Collection filtering
 *  - Mock collections shape
 *  - AkashaSearchResult schema validation
 *  - Debounce threshold (3 chars)
 *  - Token fixes (kratos-ok, kratos-warn used correctly)
 *
 * All tests are pure-logic — bun:test compatible.
 */

import { describe, it, expect } from "bun:test";
import {
  AkashaSearchResultSchema,
  AkashaSearchResponseSchema,
  AkashaCollectionSchema,
  AkashaCollectionsResponseSchema,
} from "../../api-contract/akasha.schema";

// ── Mirrored helpers ──────────────────────────────────────────────────────────

/** Mirrors ScoreBadge color logic from AkashaSearchPanel */
function scoreBadgeColor(score: number): "ok" | "warn" | "muted" {
  const pct = Math.round(score * 100);
  if (pct >= 85) return "ok";
  if (pct >= 60) return "warn";
  return "muted";
}

/** Mirrors vaultStatusColor from AkashaScreen */
function vaultStatusColor(status: "healthy" | "degraded" | "offline"): string {
  if (status === "healthy") return "var(--kratos-ok)";
  if (status === "degraded") return "var(--kratos-warn)";
  return "var(--kratos-critical)";
}

/** Search activation threshold (minimum chars for auto-search) */
const SEARCH_MIN_CHARS = 3;

function shouldAutoSearch(query: string): boolean {
  return query.trim().length >= SEARCH_MIN_CHARS;
}

// ── ScoreBadge thresholds ─────────────────────────────────────────────────────

describe("scoreBadgeColor", () => {
  it("returns ok for score >= 0.85", () => {
    expect(scoreBadgeColor(1.0)).toBe("ok");
    expect(scoreBadgeColor(0.85)).toBe("ok");
    expect(scoreBadgeColor(0.9)).toBe("ok");
  });

  it("returns warn for 0.60 <= score < 0.85", () => {
    expect(scoreBadgeColor(0.84)).toBe("warn");
    expect(scoreBadgeColor(0.60)).toBe("warn");
    expect(scoreBadgeColor(0.72)).toBe("warn");
  });

  it("returns muted for score < 0.60", () => {
    expect(scoreBadgeColor(0.59)).toBe("muted");
    expect(scoreBadgeColor(0.0)).toBe("muted");
    expect(scoreBadgeColor(0.3)).toBe("muted");
  });

  it("rounds to nearest integer for boundary test", () => {
    // 0.845 rounds to 85 → ok
    expect(scoreBadgeColor(0.845)).toBe("ok");
    // 0.844 rounds to 84 → warn
    expect(scoreBadgeColor(0.844)).toBe("warn");
  });
});

// ── vaultStatusColor (token fix verification) ─────────────────────────────────

describe("vaultStatusColor tokens", () => {
  it("uses --kratos-ok for healthy (not --kr-success)", () => {
    expect(vaultStatusColor("healthy")).toBe("var(--kratos-ok)");
    expect(vaultStatusColor("healthy")).not.toContain("--kr-success");
  });

  it("uses --kratos-warn for degraded (not --kr-warning)", () => {
    expect(vaultStatusColor("degraded")).toBe("var(--kratos-warn)");
    expect(vaultStatusColor("degraded")).not.toContain("--kr-warning");
  });

  it("uses --kratos-critical for offline", () => {
    expect(vaultStatusColor("offline")).toBe("var(--kratos-critical)");
  });
});

// ── Auto-search threshold ─────────────────────────────────────────────────────

describe("shouldAutoSearch", () => {
  it("activates at >= 3 chars", () => {
    expect(shouldAutoSearch("abc")).toBe(true);
    expect(shouldAutoSearch("akasha")).toBe(true);
    expect(shouldAutoSearch("estoicismo")).toBe(true);
  });

  it("does not activate at < 3 chars", () => {
    expect(shouldAutoSearch("")).toBe(false);
    expect(shouldAutoSearch("a")).toBe(false);
    expect(shouldAutoSearch("ab")).toBe(false);
  });

  it("trims whitespace before measuring length", () => {
    expect(shouldAutoSearch("  a  ")).toBe(false); // trim → "a" (1 char)
    expect(shouldAutoSearch(" abc ")).toBe(true);  // trim → "abc" (3 chars)
    expect(shouldAutoSearch("   ")).toBe(false);   // trim → "" (0 chars)
  });
});

// ── AkashaSearchResult schema ─────────────────────────────────────────────────

describe("AkashaSearchResultSchema", () => {
  it("validates a minimal valid result", () => {
    const valid = { id: "r-001", content: "Texto de resultado", score: 0.92 };
    expect(AkashaSearchResultSchema.safeParse(valid).success).toBe(true);
  });

  it("validates a full result with optional fields", () => {
    const full = {
      id: "r-002",
      content: "Resultado completo com metadados",
      score: 0.78,
      source: "livros/stoic.md",
      collection: "filosofia",
      metadata: { page: 42, book: "Meditações" },
    };
    expect(AkashaSearchResultSchema.safeParse(full).success).toBe(true);
  });

  it("rejects result with score > 1", () => {
    const invalid = { id: "bad", content: "x", score: 1.5 };
    expect(AkashaSearchResultSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects result with negative score", () => {
    const invalid = { id: "bad", content: "x", score: -0.1 };
    expect(AkashaSearchResultSchema.safeParse(invalid).success).toBe(false);
  });

  it("requires id and content", () => {
    expect(AkashaSearchResultSchema.safeParse({ score: 0.5 }).success).toBe(false);
    expect(AkashaSearchResultSchema.safeParse({ id: "x", score: 0.5 }).success).toBe(false);
  });
});

// ── AkashaSearchResponse schema ───────────────────────────────────────────────

describe("AkashaSearchResponseSchema", () => {
  it("validates a response with results", () => {
    const response = {
      results: [{ id: "r1", content: "Test", score: 0.85 }],
      query: "estoicismo",
      total: 1,
      latency_ms: 42,
    };
    expect(AkashaSearchResponseSchema.safeParse(response).success).toBe(true);
  });

  it("validates empty results", () => {
    const empty = { results: [], query: "nada", total: 0 };
    expect(AkashaSearchResponseSchema.safeParse(empty).success).toBe(true);
  });

  it("rejects missing query", () => {
    const bad = { results: [], total: 0 };
    expect(AkashaSearchResponseSchema.safeParse(bad).success).toBe(false);
  });

  it("latency_ms is optional", () => {
    const noLatency = { results: [], query: "q", total: 0 };
    const parsed = AkashaSearchResponseSchema.safeParse(noLatency);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.latency_ms).toBeUndefined();
    }
  });
});

// ── AkashaCollection schema ───────────────────────────────────────────────────

describe("AkashaCollectionSchema", () => {
  it("validates a minimal collection", () => {
    const col = { name: "filosofia", count: 1200 };
    expect(AkashaCollectionSchema.safeParse(col).success).toBe(true);
  });

  it("validates collection with description", () => {
    const col = { name: "negocios", count: 850, description: "Negócios e Estratégia" };
    expect(AkashaCollectionSchema.safeParse(col).success).toBe(true);
  });

  it("rejects negative count", () => {
    const bad = { name: "filosofia", count: -1 };
    expect(AkashaCollectionSchema.safeParse(bad).success).toBe(false);
  });

  it("requires name and count", () => {
    expect(AkashaCollectionSchema.safeParse({ name: "filosofia" }).success).toBe(false);
    expect(AkashaCollectionSchema.safeParse({ count: 100 }).success).toBe(false);
  });
});

// ── Mock collections ──────────────────────────────────────────────────────────

describe("mock collections", () => {
  const MOCK_COLLECTIONS = [
    { name: "filosofia",  count: 1_200 },
    { name: "negocios",   count:   850 },
    { name: "viagens",    count:   640 },
    { name: "saude",      count:   420 },
    { name: "tecnologia", count:   380 },
    { name: "projetos",   count:   290 },
  ];

  it("has exactly 6 collections", () => {
    expect(MOCK_COLLECTIONS).toHaveLength(6);
  });

  it("all collections have positive count", () => {
    for (const col of MOCK_COLLECTIONS) {
      expect(col.count).toBeGreaterThan(0);
    }
  });

  it("collections are sorted by count descending", () => {
    for (let i = 1; i < MOCK_COLLECTIONS.length; i++) {
      expect(MOCK_COLLECTIONS[i - 1]!.count).toBeGreaterThanOrEqual(MOCK_COLLECTIONS[i]!.count);
    }
  });

  it("all pass AkashaCollectionSchema validation", () => {
    for (const col of MOCK_COLLECTIONS) {
      expect(AkashaCollectionSchema.safeParse(col).success).toBe(true);
    }
  });

  it("all pass AkashaCollectionsResponseSchema wrapped", () => {
    const response = { collections: MOCK_COLLECTIONS };
    expect(AkashaCollectionsResponseSchema.safeParse(response).success).toBe(true);
  });
});

// ── Collection filter chip count limit ───────────────────────────────────────

describe("collection chips display limit", () => {
  const MAX_CHIPS = 6; // TDAH limit

  it("shows at most 6 collection chips", () => {
    const manyCollections = Array.from({ length: 20 }, (_, i) => ({
      name: `col-${i}`,
      count: 100 - i,
    }));
    const shown = manyCollections.slice(0, MAX_CHIPS);
    expect(shown).toHaveLength(6);
    expect(manyCollections.length).toBeGreaterThan(6);
  });

  it("shows all chips when collections <= 6", () => {
    const few = [{ name: "a", count: 1 }, { name: "b", count: 2 }];
    const shown = few.slice(0, MAX_CHIPS);
    expect(shown).toHaveLength(2);
  });
});

// ── Collection toggle logic ────────────────────────────────────────────────────

describe("collection toggle (deselect when same selected)", () => {
  function toggleCollection(
    current: string | undefined,
    clicked: string,
  ): string | undefined {
    return current === clicked ? undefined : clicked;
  }

  it("selects a collection when none selected", () => {
    expect(toggleCollection(undefined, "filosofia")).toBe("filosofia");
  });

  it("deselects when clicking the already-selected collection", () => {
    expect(toggleCollection("filosofia", "filosofia")).toBeUndefined();
  });

  it("switches to a different collection", () => {
    expect(toggleCollection("filosofia", "negocios")).toBe("negocios");
  });
});
