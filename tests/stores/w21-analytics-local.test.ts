/**
 * W21 — Analytics Local Tests
 * Testa: schema, mock dataset, adapter, rankings, alertas, OAuth slot
 * Zero OAuth. Zero Meta API. Zero chamadas externas.
 */

import { describe, it, expect } from "bun:test";
import {
  FullPageMetricsSchema,
  AnalyticsSourceSchema,
  PagesComparisonSchema,
  AnalyticsAlertSchema,
  MetaOAuthSlotSchema,
  SAMPLE_PAGE_METRICS,
  SAMPLE_TOTALS,
  SAMPLE_ALERTS,
  META_OAUTH_SLOT,
} from "../../api-contract/analytics.schema";
import {
  MockMetaAnalyticsAdapter,
  LiveMetaAnalyticsAdapter,
  createMetaAnalyticsAdapter,
} from "../../src/lib/meta-analytics-adapter";
import { PAGE_SLUGS } from "../../api-contract/marketing.schema";

// ── Schema Tests ──────────────────────────────────────────────────────────────

describe("AnalyticsSourceSchema", () => {
  it("aceita todos os sources válidos", () => {
    for (const src of ["live_meta", "sample_data", "mock", "cache", "unavailable"] as const) {
      expect(AnalyticsSourceSchema.safeParse(src).success).toBe(true);
    }
  });

  it("rejeita source inválido", () => {
    expect(AnalyticsSourceSchema.safeParse("instagram_real").success).toBe(false);
  });
});

describe("FullPageMetricsSchema", () => {
  it("valida todas as 6 páginas de SAMPLE_PAGE_METRICS", () => {
    for (const slug of PAGE_SLUGS) {
      const r = FullPageMetricsSchema.safeParse(SAMPLE_PAGE_METRICS[slug]);
      expect(r.success).toBe(true);
    }
  });

  it("engagement_rate deve estar entre 0 e 1", () => {
    for (const slug of PAGE_SLUGS) {
      const m = SAMPLE_PAGE_METRICS[slug];
      expect(m.engagement_rate).toBeGreaterThan(0);
      expect(m.engagement_rate).toBeLessThanOrEqual(1);
    }
  });

  it("cpm_kratos é sempre menor que cpm_meta_ads", () => {
    for (const slug of PAGE_SLUGS) {
      const m = SAMPLE_PAGE_METRICS[slug];
      expect(m.cpm_kratos).toBeLessThan(m.cpm_meta_ads);
    }
  });

  it("cpm_savings_pct é maior que 90% para todas as páginas", () => {
    for (const slug of PAGE_SLUGS) {
      expect(SAMPLE_PAGE_METRICS[slug].cpm_savings_pct).toBeGreaterThan(90);
    }
  });

  it("todos têm source: sample_data", () => {
    for (const slug of PAGE_SLUGS) {
      expect(SAMPLE_PAGE_METRICS[slug].source).toBe("sample_data");
    }
  });

  it("followers são positivos", () => {
    for (const slug of PAGE_SLUGS) {
      expect(SAMPLE_PAGE_METRICS[slug].followers).toBeGreaterThan(0);
    }
  });
});

describe("MetaOAuthSlotSchema", () => {
  it("valida META_OAUTH_SLOT", () => {
    const r = MetaOAuthSlotSchema.safeParse(META_OAUTH_SLOT);
    expect(r.success).toBe(true);
  });

  it("configured é sempre false", () => {
    expect(META_OAUTH_SLOT.configured).toBe(false);
  });

  it("required_env_vars inclui META_APP_ID", () => {
    expect(META_OAUTH_SLOT.required_env_vars).toContain("META_APP_ID");
  });

  it("required_env_vars inclui META_APP_SECRET", () => {
    expect(META_OAUTH_SLOT.required_env_vars).toContain("META_APP_SECRET");
  });

  it("status é not_configured", () => {
    expect(META_OAUTH_SLOT.status).toBe("not_configured");
  });
});

// ── SAMPLE_TOTALS ─────────────────────────────────────────────────────────────

describe("SAMPLE_TOTALS", () => {
  it("total_followers é soma correta das 6 páginas", () => {
    const expected = PAGE_SLUGS.reduce((acc, slug) => acc + SAMPLE_PAGE_METRICS[slug].followers, 0);
    expect(SAMPLE_TOTALS.total_followers).toBe(expected);
  });

  it("total_followers é maior que 2.5M", () => {
    expect(SAMPLE_TOTALS.total_followers).toBeGreaterThan(2_500_000);
  });

  it("total_reach_30d é maior que 1M", () => {
    expect(SAMPLE_TOTALS.total_reach_30d).toBeGreaterThan(1_000_000);
  });

  it("avg_engagement_rate está entre 0.03 e 0.10", () => {
    expect(SAMPLE_TOTALS.avg_engagement_rate).toBeGreaterThan(0.03);
    expect(SAMPLE_TOTALS.avg_engagement_rate).toBeLessThan(0.10);
  });

  it("source é sample_data", () => {
    expect(SAMPLE_TOTALS.source).toBe("sample_data");
  });

  it("total_estimated_value_brl é maior que 0", () => {
    expect(SAMPLE_TOTALS.total_estimated_value_brl).toBeGreaterThan(0);
  });
});

// ── SAMPLE_ALERTS ─────────────────────────────────────────────────────────────

describe("SAMPLE_ALERTS", () => {
  it("tem pelo menos 2 alertas", () => {
    expect(SAMPLE_ALERTS.length).toBeGreaterThanOrEqual(2);
  });

  it("todos são válidos pelo schema", () => {
    for (const alert of SAMPLE_ALERTS) {
      expect(AnalyticsAlertSchema.safeParse(alert).success).toBe(true);
    }
  });

  it("inclui alerta sobre OAuth Meta não configurado", () => {
    const hasOAuth = SAMPLE_ALERTS.some(
      (a) => a.description.toLowerCase().includes("oauth") ||
              a.description.toLowerCase().includes("meta_app_id") ||
              a.description.toLowerCase().includes("meta"),
    );
    expect(hasOAuth).toBe(true);
  });

  it("ids são únicos", () => {
    const ids = SAMPLE_ALERTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── MockMetaAnalyticsAdapter ──────────────────────────────────────────────────

describe("MockMetaAnalyticsAdapter", () => {
  const adapter = new MockMetaAnalyticsAdapter();

  it("isConfigured retorna false", () => {
    expect(adapter.isConfigured()).toBe(false);
  });

  it("getSource retorna sample_data", () => {
    expect(adapter.getSource()).toBe("sample_data");
  });

  it("fetchPageMetrics retorna dados válidos para lucastigrereal", async () => {
    const m = await adapter.fetchPageMetrics("lucastigrereal", 30);
    expect(m.slug).toBe("lucastigrereal");
    expect(m.followers).toBeGreaterThan(0);
    expect(m.source).toBe("sample_data");
  });

  it("fetchAllPagesMetrics retorna todas as 6 páginas", async () => {
    const all = await adapter.fetchAllPagesMetrics(30);
    for (const slug of PAGE_SLUGS) {
      expect(all[slug]).toBeDefined();
    }
  });

  it("fetchAlerts retorna lista de alertas", async () => {
    const alerts = await adapter.fetchAlerts();
    expect(alerts.length).toBeGreaterThan(0);
  });
});

// ── LiveMetaAnalyticsAdapter ──────────────────────────────────────────────────

describe("LiveMetaAnalyticsAdapter", () => {
  const adapter = new LiveMetaAnalyticsAdapter();

  it("isConfigured retorna false (sem credenciais)", () => {
    expect(adapter.isConfigured()).toBe(false);
  });

  it("getSource retorna unavailable", () => {
    expect(adapter.getSource()).toBe("unavailable");
  });

  it("fetchPageMetrics lança erro informativo", async () => {
    let threw = false;
    try {
      await adapter.fetchPageMetrics("lucastigrereal", 30);
    } catch (e) {
      threw = true;
      expect(String(e)).toContain("Human Slot");
    }
    expect(threw).toBe(true);
  });

  it("fetchAllPagesMetrics lança erro", async () => {
    let threw = false;
    try {
      await adapter.fetchAllPagesMetrics(30);
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it("fetchAlerts retorna lista vazia sem lançar erro", async () => {
    const alerts = await adapter.fetchAlerts();
    expect(alerts).toEqual([]);
  });
});

// ── Factory ───────────────────────────────────────────────────────────────────

describe("createMetaAnalyticsAdapter", () => {
  it("retorna MockMetaAnalyticsAdapter em modo local", () => {
    const adapter = createMetaAnalyticsAdapter();
    expect(adapter.isConfigured()).toBe(false);
    expect(adapter.getSource()).toBe("sample_data");
  });
});

// ── Dados de ranking ──────────────────────────────────────────────────────────

describe("Ranking Logic (derivado dos dados)", () => {
  const sorted = [...PAGE_SLUGS].map((s) => SAMPLE_PAGE_METRICS[s]).sort((a, b) => b.reach - a.reach);

  it("lucastigrereal tem maior alcance", () => {
    expect(sorted[0].slug).toBe("lucastigrereal");
  });

  it("natalaivoueu ou oquecomernatalrn tem menor alcance", () => {
    const last = sorted[sorted.length - 1].slug;
    expect(["natalaivoueu", "oquecomernatalrn"]).toContain(last);
  });

  it("soma de reach > 1M", () => {
    const total = sorted.reduce((acc, m) => acc + m.reach, 0);
    expect(total).toBeGreaterThan(1_000_000);
  });
});

// ── Campos obrigatórios de W21 ────────────────────────────────────────────────

describe("W21 Required Fields", () => {
  it("todas as páginas têm impressions", () => {
    for (const slug of PAGE_SLUGS) {
      expect(SAMPLE_PAGE_METRICS[slug].impressions).toBeGreaterThan(0);
    }
  });

  it("todas as páginas têm saves, shares, comments", () => {
    for (const slug of PAGE_SLUGS) {
      const m = SAMPLE_PAGE_METRICS[slug];
      expect(m.total_saves).toBeGreaterThan(0);
      expect(m.total_shares).toBeGreaterThan(0);
      expect(m.total_comments).toBeGreaterThan(0);
    }
  });

  it("todas as páginas têm reels_published", () => {
    for (const slug of PAGE_SLUGS) {
      expect(SAMPLE_PAGE_METRICS[slug].reels_published).toBeGreaterThanOrEqual(0);
    }
  });
});
