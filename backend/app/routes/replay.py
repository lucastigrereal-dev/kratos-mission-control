from fastapi import APIRouter, Query

router = APIRouter(prefix="/replay", tags=["replay"])


@router.get("/feed")
def replay_feed():
    """Replay feed — status + recent events for cockpit."""
    try:
        from app.services.replay_feed_service import get_replay_feed
        return get_replay_feed()
    except Exception as e:
        return {"error": str(e), "source": "error"}


@router.get("/status")
def replay_status():
    """Replay capability status."""
    try:
        from app.services.replay_feed_service import get_replay_status
        return get_replay_status()
    except Exception as e:
        return {"error": str(e)}


@router.get("/events")
def replay_events(event_type: str | None = Query(None), limit: int = Query(20, ge=1, le=100)):
    """List replayable events from ring buffer."""
    try:
        from app.services.replay_feed_service import get_replay_events
        return get_replay_events(event_type=event_type, limit=limit)
    except Exception as e:
        return {"error": str(e)}


@router.post("/trigger")
def replay_trigger(event_type: str | None = Query(None), limit: int = Query(10, ge=1, le=50)):
    """Trigger event replay with re-emit."""
    try:
        from app.services.replay_feed_service import trigger_replay
        return trigger_replay(event_type=event_type, limit=limit)
    except Exception as e:
        return {"error": str(e), "replayed": 0}
