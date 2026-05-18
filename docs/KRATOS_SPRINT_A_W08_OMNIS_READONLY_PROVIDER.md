# KRATOS Sprint A W08 — OMNIS Read-Only Status Provider

**Date:** 2026-05-17
**Wave:** A08

---

## Implementation

New `src/lib/omnis-provider.ts`:

- `checkOmnisConfig()` — detects OMNIS_BASE_URL presence via `globalThis`
- `fetchOmnisStatus()` → `OmnisStatus` (servicos, crews, jobs, memoria)
- `fetchOmnisHealth()` → `{ healthy, degraded, down }`
- `fetchOmnisCrews()` → `OmnisCrew[]`
- `fetchOmnisJobs(limit?)` → `OmnisJob[]`
- All operations are READ-ONLY — no executeJob, no runCrew, no sendCommand

## Safety Enforcement

- No job execution exports
- No command dispatch
- Test validates module has no `executeJob`/`runCrew`/`sendCommand` keys
- Config detection never leaks URL values

## Files Added

- `src/lib/omnis-provider.ts`
- `tests/stores/omnis-provider.test.ts` — 10 tests

## Test Results

- 206 pass / 0 fail (+10)

## Build

✅ Green (2.07s SSR)
