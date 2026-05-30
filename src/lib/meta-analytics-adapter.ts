/**
 * Meta Analytics Adapter Interface — W21
 *
 * Interface/contract apenas — ZERO chamadas externas.
 * Implementação real requer OAuth Meta + META_APP_ID + META_APP_SECRET.
 *
 * Human Slot: Lucas configura META_APP_ID e META_APP_SECRET quando estiver pronto.
 * O adapter real substituirá o mock sem quebrar os consumidores.
 */

import type { FullPageMetrics, AnalyticsAlert, AnalyticsSource } from "../../api-contract/analytics.schema";
import type { PageSlug } from "../../api-contract/marketing.schema";

// ── Adapter Interface ─────────────────────────────────────────────────────────
// Qualquer implementação real deve satisfazer esta interface.

export interface MetaAnalyticsAdapter {
  /** Verifica se o adapter está configurado com as credenciais necessárias */
  isConfigured(): boolean;

  /** Busca métricas de uma página pelo slug */
  fetchPageMetrics(slug: PageSlug, periodDays: number): Promise<FullPageMetrics>;

  /** Busca métricas de todas as páginas */
  fetchAllPagesMetrics(periodDays: number): Promise<Record<PageSlug, FullPageMetrics>>;

  /** Retorna alertas baseados nas métricas atuais */
  fetchAlerts(): Promise<AnalyticsAlert[]>;

  /** Fonte dos dados */
  getSource(): AnalyticsSource;
}

// ── Mock Adapter ──────────────────────────────────────────────────────────────
// Implementação local que retorna SAMPLE_DATA. Disponível agora.

import { SAMPLE_PAGE_METRICS, SAMPLE_ALERTS } from "../../api-contract/analytics.schema";
import { PAGE_SLUGS } from "../../api-contract/marketing.schema";

export class MockMetaAnalyticsAdapter implements MetaAnalyticsAdapter {
  isConfigured(): boolean {
    return false; // sempre false em modo local
  }

  async fetchPageMetrics(slug: PageSlug, _periodDays: number): Promise<FullPageMetrics> {
    return { ...SAMPLE_PAGE_METRICS[slug] };
  }

  async fetchAllPagesMetrics(_periodDays: number): Promise<Record<PageSlug, FullPageMetrics>> {
    const result = {} as Record<PageSlug, FullPageMetrics>;
    for (const slug of PAGE_SLUGS) {
      result[slug] = { ...SAMPLE_PAGE_METRICS[slug] };
    }
    return result;
  }

  async fetchAlerts(): Promise<AnalyticsAlert[]> {
    return [...SAMPLE_ALERTS];
  }

  getSource(): AnalyticsSource {
    return "sample_data";
  }
}

// ── Live Adapter Stub ──────────────────────────────────────────────────────────
// Placeholder para quando OAuth Meta for configurado.
// Lança erro se chamado sem credenciais (seguro por design).

export class LiveMetaAnalyticsAdapter implements MetaAnalyticsAdapter {
  private readonly appId: string | undefined;
  private readonly appSecret: string | undefined;

  constructor() {
    // Em modo local (Cloudflare/Vite), não lemos process.env diretamente.
    // c.env no servidor Hono é o caminho certo.
    // Aqui só checamos existência para o isConfigured().
    this.appId = undefined;    // Human Slot — Lucas configura
    this.appSecret = undefined; // Human Slot — Lucas configura
  }

  isConfigured(): boolean {
    return !!(this.appId && this.appSecret);
  }

  async fetchPageMetrics(_slug: PageSlug, _periodDays: number): Promise<FullPageMetrics> {
    throw new Error(
      "LiveMetaAnalyticsAdapter não configurado. " +
      "Configure META_APP_ID e META_APP_SECRET. " +
      "Human Slot: ver docs/HUMAN_SLOTS.md"
    );
  }

  async fetchAllPagesMetrics(_periodDays: number): Promise<Record<PageSlug, FullPageMetrics>> {
    throw new Error("LiveMetaAnalyticsAdapter não configurado — Human Slot ativo.");
  }

  async fetchAlerts(): Promise<AnalyticsAlert[]> {
    return [];
  }

  getSource(): AnalyticsSource {
    return "unavailable";
  }
}

// ── Factory ───────────────────────────────────────────────────────────────────
// Retorna o adapter correto baseado na configuração.
// Em W21, sempre retorna MockMetaAnalyticsAdapter.

export function createMetaAnalyticsAdapter(): MetaAnalyticsAdapter {
  // Em W21: sempre mock. Quando META_APP_ID estiver configurado: LiveMetaAnalyticsAdapter.
  return new MockMetaAnalyticsAdapter();
}

// Instância singleton para uso nos hooks
export const metaAnalyticsAdapter = createMetaAnalyticsAdapter();
