# KRATOS — Worker Health Contract

**Date:** 2026-05-17  
**Wave:** K13  
**Status:** DEFINED

---

## I. HEALTH ENDPOINT SHAPE

```typescript
// GET /api/health
interface WorkerHealthResponse {
  status: "ok" | "degraded" | "error";
  service: "kratos-worker";
  version: string;        // From package.json or env var
  uptime_ms: number;      // Worker process uptime
  checks: WorkerCheck[];  // Individual subsystem checks
  updated_at: string;     // ISO timestamp
}

interface WorkerCheck {
  name: string;           // "stores", "build", "routes"
  status: "pass" | "warn" | "fail";
  message?: string;
  latency_ms?: number;
}
```

---

## II. CURRENT HEALTH INFRASTRUCTURE

KRATOS has health-related data in several places:

| File | Role |
|---|---|
| `api-contract/service.schema.ts` | `ServiceHealth` enum: "live" | "degraded" | "offline" | "unknown" |
| `src/hooks/useLiveStatus.ts` | Derives `LiveState` from KRATOS + OMNIS service health |
| `backend/services/store.ts` | Mock service health data |
| `src/lib/omnis-server-fns.ts` | `fetchOmnisHealth()` — OMNIS service counts |

There is no dedicated `/api/health` endpoint yet.

---

## III. STANDARD HEALTH CHECK FLOW

```
GET /api/health
  → Check stores accessible (checkpoints, projects, appointments)
  → Check contexto snapshot returns
  → Check OMNIS mock accessible
  → Compute overall status:
    all pass → status: "ok"
    any warn  → status: "degraded"
    any fail  → status: "error"
  → Return envelope
```

---

## IV. IMPLEMENTATION PLAN

Create `src/lib/health-server-fns.ts`:

```typescript
export const getWorkerHealth = createServerFn({ method: "GET" }).handler(
  async () => {
    const checks = [];
    // Check checkpoints store
    // Check contexto snapshot
    // Compute status
    return { status, service: "kratos-worker", checks, updated_at };
  }
);
```

**Deferred to next phase** — not blocking current sprint.

---

## V. CLOUDFLARE WORKER HEALTH

For Cloudflare Workers, the health endpoint should:
- Not depend on external services (no GitHub/OMNIS calls)
- Return within 100ms (Worker execution budget)
- Not read `.env` or Worker secrets
- Always return 200 (even when degraded — use status field)

---

## VI. RELATIONSHIP WITH useLiveStatus

`useLiveStatus` hook (`src/hooks/useLiveStatus.ts`) already provides:
- Per-service health severity mapping
- Aggregate live/warn/critical state
- StatusBar display logic

The `/api/health` endpoint will complement this with server-side checks.

---

## SUMMARY

✅ Worker health shape defined  
✅ Current health infrastructure audited  
✅ Implementation plan documented  
⏳ Server function implementation — next phase  
