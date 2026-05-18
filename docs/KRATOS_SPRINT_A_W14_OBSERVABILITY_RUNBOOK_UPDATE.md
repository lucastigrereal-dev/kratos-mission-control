# KRATOS Sprint A W14 — Observability Runbook Update

**Date:** 2026-05-17  
**Wave:** A14

## Snapshot Testing
- `bun test tests/stores/contexto-snapshot.test.ts` — 23 tests
- `bun test tests/stores/dashboard-snapshot.test.ts` — 20 tests
- `bun test tests/stores/snapshot-contract-regression.test.ts` — 9 tests

## Interpreting Error Codes
- `missing_config` → env var not set in Worker. Check Cloudflare Worker settings.
- `external_unavailable` → external API unreachable. Check network/health.
- `stale_data` → data exceeds freshness threshold. Check last update time.
- `validation_error` → schema mismatch. Check api-contract/.

## GITHUB_TOKEN Verification (Without Reading Secret)
- `checkGithubConfig()` returns `configured: boolean` — safe to log
- Never log `globalThis.GITHUB_TOKEN` value

## OMNIS_BASE_URL Verification (Without Executing OMNIS)
- `checkOmnisConfig()` returns `configured: boolean`
- All OMNIS provider functions are read-only — no job execution
- Module audit: `"executeJob" in mod === false`
