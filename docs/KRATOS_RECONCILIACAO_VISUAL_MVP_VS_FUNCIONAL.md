# KRATOS — Reconciliação Visual MVP vs Funcional

**Data:** 2026-05-16  
**Tipo:** Auditoria READ-ONLY  
**Commits:** `4d3868b` vs `169264c`  

---

## 1. Pasta atual

`C:\Users\lucas\kratos-mission-control` — raiz do monorepo com duas frentes.

---

## 2. Branch atual

`main`

---

## 3. Histórico dos commits

| Pergunta | Resposta |
|---|---|
| `4d3868b` existe? | **SIM** — `feat(kratos): build mission control visual cockpit MVP` |
| `169264c` existe? | **SIM** — `feat(kratos): phase 4 — UI integration layer (OMNIS + GitHub display)` |
| Estão no mesmo histórico? | **SIM** — `4d3868b` é ancestral direto de `169264c` |
| Qual é mais recente? | `169264c` (2026-05-16 18:18) é **33 commits mais novo** que `4d3868b` (2026-05-15 22:44) |

**Cadeia:** `4d3868b` → (33 commits de Phase 1-4, waves 01-20) → `169264c`

---

## 4. Estruturas encontradas

| Estrutura | Existe? | Função provável |
|---|---|---|
| `frontend/src/components/layout/MissionControlShell.tsx` | SIM | Shell visual 5 zonas com grid CSS + overlays 3D |
| `frontend/src/components/stage/` | SIM | StageArea + IslandHotspot + MissionBanner — ilhas interativas |
| `frontend/src/components/scene3d/` | SIM | React Three Fiber: CastleCentral, IslandMesh, Lighting, câmera isométrica |
| `src/components/kratos/views/SistemaView.tsx` | SIM | View de /sistema com KRATOS + OMNIS (criado Phase 4) |
| `src/routes/sistema.tsx` | SIM | Rota TanStack delegando para SistemaView |
| `src/components/kratos/sistema/` | SIM | 5 cards: ServiceHealthCard, OmnisServiceStatusCard, OmnisCrewCard, OmnisJobItem, GithubRepoCard |

---

## 5. App ativo

| Pergunta | Resposta |
|---|---|
| O app usa `frontend/` ou `src/` na raiz? | **AMBOS coexistem.** São dois apps independentes no mesmo repo |
| O localhost atual vem de qual package.json? | Depende de qual `npm run dev` foi executado — `frontend/` roda em `:5173`, raiz roda em `:3000` |
| Qual comando dev está rodando? | Raiz: `vite dev` (TanStack Start, porta 3000). Frontend: `vite` (Vite 5 vanilla, porta 5173) |
| Qual root renderiza a tela? | Frontend renderiza `<MissionControlShell />` (React 18 + BrowserRouter). Raiz renderiza TanStack Router com `<AppShell />` (React 19) |

### Dois package.json distintos

| Aspecto | `package.json` (raiz) | `frontend/package.json` |
|---|---|---|
| Nome | `tanstack_start_ts` | `kratos-cockpit` |
| React | **19.2.0** | **18.3.1** |
| Vite | **7.3.2** | **5.4.11** |
| Roteador | TanStack Router | React Router DOM v6 |
| 3D | — | Three.js + @react-three/fiber + @react-three/drei |
| UI Kit | Radix UI + shadcn/ui | Tailwind manual |
| Teste | bun test | vitest + jsdom |
| Deploy | Cloudflare Workers | — |

---

## 6. Diferença entre as frentes

### O que o Visual MVP (`4d3868b` / `frontend/`) tem que o funcional NÃO tem:

- **3D Scene** — React Three Fiber com 9 ilhas flutuantes + castelo central + oceano + nuvens
- **Shell 5 zonas** — grid CSS com TopBar(64px) + Sidebar(240px) + Stage + RightPanel(320px) + BottomBar(72px)
- **Hotspots interativos** — 9 ilhas clicáveis abrindo IslandDetailDrawer
- **AuroraChatDrawer** — drawer lateral tipo chat com comandos
- **SpotlightModal** — modal de comando spotlight
- **Overlays** — AgendaTodayCard, AuroraCard, FocusDayCard, MusicPlayer, NimbusCard, ProgressCard, QuoteCard, SquadSelector
- **Design visual de jogo** — estética "war room" 3D, ilhas flutuantes, pontes

### O que o funcional (`169264c` / `src/`) tem que o Visual MVP NÃO tem:

- **7 rotas reais** — `/`, `/agora`, `/agenda`, `/checkpoints`, `/projetos`, `/contexto`, `/sistema` com TanStack Router file-based
- **23 server functions** — `createServerFn` com input/output Zod validation
- **12 hooks** — TanStack Query com unwrapping de envelope `{ data, error }`
- **5 stores** — checkpoints, projects, appointments, github, omnis com cache TTL
- **61 testes** — bun test com stores isoladas, sem jsdom
- **Integrações reais** — GitHub API (fetchFromGithub) + OMNIS readonly bridge
- **Design System formal** — 40+ tokens CSS (`--kratos-*`), glass panels, kratos-mono, kratos-num
- **Neuro-UX** — Miller's Law 7±2, spatial memory, zero popups, TDAH-first
- **Accessibilidade** — focus-visible, aria-labels, skip link, prefers-reduced-motion
- **61 componentes React maduros** — views, agenda, agora, checkpoints, contexto, mentor, aurora
- **Repository pattern** — `createMapRepository()` com interface `Repository<T, C, U>` pronto para swap D1

### Sobreposição:

| Área | Visual MVP | Funcional |
|---|---|---|
| Sidebar navigation | SideBar + NavItem (manual) | Sidebar + SidebarItem (integrado ao router) |
| Top bar | TopBar com greeting estático | Topbar HUD com greeting dinâmico |
| Bottom bar | BottomBar com Nimbus | StatusBar |
| Right panel | RightPanel com cards | AuroraPanel (protegido) |
| App shell | MissionControlShell (grid CSS puro) | AppShell (componentizado) |
| Visual design | Hex hardcoded `#0f172a` | Tokens `var(--kratos-surface-0)` |

---

## 7. Recomendação técnica

### C) Manter ambos separados temporariamente

**Este é o caminho mais seguro.** Justificativa:

1. **React 18 vs 19** — versões incompatíveis de React. Migrar o Visual MVP (Three.js, R3F) para React 19 exigiria validação de compatibilidade do ecossistema Three.js.

2. **Arquiteturas fundamentalmente diferentes** — Vite 5 vanilla + BrowserRouter vs Vite 7 + TanStack Start + SSR. Unificar exigiria reescrever um dos lados completamente.

3. **O funcional é produtivo** — 61 testes, build verde, dados reais, deployável para Cloudflare Workers. Não comprometer com merge arriscado.

4. **O Visual MVP é um experimento de UX** — estética "war room 3D" não foi validada com o operador. Serve como protótipo de referência visual.

5. **Custos diferentes** — o funcional é SSR-friendly (Cloudflare Workers). O Visual MVP é client-only (Three.js não roda em SSR). Unificar forçaria decisões arquiteturais prematuras.

**Alternativa D — Plano de convergência em 2 fases:**

Fase A (agora): Extrair o design visual do Visual MVP como referência de tokens para evoluir o Design System funcional (cores "war room", efeito glass, tipografia).

Fase B (futuro): Se o operador validar a estética 3D, construir uma rota `/world` no KRATOS funcional usando React Three Fiber como client-only island (lazy load + suspense), consumindo os mesmos hooks e dados do sistema funcional.

---

## 8. Próximo passo recomendado

**Microfase 4.1 — Visual Token Sync (READ-ONLY)**

1. Extrair a paleta de cores do Visual MVP (`frontend/src/components/`):
   - Background principal: `#0f172a` (slate-900)
   - Superfícies: `#1e293b` (slate-800)
   - Bordas: `#334155` (slate-700)
   - Acento: `#38bdf8` (sky-400)

2. Comparar com os tokens atuais do funcional (`src/styles.css`):
   - `--kratos-surface-0: #0C0C0E` (mais escuro, preto puro)
   - `--kratos-surface-2: #17171B` (cinza escuro)
   - `--kratos-border: rgba(255,255,255,0.06)` (mais sutil)
   - `--kratos-accent: #818CF8` (indigo, mais suave)

3. Documentar os gaps e propor 3-5 tokens novos que trariam o "feel war room" sem quebrar o sistema existente.

**NÃO implementar.** Apenas entregar o relatório de tokens para decisão do operador.

---

## Notas

- O commit `169264c` está 33 commits à frente de `4d3868b` no mesmo branch `main`
- Ambos os apps estão buildando limpo em suas respectivas configurações
- Nenhum arquivo foi alterado durante esta auditoria
- Os arquivos corrompidos `".claude/agents\357\200\242..."` no git status são lixo de shell anterior — não relacionados
