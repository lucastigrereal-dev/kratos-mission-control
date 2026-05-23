# Live Stream Schema (SSE)

**Protocol:** Server-Sent Events (text/event-stream)
**Endpoint:** `GET /live/stream`
**Content-Type:** `text/event-stream`
**Cache-Control:** `no-cache`
**Connection:** `keep-alive`

## Event Types

### `snapshot`
Full state snapshot on connection.
```
event: snapshot
data: {"source":"real","data":{...},"meta":{"latency_ms":2469}}
```

### `alert`
New or updated alert.
```
event: alert
data: {"id":"uuid","level":"warning","message":"...","timestamp":"ISO8601"}
```

### `checkpoint`
New checkpoint created.
```
event: checkpoint
data: {"id":"uuid","label":"...","timestamp":"ISO8601"}
```

### `signal`
New mentor signal.
```
event: signal
data: {"tone":"warning","message":"...","source":"context_drift"}
```

### `collector_update`
Collector status change.
```
event: collector_update
data: {"collector":"omnis","status":"degraded","source":"fallback"}
```

### `heartbeat`
Keep-alive ping every 15s.
```
event: heartbeat
data: {"timestamp":"ISO8601"}
```

## Reconnection

- Client should implement exponential backoff: 1s → 2s → 4s → 8s → max 30s
- On reconnect, a full `snapshot` event is sent
- Client state should be fully replaced on snapshot

## Fallback

If SSE fails or is not supported:
- Frontend falls back to polling `GET /live/snapshot` every 5s
- Polling is managed by `useLiveKratos` hook
