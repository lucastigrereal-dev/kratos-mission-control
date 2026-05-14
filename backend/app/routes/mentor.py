from fastapi import APIRouter
from app.db import now_iso

router = APIRouter(prefix="/mentor", tags=["mentor"])


@router.get("/summary")
def summary():
    from app.services import get_mentor_summary
    return get_mentor_summary()


@router.get("/next-action")
def next_action():
    try:
        from app.services.mentor_decision_service import get_next_best_action
        nba = get_next_best_action()
        return {"next_action": nba, "next_best_action": nba}
    except Exception:
        return {"next_action": None, "next_best_action": None}


@router.get("/next-best-action")
def next_best_action():
    try:
        from app.services.mentor_decision_service import get_next_best_action
        nba = get_next_best_action()
        return {"next_best_action": nba}
    except Exception:
        return {"next_best_action": None}


@router.get("/unfinished")
def unfinished():
    from app.services import get_unfinished_items
    return get_unfinished_items()


@router.get("/deadlines")
def deadlines():
    try:
        from app.services.calendar_service import get_overdue_events, detect_missing_deadlines
        return {
            "critical": get_overdue_events(),
            "missing": detect_missing_deadlines(),
        }
    except Exception:
        return {"critical": [], "missing": []}


@router.get("/focus")
def focus():
    from app.services import get_mentor_focus
    return get_mentor_focus()


@router.get("/signals")
def signals():
    try:
        from app.services.mentor_signal_service import generate_signals
        return generate_signals()
    except Exception:
        return []


@router.get("/context-signals")
def context_signals():
    try:
        from app.services.context_loss_service import detect_context_loss
        return detect_context_loss()
    except Exception:
        return []


@router.get("/mission-brief")
def mission_brief():
    try:
        from app.services.mission_intelligence_service import get_mission_brief
        return get_mission_brief()
    except Exception:
        return {"you_are_here": "Contexto indisponivel", "do_this_now": "Definir proxima acao"}


@router.get("/projects-at-risk")
def projects_at_risk():
    try:
        from app.services.mentor_decision_service import get_projects_at_risk
        return get_projects_at_risk()
    except Exception:
        return []


@router.get("/recommendations")
def recommendations():
    try:
        from app.services.mentor_decision_service import get_active_recommendations
        return get_active_recommendations()
    except Exception:
        return []


@router.get("/recommendations/active")
def recommendations_active():
    try:
        from app.services.mentor_decision_service import get_active_recommendations
        recs = get_active_recommendations()
        return [r for r in recs if r.get("status") == "active"]
    except Exception:
        return []


@router.get("/finish-line")
def finish_line():
    try:
        from app.services.mentor_decision_service import get_finish_line
        return get_finish_line()
    except Exception:
        return []


@router.post("/recommendations/{rec_id}/complete")
def complete_recommendation(rec_id: str):
    try:
        from app.services.mentor_decision_service import update_recommendation
        result = update_recommendation(rec_id, "completed")
        if result:
            return result
        return {"success": False}
    except Exception:
        return {"success": False}


@router.post("/recommendations/{rec_id}/dismiss")
def dismiss_recommendation(rec_id: str):
    try:
        from app.services.mentor_decision_service import update_recommendation
        result = update_recommendation(rec_id, "dismissed")
        if result:
            return result
        return {"success": False}
    except Exception:
        return {"success": False}


@router.post("/recommendations/{rec_id}/snooze")
def snooze_recommendation(rec_id: str):
    try:
        from app.services.mentor_decision_service import update_recommendation
        result = update_recommendation(rec_id, "snoozed")
        if result:
            return result
        return {"success": False}
    except Exception:
        return {"success": False}
