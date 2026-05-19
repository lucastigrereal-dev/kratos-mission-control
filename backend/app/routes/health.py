from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {
        "source": "real",
        "collector_status": "ok",
        "data": {
            "status": "ok",
            "version": "0.11.0",
            "phase": "0.11 — Operational Truth Verifier",
            "project": "kratos-mission-control",
            "mode": "local-first",
        },
    }
