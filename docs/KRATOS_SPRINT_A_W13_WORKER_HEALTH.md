# KRATOS Sprint A W13 — Worker Health Endpoint

**Date:** 2026-05-17  
**Wave:** A13

New `getWorkerHealth` in `src/lib/health-server-fns.ts`:
- Returns `{ status, service, version, checks, updated_at }`
- Aggregates from `getServicesHealthSummary()`
- Status derivation: offline > 0 → error, degraded > 0 → degraded, else ok
