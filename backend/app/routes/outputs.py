from fastapi import APIRouter
from app.services import get_outputs

router = APIRouter(prefix="/outputs", tags=["outputs"])


@router.get("")
def outputs():
    return get_outputs()
