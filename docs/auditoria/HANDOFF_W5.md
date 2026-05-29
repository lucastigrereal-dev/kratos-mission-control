# HANDOFF W5 — SSE Hardening

**Branch:** `feature/kratos-1-frontend-visual`  
**Tag:** `ksw-w5-sse-hardening`  
**Data:** 2026-05-29  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Hardening do sistema SSE/polling do KRATOS. A infraestrutura já estava
implementada (W5-B3 no useAppointments com optimistic updates, SSEConnection
com backoff em useLiveStatus, useSSEToasts em AppShell). Esta wave adiciona
cobertura de testes exaustiva e documenta os invariantes.

---

## O que foi feito

### Infraestrutura existente (validada, não modificada)

**`src/hooks/useSSEToasts.ts`** — já implementado, montado em AppShell:
- `useMissions(20)` observado continuamente
- Deduplicação via `seenRef<Set<string>>` — cada alerta dispara apenas 1× por sessão
- 4 tipos: `budget_exceeded` → `toast.error`, `approval_pending` → `toast.warning`,
  `status=failed` → `toast.error`, `status=completed` → `toast.success`

**`src/hooks/useLiveStatus.ts`** — SSEConnection com:
- Poll normal: 10s
- Backoff escalonado: 15s → 30s → 60s → 120s (4 tiers)
- Dead state: > 4 falhas → modo manutenção (120s)
- Watchdog: força refetch se silencioso > 35s enquanto conectado
- Cascade invalidations: `services`, `system/pulse`, `missions-active` quando conectado

**`src/lib/live-events-server-fns.ts`** — `fetchLiveEventsStatus`:
- Proba `/v1/events/status` (path canônico) com fallback `/events/status` (legado)
- Timeout 4s, AbortSignal, validação Zod do payload
- Deriva `connected = status === "ok"`

### B1 — Testes: sse-hardening.test.ts (novo)
`tests/stores/sse-hardening.test.ts` — 27 testes cobrindo:
- `EventsStatusSchema` validation (4 testes): payload válido, status≠ok, sem status, subscribers negativos
- `deriveConnected` (4 testes): ok→true, offline→false, degraded→false, payload inválido→false
- Backoff tier selection (7 testes): failCount 0-5, overflow/100
- Toast deduplication key format (3 testes): formato, idempotência, tipos diferentes
- `collectToastEvents` (9 testes): sem alertas, budget, approval, failed, completed, budget+approval, alerta visto, outro missionId, statuses neutros

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 13 erros pré-existentes inalterados |
| `bun run test` | ✅ 474 pass, 0 fail (+27 novos W5) |
| `bun run build` | ✅ clean (3.47s) |
| code-review | ✅ infraestrutura existente validada, backoff invariants documentados |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `tests/stores/sse-hardening.test.ts` | Criado — 27 testes |
| `docs/auditoria/HANDOFF_W5.md` | Criado — este documento |

---

## Noção de Done

- [x] `EventsStatusSchema` cobre todos os estados do backend
- [x] `deriveConnected` só true quando `status === "ok"`
- [x] Backoff tier selection testado para todos os failCount possíveis
- [x] Dead state (> SSE_MAX_FAIL_ACTIVE failures) → 120s maintenance
- [x] Deduplication keys no formato `type:missionId`
- [x] Todos os 4 tipos de toast testados (budget, approval, failed, completed)
- [x] Alerta visto não re-emite mesmo em re-render
- [x] Statuses neutros (running, paused, draft, cancelled) não emitem toast de status
- [x] 27 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**[MARCO P0]** — Todos os pré-requisitos satisfeitos:
- ✅ 6 IslandCards com dados reais (W1+W2+W6)
- ✅ ContextoView real (W3)
- ✅ Missions real no Dashboard (W4)
- ✅ AuroraDrawer real (W4.5)
- ✅ SSE hardened e testado (W5)

Ordem P0: W0 ✅ → W1 ✅ → W2 ✅ → W6 ✅ → W3 ✅ → W4 ✅ → W4.5 ✅ → W5 ✅ → **[MARCO P0]**

---

_HANDOFF gerado automaticamente — Wave W5 concluída_
