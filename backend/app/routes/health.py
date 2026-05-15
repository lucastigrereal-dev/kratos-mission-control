from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {
        "status": "ok",
        "version": "0.8.0",
        "phase": "0.8C",
        "project": "kratos-mission-control",
        "mode": "local-first",
        "data_source": "live"
    }
