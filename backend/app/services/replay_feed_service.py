"""Replay Feed Service — replay visibility for cockpit.

Wave 6: Exposes event bridge replay as a cockpit feed.
Shows replay history, available events, and replay trace status.
"""
import json
from datetime import datetime, timezone


def get_replay_status() -> dict:
    """Get current replay capability status."""
    try:
        from app.services.event_bridge import get_status
        status = get_status()
        listener = status.get("listener", {})
        return {
            "status": status.get("status", "unknown"),
            "ring_buffer": {
                "size": listener.get("ring_buffer_size", 0),
                "max": listener.get("ring_buffer_max", 100),
                "utilization_pct": round(
                    listener.get("ring_buffer_size", 0) / max(listener.get("ring_buffer_max", 1), 1) * 100, 1
                ),
            },
            "events_received": listener.get("events_received", 0),
            "channels": listener.get("channels", []),
            "heartbeat_count": status.get("heartbeat", {}).get("count", 0),
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


def get_replay_events(event_type: str | None = None, limit: int = 20) -> list[dict]:
    """Get replayable events from the ring buffer."""
    try:
        from app.services.event_bridge import get_recent_events
        events = get_recent_events(n=100)
        if event_type:
            events = [e for e in events if e.get("event_type") == event_type]

        result = []
        for e in events[-limit:]:
            result.append({
                "event_id": e.get("event_id"),
                "event_type": e.get("event_type"),
                "timestamp": e.get("timestamp"),
                "severity": e.get("severity", "info"),
                "status": e.get("status", "ok"),
                "source": e.get("source", {}).get("service", "unknown"),
                "mission_id": e.get("mission_id"),
                "trace_id": e.get("trace_id"),
                "correlation_id": e.get("correlation_id"),
            })
        return list(reversed(result))
    except Exception as e:
        return [{"error": str(e)}]


def trigger_replay(event_type: str | None = None, limit: int = 10) -> dict:
    """Trigger a replay of recent events."""
    try:
        from app.services.event_bridge import replay
        events = replay(n=limit, event_type=event_type, re_emit=True)
        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "replayed": len(events),
            "event_type_filter": event_type,
            "events": [
                {
                    "event_id": e.get("event_id"),
                    "event_type": e.get("event_type"),
                    "timestamp": e.get("timestamp"),
                }
                for e in events
            ],
        }
    except Exception as e:
        return {"error": str(e), "replayed": 0}


def get_replay_feed() -> dict:
    """Build the complete replay feed for cockpit display."""
    status = get_replay_status()
    recent = get_replay_events(limit=15)

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "status": status,
        "recent_events": recent,
        "replay_capable": status.get("status") == "running",
        "_replay_meta": {
            "mode": "live" if status.get("status") == "running" else "degraded",
            "source": "redis_ring_buffer",
        },
    }
