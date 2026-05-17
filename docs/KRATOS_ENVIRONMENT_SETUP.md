# KRATOS — Environment Setup & Variables

**Date:** 2026-05-17  
**Status:** Canonical reference for all env vars

---

## GOLDEN RULE

**NEVER commit secrets. NEVER read .env in code. NEVER log secret values.**

---

## I. CLOUDFLARE WORKER SECRETS

These are configured in Cloudflare Dashboard → Workers & Pages → Settings → Variables & Secrets.
They are NEVER in `wrangler.jsonc` or any committed file.

| Variable | Type | Required | Purpose |
|---|---|---|---|
| `GITHUB_TOKEN` | Secret | Optional | GitHub API authentication (falls back to unauthenticated: 60 req/hr) |
| `OMNIS_BASE_URL` | Plain var | Optional | OMNIS read-only base URL (falls back to mock data) |

### How to set (requires Lucas authorization + wrangler login):
```bash
# GITHUB_TOKEN (secret — enters value interactively):
wrangler secret put GITHUB_TOKEN

# OMNIS_BASE_URL (plain variable — not sensitive):
wrangler secret put OMNIS_BASE_URL
# OR via Cloudflare Dashboard UI
```

---

## II. LOCAL DEVELOPMENT

For local dev, create `.env.local` (never `.env`) in project root:

```
# .env.local — NEVER COMMIT THIS FILE
GITHUB_TOKEN=ghp_your_token_here
OMNIS_BASE_URL=http://localhost:8090
```

`.env.local` is in `.gitignore`. Verify before any commit:
```bash
git status --short  # Must not show .env.local
```

---

## III. FUTURE SECRETS (staging/production)

| Variable | Purpose | When Needed |
|---|---|---|
| `AKASHA_URL` | Akasha pgvector connection | When real context data needed |
| `CLOUDFLARE_API_TOKEN` | For `wrangler deploy` | Deploy sprint (requires Lucas auth) |
| `CLOUDFLARE_ACCOUNT_ID` | Account identifier | Deploy sprint |

---

## IV. NEVER DO THIS

```bash
# ❌ Never log a secret
console.log("token:", process.env.GITHUB_TOKEN);

# ❌ Never hardcode a secret
const token = "ghp_abc123...";

# ❌ Never commit .env
git add .env

# ❌ Never add secrets to wrangler.jsonc
# "vars": { "GITHUB_TOKEN": "..." }  ← NO

# ❌ Never pass secrets as URL params
fetch(`https://api.github.com/repos?token=${GITHUB_TOKEN}`)
```

---

## V. VERIFICATION CHECKLIST

Before any commit:
- [ ] `git status --short` — no `.env*` files shown
- [ ] `git diff --staged` — no token patterns (ghp_, sk-, Bearer)
- [ ] No `console.log` with credential data
- [ ] No hardcoded secrets in new code

---

## VI. CI SECRETS

The CI workflow (`.github/workflows/ci.yml`) uses NO secrets.
It only runs build and tests — no deploy, no external API calls.

If Playwright is added to CI (K15 plan), it will also need no secrets
since smoke tests only check routes load (no authenticated endpoints).

---

## SUMMARY

✅ GITHUB_TOKEN: Worker secret, optional, graceful fallback  
✅ OMNIS_BASE_URL: Worker var, optional, mock fallback  
✅ Local dev: .env.local (gitignored)  
✅ CI: no secrets required  
✅ Deploy: explicit Lucas authorization required  
