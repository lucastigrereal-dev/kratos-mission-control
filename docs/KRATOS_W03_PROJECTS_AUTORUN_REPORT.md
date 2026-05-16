# KRATOS W03 — Projetos data/API/UI
## Auto-Run Report · 2026-05-16

**Status: VERDE** ✅
**Wave:** W03 — Projetos data/API/UI
**Build:** Cliente + SSR limpos, zero erros

---

## Blocos Executados

| Bloco | Descrição | Status |
|---|---|---|
| 01 | Auditar /projetos atual (PlaceholderRoute stub) | ✅ |
| 02 | Criar schema Zod Project | ✅ |
| 03 | Criar hook useProjects | ✅ |
| 04 | Criar store in-memory + server functions | ✅ |
| 05 | Seedear projetos: Omnis, Kratos, Lusterart, Casa Segura, Instagramas | ✅ |
| 06 | Conectar /projetos ao hook | ✅ |
| 07 | Criar loading/empty/error/data states | ✅ |
| 08 | Criar ação primária real: toggle Ativar/Pausar | ✅ |
| 09 | Build e correções | ✅ |
| 10 | Relatório e commit seletivo | ✅ |

---

## Arquivos Criados

### `api-contract/project.schema.ts`
- `ProjectStatus`: "active" | "paused" | "completed" | "archived"
- `ProjectSchema`: id, nome, descricao, status, repo, prioridade (1-5), ultimaAtividade, timestamps
- `CreateProjectSchema` + `UpdateProjectSchema` com validação

### `backend/projects/store.ts`
- `Map<string, Project>` in-memory
- Seed com 5 projetos reais: KRATOS, OMNIS, Lusterart, Casa Segura, Instagramas
- CRUD completo: getAll (sorted by prioridade + updated), getById, create, update, remove

### `src/lib/project-server-fns.ts`
- 5 server functions: getProjects, getProject, createProject, updateProject, deleteProject
- Validação Zod em create/update
- Padrão consistente com checkpoint-server-fns

### `src/hooks/useProjects.ts`
- useProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject
- TanStack Query com staleTime 30s
- Invalidação de cache em mutations

### `src/components/kratos/projects/ProjectCard.tsx`
- Card individual com nome, descrição, status chip, estrelas de prioridade
- Botão toggle Ativar/Pausar (funcional, com feedback de pending)
- Timestamp relativo de última atividade
- Indicador de repo quando presente

### `src/components/kratos/projects/ProjectFilterBar.tsx`
- Filtros: Todos, Ativos, Pausados, Concluídos
- Contadores por status
- Chip ativo com destaque visual (`--kratos-border-live`)

### `src/components/kratos/views/ProjetosView.tsx`
- Estados: Loading, Error (com retry), Empty (com CTA criar), Empty filtrado
- Grid 3-colunas de ProjectCards
- Inline create form com auto-focus, Enter/Escape
- Summary stats no subtitle (X ativos · Y pausados)
- Toggle status funcional com pendingId tracking

### `src/routes/projetos.tsx` (modificado)
- Substitui PlaceholderRoute por ProjetosView funcional

---

## Design Compliance

- ✅ Zero `style={{ color: "#..." }}`
- ✅ Zero botões decorativos
- ✅ Loading, Empty, Error states em todas as branches
- ✅ 1 ação primária por card (toggle status)
- ✅ Dark mode via tokens CSS
- ✅ Nenhum `any` no código novo

---

## Mudanças fora de escopo NÃO tocadas

- `src/routeTree.gen.ts` — pré-existente
- `docs/KRATOS_IDEALIZATION_*` — pré-existente
- Phantom files — ignorados

---

## Próxima Wave

**W04 — Agenda data/API/UI** — autorizada.
