from fastapi import APIRouter
from app.services.runtime_bridge import build_bridge_payload

router = APIRouter(tags=["runtime"])


@router.get("/runtime/bridge")
def runtime_bridge():
    """Normalized runtime data for frontend consumption."""
    return build_bridge_payload()
