from fastapi import APIRouter
from app.services import get_reminders

router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.get("")
def reminders():
    return get_reminders()


@router.get("/today")
def today():
    return []
