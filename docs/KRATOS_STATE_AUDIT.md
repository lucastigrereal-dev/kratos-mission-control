# KRATOS State Store Audit

**Data:** 2026-05-16
**Commit:** `64f9c0e`

---

## Resumo executivo

KRATOS NAO precisa de estado global. Nao ha Zustand, Redux, React Context, nem stores globais — e isso esta CORRETO para a arquitetura atual. TanStack Query faz todo o trabalho pesado de cache, invalidation e compartilhamento entre componentes.

---

## 1. Arquitetura de estado atual

### Camadas (bottom-up)

```
┌─────────────────────────────────────────────┐
│  Views (AgendaView, AgoraView, etc.)        │  ← consomem hooks
├─────────────────────────────────────────────┤
│  Hooks (useCheckpoints, useProjects, etc.)  │  ← TanStack Query wrappers
├─────────────────────────────────────────────┤
│  Server Fns (createServerFn)                │  ← RPC bridge
├─────────────────────────────────────────────┤
│  Backend Stores (Map-based)                 │  ← dados volateis
└─────────────────────────────────────────────┘
```

### 1.1 Backend Stores (7)

| Store | Arquivo | Tipo | Persistencia | Seeds |
|---|---|---|---|---|
| Checkpoints | `backend/checkpoints/store.ts` | `createMapRepository` | Memoria | 3 |
| Projects | `backend/projects/store.ts` | `createMapRepository` | Memoria | 5 |
| Appointments | `backend/appointments/store.ts` | `createMapRepository` | Memoria | 11 |
| Contexto | `backend/contexto/store.ts` | Variavel unica | Memoria | 1 snapshot |
| Services | `backend/services/store.ts` | Map manual | Memoria | 8 servicos |
| OMNIS | `backend/omnis/store.ts` | Map cache + mock | Memoria (30s TTL) | 8 svc, 5 crews, 4 jobs |
| GitHub | `backend/github/store.ts` | Map cache + API real | Memoria (2min TTL) | 2 repos mock |

Todas as stores sao **in-memory**, resetam ao reiniciar o dev server. Sem banco de dados, sem arquivo local, sem localStorage. Os seeds garantem que o cockpit sempre abre com dados visiveis.

### 1.2 Server Functions (8 arquivos, 23 fns)

Todas seguem o padrao `Envelope<T> = { data: T | null, error: string | null }`.

| Dominio | Arquivo | Fns |
|---|---|---|
| Checkpoints | `checkpoint-server-fns.ts` | 5 (CRUD + getById) |
| Projects | `project-server-fns.ts` | 5 (CRUD + getById) |
| Appointments | `appointment-server-fns.ts` | 5 (CRUD + getById) |
| Contexto | `contexto-server-fns.ts` | 1 (getSnapshot) |
| Services | `service-server-fns.ts` | 1 (getServicesHealth) |
| GitHub | `github-server-fns.ts` | 2 (getRepo, getTracked) |
| OMNIS | `omnis-server-fns.ts` | 4 (status, health, crews, jobs) |

### 1.3 Hooks (11 arquivos)

| Hook | Tipo | Dependencias |
|---|---|---|
| `useCheckpoints` | Query + Mutation (CRUD) | checkpoint-server-fns |
| `useProjects` | Query + Mutation (CRUD) | project-server-fns |
| `useAppointments` | Query + Mutation (CRUD) | appointment-server-fns |
| `useContextSnapshot` | Query + refetch | contexto-server-fns |
| `useServices` | Query + refetch | service-server-fns |
| `useGithubRepo` | Query | github-server-fns |
| `useTrackedRepos` | Query | github-server-fns |
| `useOmnisStatus` | Query | omnis-server-fns |
| `useOmnisHealth` | Query | omnis-server-fns |
| `useOmnisCrews` | Query | omnis-server-fns |
| `useOmnisJobs` | Query | omnis-server-fns |
| `useDashboard` | Composite (4 queries) | checkpoint + project + appointment + contexto |
| `useLiveStatus` | Derivation (useMemo) | useServices + useOmnisStatus + cp count |
| `useCheckpointSuggestion` | Derivation (useMemo) | useCheckpoints + useProjects |
| `useApi` | **MORTO** | Nao referenciado em `src/` |

---

## 2. Prop drilling

### Fluxo atual

```
AppShell (owner do estado local)
  ├── Sidebar      ← collapsed, onToggle        (1 nivel)
  ├── Topbar       ← liveState, lastUpdate,      (1 nivel)
  │                   auroraOpen, onToggleAurora
  ├── children     ← nada (so children slot)
  ├── AuroraPanel  ← open, onClose               (1 nivel)
  └── StatusBar    ← liveState, lastUpdate,      (1 nivel)
                      buildTime
```

**Nao ha prop drilling profundo.** O maximo e 1 nivel (AppShell → filho direto). Os views (`AgendaView`, `AgoraView`, etc.) nao recebem props do AppShell — cada view chama seus proprios hooks.

### Problema identificado

`AppShell.tsx:11-13` usa constantes hardcoded:

```ts
const LIVE_STATE: LiveState = "live";
const LAST_UPDATE = "12s ago";
const BUILD_TIME = "2026.05.08";
```

Topbar e StatusBar recebem esses valores estaticos em vez de dados reais. Isso significa que o HUD superior/inferior sempre mostra "live" / "12s ago", mesmo que os servicos estejam offline. O `useLiveStatus` hook existe e funciona, mas nao e usado pelo AppShell.

---

## 3. Comunicacao cross-component

### Mecanismo unico: CustomEvent

`AgoraView.tsx:239` despacha um CustomEvent para abrir o AuroraPanel:

```ts
const event = new CustomEvent("kratos:open-aurora");
window.dispatchEvent(event);
```

Porem, **nenhum componente escuta esse evento.** O `AuroraPanel` recebe `open`/`onClose` como props do AppShell. O evento e despachado mas nao tem listener — aparentemente e uma bridge preparada para uso futuro ou foi desconectada durante refatoracao.

---

## 4. TanStack Query como state manager de facto

Toda sincronizacao entre componentes que consomem os mesmos dados e feita pelo cache do TanStack Query:

- `queryClient.invalidateQueries({ queryKey: ["checkpoints"] })` propaga mutations para todos os componentes que leem checkpoints
- `staleTime` varia de 15s (contexto/services) a 120s (tracked repos)
- Nao ha `refetchInterval` exceto em contexto e services (30s)

Isso e suficiente para o caso de uso atual: **1 operador, 1 aba, dados locais.** Nao ha cenarios multi-usuario ou multi-sessao.

---

## 5. O que NAO precisa de estado global

| Tentacao | Por que NAO |
|---|---|
| "Preciso de um store global de checkpoints" | TanStack Query ja cacheia e invalida. Views chamam `useCheckpoints()` independentemente |
| "Sidebar state deveria ser global" | So o AppShell usa. 1 nivel de prop drilling e aceitavel |
| "AuroraPanel state deveria ser global" | So AppShell + Topbar + AgoraView (via evento) tocam. CustomEvent resolve o caso cross-branch |
| "Tema/cores deveriam ser contexto" | CSS custom properties ja resolvem. Nao ha light mode |
| "User/prefs globais" | Nao ha auth, nao ha multi-user |

---

## 6. Achados e recomendacoes

### Achado #1 — `useApi.ts` e codigo morto

Arquivo: `src/hooks/useApi.ts` (157 linhas)
- Define `apiFetch<T>()` e `useApi<T>()` — baseados em `fetch()` raw + `useState`/`useEffect`
- **Zero referencias** em todo `src/`
- Todos os hooks reais usam `createServerFn` + TanStack Query
- **Recomendacao:** Remover na W012 (limpeza de codigo morto). Nao quebra build nem testes.

### Achado #2 — AppShell usa constantes estaticas

Topbar e StatusBar sempre mostram "live" e "12s ago". O `useLiveStatus` hook ja existe e fornece dados reais, mas o AppShell nao o consome.

- **Recomendacao:** AppShell deveria chamar `useLiveStatus()` e passar valores reais para Topbar/StatusBar. Porem, AppShell e componente protegido — requer autorizacao explicita.

### Achado #3 — CustomEvent `kratos:open-aurora` sem listener

O evento e despachado mas ninguem escuta. O clique no `AuroraShortcutCard` nao tem efeito visivel.

- **Recomendacao:** Adicionar listener no AppShell ou remover o disparo. Como AppShell e protegido, documentar como bug conhecido.

### Achado #4 — Seeds sao a unica fonte de dados

Todas as stores reiniciam com seeds no boot. Nao ha persistencia entre sessoes. Isso e intencional para a fase atual (sandbox), mas sera um gap quando o sistema for usado de verdade.

---

## 7. Verdicto final

**NAO implementar estado global.** A arquitetura atual esta correta para o escopo:

- TanStack Query = state manager de facto para dados de servidor
- `useState` local = para UI state (sidebar, aurora panel)
- CustomEvent = para comunicacao cross-branch pontual
- `localStorage` = para preferencias de UI que sobrevivem a refresh

Se um dia houver necessidade real (ex.: websocket live updates, multi-aba sync, undo/redo stack), a resposta e um **contexto React simples e escopado** — nunca Zustand/Redux.

---

## 8. Itens de acao

| ID | Acao | Prioridade | Bloqueio |
|---|---|---|---|
| A1 | Remover `src/hooks/useApi.ts` | P2 | Nenhum |
| A2 | Wire `useLiveStatus` no AppShell | P2 | AppShell e protegido |
| A3 | Consertar listener do `kratos:open-aurora` ou remover dispatch | P2 | AppShell e protegido |
| A4 | Plano de persistencia (D1/Supabase) — fora do escopo atual | P3 | Aguarda decisao de arquitetura |
