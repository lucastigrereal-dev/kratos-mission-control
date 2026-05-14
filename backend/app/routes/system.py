from fastapi import APIRouter
from app.services import get_system

router = APIRouter(prefix="/system", tags=["system"])


@router.get("")
def system():
    return get_system()
