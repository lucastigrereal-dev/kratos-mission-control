# KRATOS — OMNIS Base URL Read-Only Contract

**Date:** 2026-05-17  
**Wave:** K06  
**Status:** DEFINED

---

## I. BOUNDARY: KRATOS ↔ OMNIS

```
KRATOS (cockpit)  ──READ ONLY──►  OMNIS (execution engine)
                  ◄──────────────  status / health / crews / jobs
```

**KRATOS must never:**
- Execute a crew or job via OMNIS API
- Trigger, schedule, or queue any OMNIS action
- POST/PUT/DELETE to OMNIS endpoints
- Call OMNIS if `OMNIS_BASE_URL` is not configured
- Cache execution state and retry automatically

**KRATOS may:**
- GET status from OMNIS
- GET health from OMNIS
- GET crew list and job list from OMNIS
- Display OMNIS data in the cockpit
- Show "offline / unavailable" when OMNIS is unreachable

---

## II. ENV VAR CONTRACT

| Variable | Name | Required | Scope |
|---|---|---|---|
| OMNIS base URL | `OMNIS_BASE_URL` | Optional (graceful fallback) | Cloudflare Worker var |

### Rules
1. **Never commit** `OMNIS_BASE_URL` — Worker variable or local-only
2. **Never use** `OMNIS_BASE_URL` for POST/execution calls
3. **Never assume** OMNIS is reachable — always have fallback
4. **Never expose** OMNIS internal URL to client bundle
5. When absent → use mock data → display "offline" badge

---

## III. OMNIS STATUS SHAPE CONTRACT

```typescript
interface OmnisLiveStatus {
  active_wave: string | null;     // Current wave being executed
  status: "running" | "idle" | "error" | "offline";
  health: "healthy" | "degraded" | "unavailable";
  last_run: string | null;        // ISO timestamp
  next_action: string | null;     // Human-readable next action
  risk_level: "low" | "medium" | "high" | "critical";
  source: "live" | "mock" | "cache" | "stale";
  updated_at: string;             // ISO timestamp
}
```

---

## IV. CURRENT IMPLEMENTATION AUDIT

**Files audited:**
- `src/lib/omnis-server-fns.ts` — only `GET` methods ✅
- `backend/omnis/store.ts` — only read/mock data, no execution ✅
- `src/hooks/useOmnis.ts` — only reads, no mutations ✅

**Verified:**
- No POST/PUT/DELETE in OMNIS layer ✅
- No execution trigger functions ✅
- No `OMNIS_BASE_URL` in current code (fully mock) ✅
- All OMNIS data returned via mock store ✅

---

## V. FALLBACK CHAIN

```
OMNIS_BASE_URL present?
  NO  → Use mock data → status.source = "mock"
  YES → Fetch /status, /health, /crews, /jobs
    → Response OK?
      YES → Cache result → status.source = "live"
      NO  → Use mock data → status.source = "mock"
        → Log warning (not error, OMNIS offline is expected)
```

---

## VI. CLOUDFLARE WORKER CONFIGURATION

### How to configure (manual, requires Lucas authorization):
```
Cloudflare Dashboard → Workers & Pages → kratos-mission-control
  → Settings → Variables & Secrets
  → Add variable: OMNIS_BASE_URL = http://localhost:8090
    (or production URL when available)
```

**Note:** `OMNIS_BASE_URL` is NOT a secret (not sensitive), so it can be a plain variable.

---

## VII. WHAT HAPPENS WHEN OMNIS IS OFFLINE

The KRATOS cockpit must:
1. Show "OMNIS Offline" status badge
2. Display last cached data with stale indicator
3. **Not error or crash**
4. **Not retry automatically in a loop**
5. Allow manual refresh via user action

---

## VIII. FORBIDDEN PATTERNS

```typescript
// ❌ NEVER — executing a crew
await fetch(`${OMNIS_BASE_URL}/crews/conteudo/run`, { method: "POST" })

// ❌ NEVER — triggering a job
await fetch(`${OMNIS_BASE_URL}/jobs`, { method: "POST", body: JSON.stringify({...}) })

// ✅ OK — reading status
await fetch(`${OMNIS_BASE_URL}/status`, { method: "GET" })

// ✅ OK — reading crews
await fetch(`${OMNIS_BASE_URL}/crews`, { method: "GET" })
```

---

## SUMMARY

✅ Read-only boundary defined and documented  
✅ OMNIS_BASE_URL contract documented  
✅ Status shape contract defined  
✅ Current implementation audited — no execution patterns found  
✅ Fallback chain documented  
✅ Forbidden patterns documented  
