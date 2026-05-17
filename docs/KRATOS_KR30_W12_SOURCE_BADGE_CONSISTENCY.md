# KRATOS KR30 W12 — Snapshot Source Badge Consistency

**Date:** 2026-05-17  
**Wave:** K12  

---

## Problem

Snapshot contracts for contexto, dashboard, github, and omnis all define `source` metadata independently. There was no shared schema — each did it ad hoc or not at all.

## Solution

Created `api-contract/source-badge.schema.ts` with:

```typescript
DataSourceSchema: "live" | "mock" | "cache" | "stale" | "partial"
DataOriginSchema: "akasha" | "omnis" | "github" | "local" | "mock"

SourceBadgeMetaSchema {
  source: DataSource
  origin?: DataOrigin
  stale: boolean
  updated_at: string (ISO)
  errors: string[]
}

createSnapshotEnvelopeSchema<T>(dataSchema) → envelope with data/error/meta
```

## UI Pending (frontend/ guard active)

The `SourceBadge` UI component is deferred — **frontend/ is READ-ONLY this sprint**.  
When frontend sprint opens:
- Create `src/components/kratos/base/SourceBadge.tsx`
- Accept `meta: SourceBadgeMeta` prop
- Render: "live" = green, "mock" = gray, "stale" = yellow, "partial" = orange

## Build

✅ Build green after schema addition  
✅ New schema file compiles cleanly  
✅ Existing envelopes unaffected (meta is optional)  
