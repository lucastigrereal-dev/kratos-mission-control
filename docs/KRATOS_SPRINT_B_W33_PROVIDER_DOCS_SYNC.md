# KRATOS Sprint B W33 — Provider Docs Sync

**Date:** 2026-05-17
**Wave:** B33

## GitHub Provider (`src/lib/github-provider.ts`)
- Config detection: `checkGithubConfig()` → `{ configured, tokenEnvName, checkedAt }`
- Safe fetch: `fetchRepoStatus(owner, repo)` → `{ data, error }` with ApiError
- Tracked repos: `fetchTrackedRepos()` → `string[]`
- Hook consumer: `useGithubConfig()` in `useGithub.ts`

## OMNIS Provider (`src/lib/omnis-provider.ts`)
- Config detection: `checkOmnisConfig()` → `{ configured, baseUrlEnvName, checkedAt }`
- All operations are read-only — NO executeJob, NO runCrew
  - `fetchOmnisStatus()` → `{ data: OmnisStatus, error }`
  - `fetchOmnisHealth()` → `{ data: { healthy, degraded, down }, error }`
  - `fetchOmnisCrews()` → `{ data: OmnisCrew[], error }`
  - `fetchOmnisJobs(limit)` → `{ data: OmnisJob[], error }`
- Hook consumers: `useOmnisConfig()`, `useOmnisReadOnlyGuard()` in `useOmnis.ts`
- Boundary enforced: KRATOS observes OMNIS, never commands
