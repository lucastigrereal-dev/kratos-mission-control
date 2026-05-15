from fastapi import APIRouter
from app.db import get_db

router = APIRouter(prefix="/snapshots", tags=["snapshots"])


@router.get("")
def list_snapshots():
    try:
        db = get_db()
        rows = db.execute(
            "SELECT DISTINCT collector_name FROM collector_snapshots ORDER BY collector_name"
        ).fetchall()
        db.close()
        return [r["collector_name"] for r in rows]
    except Exception:
        return []


@router.get("/{collector_name}")
def snapshot_detail(collector_name: str):
    try:
        db = get_db()
        row = db.execute(
            "SELECT * FROM collector_snapshots WHERE collector_name = ? "
            "ORDER BY collected_at DESC LIMIT 1",
            (collector_name,),
        ).fetchone()
        db.close()
        if row:
            return {
                "id": row["id"],
                "collector_name": row["collector_name"],
                "source": row["source"],
                "collector_status": row["collector_status"],
                "payload_json": row["payload_json"],
                "collected_at": row["collected_at"],
            }
    except Exception:
        pass
    return {}
