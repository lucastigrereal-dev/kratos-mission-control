# KRATOS Sprint A W15 — Local Dev Runbook Update

**Date:** 2026-05-17  
**Wave:** A15

## Quick Start
```bash
bun install
bun run dev      # Dev server
bun run build    # Production build (~3s)
bun test tests/  # Full test suite
```

## CI
- `.github/workflows/build-and-test.yml`
- Runs: `bun install` → `bun run build` → `bun test tests/`
- No secrets required in CI

## Troubleshooting
- **EPERM**: file locked by another process. Close other terminals.
- **Git index.lock**: stale lock file. `rm .git/index.lock` if no git process running.
- **FrontendGuard**: `frontend/` directory is read-only. To lift, remove from protected paths.

## Expected Env Vars (Names Only, No Values)
- `GITHUB_TOKEN` — GitHub API access (optional, mock fallback exists)
- `OMNIS_BASE_URL` — OMNIS bridge URL (optional, mock fallback exists)
