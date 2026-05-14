from fastapi import APIRouter, Request
from app.db import get_db, generate_id, now_iso
import json

router = APIRouter(prefix="/calendar", tags=["calendar"])


def _row_to_event(row):
    return {
        "id": row["id"],
        "project_id": row["project_id"],
        "task_id": row["task_id"],
        "deliverable_id": row["deliverable_id"],
        "title": row["title"],
        "description": row["description"] or "",
        "event_type": row["event_type"],
        "start_at": row["start_at"],
        "end_at": row["end_at"],
        "due_at": row["due_at"],
        "status": row["status"],
        "priority": row["priority"],
        "source": row["source"],
        "created_at": row["created_at"],
    }


@router.get("/today")
def today():
    try:
        from app.services.calendar_service import get_today_events
        return get_today_events()
    except Exception:
        return []


@router.get("/week")
def week():
    try:
        from app.services.calendar_service import get_week_events
        return get_week_events()
    except Exception:
        return []


@router.get("/month")
def month():
    try:
        from app.services.calendar_service import get_month_events
        return get_month_events()
    except Exception:
        return []


@router.get("/overdue")
def overdue():
    try:
        from app.services.calendar_service import get_overdue_events
        return get_overdue_events()
    except Exception:
        return []


@router.get("/upcoming")
def upcoming():
    try:
        from app.services.calendar_service import get_upcoming_events
        return get_upcoming_events()
    except Exception:
        return []
