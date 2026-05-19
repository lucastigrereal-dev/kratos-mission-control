from fastapi import APIRouter
from app.services.operational_truth_service import build_operational_truth

router = APIRouter(tags=["operational-truth"])


@router.get("/operational-truth")
def operational_truth():
    """Cross-reference all collectors to determine the operational truth.

    Runs 4 checks in parallel:
      - project_alignment: git vs AW vs focus → same project?
      - infrastructure_health: docker vs OMNIS vs system → all healthy?
      - data_freshness: are all collectors returning real data?
      - git_hygiene: working trees clean? Need checkpoint?

    Returns a global verdict: consistent | mostly_consistent | degraded | conflict.
    """
    return build_operational_truth()
