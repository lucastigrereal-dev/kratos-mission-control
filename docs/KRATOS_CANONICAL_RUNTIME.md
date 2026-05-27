# KRATOS CANONICAL RUNTIME

Version: 1.0 | Ratified: 2026-05-19 | Authority: CCOO Architecture Constitution v1.0

---

## Module Identity

- **Module:** KRATOS
- **Verb:** OBSERVA
- **Role:** Cockpit operacional — vê tudo, não executa tudo
- **Repository:** `kratos-mission-control`
- **Git:** `main` (ahead 2 of origin)

---

## Canonical Runtimes

### Frontend: `src/` (TanStack Start + React 19)

- Framework: TanStack Start (SSR-enabled)
- React: 19.2.0
- Port: 5173 (default)
- Stack: shadcn/ui + Radix + Tailwind 4 + Recharts + TanStack Query/Router
- NO 3D dependencies

### Frontend (FROZEN): `frontend/` (Vite + React 18 + Three.js)

- Status: CONGELADO até INTEGRATION_GATE (FASE 6)
- Three.js, @react-three/fiber, @react-three/drei
- NÃO é canonical — preservado para referência futura

### Backend: `backend/` (FastAPI v0.11.0)

- Framework: FastAPI
- Entrypoint: `backend/app/main.py`
- Routes: 30 módulos
- CORS: localhost:5173, localhost:8083

### Database: SQLite

- Path: `backend/app/db/`
- Purpose: Operational truth — tasks, projects, alerts, checkpoints, snapshots
- Migrations: `backend/migrations/`

---

## Operational Truth Engine (v0.11)

Endpoint: `GET /operational-truth`

4 cross-reference checks run in parallel:
1. **project_alignment:** git vs ActivityWatch vs focus → same project?
2. **infrastructure_health:** docker vs OMNIS vs system → all healthy?
3. **data_freshness:** are all collectors returning real data?
4. **git_hygiene:** working trees clean? Need checkpoint?

Verdicts: consistent | mostly_consistent | degraded | conflict

Last verified: 2026-05-19 — `mostly_consistent`

---

## What KRATOS DOES

- Observa estado operacional de todos os módulos
- Coleta snapshots de git, docker, OMNIS, system, ActivityWatch
- Detecta conflitos entre fontes independentes
- Serve como cockpit para o operador humano

## What KRATOS DOES NOT DO

- NÃO executa missões (OMNIS faz)
- NÃO armazena memória semântica (AKASHA faz)
- NÃO organiza notas humanas (OBSIDIAN faz)
- NÃO interpreta estratégia (AURORA faz)
- NÃO decide (Lucas faz)

---

## Integration Points

| Target | Endpoint | Status |
|--------|----------|--------|
| OMNIS | /omnis/status, /omnis/summary | HYPOTHESIS |
| AKASHA | /operational-truth | HYPOTHESIS |
| Docker | /docker | CONFIRMED |
| Git | /git | CONFIRMED |
| System | /system | CONFIRMED |

---

## References

- CCOO Architecture Constitution v1.0
- CCOO Master Roadmap — FASE 2
- FRONTEND_3D_FREEZE_NOTICE.md
