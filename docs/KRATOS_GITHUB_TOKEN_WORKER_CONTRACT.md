# KRATOS — GitHub Token Worker Contract

**Date:** 2026-05-17  
**Wave:** K04  
**Status:** DEFINED — not yet deployed to Cloudflare

---

## I. OVERVIEW

KRATOS reads GitHub repository status (PRs, commits, health) to display in the `/sistema` cockpit. This requires the GitHub API, which has rate limits that require authentication.

**Boundary:** KRATOS reads GitHub. KRATOS never writes to GitHub.

---

## II. ENV VAR CONTRACT

| Variable | Name | Required | Scope |
|---|---|---|---|
| GitHub Personal Access Token | `GITHUB_TOKEN` | Optional (graceful fallback) | Cloudflare Worker secret |

### Rules
1. **Never commit** `GITHUB_TOKEN` — always a Worker secret
2. **Never log** token value — not in console, not in response
3. **Never include** in client-side bundle
4. **Never hardcode** in any file
5. **Read via** `(globalThis as Record<string, unknown>).GITHUB_TOKEN` (Worker env pattern)

---

## III. CURRENT IMPLEMENTATION

**File:** `backend/github/store.ts`

```typescript
const token = (globalThis as Record<string, unknown>).GITHUB_TOKEN as string | undefined;
if (token) {
  headers.Authorization = `Bearer ${token}`;
}
```

✅ Token is optional — if absent, request proceeds unauthenticated  
✅ Token never logged  
✅ Token never returned in response  
✅ Graceful fallback to mock data when API fails  

---

## IV. FALLBACK CHAIN

```
Request received
  → Is token present? 
    YES → Authenticated API call (5000 req/hr)
    NO  → Unauthenticated call (60 req/hr per IP)
      → API call succeeds? 
        YES → Use live data
        NO  → Check in-memory cache
          → Cache hit? YES → Return cached data
          → Cache miss? Check MOCK_REPOS
            → Mock exists? YES → Return mock
            → NO → Return { data: null, error: "..." }
```

---

## V. CLOUDFLARE WORKER CONFIGURATION

### How to set (manual — never automated):
```bash
# Via wrangler CLI (requires Lucas authorization + wrangler login):
wrangler secret put GITHUB_TOKEN
# Enter token value when prompted — never in command line
```

### wrangler.jsonc reference:
The token is NOT in `wrangler.jsonc` — it's a secret stored separately in Cloudflare dashboard.

### Via Cloudflare Dashboard (preferred):
1. Cloudflare Dashboard → Workers & Pages → kratos-mission-control
2. Settings → Variables & Secrets
3. Add secret: `GITHUB_TOKEN`
4. Value: Personal Access Token with `repo:read` scope

---

## VI. MINIMUM TOKEN SCOPE

When creating a GitHub PAT for KRATOS:
- `public_repo` — for public repos only (recommended)
- `repo` — for private repos (only if needed)
- **NO write permissions**
- **NO admin permissions**
- **NO delete permissions**

---

## VII. RATE LIMITS

| Scenario | Rate Limit | KRATOS Behavior |
|---|---|---|
| No token | 60 req/hr per IP | Falls back to cache/mock after limit |
| With token | 5000 req/hr | Normal operation |
| Cache TTL | 120s (2 min) | Reduces real API calls |
| Fetch timeout | 3000ms | Aborts and falls back |

---

## VIII. SAFETY CHECKLIST

- [x] Token never hardcoded
- [x] Token never logged
- [x] Token never in client bundle (server-only via createServerFn)
- [x] Token presence is optional
- [x] Graceful fallback when token absent
- [x] Graceful fallback when API fails
- [x] Cache prevents excessive API calls
- [x] Timeout prevents hanging requests
- [x] Mock data prevents empty UI

---

## IX. WHAT KRATOS DOES NOT DO

- Does NOT write to GitHub (create PRs, comments, issues)
- Does NOT store token in localStorage
- Does NOT pass token to client
- Does NOT require token to function (degrades gracefully)

---

## SUMMARY

✅ Contract defined  
✅ Implementation audited — safe  
✅ Fallback chain documented  
✅ Cloudflare setup instructions documented  
✅ No secrets in codebase  
