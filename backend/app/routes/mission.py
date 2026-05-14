from fastapi import APIRouter

router = APIRouter(prefix="/mission", tags=["mission"])


@router.get("/current")
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


@router.get("/lens")
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
