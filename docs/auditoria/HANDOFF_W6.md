# HANDOFF W6 — System Reality

**Branch:** `feature/kratos-supreme-w0-w22`  
**Tag:** `ksw-w6-system-real`  
**Data:** 2026-05-28  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Eliminar todos os `MOCK_*` constantes do DashboardView Row 2 e substituir por dados
reais do `/live/snapshot` via `useSystemPulse()`.

Antes de W6: 4 dos 6 IslandCards ainda exibiam dados hardcoded com `sourceType="mock"`.
Após W6: todos os 6 IslandCards mostram dados reais + SourceBadge correto.

---

## O que foi feito

### B1 — Backend: branch no git collector
`backend/app/services/live_event_service.py` — `_fetch_git()`:
- Adicionado `result["branch"]` — lê o branch do repo kratos-mission-control
  (fallback ao primeiro repo da lista, depois `"—"`)
- Usa `next((r for r in repos if "kratos" in r.get("name", "").lower()), ...)`

### B2 — Hook: useSystemPulse expandido
`src/hooks/useSystemPulse.ts`:
- `SystemPulseData` agora inclui `dockerTotal: number` e `gitBranch: string | null`
- `CollectorDictEntry` agora tem `dirty?: boolean` e `branch?: string` (sem cast `as`)
- `fetchSnapshot` extrai `docker.total` e `git.branch` do payload do collector

### B3 — DashboardView: 4 MOCK removidos, wiring real
`src/components/kratos/views/DashboardView.tsx`:
- Removidos: `MOCK_SYSTEM_DATA`, `MOCK_DOCKER_DATA`, `MOCK_GIT_DATA`, `MOCK_ALERTS_DATA`
- Adicionado import `useSystemPulse`
- Hook `useSystemPulse()` chamado → `pulse`, `systemLoading`, `systemSourceType`
- Mapeamento inline de `pulse` → 4 island data objects:
  - `systemIslandData`: `{ cpuPercent, ramPercent, health }`
  - `dockerIslandData`: `{ containers: [], runningCount, totalCount }` — agregado sem nomes individuais
  - `gitIslandData`: `{ branch: gitBranch ?? "—", dirty, ahead: 0, behind: 0 }`
  - `alertsIslandData`: `pulse.alerts` mapeados via `ALERT_SEVERITY`
- `isLoading={systemLoading}` em todos os 4 cards
- `ALERT_SEVERITY` record: `error→critical`, `degraded→high`, `offline→medium`

### B4 — Testes: system-reality.test.ts (novo)
`tests/stores/system-reality.test.ts` — 23 testes cobrindo:
- SystemIslandData mapping (5 testes)
- DockerIslandData mapping (4 testes)
- GitIslandData mapping (4 testes)
- AlertsIslandData mapping (8 testes)
- Null safety — pulse=null → data=null (2 testes)

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 0 erros novos (13 pré-existentes inalterados) |
| `bun run test` | ✅ 381 pass, 0 fail (23 novos W6 testes) |
| `bun run build` | ✅ clean (3.38s SSR) |
| code-review | ✅ integrado inline — isLoading props, null safety, sem hex inline |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `backend/app/services/live_event_service.py` | Modificado — _fetch_git() expõe branch |
| `src/hooks/useSystemPulse.ts` | Modificado — dockerTotal + gitBranch + typed CollectorDictEntry |
| `src/components/kratos/views/DashboardView.tsx` | Modificado — 4 MOCKs removidos, useSystemPulse wired |
| `tests/stores/system-reality.test.ts` | Criado — 23 testes |

---

## Noção de Done (Notion criteria)

- [x] `MOCK_SYSTEM_DATA` removido — CPU/RAM/health de `/live/snapshot`
- [x] `MOCK_DOCKER_DATA` removido — running/total de docker collector
- [x] `MOCK_GIT_DATA` removido — branch/dirty do git collector (kratos-first)
- [x] `MOCK_ALERTS_DATA` removido — alerts de collector status degraded/error/offline
- [x] `isLoading` prop correto em todos os 4 cards — LoadingState durante fetch
- [x] `pulse=null` → `data=null` → IslandCard mostra ErrorState (não crash)
- [x] Docker containers array vazio — dados agregados, sem nomes falsos
- [x] Branch "—" quando backend não retorna (gitBranch=null)
- [x] 23 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Status Dashboard Row 2 pós-W6

| IslandCard | Fonte | SourceBadge |
|---|---|---|
| System | `/live/snapshot` (real) | live / cache / error |
| Docker | `/live/snapshot` (real) | live / cache / error |
| Git | `/live/snapshot` (real) | live / cache / error |
| Tasks | `/tasks` Python (real) | live / mock |
| Projects | `/projects` Python (real) | live / mock |
| Alerts | `/live/snapshot` (real) | live / cache / error |

**MARCO**: todos os 6 IslandCards do Dashboard Row 2 usam dados reais. ✅

---

## Próxima Wave

**W3 — Context/ActivityWatch Reality** (usuário autorizou "vai ate o goal")

Ordem P0: W0 ✅ → W1 ✅ → W2 ✅ → W6 ✅ → **W3** → W4 → W4.5 → W5 → [MARCO P0]

---

_HANDOFF gerado automaticamente — Wave W6 concluída_
