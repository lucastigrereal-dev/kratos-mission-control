# KRATOS — Dashboard Snapshot Contract

**Date:** 2026-05-17  
**Wave:** K10  
**Endpoint:** `/api/dashboard/snapshot`  
**Status:** DEFINED

---

## I. CURRENT IMPLEMENTATION

The dashboard is assembled client-side via `useDashboard()` hook (`src/hooks/useDashboard.ts`), which aggregates:
- `useQuery(checkpoints)` via `getCheckpoints()`
- `useQuery(projects)` via `getProjects()`
- `useQuery(appointments)` via `getAppointments()`
- `useQuery(contextSnapshot)` via `getContextSnapshot()`

There is no dedicated `/api/dashboard/snapshot` server endpoint yet.

---

## II. SNAPSHOT CONTRACT (proposed)

```typescript
interface DashboardSnapshot {
  summary_cards: {
    checkpoints: {
      total: number;
      pending: number;
      in_progress: number;
      completed: number;
    };
    projects: {
      total: number;
      active: number;
      paused: number;
      completed: number;
    };
    appointments: {
      today: number;
      overdue: number;
      total: number;
    };
  };
  services: {
    healthy: number;
    degraded: number;
    down: number;
    total: number;
  };
  repos: {
    tracked: number;
    names: string[];
  };
  next_actions: string[];          // Top 3 derived actions
  health: "green" | "yellow" | "red";  // Derived overall health
  source: "live" | "mock" | "cache" | "partial";
  updated_at: string;              // ISO timestamp
  stale: boolean;
  errors: string[];                // Per-source errors (not crashing)
}
```

---

## III. HEALTH DERIVATION LOGIC

```
health = "green" when:
  - No overdue appointments
  - All services healthy
  - No high drift

health = "yellow" when:
  - 1-2 overdue appointments OR
  - 1-2 degraded services OR
  - Drift is "light"

health = "red" when:
  - 3+ overdue appointments OR
  - Any service "down" OR
  - Drift is "high"
```

---

## IV. PARTIAL DATA HANDLING

Dashboard is composed from multiple sources. Each may fail independently:

```
{
  source: "partial",
  errors: ["checkpoints: timeout", "github: unavailable"],
  data: { ... } // available parts still returned
}
```

The dashboard **must never show a blank screen** if one source fails.

---

## V. STALE DETECTION

- `stale: true` if `updated_at` is > 60 seconds ago
- Each sub-source has its own stale time:
  - checkpoints: 15s
  - projects: 30s
  - appointments: 60s
  - contexto: 30s
  - services: 10s

---

## VI. NEXT SPRINT IMPLEMENTATION NOTES

To implement the `/api/dashboard/snapshot` server function:
1. Create `backend/dashboard/snapshot.ts` — aggregator
2. Add to `src/lib/dashboard-server-fns.ts`
3. Keep `useDashboard()` as client hook (backward compat)
4. Add Zod schema to `api-contract/dashboard.schema.ts`

**Not blocking current sprint** — current client-side aggregation works.

---

## SUMMARY

✅ Contract defined  
✅ Shape documented with all required fields  
✅ Partial data handling strategy documented  
✅ Health derivation logic documented  
⏳ Server function implementation — next phase  
