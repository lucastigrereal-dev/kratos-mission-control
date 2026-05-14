from fastapi import APIRouter
from app.services import get_git

router = APIRouter(prefix="/git", tags=["git"])


@router.get("")
def git():
    return get_git()
