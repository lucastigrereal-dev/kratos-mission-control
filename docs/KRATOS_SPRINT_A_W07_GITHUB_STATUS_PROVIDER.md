# KRATOS Sprint A W07 — GitHub Status Provider

**Date:** 2026-05-17
**Wave:** A07

---

## Implementation

New `src/lib/github-provider.ts`:

- `checkGithubConfig()` — detects GITHUB_TOKEN presence via `globalThis`, never reads `.env`
- `fetchRepoStatus(owner, repo)` — wraps `getRepoStatus` with config check
  - Token absent → `missing_config` ApiError
  - Not found → `not_found` ApiError
  - Network error → `external_unavailable` ApiError
- `fetchTrackedRepos()` — delegates to existing store

## Safety

- Never reads `.env`
- Never logs token value
- Config object excludes token value (only `configured` boolean + `tokenEnvName`)

## Files Added

- `src/lib/github-provider.ts` — provider module
- `tests/stores/github-provider.test.ts` — 7 tests

## Test Results

- 196 pass / 0 fail (+7)

## Build

✅ Green (2.40s SSR)
