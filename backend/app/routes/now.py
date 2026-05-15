from fastapi import APIRouter
from app.services import get_now

router = APIRouter(prefix="/now", tags=["now"])


@router.get("")
def now():
    return get_now()
