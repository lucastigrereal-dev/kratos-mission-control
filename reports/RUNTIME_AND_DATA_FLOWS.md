# KRATOS Runtime and Data Flows

Generated: 2026-05-19

## 1. Local Runtime Flow

```text
Operator opens KRATOS UI
  -> React route renders shell/page
  -> hook queries FastAPI endpoint or subscribes to SSE
  -> FastAPI route calls service
  -> service reads SQLite, collector, cache, or mock fallback
  -> response returns source metadata where implemented
  -> frontend renders operational card/state/source badge
  -> Lucas decides next action
```

## 2. Live Snapshot Flow

`/live/snapshot` is the central operational aggregation endpoint.

Expected flow:

1. Frontend calls `/live/snapshot`.
2. `backend/app/routes/live.py` delegates to live event service.
3. `live_event_service.py` fetches multiple sections:
   - mission lens
   - today agenda
   - recent checkpoints
   - mentor signals
   - alerts
   - context
   - next best action
   - today execution
   - collector status
4. Service applies parallel fetch and timeout/fallback logic.
5. Payload is returned using the collector envelope pattern.
6. Frontend derives live state, system pulse, and UI badges.

Failure behavior should be:

- One collector failure should degrade only that section.
- Total backend failure should produce a visible offline/error state.
- Source should identify `real`, `cached`, `fallback`, `mock`, or `error`.

## 3. SSE Flow

`/live/stream` is intended for low-latency updates.

```text
Frontend EventSource
  -> GET /live/stream
    -> FastAPI async event stream
      -> live event payloads
        -> query invalidation / UI refresh
          -> fallback to polling when SSE fails
```

Observed frontend behavior:

- `frontend/src/hooks/useLiveKratos.ts` opens `EventSource("http://127.0.0.1:5100/live/stream")`.
- `src/hooks/useLiveStatus.ts` opens `EventSource(BASE_URL + "/live/stream")`.
- On error, hooks close SSE and degrade to reconnect or polling.

Risk:

- API base is duplicated.
- Fallback behavior differs between hooks.
- A shared live client would reduce drift.

## 4. Context Flow

```text
ActivityWatch / browser/window state
  -> activitywatch_collector
    -> context_classifier_service
      -> context_drift_service / context_loss_service
        -> /context/current, /context/lost, /context/project-guess
          -> Contexto UI, Aurora/Mentor signals, checkpoint suggestion
```

Risks:

- ActivityWatch can be offline.
- Classification is heuristic.
- Context can be wrong and should always expose confidence/source.

## 5. Mentor / Mission Flow

```text
SQLite state + collectors + alerts + context
  -> mentor_signal_service
  -> mentor_decision_service
  -> mission_intelligence_service
    -> /mentor/*
    -> /mission/current
    -> /mission/lens
      -> Aurora panel / Mission lens / next action UI
```

Architectural tension:

- Docs say Aurora interprets and KRATOS sees.
- Backend `mentor_*` and `mission_intelligence_service.py` already interpret.
- This is acceptable only if these are deterministic KRATOS heuristics, not autonomous Aurora claims.

Recommended language:

- KRATOS can compute operational heuristics.
- Aurora owns conversational/semantic interpretation.

## 6. Database Flow

```text
FastAPI service
  -> get_db()
    -> SQLite file path from KRATOS_DB_PATH or backend/data/kratos.db
      -> WAL mode
      -> foreign keys on
      -> SQL tables
        -> service returns dict/list
```

Critical issue:

- Inline schema and migration SQL are not the same model.
- A single DB authority is required before larger persistence work.

## 7. OMNIS Read-Only Flow

```text
KRATOS frontend
  -> /omnis/status or /omnis/summary
    -> omnis_collector
      -> try HTTP OMNIS health/status
      -> fallback to filesystem/mock
        -> return status for display
```

Forbidden by contract:

- POST/PUT/DELETE to OMNIS.
- Trigger jobs.
- Execute crews.
- Retry execution.

KRATOS may only observe OMNIS.

## 8. Akasha / Obsidian Flow

### Obsidian to Akasha

```text
Obsidian markdown
  -> scan vault
  -> parse frontmatter
  -> chunk text
  -> Ollama embedding
  -> Docker exec psql into akasha-postgres
  -> documents/document_chunks/chunk_embeddings
```

### Akasha to Obsidian

```text
Akasha PostgreSQL
  -> query documents + chunks
  -> map domain to PARA folder
  -> write markdown notes
  -> create dashboards/templates
```

### Unified RAG

```text
query
  -> Akasha SQL keyword search
  -> Obsidian markdown scan
  -> context object
  -> generated prompt saved under .planning
```

Risk:

- These scripts are powerful and write outside the repo.
- They must be operated with explicit authorization and dry-run discipline.

