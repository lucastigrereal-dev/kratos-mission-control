# KRATOS Sprint A W03 — Contexto Snapshot Contract

**Date:** 2026-05-17
**Wave:** A03

---

## Contract: `ContextoSnapshotData`

Added to `api-contract/contexto.schema.ts`:

```typescript
ContextoSnapshotDataSchema = {
  current_context: string,     // what project/mission is active now
  confidence: number (0-100),  // confidence score
  mode: ContextoMode,          // execution | planning | review | standby | unknown
  next_action: string,         // concrete next step
  origin: string,              // source system (akasha, local, omnis, etc.)
}
```

## Distinction from existing `ContextSnapshotSchema`

- Existing `ContextSnapshotSchema` = desktop telemetry (tabs, windows, focus status)
- New `ContextoSnapshotDataSchema` = high-level mission snapshot (what are we doing, what's next)

Both coexist — different purposes, different endpoints.

## Build

✅ Green (2.57s SSR)
