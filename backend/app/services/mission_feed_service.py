"""Mission Feed Service — real mission data for cockpit display.

Wave 3: Sources mission state from SQLite + event bridge ring buffer.
Replaces mock get_now() dependency with real data.
"""
import json
from datetime import datetime, timezone

from app.services.event_bridge import get_recent_events, get_status as get_event_status


def get_missions_from_db(limit: int = 20) -> list[dict]:
    """Fetch real missions from SQLite."""
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT m.id, m.project_id, m.title, m.description, m.status, m.phase, "
            "m.created_at, m.updated_at, p.name as project_name "
            "FROM missions m "
            "LEFT JOIN projects p ON m.project_id = p.id "
            "ORDER BY m.updated_at DESC "
            "LIMIT ?",
            (limit,)
        ).fetchall()
        db.close()
        return [
            {
                "id": row["id"],
                "project_id": row["project_id"],
                "title": row["title"],
                "description": row["description"] or "",
                "status": row["status"] or "active",
                "phase": row["phase"] or "",
                "project_name": row["project_name"] or "",
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            }
            for row in rows
        ]
    except Exception:
        return []


def get_mission_summary() -> dict:
    """Aggregate mission status across all projects."""
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT status, COUNT(*) as cnt FROM missions GROUP BY status"
        ).fetchall()
        total = db.execute("SELECT COUNT(*) as cnt FROM missions").fetchone()
        db.close()

        by_status = {row["status"]: row["cnt"] for row in rows}
        total_count = total["cnt"] if total else 0

        return {
            "total": total_count,
            "active": by_status.get("active", 0),
            "completed": by_status.get("completed", 0),
            "failed": by_status.get("failed", 0),
            "planned": by_status.get("planned", 0),
            "paused": by_status.get("paused", 0),
            "source": "sqlite" if total_count > 0 else "empty",
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        return {
            "total": 0, "active": 0, "completed": 0, "failed": 0,
            "planned": 0, "paused": 0,
            "source": "error", "error": str(e),
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }


def get_mission_events(mission_id: str | None = None, limit: int = 20) -> list[dict]:
    """Get mission-related events from the event bridge ring buffer."""
    events = get_recent_events(n=100)
    filtered = []
    for event in events:
        if mission_id:
            if event.get("mission_id") == mission_id:
                filtered.append(_normalize_event(event))
        elif event.get("event_type", "").startswith("mission."):
            filtered.append(_normalize_event(event))

    filtered.sort(key=lambda e: e.get("timestamp", ""), reverse=True)
    return filtered[:limit]


def _normalize_event(event: dict) -> dict:
    return {
        "event_id": event.get("event_id"),
        "event_type": event.get("event_type"),
        "timestamp": event.get("timestamp"),
        "mission_id": event.get("mission_id"),
        "severity": event.get("severity", "info"),
        "status": event.get("status", "ok"),
        "source": event.get("source", {}).get("service", "unknown"),
    }


def get_mission_feed() -> dict:
    """Build the complete mission feed payload for the cockpit.

    Aggregates: SQLite missions + event bridge ring buffer + event stats.
    """
    missions = get_missions_from_db(limit=10)
    summary = get_mission_summary()
    recent_events = get_mission_events(limit=15)
    event_status = _safe(get_event_status, {})
    event_listener = event_status.get("listener", {})

    # Compute lifecycle stats
    lifecycle = {"planned": 0, "active": 0, "completed": 0, "failed": 0}
    for m in missions:
        status = m.get("status", "")
        if status in lifecycle:
            lifecycle[status] += 1

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "summary": summary,
        "missions": missions,
        "lifecycle": lifecycle,
        "recent_events": recent_events,
        "event_buffer": {
            "total": event_listener.get("events_received", 0),
            "heartbeats": event_status.get("heartbeat", {}).get("count", 0),
            "channels": event_listener.get("channels", []),
        },
        "_feed_meta": {
            "source": "sqlite" if missions else "empty",
            "events_from": "redis_ring_buffer" if recent_events else "none",
            "mode": "live" if missions else "empty",
        },
    }


def _safe(fn, default):
    try:
        return fn()
    except Exception:
        return default
