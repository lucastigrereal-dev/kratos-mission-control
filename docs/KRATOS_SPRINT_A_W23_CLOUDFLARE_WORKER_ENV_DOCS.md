# KRATOS Sprint A W23 — Cloudflare Worker Env Docs

**Date:** 2026-05-17
**Wave:** A23

## Expected Environment Variables (Names Only, No Values)

| Variable | Purpose | Required | Consumer |
|---|---|---|---|
| `GITHUB_TOKEN` | GitHub API access (repo status, PRs) | No (mock fallback) | `src/lib/github-provider.ts` |
| `OMNIS_BASE_URL` | OMNIS bridge URL | No (mock fallback) | `src/lib/omnis-provider.ts` |

## How They're Injected
- **Production**: Cloudflare Worker secrets via `wrangler secret put` or Dashboard → Settings → Variables
- **Local dev**: set via `globalThis` in dev entry or `.dev.vars` (Wrangler) — KRATOS reads from `globalThis`, not `.dev.vars` directly
- **CI**: not set — tests use mock fallbacks; `github-token-safety.test.ts` actively clears `globalThis.GITHUB_TOKEN`

## Config Detection Pattern
```ts
// Both providers use this safe pattern — never reads .env, never throws
const token = (globalThis as Record<string, unknown>).GITHUB_TOKEN as string | undefined;
if (!token) {
  return { data: null, error: createApiError("missing_config", "GITHUB_TOKEN não configurado") };
}
```

## Cloudflare Worker Bindings (Planned, Not Active)
| Binding | Type | Status |
|---|---|---|
| `KRATOS_DB` | D1 | Commented out in `wrangler.jsonc` — needs database_id |
| `KRATOS_KV` | KV | Commented out in `wrangler.jsonc` — needs id |
