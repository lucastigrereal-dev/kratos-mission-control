# KRATOS CODEX AUDIT

## Stack detectada
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: FastAPI (Python) + SQLite local
- Build tool: Vite
- Package manager: npm (frontend), pip (backend)
- Testing: Vitest (frontend), pytest (backend)
- Real-time: SSE (Server-Sent Events) for live updates
- 3D Graphics: Three.js + React Three Fiber (already installed)

## Estrutura do frontend
```
frontend/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css (Tailwind importado)
│   ├── components/
│   │   ├── layout/ (KratosVisualShell, KratosTopHud, KratosSidebar, KratosBottomDock, KratosRightRail)
│   │   ├── scene3d/ (3D components)
│   │   ├── world/ (KratosWorldMap, FloatingIsland, CentralCastleIsland)
│   │   ├── ui/ (various UI components)
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

## Arquivos críticos encontrados
- `frontend/src/hooks/useLiveKratos.ts` - SSE connection hook
- `frontend/src/hooks/useApi.ts` - REST API hook
- `frontend/src/components/layout/KratosVisualShell.tsx` - Main app shell
- `frontend/src/components/world/KratosWorldMap.tsx` - World map component
- `frontend/src/pages/MissionLensPage.tsx` - Mission lens page
- `backend/app/routes/live.py` - SSE and snapshot endpoints
- `backend/app/routes/mission.py` - Mission lens endpoint (/mission/lens)
- `backend/data/kratos.db` - SQLite database

## Arquivos proibidos
- `backend/` directory (não deve ser modificado)
- `backend/data/kratos.db` (banco de dados SQLite)
- `backend/app/routes/` (endpoints FastAPI)
- `backend/app/services/` (serviços Python)
- `backend/app/schemas/` (schemas de dados)

## Como rodar o frontend
```bash
cd frontend
npm run dev          # Development server on http://localhost:5173
npm run build        # Build for production
npm run test         # Run tests
npm run preview      # Preview production build
```

## Como rodar o backend, se detectado
```bash
cd backend
# Assuming virtual environment is set up
python -m uvicorn app.main:app --host 127.0.0.1 --port 5100 --reload
```

## Como testar /live/snapshot
```bash
curl http://127.0.0.1:5100/live/snapshot
```

## Como testar /live/stream
```bash
curl http://127.0.0.1:5100/live/stream
```

## Riscos
1. **Three.js já instalado** - O prompt diz "NÃO instale Three.js na V1" mas já está instalado
2. **Backend é complexo** - 2569 arquivos Python no backend, não deve ser modificado
3. **Conflito de portas** - Frontend roda em 5173, backend em 5100
4. **SSE connection** - O hook useLiveKratos já está implementado e conectando

## Plano seguro para próxima etapa
1. Criar novo branch para trabalho
2. Fazer auditoria visual dos componentes existentes
3. Verificar integração com Mission Lens (/mission/lens endpoint)
4. Implementar AppShell com base nos componentes existentes
5. Criar WorldMap MVP com ilhas flutuantes
6. Integrar dados reais via SSE e REST endpoints
7. Manter todas as regras de não modificação do backend