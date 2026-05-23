"""Approval service — local in-memory approval queue. No external actions executed."""
import uuid
from datetime import datetime, timezone
from typing import Literal, Optional

State = Literal["pending", "approved", "rejected", "deferred", "needs_context"]

_approvals: list[dict] = []


def list_approvals(status: Optional[str] = None) -> list[dict]:
    if status:
        return [a for a in _approvals if a["status"] == status]
    return list(_approvals)


def create_approval(title: str, description: str = "", risk: str = "low", source: str = "manual") -> dict:
    now = datetime.now(timezone.utc).isoformat()
    item = {
        "id": str(uuid.uuid4()),
        "title": title,
        "description": description,
        "status": "pending",
        "risk": risk,
        "source": source,
        "created_at": now,
        "updated_at": now,
    }
    _approvals.append(item)
    return item


def update_approval(approval_id: str, status: State) -> dict | None:
    for a in _approvals:
        if a["id"] == approval_id:
            if status not in ("pending", "approved", "rejected", "deferred", "needs_context"):
                return None
            a["status"] = status
            a["updated_at"] = datetime.now(timezone.utc).isoformat()
            return a
    return None


def delete_approval(approval_id: str) -> bool:
    for i, a in enumerate(_approvals):
        if a["id"] == approval_id:
            _approvals.pop(i)
            return True
    return False
