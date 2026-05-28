# HANDOFF W2 — Projects Reality

**Branch:** `feature/kratos-supreme-w0-w22`  
**Tag:** `ksw-w2-projects-real`  
**Data:** 2026-05-28  
**Status:** ✅ COMPLETO

---

## Objetivo da Wave

Corrigir a lacuna entre projetos salvos no SQLite e a exibição no dashboard.
`GET /projects` retornava lista bruta sem envelope (e silenciosamente servia mock
quando SQLite estava vazio). Agora retorna envelope `{ data, source, source_ts }`
com SourceBadge visível no IslandCard de projetos.

---

## O que foi feito

### B1 — Backend: helpers de envelope para projetos
`backend/app/services/__init__.py`:
- `_project_row_to_dict(row)` → converte sqlite3.Row em project dict
- `_project_envelope(data, source)` → monta `{ data, source, source_ts: iso }`
- `_mock_project_envelope(filename)` → envelope com source='mock' a partir de JSON
- `get_projects()` refatorado: SQLite OK → `source: "live"`. Exception → `source: "mock"`
  - Empty SQLite = `source: "live"` (fix do `if result:` bug)
- `get_project_detail()` atualizado: unwrap `envelope.get("data", [])` no fallback

### B2 — api-contract: project.schema.ts atualizado
`api-contract/project.schema.ts`:
- `ProjectAPIItemSchema` — schema permissivo que reflete campos Python SQLite
  (name, description, type, status, phase, priority, repo_path, etc.)
- `ProjectDataSourceSchema`, `ProjectEnvelopeSchema`
- `ProjectIslandItem`, `ProjectsIslandResult`
- `projectEnvelopeToIslandData()` — filtra active/running, limita a 5 (TDAH), preserva riskLevel
- Layer 1 (TypeScript store CRUD) preservada intacta

### B3 — MOCK_REGISTRY
`src/lib/api/client.ts` — adicionado `/projects` ao MOCK_REGISTRY para VITE_USE_MOCKS

### B4 — Hook: useProjectsAPI()
`src/hooks/useProjects.ts` — adicionada função nova ao arquivo existente:
- `useProjectsAPI()`: query `["projects", "api"]`, refetch 60s, stale 30s
- `fetchProjectsFromAPI()`: lança erro em falha Zod (não retorna null silenciosamente)
- `toDataSource()`: mapeia backend source → frontend DataSource

### B5 — IslandCard: domínio "projects"
`src/components/kratos/shell/IslandCard.tsx`:
- `FolderKanban` import do lucide-react
- `"projects"` adicionado a `IslandDomain` type
- `ProjectsIslandData` interface exportada
- `DOMAIN_META` entry: label "Projetos", icon FolderKanban, question "Projetos ativos"
- `ProjectsContent` componente: lista top-3 ativos com dot de risco colorido
- `case "projects"` no switch de renderContent()

### B6 — DashboardView wiring
`src/components/kratos/views/DashboardView.tsx`:
- `useProjectsAPI` import adicionado
- `MOCK_CONTEXT_DATA` removido (card "context" substituído por "projects" real)
- `ContextIslandData` removido dos imports (não usado mais)
- Hook `useProjectsAPI()` chamado com `projectsAPI`, `projectsSourceType`, `projectsLoading`
- IslandCard "context" → IslandCard "projects" com dados reais + `isLoading` prop correto

### B7 — Testes: projects-reality.test.ts (novo arquivo)
`tests/stores/projects-reality.test.ts` — 20 testes cobrindo:
- Path SQLite real (source: live)
- Path fallback mock (source: mock)
- Integridade do envelope
- Mapeamento para ProjectsIslandData

---

## Gate Final

| Gate | Resultado |
|---|---|
| `bun run typecheck` | ✅ 0 erros novos (13 pré-existentes inalterados) |
| `bun run test` | ✅ 358 pass, 0 fail (20 novos W2 testes) |
| `bun run build` | ✅ clean (3.5s SSR) |
| code-review | ✅ integrado inline (isLoading, Zod throw, sem hex inline) |

---

## Arquivos modificados / criados

| Arquivo | Ação |
|---|---|
| `backend/app/services/__init__.py` | Modificado — helpers + refactor get_projects |
| `api-contract/project.schema.ts` | Modificado — Layer 2 envelope + island types |
| `src/lib/api/client.ts` | Modificado — MOCK_REGISTRY /projects |
| `src/hooks/useProjects.ts` | Modificado — useProjectsAPI() adicionado |
| `src/components/kratos/shell/IslandCard.tsx` | Modificado — domain "projects" |
| `src/components/kratos/views/DashboardView.tsx` | Modificado — wiring projects real |
| `tests/stores/projects-reality.test.ts` | Criado — 20 testes |

---

## Noção de Done (Notion criteria)

- [x] `GET /projects` retorna SQLite real com envelope `{ data, source, source_ts }`
- [x] Empty SQLite → `source: "live"` (não mock disfarçado)
- [x] SQLite falha → `source: "mock"` com fallback transparente
- [x] Frontend hook `useProjectsAPI()` consome endpoint real
- [x] Dashboard IslandCard "projects" mostra dados reais + SourceBadge correto
- [x] `isLoading` prop correta — LoadingState exibe durante fetch
- [x] Zod parse failure → TanStack Query `isError: true`
- [x] 20 novos testes passando
- [x] Build limpo, 0 erros TypeScript novos

---

## Próxima Wave

**W6 — Offline/UI Hardening** (aguardando "KRATOS: vai W6" do Lucas)

Ordem P0: W0 ✅ → W1 ✅ → W2 ✅ → **W6** → W3 → W4 → W4.5 → W5 → [MARCO P0]

---

_HANDOFF gerado automaticamente — Wave W2 concluída_
