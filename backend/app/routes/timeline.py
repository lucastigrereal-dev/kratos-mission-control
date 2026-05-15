from fastapi import APIRouter
from app.services import get_timeline

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("")
def timeline():
    return get_timeline()
