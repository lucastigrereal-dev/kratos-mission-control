from fastapi import APIRouter
from app.services import get_execution_today

router = APIRouter(prefix="/execution", tags=["execution"])


@router.get("/today")
def today():
    return get_execution_today()


@router.get("/week")
def week():
    return {}
