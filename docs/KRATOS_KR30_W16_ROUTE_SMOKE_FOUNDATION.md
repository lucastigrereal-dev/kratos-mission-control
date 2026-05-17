# KRATOS KR30 W16 — Route Smoke Test Foundation

**Date:** 2026-05-17  
**Wave:** K16  
**Tests added:** 16  
**Suite total:** 150 pass / 0 fail

## What was built

`tests/contracts/route-smoke.test.ts` — 16 backend smoke tests, one per route:

| Route | Source | Tests |
|---|---|---|
| / (dashboard) | checkpoints + projects + appointments + contexto | 4 |
| /agora | checkpoints | 2 |
| /agenda | appointments | 2 |
| /checkpoints | checkpoints | 1 |
| /projetos | projects | 2 |
| /contexto | contexto snapshot | 2 |
| /sistema | services + omnis + github | 3 |

## What's deferred

Visual smoke (Playwright) — K15 plan. Requires CI + frontend sprint.
