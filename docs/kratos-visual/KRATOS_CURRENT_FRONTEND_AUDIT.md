# KRATOS CURRENT FRONTEND AUDIT

## Stack detectada
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: FastAPI (Python) + SQLite local
- Build tool: Vite
- Package manager: npm (frontend), pip (backend)
- Testing: Vitest (frontend), pytest (backend)
- Real-time: SSE (Server-Sent Events) for live updates
- 3D Graphics: Three.js + React Three Fiber (já instalado)

## Estrutura atual do frontend
```
frontend/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css (Tailwind importado)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── KratosVisualShell.tsx
│   │   │   ├── KratosTopHud.tsx
│   │   │   ├── KratosSidebar.tsx
│   │   │   ├── KratosBottomDock.tsx
│   │   │   └── KratosRightRail.tsx
│   │   ├── scene3d/
│   │   │   ├── WorldScene.tsx
│   │   │   └── various 3D components
│   │   ├── world/
│   │   │   ├── KratosWorldMap.tsx
│   │   │   ├── FloatingIsland.tsx
│   │   │   ├── CentralCastleIsland.tsx
│   │   │   └── various world components
│   │   ├── ui/
│   │   │   ├── various UI components
│   │   │   └── shared components
│   │   └── various component files
│   ├── pages/
│   │   ├── VisaoGeralPage.tsx
│   │   ├── TarefasPage.tsx
│   │   ├── ProjetosPage.tsx
│   │   ├── ContextoPage.tsx
│   │   ├── CheckpointsPage.tsx
│   │   ├── SistemaPage.tsx
│   │   ├── MissionLensPage.tsx
│   │   ├── OmnisPage.tsx
│   │   ├── AuroraPage.tsx
│   │   ├── ApprovalsPage.tsx
│   │   └── various other pages
│   ├── hooks/
│   │   ├── useLiveKratos.ts (SSE connection)
│   │   ├── useApi.ts (REST API calls)
│   │   ├── useCheckpointSuggestion.ts
│   │   └── various test files
│   └── styles/
├── public/
│   ├── assets/
│   ├── islands/
│   ├── manifest.webmanifest
│   └── sw.js
├── package.json (scripts: dev, build, test, preview)
└── vite.config.ts
```

## Componentes existentes

### Layout Components
- `KratosVisualShell.tsx` - Main app shell container
- `KratosTopHud.tsx` - Top navigation bar with HUD elements
- `KratosSidebar.tsx` - Left sidebar navigation
- `KratosBottomDock.tsx` - Bottom dock with quick actions
- `KratosRightRail.tsx` - Right rail with context information

### World Components
- `KratosWorldMap.tsx` - Main world map container
- `FloatingIsland.tsx` - Base floating island component
- `CentralCastleIsland.tsx` - Central castle island
- `WorldScene.tsx` - 3D world scene container

### UI Components
- `SourceBadge.tsx` - Data source indicator
- `LoadingSkeleton.tsx` - Loading state component
- `AuroraPanel.tsx` - Aurora AI panel
- `CheckpointTimeline.tsx` - Checkpoint timeline visualization
- `ProjectContinuityCard.tsx` - Project continuity card
- Various other cards and UI elements

### Pages
- `VisaoGeralPage.tsx` - Overview/dashboard page
- `TarefasPage.tsx` - Tasks page
- `ProjetosPage.tsx` - Projects page
- `ContextoPage.tsx` - Context page
- `CheckpointsPage.tsx` - Checkpoints page
- `SistemaPage.tsx` - System status page
- `MissionLensPage.tsx` - Mission lens page
- `OmnisPage.tsx` - OMNIS page
- `AuroraPage.tsx` - Aurora page
- `ApprovalsPage.tsx` - Approvals page

## Hooks existentes
- `useLiveKratos.ts` - SSE connection and live data
- `useApi.ts` - REST API calls with source tracking
- `useCheckpointSuggestion.ts` - Checkpoint suggestions

## Estado atual
- Tailwind CSS configurado e funcionando
- React Router configurado
- Three.js e React Three Fiber instalados
- SSE connection implementada
- Componentes básicos existentes mas precisam de visual upgrade
- Design system básico presente mas precisa ser expandido

## Arquivos que precisam ser alterados
1. `frontend/src/index.css` - Adicionar design tokens
2. `frontend/src/styles/` - Adicionar estilos base
3. `frontend/src/components/layout/` - Aprimorar AppShell
4. `frontend/src/components/world/` - Aprimorar WorldMap e ilhas
5. `frontend/src/components/ui/` - Criar componentes UI base
6. `frontend/src/pages/` - Aprimorar páginas existentes
7. `frontend/src/components/scene3d/` - Aprimorar componentes 3D

## Riscos
1. Three.js já instalado - Precisamos ter cuidado para não criar versões duplicadas
2. Backend tem muitos arquivos (2569 arquivos Python) - Não devemos modificá-lo
3. Conexão SSE já está funcionando - Devemos preservá-la
4. Mission Lens endpoint (/mission/lens) já existe - Devemos integrá-lo corretamente