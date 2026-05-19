"""KRATOS /cost/ routes — Finance Monster API surface."""
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(tags=["cost"])


class CostRecordRequest(BaseModel):
    execution_id: str
    model: str
    input_tokens: int = 0
    output_tokens: int = 0
    mission_id: str = "unknown"
    endpoint: str = ""
    notes: str = ""


@router.get("/cost/status")
def cost_status(days: int = Query(default=30, ge=1, le=365)):
    """Current cost summary: totals, by-model, by-mission, local-vs-cloud."""
    from app.services.cost_service import get_cost_status
    return get_cost_status(days=days)


@router.get("/cost/ledger")
def cost_ledger(
    mission_id: str = Query(default=None),
    model: str = Query(default=None),
    days: int = Query(default=30, ge=1, le=365),
    limit: int = Query(default=100, ge=1, le=1000),
):
    """Query cost ledger entries with optional filters."""
    from app.services.cost_service import get_ledger
    return get_ledger(mission_id=mission_id, model=model, days=days, limit=limit)


@router.post("/cost/record")
def cost_record(body: CostRecordRequest):
    """Record a new cost entry in the ledger."""
    from app.services.cost_service import record_cost
    return record_cost(
        execution_id=body.execution_id,
        model=body.model,
        input_tokens=body.input_tokens,
        output_tokens=body.output_tokens,
        mission_id=body.mission_id,
        endpoint=body.endpoint,
        notes=body.notes,
    )
