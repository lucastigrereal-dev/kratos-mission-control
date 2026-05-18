# KRATOS 1.0 — ROADMAP COMPLETO DE EXECUÇÃO
**Data:** 2026-05-18 | **Owner:** Lucas Tigre | **Meta:** KRATOS 0.9 → 1.0 Supremo

---

## DEFINIÇÃO CANÔNICA DO SISTEMA

```
KRATOS = cockpit local-first que transforma caos em próxima ação clara.

KRATOS → VÊ
Aurora → INTERPRETA
OMNIS  → AGE (Fase 5 — fora deste roadmap)
Lucas  → DECIDE (sempre)
```

---

## INVENTÁRIO DO QUE JÁ EXISTE (não recriar)

| Artefato | Localização | Status |
|---|---|---|
| Design tokens completos | `src/styles.css` | ✅ Completo |
| SourceBadgeIndicator | `src/components/kratos/base/SourceBadgeIndicator.tsx` | ✅ Existe — estender |
| source-badge.schema.ts | `api-contract/source-badge.schema.ts` | ✅ Existe — adicionar tipos |
| AuroraPanel | `src/components/kratos/shell/AuroraPanel.tsx` | ✅ Existe — estender |
| AuroraPanelContent | `src/components/kratos/aurora/AuroraPanelContent.tsx` | ✅ Existe — estender |
| useCheckpoints | `src/hooks/useCheckpoints.ts` | ✅ Existe — estender |
| useLiveStatus | `src/hooks/useLiveStatus.ts` | ✅ Existe — estender com SSE |
| useServices | `src/hooks/useServices.ts` | ✅ Existe |
| useDashboard | `src/hooks/useDashboard.ts` | ✅ Existe |
| DashboardView | `src/components/kratos/views/DashboardView.tsx` | ✅ Existe — refatorar |
| NextActionCard | `src/components/kratos/agora/NextActionCard.tsx` | ✅ Existe — estender |
| SystemPulseStrip | `src/components/kratos/agora/SystemPulseStrip.tsx` | ✅ Existe |
| ResumeFromHereCard | `src/components/kratos/checkpoints/ResumeFromHereCard.tsx` | ✅ Existe |
| RiskProjectCard | `src/components/kratos/mentor/RiskProjectCard.tsx` | ✅ Existe |
| MentorRecommendationCard | `src/components/kratos/mentor/MentorRecommendationCard.tsx` | ✅ Existe |
| API Contract V1 | `api-contract/KRATOS_API_CONTRACT_V1.md` | ✅ 55+ endpoints documentados |
| Backend base URL | `http://localhost:5100` | ✅ Definido no contrato |

**Regra de execução:** verificar lista acima antes de criar qualquer arquivo novo. Estender > recriar.

---

## ESTADO ATUAL DOS TESTES

```
Unit/Store:  41 pass  (bun test)
E2E:         42 pass / 3 skip / 0 fail  (playwright — porta 8081)
Build:       ✅ limpo  (bun run build)
Deploy:      ✅ live   (kratos-mission-control.i9lucastigre.workers.dev)
```

Manter estes números em 100% verde em cada fase.

---

## FASE 0 — VERDADE OPERACIONAL
**Duração estimada:** 1 dia | **Pré-requisito:** nada
**Meta:** cada dado exibido diz de onde veio. Zero teatro.

### 0.1 — Estender source-badge.schema.ts
**Arquivo:** `api-contract/source-badge.schema.ts`

Adicionar ao enum `DataSourceSchema` os tipos faltantes:
- `"error"` — falha de fetch não recuperável
- `"computed"` — derivado de outros dados localmente

Nenhum arquivo novo. Só adicionar ao schema existente.

### 0.2 — Estender SourceBadgeIndicator.tsx
**Arquivo:** `src/components/kratos/base/SourceBadgeIndicator.tsx`

Adicionar visuais para os dois novos tipos:
- `error` → X vermelho + texto "ERROR"
- `computed` → ícone `Cpu` azul + texto "COMPUTED"

Garantir que o componente aceita `size="sm"` para uso compacto nos cards.

### 0.3 — Criar src/lib/data-sources.ts
**Arquivo:** `src/lib/data-sources.ts` ← novo arquivo

```typescript
export const DATA_SOURCES_MAP = {
  mission_lens:  { endpoint: "/mission/lens",      fallback: "/live/snapshot" },
  tasks:         { endpoint: "/tasks/today",       fallback: "mock" },
  projects:      { endpoint: "/projects",          fallback: "mock" },
  system:        { endpoint: "/live/snapshot",     fallback: "cached" },
  docker:        { endpoint: "/live/snapshot",     fallback: "cached" },
  git:           { endpoint: "/live/snapshot",     fallback: "cached" },
  checkpoints:   { endpoint: "/checkpoints",       fallback: "mock" },
  alerts:        { endpoint: "/alerts/active",     fallback: "cached" },
  context:       { endpoint: "/context/current",   fallback: "fallback" },
  mentor:        { endpoint: "/mentor/summary",    fallback: "computed" },
  drift:         { endpoint: "/context/lost",      fallback: "computed" },
} as const;

export type DataDomain = keyof typeof DATA_SOURCES_MAP;
```

### 0.4 — Auditoria de mocks
- Grep por `mock-data/` em todos os hooks e componentes
- Qualquer componente consumindo mock direto → adicionar `SourceBadgeIndicator` com `source="mock"`
- Criar `.env.local` com `VITE_USE_MOCK=false`

### 0.5 — Gate de qualidade Fase 0
```bash
bun run build        # zero erros
bun test             # 41 pass mínimo
# Todo card com dado tem SourceBadgeIndicator visível
```

---

## FASE 1 — HOOKS (O PULSO DO SISTEMA)
**Duração estimada:** 2 dias | **Pré-requisito:** Fase 0 completa
**Meta:** uma fonte de verdade por domínio de dado. Nenhum fetch direto em componente.

**Nota de arquitetura:** o projeto usa TanStack Start com loaders SSR.
Hooks usam `@tanstack/react-query` com `staleTime`. Sem `localStorage` (sandbox bloqueia).
Cache cross-render via `useRef` apenas onde React Query não alcança (SSE state).

### 1.1 — useMissionLens.ts
**Arquivo:** `src/hooks/useMissionLens.ts` ← novo

```typescript
// Busca /mission/lens com zod.parse na resposta
// staleTime: 30_000
// fallback: /live/snapshot se mission/lens retornar 404
// Expõe: lens, isLoading, sourceType, refetch
// sourceType derivado: "live" | "cached" | "fallback" | "mock" | "error"
```

Schema Zod inline baseado no MissionLens interface do contrato.
Usar `createSnapshotEnvelopeSchema` de `source-badge.schema.ts`.

### 1.2 — Estender useLiveStatus.ts com SSE
**Arquivo:** `src/hooks/useLiveStatus.ts` ← modificar existente

Adicionar suporte a `GET /live/stream` (SSE):
```typescript
// 1. Conecta EventSource /live/stream
// 2. Cada evento → invalida React Query cache do snapshot
// 3. Se EventSource falha após 3s → polling /live/snapshot a cada 10s
// 4. Expõe: isSSEConnected, sourceType
```

### 1.3 — useDriftDetection.ts
**Arquivo:** `src/hooks/useDriftDetection.ts` ← novo

```typescript
// Busca /context/lost para drift do backend
// Complementa com document.visibilityState (janela em foco ou não)
// Thresholds: 10min → "drifting", 20min → "lost", 45min → "zombie"
// Nudge: uma mensagem por threshold por sessão (useRef para rastrear)
// Expõe: driftState, minutesOff, originalMission, nudgeMessage
// "drifting" | "lost" | "zombie" | "on-mission"
```

### 1.4 — Estender useCheckpoints.ts com resume
**Arquivo:** `src/hooks/useCheckpoints.ts` ← adicionar ao existente

```typescript
// Nova query: checkpoints com status="paused", limit=5
// Nova mutation: resumeMission(id) → POST /context/checkpoint com restore
// Expõe adicionalmente: pausedCheckpoints, resumeMission, canResume
```

### 1.5 — useSystemPulse.ts
**Arquivo:** `src/hooks/useSystemPulse.ts` ← novo

```typescript
// Polling /live/snapshot a cada 10s (staleTime: 10_000)
// Extrai: cpu_percent, ram_percent, docker_containers, git_dirty, alerts
// Deriva health: "healthy" | "degraded" | "critical"
//   CPU > 85% || RAM > 90% → "critical"
//   CPU > 70% || RAM > 80% → "degraded"
// Expõe: pulse, health, isLoading, sourceType
```

### 1.6 — Gate de qualidade Fase 1
```bash
bun run build        # zero erros
bun test             # 41 pass mínimo
# Cada hook testado com backend offline → fallback sem tela branca
```

---

## FASE 2 — COMPONENTES VISUAIS NOVOS
**Duração estimada:** 2-3 dias | **Pré-requisito:** Fase 1 completa
**Meta:** apenas o que não existe. Estender antes de criar.

### 2.1 — base/ProgressRing.tsx
**Arquivo:** `src/components/kratos/base/ProgressRing.tsx` ← novo

```typescript
// SVG ring de progresso para checkpoints
// Props: value (0-100), size?: number, color?: string, label?: string
// Animação de fill no mount: stroke-dashoffset de 0 → valor final
// 150ms, kr-ease-out
```

### 2.2 — shell/NextActionBlock.tsx
**Arquivo:** `src/components/kratos/shell/NextActionBlock.tsx` ← novo

O componente mais importante do sistema. Responde: "O que fazer agora?"

```typescript
// Props: action: MissionLens['next_action'], sourceType: DataSource
// Layout:
//   - Texto da ação: text-xl font-bold (destaque máximo)
//   - Priority badge: critical=vermelho, high=amarelo, medium=azul, low=cinza
//   - Tempo estimado: "~X min"
//   - Botão "Iniciar" → POST /context/checkpoint (salva ponto de partida)
//   - SourceBadgeIndicator no corner superior direito
// Se sourceType === "mock": banner roxo "DEMONSTRAÇÃO" acima do texto
// Se sourceType === "error": ErrorState com botão retry
```

### 2.3 — shell/IslandCard.tsx
**Arquivo:** `src/components/kratos/shell/IslandCard.tsx` ← novo

Cards flutuantes por domínio operacional:

```typescript
// Props: domain: "system"|"docker"|"git"|"tasks"|"context"|"alerts"
//        data: any, sourceType: DataSource, compact?: boolean
//
// Layouts por domínio:
//   system:  CPU bar + RAM bar + health badge
//   docker:  lista containers (nome + status dot), total running/total
//   git:     branch atual + dirty indicator (arquivo modificados) + commits ahead/behind
//   tasks:   3 tasks mais urgentes + "ver mais" link
//   context: app ativa + projeto inferido + tempo na missão
//   alerts:  lista alerts com severity (critical primeiro)
//
// Todo domínio: SourceBadgeIndicator no header do card
// ErrorBoundary por Island (falha num card não quebra os outros)
// Skeleton no shape exato do dado durante loading
```

### 2.4 — shell/DriftIndicator.tsx
**Arquivo:** `src/components/kratos/shell/DriftIndicator.tsx` ← novo

```typescript
// Aparece APENAS quando driftState !== "on-mission"
// Invisible quando on-mission (retorna null, zero espaço no layout)
//
// Visual: barra horizontal full-width abaixo do Topbar
//   verde → amarelo (10min) → laranja (20min) → vermelho (45min)
//   largura da barra proporcional aos minutos (max: 45min = 100%)
//
// Conteúdo: nudgeMessage do useDriftDetection + botão "Retomar missão"
// Botão → useCheckpoints.resumeMission() do último checkpoint paused
// Animação: entrada suave 200ms fade+slide-down
// Tom: sem culpa. "Você estava em X. Retomar?"
```

### 2.5 — Estender AuroraPanelContent.tsx
**Arquivo:** `src/components/kratos/aurora/AuroraPanelContent.tsx` ← modificar existente

Adicionar seções usando dados reais:
```typescript
// Seção 1: Mentor Summary → /mentor/summary (texto natural)
// Seção 2: Próxima Ação → lens.next_action (resumo compacto)
// Seção 3: Não Fazer → lens.do_not_do como lista com ícone X
// Seção 4: Riscos → até 3 riscos de lens.risks com severity badge
// Seção 5: Estado de Drift → driftState atual

// Aurora NUNCA tem botões de execução
// Aurora só mostra e interpreta — zero CTAs de ação
// Cada seção tem SourceBadgeIndicator próprio
```

### 2.6 — checkpoints/CheckpointResume.tsx
**Arquivo:** `src/components/kratos/checkpoints/CheckpointResume.tsx` ← novo
(Complementa ResumeFromHereCard.tsx existente — este é o container)

```typescript
// Props: missions: PausedCheckpoint[], onResume: (id: string) => void
// Lista de cards colapsáveis (máx 3 visíveis):
//   - Nome da missão
//   - Projeto relacionado
//   - "Pausado há X horas/dias"
//   - Preview do último contexto (1 linha)
//   - Botão "Retomar" → onResume(id)
// Empty state: "Nenhuma missão pausada. Tudo em dia."
// Atalho de teclado: Ctrl+R no BottomDock abre esta lista
```

### 2.7 — Gate de qualidade Fase 2
```bash
bun run build        # zero erros
bun run lint         # zero erros novos
# Cada novo componente: Loading, Empty, Error states implementados
# Todo componente com dado: SourceBadgeIndicator visível
# Mobile 375px: sem quebra de layout
# Dark mode: verificado (já é o padrão)
```

---

## FASE 3 — VIEW INTEGRADA (O COCKPIT)
**Duração estimada:** 2 dias | **Pré-requisito:** Fases 1 e 2 completas
**Meta:** layout cockpit completo. 10 segundos → missão + próxima ação visíveis.

### 3.1 — Refatorar DashboardView.tsx
**Arquivo:** `src/components/kratos/views/DashboardView.tsx` ← refatorar existente

Layout final do cockpit:

```
┌────────────────────────────────────────────────────────────────┐
│  Topbar: Logo + missão atual + SourceBadge global + DriftBar   │
├─────────────────────────────────────┬──────────────────────────┤
│                                     │                          │
│   NextActionBlock                   │   AuroraPanel            │
│   (centro, destaque máximo)         │   (340px, colapsável)    │
│                                     │                          │
│   ─────────────────────────         │   Toggle: botão flutuante│
│                                     │   Esc fecha              │
│   Island Grid (2×3):                │                          │
│   [System]  [Docker]  [Git]         │                          │
│   [Tasks]   [Context] [Alerts]      │                          │
│                                     │                          │
├─────────────────────────────────────┴──────────────────────────┤
│  BottomDock: CheckpointResume | Ctrl+S = salvar checkpoint     │
└────────────────────────────────────────────────────────────────┘
```

Regras de integração:
- Todos os dados via hooks Fase 1 — nenhum fetch direto no componente
- `sourceType` propagado para todos os filhos via props (não Context)
- Se `sourceType === "error"` global → ErrorState com retry + timestamp
- Se `sourceType === "mock"` → banner fixo no topo "MODO DEMONSTRAÇÃO"
- DriftIndicator renderiza abaixo do Topbar, ocupa zero espaço quando inativo
- AuroraPanel como `Suspense boundary` isolado (não bloqueia cockpit)

### 3.2 — Integrar atalhos de teclado globais
**Arquivo:** `src/__root.tsx` ← adicionar listener global

```typescript
// Ctrl+S     → salvar checkpoint imediato (POST /checkpoints)
// Ctrl+R     → abrir CheckpointResume no BottomDock
// Ctrl+\     → toggle AuroraPanel
// Esc        → fechar AuroraPanel (já implementado)
```

### 3.3 — Integrar DriftIndicator na rota /
**Arquivo:** `src/routes/index.tsx` ← modificar loader

Loader SSR deve pre-fetch:
- `/mission/lens` → MissionLens completo
- `/checkpoints?status=paused&limit=1` → último checkpoint pausado

Dados chegam no HTML — zero loading state inicial para itens críticos.

### 3.4 — Gate de qualidade Fase 3
```bash
bun run build                                    # zero erros
bun test                                         # 41 pass mínimo
PLAYWRIGHT_BASE_URL=http://localhost:8081 bun run test:e2e  # 42/45 mínimo
```

**Teste manual dos 5 critérios:**
```
[ ] Teste 1 — Clareza:    abriu → 10s → missão + próxima ação + risco + sistema visíveis
[ ] Teste 2 — Verdade:    todo card tem SourceBadge visível
[ ] Teste 3 — Anti-dash:  cada island responde 1 pergunta operacional
[ ] Teste 4 — Fronteira:  Aurora só mostra, nenhum botão de execução nela
[ ] Teste 5 — Retomada:   interrompeu → reabriu → checkpoint + botão retomar visíveis
```

---

## FASE 4 — DRIFT DETECTION E ZOMBIE PROJECTS
**Duração estimada:** 1 dia | **Pré-requisito:** Fase 3 completa
**Meta:** sistema detecta dispersão e age suavemente.

### 4.1 — Ativar DriftIndicator na view principal
- `useDriftDetection` integrado no `DashboardView`
- `DriftIndicator` renderizando quando `driftState !== "on-mission"`
- Nudge: aparece uma vez por threshold por sessão (rastreado via `useRef`)
- Nenhum popup, nenhum toast bloqueante — só a barra sutil

### 4.2 — Zombie Project Detection
**Arquivo:** `src/components/kratos/projects/ZombieBadge.tsx` ← novo pequeno componente

```typescript
// Lógica: projeto com último checkpoint updated_at > 72h atrás
// Query adicional em useProjects: calcular zombie_since para cada projeto
// Badge "Zumbi" cinza na IslandCard de projects/tasks
// Sem alarme — só indicação visual discreta
```

### 4.3 — /agora route completa
**Arquivo:** `src/routes/agora.tsx` e `src/components/kratos/views/AgoraView.tsx`

A rota `/agora` é o modo foco máximo:
- Só `NextActionBlock` + `DriftIndicator`
- Island grid oculto
- AuroraPanel disponível via toggle
- Sem sidebar (ou sidebar colapsada automática)

### 4.4 — Gate final Fase 4
```bash
bun run build        # zero erros
bun test             # 41 pass mínimo
bun run lint         # zero erros novos
PLAYWRIGHT_BASE_URL=http://localhost:8081 bun run test:e2e  # 42/45 mínimo
git push origin main # CI Cloudflare → deploy verde
```

---

## FASE 5 — POLISH E KRATOS 1.0
**Duração estimada:** 1 dia | **Pré-requisito:** Fase 4 completa
**Meta:** produto que o Lucas abre toda manhã sem atrito.

### 5.1 — Auditoria final de UX/TDAH
Checklist neuro-compatível:
```
[ ] Máximo 7 elementos de decisão visíveis por tela (Lei de Miller)
[ ] 1 ação primária por tela (NextActionBlock é o mais proeminente)
[ ] Posições fixas — nenhum componente reordena sozinho
[ ] Zero popups sem trigger explícito
[ ] Animações: máx 2 simultâneas, duração ≤ 200ms, sem loops infinitos
[ ] prefers-reduced-motion: desliga toda animação (testar)
[ ] Mobile 375px: cockpit legível sem scroll horizontal
[ ] Console do navegador: zero erros em todas as 7 rotas
```

### 5.2 — Mensagem canônica no sistema
Garantir que aparece na tela principal quando missão é carregada:

> "Tigrão, você estava aqui. O próximo passo é esse."

### 5.3 — Storybook mínimo de estados (opcional, se tempo permitir)
Para cada componente novo: documentar os 4 estados visuais:
- `live` com dados reais
- `mock` com badge roxo
- `error` com ErrorState
- `loading` com skeleton

### 5.4 — Definition of Done final — KRATOS 1.0

#### TypeScript
- [ ] `bun run lint` — zero erros novos
- [ ] Zero `any` no código novo
- [ ] Todas as props com `interface` definida

#### Build & Deploy
- [ ] `bun run build` — zero erros (client + SSR)
- [ ] `git push main` → Cloudflare CI → deploy verde automático
- [ ] URL de produção respondendo: `kratos-mission-control.i9lucastigre.workers.dev`

#### Testes
- [ ] `bun test` — 41+ pass
- [ ] `bun run test:e2e` — 42/45 pass

#### Funcional
- [ ] Backend offline → fallback visual em todos os cards, sem tela branca
- [ ] Backend online → `source="live"` em todos os badges
- [ ] SSE conectado → dados atualizam sem polling manual
- [ ] Ctrl+S → checkpoint salvo
- [ ] Botão "Retomar" → missão restaurada

#### Os 5 testes canônicos
- [ ] **Clareza:** 10 segundos → missão + próxima ação + risco + sistema
- [ ] **Verdade:** todo card tem SourceBadge
- [ ] **Anti-dashboard:** cada island responde 1 pergunta operacional
- [ ] **Fronteira:** Aurora só mostra
- [ ] **Retomada:** checkpoint resume funcionando

---

## SEQUÊNCIA DE EXECUÇÃO (ordem obrigatória)

```
FASE 0: Verdade Operacional          → 1 dia
  └── 0.1 Estender source-badge.schema.ts
  └── 0.2 Estender SourceBadgeIndicator.tsx
  └── 0.3 Criar data-sources.ts
  └── 0.4 Auditoria de mocks

FASE 1: Hooks                        → 2 dias
  └── 1.1 useMissionLens.ts (novo)
  └── 1.2 Estender useLiveStatus.ts (SSE)
  └── 1.3 useDriftDetection.ts (novo)
  └── 1.4 Estender useCheckpoints.ts (resume)
  └── 1.5 useSystemPulse.ts (novo)

FASE 2: Componentes novos            → 2-3 dias
  └── 2.1 base/ProgressRing.tsx
  └── 2.2 shell/NextActionBlock.tsx ← mais importante
  └── 2.3 shell/IslandCard.tsx
  └── 2.4 shell/DriftIndicator.tsx
  └── 2.5 Estender AuroraPanelContent.tsx
  └── 2.6 checkpoints/CheckpointResume.tsx

FASE 3: View integrada               → 2 dias
  └── 3.1 Refatorar DashboardView.tsx
  └── 3.2 Atalhos globais Ctrl+S, Ctrl+R, Ctrl+\
  └── 3.3 Loader SSR para rota /

FASE 4: Drift + Zombie + /agora      → 1 dia
  └── 4.1 DriftIndicator ativo
  └── 4.2 ZombieBadge.tsx
  └── 4.3 /agora route completa

FASE 5: Polish + KRATOS 1.0          → 1 dia
  └── 5.1 Auditoria UX/TDAH
  └── 5.2 Mensagem canônica
  └── 5.3 Definition of Done completo

TOTAL ESTIMADO: 9-10 dias de execução
```

---

## REGRAS INVIOLÁVEIS (checklist de cada PR)

1. Backend não é alterado — só consomido
2. Sem `localStorage` — React Query + `useRef` para cache
3. Todo dado exibido tem `SourceBadgeIndicator` visível
4. `mock` só existe com badge "MOCK" em roxo
5. Aurora zero CTAs de execução
6. OMNIS/Akasha fora do escopo — Fase 5 futura separada
7. Drift nudge: suave, sem popup bloqueante, uma vez por threshold por sessão
8. `bun run build` limpo antes de cada commit
9. `src/routeTree.gen.ts` nunca editado manualmente
10. Deploy só via `git push main` → CI automático

---

## FRASE CANÔNICA DO SISTEMA

> "Tigrão, você estava aqui. O próximo passo é esse."

**KRATOS é o olho. Aurora é a consciência. Lucas é o comandante.**

---

*Gerado em 2026-05-18 | kratos-mission-control | Branch: main*
