# KRATOS Sprint B W32 — Deploy Staging Readiness Update

**Date:** 2026-05-17
**Wave:** B32

## Updated Checklist
| Gate | Status |
|---|---|
| `bun run build` | PASS (~5.2s) |
| `bun test tests/` | PASS (270/0) |
| CI workflow | PASS (hardened A22) |
| Frontend wired to snapshots | PASS (Sprint B) |
| SourceBadgeMeta visible | PASS |
| Config detection working | PASS |
| Worker health endpoint | PASS |
| Worker secrets set | NOT YET (requires Lucas) |
| Deploy executed | NO (requires Lucas authorization) |

## Pre-Deploy (When Authorized)
```bash
bunx wrangler deploy --dry-run
bunx wrangler secret put GITHUB_TOKEN   # if real GitHub data wanted
bunx wrangler secret put OMNIS_BASE_URL # if OMNIS bridge wanted
bunx wrangler deploy
```
