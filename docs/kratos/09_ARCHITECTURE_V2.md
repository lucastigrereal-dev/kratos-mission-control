# KRATOS — Architecture v1.0

> Mapa técnico completo do projeto. A Manus não cria arquivos fora desta estrutura
> sem aprovação explícita. Stack obrigatória e imutável descrita abaixo.

---

## 1. STACK OBRIGATÓRIA (NÃO ALTERAR)

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 14+ |
| Linguagem | TypeScript | 5+ strict mode |
| Estilização | Tailwind CSS | 3.4+ |
| Componentes UI | Radix UI + componentes próprios | latest |
| Ícones | Lucide React | latest |
| State global | Zustand | 4+ |
| Server state | TanStack Query (React Query) | 5+ |
| Animações | Framer Motion | 11+ |
| Backend/DB | Supabase (NÃO TOCAR) | — |
| Auth | Supabase Auth (NÃO TOCAR) | — |
| Realtime | SSE via Supabase (NÃO TOCAR) | — |
| Formulários | React Hook Form + Zod | latest |

> ⚠️ PROIBIDO instalar dependências novas sem listar e aguardar aprovação.
> ⚠️ NUNCA alterar arquivos de backend, auth, Supabase client, ou endpoints de API.

---

## 2. ESTRUTURA DE PASTAS

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # RootLayout com providers
│   ├── page.tsx                  # Redireciona para /dashboard
│   ├── dashboard/
│   │   ├── layout.tsx            # AppShell (sidebar + topbar)
│   │   ├── page.tsx              # Mission Control (tela principal)
│   │   └── loading.tsx           # Skeleton do Mission Control
│   ├── quests/
│   │   ├── page.tsx              # Lista de missões
│   │   └── [id]/page.tsx         # Detalhe de missão
│   ├── skills/
│   │   └── page.tsx              # Mapa de habilidades
│   ├── arena/
│   │   └── page.tsx              # Batalha de hábitos
│   └── profile/
│       └── page.tsx              # Perfil e estatísticas
│
├── components/
│   ├── shell/                    # Estrutura da aplicação
│   │   ├── AppShell.tsx          # Layout raiz com sidebar+main
│   │   ├── TopBar.tsx            # Barra superior
│   │   ├── Sidebar.tsx           # Navegação lateral
│   │   ├── BottomDock.tsx        # Dock inferior (mobile + desktop)
│   │   └── RightRail.tsx         # Painel direito colapsável
│   │
│   ├── mission/                  # Mission Control
│   │   ├── MissionHero.tsx       # Card central da missão ativa
│   │   ├── NextActionCard.tsx    # Próxima ação em destaque
│   │   ├── MissionProgress.tsx   # Barra de progresso da missão
│   │   └── MissionEmpty.tsx      # Empty state sem missão ativa
│   │
│   ├── islands/                  # Ilhas do mapa
│   │   ├── IslandMap.tsx         # Container do mapa com canvas/grid
│   │   ├── IslandCard.tsx        # Card de cada ilha
│   │   ├── IslandLock.tsx        # Estado bloqueado de ilha
│   │   └── IslandBadge.tsx       # Badge de progresso da ilha
│   │
│   ├── quests/                   # Sistema de missões
│   │   ├── QuestCard.tsx         # Card de missão individual
│   │   ├── QuestList.tsx         # Lista paginada de missões
│   │   ├── QuestFilters.tsx      # Filtros de missão
│   │   └── QuestDetail.tsx       # Vista detalhada de uma missão
│   │
│   ├── hud/                      # Elementos do HUD
│   │   ├── XPBar.tsx             # Barra de experiência
│   │   ├── StreakCounter.tsx      # Contador de sequência
│   │   ├── LevelBadge.tsx        # Badge de nível atual
│   │   ├── AuroraBackground.tsx  # Fundo animado orgânico
│   │   └── StatusDot.tsx         # Indicador de status colorido
│   │
│   ├── ui/                       # Primitivos reutilizáveis
│   │   ├── GlassCard.tsx         # Card glassmorphism base
│   │   ├── Button.tsx            # Botão com variantes
│   │   ├── Badge.tsx             # Badge/chip
│   │   ├── ProgressBar.tsx       # Barra de progresso
│   │   ├── Skeleton.tsx          # Skeleton loader
│   │   ├── EmptyState.tsx        # Empty state padrão
│   │   ├── Tooltip.tsx           # Tooltip acessível
│   │   └── Modal.tsx             # Modal base
│   │
│   └── providers/
│       ├── QueryProvider.tsx     # TanStack Query
│       ├── ThemeProvider.tsx     # Tokens CSS globais
│       └── AuthProvider.tsx      # Auth state (NÃO ALTERAR lógica)
│
├── hooks/
│   ├── useCurrentMission.ts      # Missão ativa do usuário
│   ├── useXP.ts                  # Estado de XP e nível
│   ├── useStreak.ts              # Streak atual
│   ├── useQuests.ts              # Lista e filtros de missões
│   ├── useIslands.ts             # Estado das ilhas
│   └── useRealtime.ts            # SSE Supabase (NÃO ALTERAR)
│
├── stores/
│   ├── uiStore.ts                # Estado de UI (sidebar aberta, modal, etc.)
│   ├── missionStore.ts           # Cache local de missão ativa
│   └── userStore.ts              # Dados do usuário logado
│
├── types/
│   ├── mission.ts                # Types de missão e quest
│   ├── user.ts                   # Types de usuário e perfil
│   ├── island.ts                 # Types de ilhas e mapa
│   └── common.ts                 # Types compartilhados
│
├── lib/
│   ├── supabase/                 # Supabase client (NÃO ALTERAR)
│   ├── utils.ts                  # Utilitários gerais
│   └── cn.ts                     # clsx + twMerge helper
│
└── styles/
    ├── globals.css               # Tokens CSS + base stylesheet
    └── kratos-tokens.css         # Tokens KRATOS completos
```

---

## 3. CONVENÇÕES DE CÓDIGO

### TypeScript
- `strict: true` obrigatório no `tsconfig.json`
- Sem `any` — use `unknown` e type guards
- Props de componentes sempre tipadas com `interface ComponentNameProps`
- Hooks sempre retornam tipo explícito

### Componentes
- Componentes de UI: Client Components (`'use client'`) apenas quando necessário
- Server Components por padrão no App Router
- Lazy loading obrigatório para ilhas e componentes pesados:
  ```tsx
  const IslandMap = dynamic(() => import('@/components/islands/IslandMap'), {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false
  });
  ```

### Estilização
- Tailwind classes para estilos utilitários
- CSS custom properties (tokens) para valores de design
- `cn()` helper para merge condicional de classes
- ZERO estilos inline hardcoded

### Performance
- `React.memo()` em componentes que recebem props estáveis
- `useMemo()` e `useCallback()` onde houver computação pesada
- Imagens: sempre `next/image` com `width`, `height`, `priority` no hero
- `content-visibility: auto` em listas longas

---

## 4. LAYOUT DO APP SHELL

```
┌─────────────────────────────────────────────────────┐
│ TopBar (64px height, sticky, glassmorphism)          │
├──────────┬──────────────────────────────┬────────────┤
│          │                              │            │
│ Sidebar  │     Main Content Area        │ RightRail  │
│ (220px)  │     (flex: 1)                │ (280px)    │
│ sticky   │                              │ colapsável │
│          │                              │            │
│          │                              │            │
├──────────┴──────────────────────────────┴────────────┤
│ BottomDock (60px, sticky bottom, sempre visível)     │
└─────────────────────────────────────────────────────┘
```

**Regras do layout:**
- UMA região de scroll: apenas o `Main Content Area` rola
- `TopBar`, `Sidebar`, `RightRail`, `BottomDock` são sempre fixos
- Em mobile (< 768px): `Sidebar` vira drawer, `RightRail` some, `BottomDock` expande

---

## 5. FLUXO DE DADOS

```
Supabase DB
    ↓
TanStack Query (cache + refetch)
    ↓
Custom Hooks (useCurrentMission, useXP, etc.)
    ↓
Zustand Store (estado de UI)
    ↓
Componentes React
```

**SSE Realtime:**
- `useRealtime.ts` já está implementado — NÃO reescrever
- Apenas consuma os eventos via hook existente
- Invalide queries do TanStack Query ao receber eventos

---

## 6. ROTAS E NAVEGAÇÃO

| Rota | Componente principal | Descrição |
|---|---|---|
| `/` | redirect → `/dashboard` | — |
| `/dashboard` | `MissionControl` | Tela principal / hub central |
| `/quests` | `QuestList` | Todas as missões |
| `/quests/[id]` | `QuestDetail` | Detalhe de missão |
| `/skills` | `SkillMap` | Mapa de habilidades |
| `/arena` | `Arena` | Batalha de hábitos |
| `/profile` | `Profile` | Perfil e estatísticas |
