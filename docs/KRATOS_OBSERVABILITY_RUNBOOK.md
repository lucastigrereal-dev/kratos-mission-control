# KRATOS — Observability Runbook

**Date:** 2026-05-17  
**Wave:** K23  

---

## I. TESTING THE BACKEND

### Run all tests
```bash
bun test tests/
# Expected: 176+ pass / 0 fail
```

### Run specific layers
```bash
bun test tests/stores/          # Store unit tests
bun test tests/contracts/       # Contract regression tests
bun test tests/stores/github-token-safety.test.ts  # Token safety
bun test tests/stores/omnis-readonly-fallback.test.ts  # OMNIS boundary
```

### Regression gate (run before any commit)
```bash
bun test tests/ && echo "TESTS OK" || echo "TESTS FAILED"
```

---

## II. TESTING THE BUILD

```bash
bun run build
# Expected: ✓ built in ~2s
# Watch for: server-*.js size (should be ~729 kB, alert if > 900 kB)
```

---

## III. TESTING SNAPSHOTS

### Contexto snapshot
```bash
# Start dev server first:
bun run dev
# Then in another terminal:
curl http://localhost:3000/api/contexto/snapshot
# Expected: { data: {...}, error: null }
```

### Dashboard snapshot
```bash
# Assembled client-side via useDashboard()
# Check /dashboard route in browser: 7 routes should show data cards
```

### Services health
```bash
curl http://localhost:3000/api/sistema/live
# Expected: services array with health fields
```

---

## IV. CHECKING HEALTH (WORKER)

Currently no dedicated `/api/health` endpoint (K13 plan, deferred).
Use the following proxies:

```bash
# Build OK = worker compilable
bun run build

# Test OK = stores healthy
bun test tests/

# Dev server OK = routes loadable
bun run dev
# Browse to http://localhost:3000 — no crash = healthy
```

---

## V. DIAGNOSING STALE DATA

| Symptom | Source | Fix |
|---|---|---|
| Contexto shows old project | `capturedAt` > 5 min | Refresh via `/contexto` route action |
| Services show wrong status | Mock data (expected) | Connect real Akasha/OMNIS |
| GitHub shows old commits | Cache TTL = 2 min | Wait or `_reset()` in dev |
| OMNIS shows "offline" badge | No OMNIS_BASE_URL | Expected in dev mode |

---

## VI. INTERPRETING SOURCE BADGE

The `SourceBadgeMeta` schema defines:
- `"live"` — data from real API, fresh
- `"mock"` — data from in-memory mock store (dev mode or offline)
- `"cache"` — data from TTL cache (still valid)
- `"stale"` — data older than threshold (shown with warning)
- `"partial"` — some sources succeeded, some failed

**UI badge** (deferred to frontend sprint):
```
🟢 live     = API connected, data fresh
⚪ mock     = Using development mock data
🟡 stale    = Data is old, may be inaccurate
🟠 partial  = Some data missing
🔴 error    = No data available
```

---

## VII. DIAGNOSING ERRORS

| Error Code | Cause | Fix |
|---|---|---|
| `missing_config` | GITHUB_TOKEN/OMNIS_BASE_URL absent | Set Worker secret or accept mock fallback |
| `external_unavailable` | GitHub/OMNIS/Akasha offline | Check service status; fallback to mock |
| `validation_error` | Response shape changed | Check schema vs API response |
| `rate_limited` | No GITHUB_TOKEN, many requests | Add GITHUB_TOKEN to Worker |
| `forbidden_action` | Code tried to POST to OMNIS | Fix: KRATOS is read-only |
| `internal_error` | Unexpected throw | Check server logs in Cloudflare |

---

## VIII. EPERM / LOCK FILE ISSUES

```bash
# If build fails with EPERM (Windows file lock):
# 1. Close any open files in dist/
# 2. Wait 5 seconds and retry

# If Git index.lock:
rm -f .git/index.lock  # Only if no git operation is running

# If bun install fails:
rm -rf node_modules && bun install
```

---

## IX. CREDIT SAVER HOOKS STATUS

```bash
# Check active hooks:
cat .claude/settings.json  # If exists
# Credit Saver is in startup hook (KRATOS Credit Saver message on session start)
```

---

## X. FULL HEALTH CHECK SEQUENCE

```bash
# 1. Git state
git status --short

# 2. Build
bun run build

# 3. Tests
bun test tests/

# 4. Smoke check (manual)
bun run dev
# Open http://localhost:3000
# Check: /, /sistema, /contexto, /checkpoints

# 5. Confirm baseline
echo "Build: $(bun run build 2>&1 | tail -1)"
echo "Tests: $(bun test tests/ 2>&1 | grep 'pass\|fail' | tail -1)"
```
