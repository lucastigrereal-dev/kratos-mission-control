from fastapi import APIRouter
from app.services import get_deadlines

router = APIRouter(prefix="/deadlines", tags=["deadlines"])


@router.get("")
def deadlines():
    return get_deadlines()


@router.get("/overdue")
def overdue():
    return []


@router.get("/upcoming")
def upcoming():
    return []


@router.get("/missing")
def missing():
    return []
