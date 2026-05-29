# HANDOFF W12 — Multi-Page Cockpit UI

**Branch:** `feature/kratos-1-frontend-visual`  
**Tag:** `ksw-w12-multipage`  
**Data:** 2026-05-29  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Cockpit multi-page para as 6 páginas do Instagram de Lucas Tigre.
OMNIS W24 backend não disponível → full UI com fallback mock realístico
(mesmo padrão W1-W4 — dados reais se conectam quando OMNIS W24 entregar).

---

## O que foi feito

### api-contract/marketing.schema.ts (novo)
- `PAGE_SLUGS`, `PageSlug`, `PAGE_PROFILES` — 6 páginas com metadados canônicos
- `TOTAL_FOLLOWERS = 2_581_000`
- `PageMetricsSchema`, `PageMetricsEnvelopeSchema`, `TopPostSchema`
- `CrossPageAnalyticsSchema`, `WeeklyMetricPointSchema`, `CrossPageEnvelopeSchema`
- Sincronizado com OMNIS W24 Pydantic models (quando disponível)

### src/hooks/usePageMetrics.ts (novo)
- `usePageMetrics(slug, periodDays)` → métricas por página
- Consome `GET /marketing/pages/:slug/metrics?period=:days`
- Fallback mock realístico (lucastigrereal: 285K reach, etc.)
- `staleTime: 60_000`, `refetchInterval: 60_000`

### src/hooks/useCrossPageAnalytics.ts (novo)
- `useCrossPageAnalytics(periodDays: 7|30|90)` → analytics cruzado
- Consome `GET /marketing/analytics/cross-pages?period=:days`
- Fallback mock: série semanal para todas as 6 páginas
- `staleTime: 120_000`, `refetchInterval: 120_000`

### src/components/kratos/islands/marketing/PageCard.tsx (novo — W12-B1)
- Card compacto: avatar initial + nome + handle + SourceBadgeIndicator
- 3 métricas: alcance + engajamento + novos seguidores, com TrendBadge
- Top post preview (caption, primeiros 60 chars)
- `isHot=true` → glow border + 🔥 top badge
- TDAH-first: máximo 3 métricas visíveis

### src/components/kratos/islands/marketing/PerformanceCharts.tsx (novo — W12-B2)
- Recharts v2.15.4: LineChart + BarChart
- `TrendChart` — alcance semanal top-3 páginas (line chart)
- `ReachBarChart` — comparativo instantâneo das 6 páginas (bar horizontal)
- `PeriodTabs` — seletor 7d/30d/90d
- SVG stroke com rgba estático (color-mix não funciona em attrs SVG)

### src/components/kratos/shell/PageSwitcher.tsx (novo)
- Mini-seletor das 6 páginas + "Todas"
- Keyboard shortcuts: 0=todas, 1-6=páginas em ordem
- Guard: INPUT/TEXTAREA/SELECT/contenteditable ignoram shortcuts
- Modo compacto (somente initials) e modo normal (nome + seguidores)

### src/components/kratos/islands/AgenciaScreen.tsx (modificado)
- **Removido:** `MarketingMetricsCard` (DEMO hardcoded)
- **Adicionado:** `MultiPageCockpit` — seção completa com:
  - Aggregate bar (total seguidores, alcance, eng. médio)
  - `PageSwitcher` para filtrar por página
  - Grid 2-col de 6 `PageCard` (dados reais via `usePageMetrics`)
  - `PerformanceCharts` com cross-page analytics
- **Corrigido:** `total_items`/`pending_items` → schema correto `total`/`por_status`
- **Hook rule:** 6 `usePageMetrics` calls fixos no topo do `MultiPageCockpit` (não em loop)

---

## Correções do Code Review

| Issue | Fix |
|---|---|
| `--kr-success` undefined | → `--kratos-ok` (token correto) em 4 locais |
| `--kr-ghost` undefined | → `--kratos-ghost` em PageCard |
| `color-mix()` em SVG stroke attr | → `rgba(255,255,255,0.06)` estático |
| `contenteditable` no keyboard guard | Adicionado `el.isContentEditable` check |

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ zero erros novos em W12 |
| `bun run test` | ✅ 549 pass, 0 fail (+46 novos W12) |
| `bun run build` | ✅ clean (client + SSR) |
| code-review | ✅ 4 fixes aplicados |

---

## Arquivos criados / modificados

| Arquivo | Ação |
|---|---|
| `api-contract/marketing.schema.ts` | Criado — contratos W12 |
| `src/hooks/usePageMetrics.ts` | Criado — métricas por página |
| `src/hooks/useCrossPageAnalytics.ts` | Criado — analytics cruzado |
| `src/components/kratos/islands/marketing/PageCard.tsx` | Criado — card compacto |
| `src/components/kratos/islands/marketing/PerformanceCharts.tsx` | Criado — recharts |
| `src/components/kratos/shell/PageSwitcher.tsx` | Criado — seletor de páginas |
| `src/components/kratos/islands/AgenciaScreen.tsx` | Modificado — MultiPageCockpit |
| `tests/stores/w12-marketing-cockpit.test.ts` | Criado — 46 testes |
| `docs/auditoria/HANDOFF_W12.md` | Criado — este documento |

---

## Pendências (externos)

| Item | Bloqueio |
|---|---|
| Dados reais das páginas | OMNIS W24 `GET /marketing/pages/:slug/metrics` |
| Cross-page analytics real | OMNIS W24 `GET /marketing/analytics/cross-pages` |
| Token Meta / Publer | Lucas autorizar integração |

---

## Noção de Done

- [x] `marketing.schema.ts` — 6 páginas, schemas completos
- [x] `usePageMetrics` — mock realístico, fallback transparente
- [x] `useCrossPageAnalytics` — série semanal mock, period 7/30/90
- [x] `PageCard` — 3 métricas + trend + top post + SourceBadge
- [x] `PerformanceCharts` — LineChart + BarChart com recharts
- [x] `PageSwitcher` — 6 páginas + keyboard shortcuts
- [x] `AgenciaScreen` — DEMO removido, MultiPageCockpit real
- [x] 46 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**W13 — Memory Search UI**

Ordem: W12 ✅ → **W13** → W14 → tag kratos-v2.0-main

---

_HANDOFF gerado — Wave W12 concluída_
