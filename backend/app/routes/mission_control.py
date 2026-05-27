"""Mission Control Read-Only Backend — zero mutations, zero side effects."""
from fastapi import APIRouter
from app.schemas.mission_control_schemas import (
    MCOverviewResponse,
    MCHealthResponse,
    MCBlockersResponse,
    MCCapabilitiesResponse,
    MCRuntimeResponse,
)

router = APIRouter(prefix="/mission-control", tags=["mission-control"])


@router.get("/overview", response_model=MCOverviewResponse)
def mc_overview():
    from app.services.mission_control_service import get_overview
    return get_overview()


@router.get("/health", response_model=MCHealthResponse)
def mc_health():
    from app.services.mission_control_service import get_health
    return get_health()


@router.get("/blockers", response_model=MCBlockersResponse)
def mc_blockers():
    from app.services.mission_control_service import get_blockers
    return get_blockers()


@router.get("/capabilities", response_model=MCCapabilitiesResponse)
def mc_capabilities():
    from app.services.mission_control_service import get_capabilities
    return get_capabilities()


@router.get("/runtime", response_model=MCRuntimeResponse)
def mc_runtime():
    from app.services.mission_control_service import get_runtime
    return get_runtime()
