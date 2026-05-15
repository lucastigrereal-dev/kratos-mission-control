"""Execution plan service — today's plan and prioritization."""

from datetime import date, datetime, timezone
from app.db import now_iso


def get_today_plan() -> dict:
    """Build today's execution plan: tasks + calendar + focus blocks."""
    today = date.today().isoformat()

    try:
        from app.db import get_db
        db = get_db()

        tasks = db.execute(
            "SELECT id, title, project_id, status, priority, source, due_date, next_action "
            "FROM tasks WHERE due_date = ? AND status NOT IN ('done', 'cancelled') "
            "ORDER BY priority DESC",
            (today,)
        ).fetchall()

        active_count = db.execute(
            "SELECT COUNT(*) as cnt FROM tasks "
            "WHERE status NOT IN ('done', 'cancelled')"
        ).fetchone()

        db.close()

        plan_tasks = []
        for t in tasks:
            plan_tasks.append({
                "id": t["id"],
                "title": t["title"],
                "project_id": t["project_id"] or "",
                "status": t["status"] or "inbox",
                "priority": t["priority"] or "medium",
                "source": t["source"] or "manual",
                "due_date": t["due_date"] or "",
                "next_action": t["next_action"] or t["title"],
            })

        return {
            "date": today,
            "tasks": plan_tasks,
            "task_count": len(plan_tasks),
            "active_task_count": active_count["cnt"] if active_count else 0,
            "focus_blocks": [
                {"label": "Deep Work 1", "suggested_start": "09:00", "duration_min": 90},
                {"label": "Deep Work 2", "suggested_start": "14:00", "duration_min": 90},
            ],
            "generated_at": now_iso(),
        }
    except Exception:
        return _mock_today_plan()


def _mock_today_plan() -> dict:
    from app.services import _load_json
    plan = _load_json("execution_today.json")
    if isinstance(plan, dict):
        return plan
    return {
        "date": date.today().isoformat(),
        "tasks": [],
        "task_count": 0,
        "active_task_count": 0,
        "focus_blocks": [],
        "generated_at": now_iso(),
    }
