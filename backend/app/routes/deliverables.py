from fastapi import APIRouter
from app.services import get_deliverables

router = APIRouter(prefix="/deliverables", tags=["deliverables"])


@router.get("")
def deliverables():
    return get_deliverables()


@router.get("/overdue")
def overdue():
    return []
