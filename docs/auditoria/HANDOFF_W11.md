# HANDOFF W11 — Saneamento + Frontend Observability

**Branch:** `feature/kratos-1-frontend-visual`  
**Tag:** `ksw-w11-saneamento`  
**Data:** 2026-05-29  
**Status:** ✅ COMPLETO (B9 soak e B3 DSN aguardam infra externa)

---

## Objetivo da Wave

Saneamento pós-MARCO-P0 + observability frontend profissional:
structured logger, SSE real com backoff/watchdog, Lighthouse CI workflow.

**Nota:** W10 (Marketing Cockpit Live) não foi executado nesta branch — auditoria
adaptada para estado pós-P0. A maioria dos itens W11 (Sentry, Web Vitals, Error
Boundary) já estava implementada.

---

## O que foi feito

### B1 — Auditoria post-P0
`docs/auditoria/W11_POSTMORTEM_W10.md`:
- Sentry ✅ pré-existente (src/lib/sentry.ts)
- Web Vitals ✅ pré-existente (src/lib/webVitals.ts)
- RouteErrorBoundary ✅ em 9/9 rotas
- P0 bugs: nenhum encontrado
- P1 gaps: logger, sseClient, lighthouse.yml → resolvidos nos blocos seguintes

### B4 — Structured Logger (novo)
`src/lib/observability/logger.ts`:
- `createLogger(module)` → Logger com debug/info/warn/error
- **Dev**: colorized console output (`%c` styling), todos os níveis
- **Prod**: debug/info silenciosos; warn → `captureMessage` Sentry; error → `captureError` Sentry
- Campos implícitos: timestamp HH:mm:ss.mmm, module name, level
- SSR-safe (no-op em server-side)
- `logger` singleton exportado para one-off usage

### B6 — Lighthouse CI (novo)
`.github/workflows/lighthouse.yml`:
- Trigger: PRs targeting `main`
- Aguarda Vercel preview URL (via `patrickedqvist/wait-for-vercel-preview`)
- 3 runs, mediana; rotas `/agora` e `/sistema` auditadas
- Budgets: Performance >90, Accessibility >95, Best Practices >95, SEO >90
- Skip gracioso quando sem preview URL (continue-on-error: true)
- Ativa quando VERCEL_TOKEN + LHCI_GITHUB_APP_TOKEN configurados

### B7 — Error Boundary (pré-existente, validado)
`src/components/kratos/base/RouteErrorBoundary.tsx` — já implementado, em todas as rotas.
Sentry integration via `captureError` já presente. Nenhuma alteração necessária.

### B8 — SSE Client real (novo)
`src/lib/realtime/sseClient.ts`:
- `SSEClient` class: EventSource wrapper completo
- Backoff: `[1s, 2s, 4s, 8s, 16s, 30s]` (cap no índice 5)
- Max 10 retries → dead state; `.reconnect()` para retry manual
- Watchdog: reconecta se silencioso > 60s enquanto `state=live`
- Callbacks: `onMessage(data)` + `onStateChange(state, retries)`
- Last-Event-ID: preservado via query param para resume
- SSR/EventSource guards: no-op em ambientes incompatíveis
- `getLiveStreamClient()`: singleton para `/live/stream`

`src/hooks/useLiveStream.ts`:
- React hook sobre `getLiveStreamClient()`
- Invalida `["system","pulse"]`, `["services"]`, `["missions-active"]` na TanStack Query a cada evento
- Batch via `queueMicrotask` — evita flood de invalidações
- Retorna: `{ sseState, retryCount, lastSnapshot, reconnect }`

### B10 — Testes: w11-observability.test.ts (novo)
`tests/stores/w11-observability.test.ts` — 29 testes cobrindo:
- Logger dispatch (3 testes): dev emite tudo, prod silencia debug/info, prod emite warn/error
- SSE backoff schedule (7 testes): tentativas 0-5 + overflow
- SSE dead state (4 testes): limite exato, ultrapassado, zero, maxRetries=0
- Web Vitals ratings (15 testes): LCP, CLS, INP, TTFB nos 3 tiers + métrica desconhecida

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 13 erros pré-existentes inalterados |
| `bun run test` | ✅ 503 pass, 0 fail (+29 novos W11) |
| `bun run build` | ✅ clean |
| code-review | ✅ SSEClient sem side effects em SSR, backoff cap correto |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `src/lib/observability/logger.ts` | Criado — structured logger |
| `src/lib/realtime/sseClient.ts` | Criado — EventSource + backoff/watchdog |
| `src/hooks/useLiveStream.ts` | Criado — React hook para SSE stream |
| `.github/workflows/lighthouse.yml` | Criado — Lighthouse CI |
| `docs/auditoria/W11_POSTMORTEM_W10.md` | Criado — auditoria |
| `tests/stores/w11-observability.test.ts` | Criado — 29 testes |
| `docs/auditoria/HANDOFF_W11.md` | Criado — este documento |

---

## Pendências (externos)

| Item | Bloqueio | Ação |
|---|---|---|
| Sentry DSN ativo | Lucas precisa fornecer `VITE_SENTRY_DSN` | Adicionar ao `.env` |
| Lighthouse CI ativo | Requer Vercel deploy (autorização Lucas) | Após deploy |
| Soak 7 dias | Requer prod | Background após deploy |

---

## Noção de Done

- [x] Structured logger criado (prod silencia debug/info → Sentry)
- [x] SSEClient com backoff 1s→30s (6 tiers), max 10 retries, watchdog 60s
- [x] useLiveStream invalida TanStack Query em cada evento
- [x] Lighthouse CI workflow criado (.github/workflows/lighthouse.yml)
- [x] Error Boundary em todas as 9 rotas (pré-existente, validado)
- [x] Sentry infrastructure pré-existente (pré-existente, validado)
- [x] Web Vitals pré-existente (pré-existente, validado)
- [x] 29 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**W12 — Multi-Page Cockpit UI**

Ordem: W11 ✅ → **W12** → W13 → W14 → tag kratos-v2.0-main

---

_HANDOFF gerado automaticamente — Wave W11 concluída_
