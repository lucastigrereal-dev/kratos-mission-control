from fastapi import APIRouter, Request
from app.services import get_tasks, get_today_tasks, get_overdue_tasks, get_unfinished_items
from app.db import get_db, generate_id, now_iso
import json

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("")
def list_tasks():
    return get_tasks()


@router.get("/today")
def today():
    return get_today_tasks()


@router.get("/overdue")
def overdue():
    return get_overdue_tasks()


@router.get("/doing")
def doing():
    try:
        envelope = get_tasks()
        all_tasks = envelope.get("data", [])
        filtered = [t for t in all_tasks if t.get("status") == "doing"]
        return {
            "data": filtered,
            "source": envelope.get("source", "live"),
            "source_ts": envelope.get("source_ts", ""),
        }
    except Exception:
        return {"data": [], "source": "mock", "source_ts": ""}


@router.get("/unfinished")
def unfinished():
    return get_unfinished_items()


@router.post("")
async def create_task(request: Request):
    body = await request.json()
    db = get_db()
    task_id = body.get("id", f"task-{generate_id()}")
    db.execute(
        "INSERT OR REPLACE INTO tasks (id, project_id, title, description, status, priority, "
        "due_date, deadline_type, next_action, blocker, source, created_at, updated_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            task_id,
            body.get("project_id") or None,
            body.get("title", ""),
            body.get("description", ""),
            body.get("status", "inbox"),
            body.get("priority", "medium"),
            body.get("due_date"),
            body.get("deadline_type", "soft"),
            body.get("next_action", ""),
            body.get("blocker", ""),
            body.get("source", "manual"),
            now_iso(),
            now_iso(),
        ),
    )
    db.commit()
    db.close()
    return {
        "id": task_id,
        "title": body.get("title", ""),
        "project_id": body.get("project_id", ""),
        "status": body.get("status", "inbox"),
        "priority": body.get("priority", "medium"),
        "source": body.get("source", "manual"),
        "created_at": now_iso(),
    }


@router.patch("/{task_id}")
async def update_task(task_id: str, request: Request):
    body = await request.json()
    db = get_db()
    updates = []
    values = []
    for field in ["title", "project_id", "status", "priority", "description",
                   "due_date", "next_action", "blocker", "source"]:
        if field in body:
            updates.append(f"{field} = ?")
            values.append(body[field])
    if updates:
        updates.append("updated_at = ?")
        values.append(now_iso())
        values.append(task_id)
        db.execute(f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?", values)
        db.commit()
    db.close()
    return {"id": task_id, "updated": True}
