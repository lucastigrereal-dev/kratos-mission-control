# KRATOS Sprint B W24 — Stale Data UX Pass

**Date:** 2026-05-17
**Wave:** B24

## Stale Indicators Already Present
- `SourceBadgeIndicator`: Shows "Desatualizado" when `meta.stale === true` with red exclamation mark
- Relative time display: "há 30s", "há 5m", "há 2h"
- Error count visible in tooltip: "· 2 erro(s)"
- Color shifts: stale data uses `--kr-color-risk` (red) instead of mock amber or live blue

## Coverage
| Data Source | Stale Detection | UX Response |
|---|---|---|
| Contexto mission snapshot | `meta.stale` + `meta.errors` | SourceBadgeIndicator turns red + "Desatualizado" |
| Dashboard snapshot | `meta.stale` + `meta.errors` | SourceBadgeIndicator warning |
| Worker health | N/A (always computed fresh) | Timestamp visible in badge |
| GitHub repos | React Query `isStale` | Default React Query behavior |
| OMNIS status | React Query `isStale` | Per-section ErrorState |
