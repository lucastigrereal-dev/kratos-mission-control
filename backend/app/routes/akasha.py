from fastapi import APIRouter
from app.services import get_akasha_status

router = APIRouter(prefix="/akasha", tags=["akasha"])


@router.get("/status")
def akasha_status():
    """AKASHA memory health — PostgreSQL/pgvector status with source badge."""
    return get_akasha_status()
