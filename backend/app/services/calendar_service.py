"""Calendar service — event management and deadline detection."""

from datetime import date, datetime, timezone, timedelta
from app.db import now_iso


def get_today_events() -> list[dict]:
    """Return calendar events for today from SQLite."""
    return _get_events_for_date(date.today().isoformat())


def get_week_events() -> list[dict]:
    """Return calendar events for the current week."""
    today = date.today()
    start = today - timedelta(days=today.weekday())
    events = []
    for i in range(7):
        d = start + timedelta(days=i)
        events.extend(_get_events_for_date(d.isoformat()))
    return events


def get_month_events() -> list[dict]:
    """Return calendar events for the current month."""
    today = date.today()
    start = today.replace(day=1)
    if today.month == 12:
        end = today.replace(year=today.year + 1, month=1, day=1)
    else:
        end = today.replace(month=today.month + 1, day=1)
    days = (end - start).days
    events = []
    for i in range(days):
        d = start + timedelta(days=i)
        events.extend(_get_events_for_date(d.isoformat()))
    return events


def get_overdue_events() -> list[dict]:
    """Return overdue calendar events."""
    today = date.today().isoformat()
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT id, title, description, event_date, event_type, project_id, status "
            "FROM calendar_events WHERE event_date < ? AND status != 'done' "
            "ORDER BY event_date ASC LIMIT 20",
            (today,)
        ).fetchall()
        db.close()
        return [_row_to_event(r) for r in rows]
    except Exception:
        from app.services import _load_json
        data = _load_json("calendar_week.json")
        if isinstance(data, dict):
            today_str = today
            return [e for e in data.get("events", []) if e.get("date", "") < today_str]
        return []


def get_upcoming_events(days: int = 7) -> list[dict]:
    """Return upcoming events within the next N days."""
    today = date.today()
    end = today + timedelta(days=days)
    events = []
    current = today + timedelta(days=1)
    while current <= end:
        events.extend(_get_events_for_date(current.isoformat()))
        current += timedelta(days=1)
    return events


def detect_missing_deadlines() -> list[dict]:
    """Detect tasks that should have deadlines but don't."""
    missing = []
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT id, title, project_id, status, priority FROM tasks "
            "WHERE due_date IS NULL AND status IN ('inbox', 'doing', 'next') "
            "AND priority IN ('high', 'critical') LIMIT 10"
        ).fetchall()
        db.close()
        for t in rows:
            missing.append({
                "task_id": t["id"],
                "title": t["title"],
                "project_id": t["project_id"],
                "severity": "warning" if t["priority"] == "critical" else "info",
                "reason": "Tarefa prioritária sem data definida",
            })
    except Exception:
        pass
    return missing


def _get_events_for_date(event_date: str) -> list[dict]:
    """Get calendar events for a specific date from SQLite."""
    try:
        from app.db import get_db
        db = get_db()
        rows = db.execute(
            "SELECT id, title, description, event_date, event_type, project_id, status "
            "FROM calendar_events WHERE event_date = ? ORDER BY event_date ASC",
            (event_date,)
        ).fetchall()
        db.close()
        return [_row_to_event(r) for r in rows]
    except Exception:
        return []


def _row_to_event(row) -> dict:
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"] or "",
        "date": row["event_date"],
        "event_date": row["event_date"],
        "event_type": row["event_type"] or "task",
        "project_id": row["project_id"] or None,
        "status": row["status"] or "pending",
    }
