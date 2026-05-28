# HANDOFF W1 — Tasks Reality

**Branch:** `feature/kratos-supreme-w0-w22`  
**Tag:** `ksw-w1-tasks-real`  
**Data:** 2026-05-28  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Corrigir a lacuna entre `POST /tasks` (gravava em SQLite) e `GET /tasks` (lia mock JSON).
Garantir que o frontend mostre dados reais do SQLite com source envelope e SourceBadge correto.

---

## O que foi feito

### B1 — Triage W0 (port 8000 → 5100)
- `scripts/start.ps1`: porta 8000 → **5100** (porta canônica do backend)
- `src/hooks/useBackendHealth.ts`: `BACKEND_HEALTH_URL` corrigida para port 5100

### B2 — Backend: helpers de envelope
`backend/app/services/__init__.py` — adicionados 3 helpers privados:
- `_task_row_to_dict(row)` → converte sqlite3.Row em dict
- `_task_envelope(data, source)` → monta `{ data, source, source_ts: iso }`
- `_mock_task_envelope(filename)` → envelope com source='mock' a partir de JSON

### B3 — Backend: refactor 4 funções
`get_tasks()`, `get_today_tasks()`, `get_overdue_tasks()`, `get_unfinished_items()`:
- **Antes**: `if result: return result` → silenciosamente devolvia mock quando SQLite vazio
- **Depois**: SQLite OK (mesmo vazio) → `source: "live"`. SQLite erro → `source: "mock"`

### B4 — Backend: rota /doing
`backend/app/routes/tasks.py` — `/doing` agora unwrapa envelope antes de filtrar:
```python
envelope = get_tasks()
all_tasks = envelope.get("data", [])
filtered = [t for t in all_tasks if t.get("status") == "doing"]
return { "data": filtered, "source": ..., "source_ts": ... }
```

### B5 — api-contract: tasks.schema.ts (novo arquivo)
`api-contract/tasks.schema.ts`:
- `TaskSchema`, `TaskStatusSchema`, `TaskPrioritySchema`
- `TaskEnvelopeSchema`: `{ data: Task[], source: "live"|"mock"|"cached"|"fallback", source_ts: string }`
- `envelopeToIslandData()`: filtra doing/high/critical, limita a 5 (TDAH), mapeia overdue

### B6 — MOCK_REGISTRY para VITE_USE_MOCKS
`src/lib/api/client.ts` — adicionado `/tasks/today` e `/tasks` ao MOCK_REGISTRY

### B7 — Hook: useTasks.ts (novo arquivo)
`src/hooks/useTasks.ts`:
- `useTasksToday()`: query `["tasks", "today"]`, refetch 60s, stale 30s
- `useTasks()`: query `["tasks", "all"]`, refetch 60s, stale 30s
- Ambos lançam erro em falha Zod (não retornam null silenciosamente)
- `toDataSource()` mapeia backend source → frontend DataSource

### B8 — DashboardView: wiring real
`src/components/kratos/views/DashboardView.tsx`:
- Removido `MOCK_TASKS_DATA` hardcoded
- Adicionado `useTasksToday()` hook
- `<IslandCard domain="tasks" ... sourceType={tasksSourceType} isLoading={tasksLoading} />`
- `isLoading` prop passa corretamente (fix code-review HIGH #1)

### B9 — Testes: tasks-reality.test.ts (novo arquivo)
`tests/stores/tasks-reality.test.ts` — 18 testes cobrindo:
- B6: path SQLite real (source: live)
- B7: path fallback mock (source: mock)
- Integridade do envelope
- Mapeamento para TasksIslandData

### B9 — Code review HIGH issues fixadas
1. `isLoading` prop adicionada ao IslandCard de tasks
2. `safeParse` agora lança erro em vez de retornar null silenciosamente

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 0 erros novos (13 pré-existentes inalterados) |
| `bun run test` | ✅ 337 pass (project-store flaky em paralelo — pré-existente, #003 em BUGS_INCIDENTAIS) |
| `bun run build` | ✅ clean (client 21s + SSR 23s) |
| code-review | ✅ 2 HIGHs corrigidas antes de fechar |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `backend/app/services/__init__.py` | Modificado — helpers + refactor 4 funções |
| `backend/app/routes/tasks.py` | Modificado — /doing unwrap envelope |
| `api-contract/tasks.schema.ts` | Criado — contrato canônico tasks |
| `src/lib/api/client.ts` | Modificado — MOCK_REGISTRY tasks |
| `src/hooks/useTasks.ts` | Criado — useTasksToday + useTasks |
| `src/components/kratos/views/DashboardView.tsx` | Modificado — wiring real + isLoading |
| `tests/stores/tasks-reality.test.ts` | Criado — 18 testes |
| `scripts/start.ps1` | Modificado — port 8000 → 5100 (triage W0) |
| `src/hooks/useBackendHealth.ts` | Modificado — port 8000 → 5100 (triage W0) |
| `docs/auditoria/BUGS_INCIDENTAIS.md` | Atualizado — adicionado #003 flaky sort |

---

## Noção de Done (Notion criteria)

- [x] `GET /tasks` retorna SQLite real com envelope `{ data, source, source_ts }`
- [x] Empty SQLite → `source: "live"` (não mock disfarçado)
- [x] SQLite falha → `source: "mock"` com fallback transparente
- [x] Frontend hook `useTasksToday()` consome endpoint real
- [x] Dashboard IslandCard mostra dados reais + SourceBadge correto
- [x] `isLoading` prop correta — LoadingState exibe durante fetch
- [x] Zod parse failure → TanStack Query `isError: true` (não null silencioso)
- [x] 18 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**W2 — Projects Reality** (aguardando "KRATOS: vai W2" do Lucas)

Objetivo: `GET /projects` lendo SQLite real, mesma correção feita em W1 para tasks.

---

_HANDOFF gerado automaticamente — Wave W1 concluída_
