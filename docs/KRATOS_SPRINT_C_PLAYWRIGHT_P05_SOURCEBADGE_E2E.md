# KRATOS Sprint C — P05 SourceBadge E2E

**Data:** 2026-05-17

## Tests Created
`tests/e2e/sourcebadge.smoke.spec.ts` — 3 tests for SourceBadgeIndicator.

## Routes Covered

| Route | View | Expectation |
|---|---|---|
| `/` | DashboardView | Badge with known label present |
| `/contexto` | ContextoView | Badge with known label present |
| `/sistema` | SistemaView | Badge with known label present |

## Assertions
- A `<span>` with text matching known labels ("Ao vivo", "Simulado", "Parcial", "Desatualizado") is visible
- The `title` attribute contains "Fonte:" (metadata contract)

## Tolerance
- No dependency on exact label text — any known label is valid
- No dependency on timeago value (dynamic)
- If mock data is missing, SourceBadge may not render — test expectation may need adjustment based on actual dev data state

## Next
P06 — Snapshot states E2E.
