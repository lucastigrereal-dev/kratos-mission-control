# KRATOS Sprint A W26 — Provider Timeout/Retry Policy

**Date:** 2026-05-17
**Wave:** A26

## Current State
- `github-provider.ts`: `fetchRepoStatus()` is async — calls `getRepoStatus()` from backend store
- `omnis-provider.ts`: all functions are sync (store returns mock data immediately)
- No timeout wrapping, no retry logic

## Policy Defined

### Timeout
| Provider | Operation | Timeout | Rationale |
|---|---|---|---|
| GitHub | `fetchRepoStatus()` | 10s | GitHub API typically responds in <1s; 10s covers slow connections |
| OMNIS | All fetches | 5s | Local/bridge calls should be sub-second |
| Dashboard | `getDashboardSnapshot()` | 15s | Aggregates repos (max 3) + services + context |

### Retry
| Condition | Strategy | Max Retries | Backoff |
|---|---|---|---|
| Timeout | Retry once | 1 | 500ms |
| `external_unavailable` | No retry (downstream dead) | 0 | — |
| `rate_limited` | Retry with backoff | 2 | 1s, 4s |
| Other errors | No retry (fail fast) | 0 | — |

### Implementation Pattern
```ts
async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout: ${label} (${ms}ms)`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}
```

## Applied to `dashboard-server-fns.ts`
The only async call that would benefit from timeout is `getRepoStatus()` (already inside `Promise.all()`). Since the backend store returns mock data when GITHUB_TOKEN is missing, timeout is a production-only concern — not applicable with current mock stores.

## Applied to `github-provider.ts`
`fetchRepoStatus()` is the only async provider function. Timeout wrapping at the provider level ensures the caller never hangs:

```ts
export async function fetchRepoStatus(owner: string, repo: string): Promise<GithubProviderResult> {
  const config = checkGithubConfig();
  if (!config.configured) {
    return { data: null, error: createApiError("missing_config", "GITHUB_TOKEN não configurado") };
  }
  try {
    const status = await withTimeout(getRepoStatus(owner, repo), 10_000, `github:${owner}/${repo}`);
    if (!status) return { data: null, error: createApiError("not_found", `Repositório ${owner}/${repo} não encontrado`) };
    return { data: status, error: null };
  } catch (e) {
    const code = classifyError(e);
    return { data: null, error: toSnapshotError(code, "GitHub API error", e) };
  }
}
```

## Not Applied to `omnis-provider.ts`
All OMNIS provider functions are synchronous (mock store). Timeout would be added when real HTTP calls are introduced in Sprint B/C.
