# HANDOFF W11 — Saneamento + Frontend Observability
**Data:** 2026-05-27
**Branch:** main
**Tag:** kratos-w11-saneamento
**Notion:** https://www.notion.so/36d22eba8f088125b9eded6789f88618

---

## Resumo Executivo

W11 zera a dívida técnica acumulada no W10 (58 erros TS runtime) e adiciona camada
completa de observabilidade frontend — Sentry, Web Vitals e Error Boundaries em todas
as rotas. O SSE polling ganhou backoff exponencial e watchdog, tornando o cockpit
resiliente a backends offline.

**Status final: ✅ COMPLETO** (B1–B9 entregues; B8 Lighthouse requer ambiente browser)

---

## Commits W11

| Commit | Block | Descrição |
|--------|-------|-----------|
| `3d9ab93` | B1 | Auditoria pós-fogo W10 — mapeamento P0/P1/P2 |
| `380903b` | B2 | SSE telemetry hooks + console audit baseline |
| `ca1e583` | B3 | DataOrigin, null-string, import paths |
| `6701aa6` | B4 | Zerando 58 erros TS runtime (20 arquivos) |
| `cbe5683` | B5/B6/B7 | Sentry + Web Vitals + Error Boundary audit |
| `eddec30` | B9 | SSE hardening — backoff + cap + watchdog |

---

## O que foi entregue

### B1–B3: Auditoria e Saneamento Base
- Mapeamento completo de erros P0/P1/P2 pós-W10
- Correção de DataOrigin, null-string guards, import paths incorretos
- Baseline de console audit documentado

### B4: Zero TS Errors (58 → 0)
Padrões corrigidos em 20 arquivos:
- `createServerFn().inputValidator()` → handlers recebem `{ data }`, callers passam `{ data: ... }`
- Icon types: `LucideIcon` → `ComponentType<{ className?; style?; strokeWidth?; aria-hidden? }>`
- `CheckpointStatus`: removido `"archived"` (inexistente) → usar `"cancelled"` / `"blocked"`
- `DashboardSummary`: adicionado `isError: boolean; error: Error | null`
- CSS `ringColor` em `style={{}}` → Tailwind class `ring-[var(--token)]`
- `WorldTopHud sourceType`: mapeado `"partial"/"computed"` → `"cache"`

### B5: Sentry Integration (`src/lib/sentry.ts`)
- `initSentry()` — idempotente, no-op se `VITE_SENTRY_DSN` não configurado
- `captureError()`, `captureMessage()`, `addBreadcrumb()`, `setSentryUser()`
- PII scrubbed em `beforeSend` (sem `ip_address` / `email`)
- Sample rate: 10% em prod, 100% em dev

### B6: Web Vitals (`src/lib/webVitals.ts`)
- Métricas: CLS, FCP, INP, LCP, TTFB (FID removido em web-vitals v4+)
- Thresholds Google 2024
- Reporting: `kratosAnalytics.track()` + Sentry breadcrumb + DEV console

### B7: Error Boundary Audit
- Novo: `src/components/kratos/base/RouteErrorBoundary.tsx`
- Wired em todas as 7 rotas: agora, agenda, checkpoints, contexto, projetos, sistema, ilhas.$islandId
- Dev mode: mostra stack trace
- Prod: captura no Sentry + analytics + link para `/agora`

### B9: SSE Hardening (`src/hooks/useLiveStatus.ts`)
- Backoff tiers: 10s → 15 → 30 → 60 → 120s (maintenance)
- Dead-state cap: após 4 falhas consecutivas, entra em manutenção (2min/poll)
- Heartbeat watchdog: force-refetch se conectado mas silencioso > 35s
- `sourceType` escalado para `"stale"` em dead-state
- `isSSEDeadState` exposto via `KratosContext` para a UI

---

## Gates de Qualidade

| Gate | Resultado |
|------|-----------|
| `bun run build` | ✅ clean (client + SSR) |
| `bun test` (302 testes) | ✅ 302 pass / 0 fail |
| TypeScript src/ | ✅ 0 erros novos |
| Bundle main gzip | ✅ ~205 KB (baseline W11) |

---

## Pendências Abertas

| Item | Prioridade | Bloco |
|------|-----------|-------|
| W11-B8 Lighthouse baseline (> 85 desktop + mobile) | P2 | Requer ambiente browser |
| Configurar `VITE_SENTRY_DSN` no `.env` | P1 | Manual — Lucas cria projeto Sentry |
| `git push` (rede indisponível durante sessão) | P0 | 2 commits pendentes: `cbe5683`, `eddec30` |

---

## Próxima Wave: W12 — Multi-Page Cockpit UI

**Pré-requisito:** OMNIS W24 fechado (multi-page backend)

Escopo previsto:
- `/ilhas/*` screens com dados reais (Arena, Tesouro, Forja, Observatorio)
- Dock data dinâmica via hooks reais
- IslandPageFrame + header universais (já existem, precisam de dados)

**Aguardar sinal de OMNIS W24 antes de iniciar.**

---

## Riscos Residuais

| Risco | Status |
|-------|--------|
| Dois token systems (`--kr-*` e `--kratos-*`) | Ativo — migração gradual ok |
| `frontend/` legado | Intocado — só `src/` modificado nesta wave |
| bun lockfile + rollup cache | Mitigado — `bun pm cache rm && rm -rf node_modules && bun install` |
