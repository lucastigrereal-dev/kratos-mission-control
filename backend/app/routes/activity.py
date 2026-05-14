from fastapi import APIRouter
from app.services import get_activity, get_tabs

router = APIRouter(tags=["activity"])


@router.get("/activity")
def activity():
    return get_activity()


@router.get("/tabs")
def tabs():
    return get_tabs()
