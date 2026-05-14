from fastapi import APIRouter
from app.services import get_tabs, get_browser_contexts, get_activity_windows, get_activity_sessions, get_context_switches

router = APIRouter(tags=["activity"])


@router.get("/tabs")
def tabs():
    return get_tabs()


@router.get("/activity/browser")
def browser():
    return get_browser_contexts()


@router.get("/activity/windows")
def windows():
    return get_activity_windows()


@router.get("/activity/sessions")
def sessions():
    return get_activity_sessions()


@router.get("/activity/context-switches")
def context_switches():
    return get_context_switches()
