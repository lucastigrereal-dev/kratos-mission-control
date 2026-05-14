from fastapi import APIRouter
from app.services import get_activitywatch_status

router = APIRouter(prefix="/activitywatch", tags=["activitywatch"])


@router.get("/status")
def activitywatch_status():
    return get_activitywatch_status()


@router.get("/buckets")
def buckets():
    try:
        from app.collectors.activitywatch_collector import get_buckets
        return get_buckets()
    except Exception:
        return []
