from fastapi import APIRouter, Query

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/bridge")
def event_bridge(
    n: int = Query(default=50, ge=1, le=100),
    type: str | None = Query(default=None, alias="type"),
    source: str | None = Query(default=None),
):
    """Last N events from cross-container event bridge ring buffer."""
    from app.services.event_bridge import get_recent_events
    events = get_recent_events(n=n, event_type=type, source=source)
    return {"count": len(events), "events": events}


@router.get("/bridge/status")
def event_bridge_status():
    """Cross-container event bridge diagnostic status."""
    from app.services.event_bridge import get_status
    return get_status()


@router.post("/bridge/start")
def event_bridge_start():
    """Start the event bridge heartbeat + listener threads."""
    from app.services.event_bridge import start
    return start()
