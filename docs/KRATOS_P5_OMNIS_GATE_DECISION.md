# KRATOS P5 — OMNIS Gate Decision

**Data:** 2026-05-18
**Status:** **BLOCKED_BY_BACKEND**

---

## Auditoria

### Backend / API OMNIS
- `src/hooks/useOmnis.ts` — existe hook com `useOmnisStatus()`, `useOmnisHealth()`, `useOmnisCrews()`, `useOmnisJobs()`
- `api-contract/omnis.schema.ts` — schemas Zod definidos para OmnisStatus, OmnisCrew, OmnisJob, OmnisMemoryStats
- `tests/stores/omnis-store.test.ts` — 11 testes (passam)
- Backend OMNIS real: **NÃO EXISTE** — bridge implementada como P2 mas sem execução controlada

### UI / Placeholder OMNIS
- `OmnisLabScreen.tsx` — tela de ilha com holographic core, summary cards, agents, automations, flow stepper
- Placeholder visual honesto — não afirma execução real
- Sem botão "Delegar para OMNIS" no cockpit principal

### Gate de Aprovação
- **NÃO EXISTE** — não há gate visual de approve/cancel
- **NÃO EXISTE** — não há job queue com status visual
- Nenhuma execução acontece sem gate porque **não há backend para executar**

---

## Classificação

**BLOCKED_BY_BACKEND**

O que existe:
- Schema de contrato Zod definido (`api-contract/omnis.schema.ts`)
- Hook de consumo com mock/fallback (`useOmnis.ts`)
- Tela de visualização placeholder (`OmnisLabScreen.tsx`)
- 11 testes de store (passam)

O que falta:
- Backend OMNIS com endpoints reais
- Gate visual: botão "Delegar" → tela de aprovação → confirmação humana
- Job queue com status (pending → running → done/failed)
- Log de execução auditável
- Sandbox/isolamento de execução

---

## Contrato Mínimo Recomendado (futuro)

```
POST /api/omnis/execute
Body: { crew_id, job_id, approved_by: "human" }
Response: { job_id, status: "queued" }

GET /api/omnis/jobs/:id
Response: { job_id, status, started_at, finished_at, result, log }

POST /api/omnis/jobs/:id/cancel
Response: { job_id, status: "cancelled" }
```

Regras de segurança:
1. Toda execução requer `approved_by: "human"` com timestamp
2. Rate limit: 1 execução por vez
3. Timeout: 5 minutos máximo
4. Log completo auditável
5. Sem acesso a filesystem do host
6. Sem acesso a variáveis de ambiente sensíveis

---

## Risco de Segurança Atual

**BAIXO** — Não há backend OMNIS em execução. Placeholder é honesto. Nenhum botão de execução exposto.

---

## Próximos Passos (futuro)

1. Implementar backend OMNIS com endpoints reais
2. Criar gate visual de aprovação no cockpit
3. Adicionar job queue com status em tempo real
4. Implementar sandbox de execução
5. Testar fluxo completo: delegate → approve → execute → report
