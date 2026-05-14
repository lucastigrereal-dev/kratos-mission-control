from fastapi import APIRouter

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/timeseries")
def timeseries():
    return []


@router.get("/summary")
def summary():
    return {"total_metrics": 0}
