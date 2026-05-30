# KRATOS 1.0 FRONTEND VISUAL — CODEX SCOPE

## Objetivo
Transformar o KRATOS 0.9 funcional em KRATOS 1.0 visual-operacional, com frontend Apple-clean + mundo vivo de ilhas + HUD + Aurora contextual, preservando 100% do backend.

## Regras absolutas
- Codex mexe no visual.
- Codex não mexe no contrato vivo.
- Backend proibido.
- SSE preservado.
- Mission Lens preservado.
- Build obrigatório no final.

## Escopo permitido

### 1. Frontend Visual
- Design system (tokens, componentes base)
- AppShell (TopBar/HUD, Sidebar, BottomDock, RightRail)
- WorldMap 2D/pseudo-3D com ilhas flutuantes
- AuroraPanel contextual
- Telas de ilhas (Agência, Akasha, Arena, Filosofia, Forja, Nimbus, Observatório, OMNIS Lab, Tesouro, Vila)
- Estados visuais (live/stale/degraded/offline)
- Neuro-UX TDAH-first

### 2. Componentes permitidos
- `frontend/src/index.css` (tokens CSS)
- `frontend/src/styles/**` (estilos base)
- `frontend/src/components/ui/**` (componentes UI base)
- `frontend/src/components/layout/**` (componentes de layout)
- `frontend/src/components/world/**` (componentes do mundo)
- `frontend/src/components/scene3d/**` (componentes 3D, se necessário)
- `frontend/src/pages/**` (telas)

### 3. Hooks permitidos
- Leitura de `useLiveKratos.ts` (não modificação)
- Leitura de `useApi.ts` (não modificação)
- Criação de novos hooks visuais

## Escopo proibido

### 1. Backend
- `backend/` (diretório inteiro)
- `data/` (diretório de dados)
- Arquivos SQLite
- Collectors
- Services Python
- Routers FastAPI
- Endpoints
- Contratos de API
- Schema do banco
- Autenticação
- Supabase
- WebSocket

### 2. Arquivos críticos
- `useLiveKratos.ts` (apenas leitura)
- `lib/api.ts` (apenas leitura)
- `backend/**/*`
- `.env` com segredos

## Arquitetura visual esperada

```
┌─────────────────────────────────────────────────────┐
│  TopHUD (48px) — Topbar: breadcrumb + Aurora orb    │
├─────┬───────────────────────────────────────────────┤
│     │   WORLD MAP / ROTAS / ILHAS (flex-1)          │
│ S   │                                               │
│ i   │   /           → Dashboard + WorldMap          │
│ d   │   /agora       → FocusCard, NextAction        │
│ e   │   /agenda      → Calendário, Deadlines        │
│ b   │   /projetos    → ProjectCard, Pipeline        │
│ a   │   /contexto    → CurrentContext, FocusDrift   │
│ r   │   /checkpoints → Timeline, ResumeFromHere     │
│     │   /sistema     → Health, GitHub, OMNIS        │
│     │   /perfil      → Profile, Billing             │
│     │   /ilhas/:id   → 10 island screens            │
├─────┴───────────────────────────────────────────────┤
│  BottomDock (56px)                                  │
└─────────────────────────────────────────────────────┘
```

## Critério de aceite
- `npm run build` passa.
- O backend não foi alterado.
- SSE continua funcionando.
- `/live/snapshot` continua funcionando.
- `/mission/lens` continua funcionando.
- A tela principal responde às 9 perguntas operacionais.
- O visual parece KRATOS, não SaaS azul genérico.