# W21 ANALYTICS MAP

**Data:** 2026-05-30  
**Propósito:** Mapeamento das páginas analytics existentes antes de criar W21  

---

## Componentes Existentes (W12)

| Componente | Status | Notes |
|-----------|--------|-------|
| `src/components/kratos/islands/marketing/PageCard.tsx` | ✅ W12 | 6 PageCards, mock data |
| `src/components/kratos/islands/marketing/PerformanceCharts.tsx` | ✅ W12 | LineChart + BarChart |
| `src/components/kratos/shell/PageSwitcher.tsx` | ✅ W12 | Filtro por página |
| `src/components/kratos/islands/AgenciaScreen.tsx` | ✅ W12 | Multi-page cockpit |

## Hooks Existentes (W12)

| Hook | Endpoint | Source |
|------|----------|--------|
| `usePageMetrics(slug, period)` | `GET /marketing/pages/:slug/metrics` | Mock fallback |
| `useCrossPageAnalytics(period)` | `GET /marketing/analytics/cross-pages` | Mock fallback |

## Schemas Existentes

- `api-contract/marketing.schema.ts` — PageProfile, PageMetrics, CrossPageAnalytics, WeeklyMetricPoint
- 6 páginas: total 2.581.000 seguidores

## OAuth Meta Status

❌ **BLOCKED_EXTERNAL** — META_APP_ID + META_APP_SECRET não configurados  
❌ Meta Insights API — não chamada  
❌ Graph API — não configurada  

## Gap W21

| Feature | Estado | O que criar |
|---------|--------|-------------|
| Contrato PageMetrics completo | Parcial (W12) | Adicionar: impressions, saves, shares, comments, reels |
| Mock dataset rico 6 páginas | Parcial (W12) | Dataset completo + SAMPLE_DATA label |
| Dashboard por página | Não existe | AnalyticsDashboard component |
| Visão comparativa | Não existe | ComparisonView |
| Ranking | Não existe | RankingPanel |
| Alertas | Não existe | AlertsPanel |
| Meta OAuth Human Slot | Não existe | Component explícito |
| Meta Adapter Interface | Não existe | Type-only, zero chamadas |

---

**MAP COMPLETO → W21-B02**
