# W17 — Observability UI Pass

**Data:** 2026-05-16
**Status:** CONCLUÍDO
**Build:** VERDE (sem alterações)

---

## Objetivo

Verificar a UI de observabilidade: health dos serviços, status dots,
atualização em tempo real, fallback quando offline.

---

## Componentes auditados

### ServiceHealthCard (`src/components/kratos/sistema/ServiceHealthCard.tsx`)

- Nome, descrição, URL e versão do serviço
- StatusDot com severity mapeada: `live→ok, degraded→warn, offline→critical, unknown→muted`
- Pulse animation em serviços live (`.kratos-pulse`)
- Labels em português (LIVE, DEGRADADO, OFFLINE, DESCONHECIDO)

### Sistema route (`src/routes/sistema.tsx`)

- Grid 4 colunas responsivo (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
- Loading state via `LoadingState` component
- Gallery de referência com 9 estados + 3 painéis (empty/loading/error)

### Hook (`src/hooks/useServices.ts`)

- `refetchInterval: 30_000` (atualização a cada 30s)
- `staleTime: 15_000`
- Fallback: `services: []` quando dados indisponíveis

---

## Verificação

| Check | Status |
|---|---|
| Dados reais (useServices hook) | OK |
| Loading state | OK |
| Indicadores visuais de health | OK (cores + pulse) |
| Atualização automática | OK (30s interval) |
| Fallback offline | OK (array vazio) |
| Responsivo | OK (1→2→4 colunas) |

---

## Gap documentado

Sem gráfico de timeline/histórico de health — apenas snapshot atual.
Fora do escopo MVP, documentado como melhoria futura.
