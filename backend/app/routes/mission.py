from fastapi import APIRouter
from app.schemas.mission_schemas import MissionLensResponse, MissionCurrentResponse, MissionStatusResponse, MissionReplayResponse

router = APIRouter(prefix="/mission", tags=["mission"])

# In-memory store for mission status (MVP — resets on server restart)
_mission_store: dict = {}


@router.get("/current", response_model=MissionCurrentResponse)
def current():
    try:
        from app.services.mission_intelligence_service import get_current_mission
        return get_current_mission()
    except Exception:
        return {
            "current_project": {"id": "unknown", "name": "Indefinido"},
            "current_mission": {"id": "unknown", "title": "Missão indefinida"},
            "focus_state": "drifting",
        }


@router.get("/lens", response_model=MissionLensResponse)
def lens():
    try:
        from app.services.mission_intelligence_service import get_mission_lens
        return get_mission_lens()
    except Exception:
        return {
            "contract_version": "mission_lens.v1",
            "source": "error",
            "collector_status": "error",
            "data": {
                "current_mission": {"title": "Missão indefinida", "project": "Indefinido"},
                "next_action": {"title": "Definir próxima ação", "priority": "low"},
                "do_not_do": [],
                "risks": [],
                "deadlines": [],
                "checkpoint": {"available": False},
                "system_pulse": {"status": "unknown"},
                "mentor_summary": {"text": "Sistema indisponível", "tone": "calm"},
                "checkpoint_suggestion": {"should_suggest": False},
            },
        }


@router.get("/{mission_id}/status", response_model=MissionStatusResponse)
def mission_status(mission_id: str):
    """Get current status of a mission by ID."""
    if mission_id in _mission_store:
        return {
            "mission_id": mission_id,
            "status": _mission_store[mission_id].get("status", "unknown"),
            "tasks": _mission_store[mission_id].get("tasks", []),
            "task_count": len(_mission_store[mission_id].get("tasks", [])),
        }
    return {
        "mission_id": mission_id,
        "status": "not_found",
        "tasks": [],
        "task_count": 0,
    }


@router.get("/{mission_id}/replay", response_model=MissionReplayResponse)
def mission_replay(mission_id: str):
    """Replay the event timeline for a mission."""
    if mission_id in _mission_store:
        mission = _mission_store[mission_id]
        return {
            "mission_id": mission_id,
            "status": mission.get("status", "unknown"),
            "timeline": mission.get("timeline", []),
            "event_count": len(mission.get("timeline", [])),
        }
    return {
        "mission_id": mission_id,
        "status": "not_found",
        "timeline": [],
        "event_count": 0,
    }


def store_mission_event(mission_id: str, event: dict) -> None:
    """Store a mission event for replay. Called by mission_bus_service."""
    if mission_id not in _mission_store:
        _mission_store[mission_id] = {
            "status": "planned",
            "tasks": [],
            "timeline": [],
        }
    _mission_store[mission_id]["timeline"].append({
        "event_type": event.get("event_type"),
        "timestamp": event.get("timestamp"),
        "event_id": event.get("event_id"),
    })
    if event.get("event_type") == "mission.completed":
        _mission_store[mission_id]["status"] = "completed"
    elif event.get("event_type") == "mission.failed":
        _mission_store[mission_id]["status"] = "failed"
