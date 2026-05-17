# KRATOS — Contexto Snapshot Contract

**Date:** 2026-05-17  
**Wave:** K08  
**Endpoint:** `/api/contexto/snapshot`  
**Status:** DEFINED (current schema + envelope extension)

---

## I. CURRENT SCHEMA (api-contract/contexto.schema.ts)

The `ContextSnapshotSchema` covers the core data shape:

```typescript
ContextSnapshot {
  id: string (UUID)
  capturedAt: string (ISO datetime)
  project: string
  mission: string
  app: string
  window: string
  focusStatus: "on_focus" | "off_focus" | "unknown"
  confidence: number (0-100)
  drift: "none" | "light" | "high"
  driftMinutes?: number
  activeWindowApp: string
  activeWindowTitle: string
  activeWindowDomain?: string
  activeWindowDuration: string
  reasons: string[]
  browserTabs: BrowserTab[]
}
```

---

## II. SNAPSHOT ENVELOPE (extended contract)

The `/api/contexto/snapshot` endpoint wraps `ContextSnapshot` in an envelope with observability metadata:

```typescript
interface ContextoSnapshotEnvelope {
  data: ContextSnapshot | null;
  error: string | null;
  source: "live" | "mock" | "cache" | "stale";
  stale: boolean;          // true if capturedAt > 5 min ago
  updated_at: string;      // ISO timestamp of this response
  next_action: string | null;  // Derived hint for cockpit display
  origin: "akasha" | "local" | "mock";  // Where data came from
}
```

---

## III. CURRENT IMPLEMENTATION

**File:** `backend/contexto/store.ts`  
**Status:** Mock-backed with seeded data

The store returns a hardcoded mock snapshot. The extended envelope fields (`source`, `stale`, `next_action`, `origin`) are not yet implemented at the server function level.

**Recommendation for K09:** Add envelope wrapper in `src/lib/` server function.

---

## IV. STALE DETECTION LOGIC

```typescript
function isStale(capturedAt: string): boolean {
  const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
  return Date.now() - new Date(capturedAt).getTime() > STALE_THRESHOLD_MS;
}
```

When stale:
- `stale: true` in envelope
- `source: "stale"` 
- UI shows stale indicator badge
- Data is still returned (degraded, not broken)

---

## V. FALLBACK CHAIN

```
Request to /api/contexto/snapshot
  → Akasha online? (AKASHA_URL present)
    YES → Fetch latest context snapshot
      → Parse with ContextSnapshotSchema
        → Valid → return { data, source: "live", stale: false }
        → Invalid → fall to mock
    NO → Use local backend/contexto/store.ts
      → Return { data, source: "mock", stale: false }
      → If capturedAt old → { stale: true, source: "stale" }
```

---

## VI. NEXT_ACTION DERIVATION

`next_action` is derived from the snapshot, not stored:

```typescript
function deriveNextAction(snapshot: ContextSnapshot): string {
  if (snapshot.drift === "high") return "Retomar foco em: " + snapshot.project;
  if (snapshot.focusStatus === "off_focus") return "Checar contexto atual";
  if (snapshot.confidence < 50) return "Confirmar projeto ativo";
  return null;
}
```

---

## VII. WHAT KRATOS DOES NOT DO

- Does NOT write to Akasha
- Does NOT modify context snapshots
- Does NOT execute any context capture
- Does NOT require Akasha to display context (fallback to mock)

---

## VIII. CLOUDFLARE WORKER ENV

| Variable | Name | Required |
|---|---|---|
| Akasha URL | `AKASHA_URL` | Optional (mock fallback) |

---

## SUMMARY

✅ Core schema already exists in `api-contract/contexto.schema.ts`  
✅ Extended envelope contract defined  
✅ Stale detection logic defined  
✅ Fallback chain documented  
✅ Read-only boundary maintained  
⏳ Server function envelope wrapper — implement in K09  
