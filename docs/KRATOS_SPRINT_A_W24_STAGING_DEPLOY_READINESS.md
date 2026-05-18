# KRATOS Sprint A W24 — Staging Deploy Readiness

**Date:** 2026-05-17
**Wave:** A24
**DEPLOY NOT EXECUTED** — requires explicit Lucas authorization.

## Prerequisites Check
| Item | Status |
|---|---|
| `bun run build` clean | PASS (~5.2s) |
| `bun test tests/` 243/0 | PASS |
| CI workflow | PASS (hardened in A22) |
| `wrangler.jsonc` configured | YES |
| Worker secrets (GITHUB_TOKEN, OMNIS_BASE_URL) | Optional — not required for deploy |
| D1/KV bindings | Not active (commented out) |

## Staging Deploy Command (Not Executed)
```bash
bunx wrangler deploy --env staging
```

Or for dry run:
```bash
bunx wrangler deploy --env staging --dry-run
```

## What `wrangler deploy` Does
1. Reads `wrangler.jsonc` for Worker name and config
2. Bundles the SSR build output from `dist/server/`
3. Uploads to Cloudflare Workers
4. Publish to `*.workers.dev` subdomain or custom route

## Pre-Flight Checklist (Before Any Deploy)
- [ ] `bun run build` passes with no errors
- [ ] `bun test tests/` all pass
- [ ] CI green on target branch
- [ ] `bunx wrangler deploy --dry-run` reports clean
- [ ] Worker secrets set via `wrangler secret put` if needed
- [ ] Rollback plan: `wrangler rollback` or deploy previous commit

## Rollback
```bash
bunx wrangler rollback
```
Or deploy a known-good version from git history.

## Warning
- **NEVER deploy without explicit Lucas authorization**
- `wrangler deploy` is destructive to the production Worker
- Staging Workers can use `--env staging` for safe testing
