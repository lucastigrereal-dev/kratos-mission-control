from fastapi import APIRouter
from app.services import get_qdrant_status

router = APIRouter(prefix="/qdrant", tags=["qdrant"])


@router.get("/status")
def qdrant_status():
    """Qdrant operational memory health — vector DB + collection inventory."""
    return get_qdrant_status()
