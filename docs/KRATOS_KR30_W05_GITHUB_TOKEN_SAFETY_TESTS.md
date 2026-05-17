# KRATOS KR30 W05 — GitHub Token Safety Tests

**Date:** 2026-05-17  
**Wave:** K05  
**Tests added:** 8  
**Suite total:** 81 pass / 0 fail

---

## Coverage Added

| Test | What it verifies |
|---|---|
| Returns mock data when no token | Fallback chain works without auth |
| Does not throw without token | No uncaught exception |
| Unknown repo returns null | Not an error, graceful null |
| Response never contains `Bearer` | Token not in output |
| Response never contains `Authorization` | Header not leaked |
| Response never contains `GITHUB_TOKEN` | Key name not leaked |
| listTrackedRepos no token leak | List function also clean |
| Cache reset safe | No token bleed between calls |
| Required fields present (token-independent) | Shape stability |
| URL fields point to github.com | No internal URL leakage |

---

## File

`tests/stores/github-token-safety.test.ts`

---

## Decisions

- Used direct try/catch instead of `resolves.not.toThrow()` — Bun behavior difference with Promise resolution vs. throw
- No real network calls — all tests use mock fallback path (no GITHUB_TOKEN in test env)
- Tests run in isolation with `_reset()` in `beforeEach`

---

## Build & Test Gate

- ✅ `bun run build` — green  
- ✅ `bun test tests/` — 81 pass / 0 fail  
