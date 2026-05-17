# KRATOS KR30 W17 — CI Build & Test Workflow

**Date:** 2026-05-17  
**Wave:** K17  
**File:** `.github/workflows/ci.yml`

## What CI Does

1. Triggers on push to `main` and feature branches
2. Sets up Bun 1.3.10 (matches local dev)
3. `bun install --frozen-lockfile` — reproducible installs
4. `bun run build` — full build gate (client + SSR)
5. `bun test tests/` — 150 tests across stores + contracts

## What CI Does NOT Do

- No deploy (`wrangler deploy` requires explicit authorization)
- No secrets injected (GITHUB_TOKEN, OMNIS_BASE_URL are Worker secrets, not CI secrets)
- No Playwright (deferred to K15 plan + CI enhancement)
- No push to registry or external service

## Runs On

- ubuntu-latest (GitHub-hosted runner)
- Bun 1.3.10 pinned

## Branch Coverage

- `main` (direct push and PRs)
- `feat/**`, `fix/**`, `docs/**`, `test/**`, `ci/**`
