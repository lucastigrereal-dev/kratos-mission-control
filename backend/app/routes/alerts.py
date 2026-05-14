from fastapi import APIRouter, Request
from app.services import get_alerts as svc_get_alerts
from app.db import get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
def list_alerts():
    try:
        from app.services.alert_service import get_alerts
        return get_alerts()
    except Exception:
        return svc_get_alerts()


@router.get("/active")
def active():
    try:
        from app.services.alert_service import get_alerts
        return get_alerts(status="active")
    except Exception:
        return []


@router.get("/history")
def history():
    try:
        from app.services.alert_service import get_alerts
        return get_alerts(status="resolved")
    except Exception:
        return []


@router.patch("/{alert_id}")
async def update_alert(alert_id: str, request: Request):
    body = await request.json()
    db = get_db()
    if "status" in body:
        db.execute(
            "UPDATE alert_events SET status = ?, last_seen_at = datetime('now') WHERE id = ?",
            (body["status"], alert_id),
        )
        db.commit()
    db.close()
    return {"id": alert_id, "updated": True}
