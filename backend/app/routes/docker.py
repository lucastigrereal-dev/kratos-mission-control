from fastapi import APIRouter
from app.services import get_docker

router = APIRouter(prefix="/docker", tags=["docker"])


@router.get("")
def docker():
    return get_docker()
