"""KRATOS /cost/ routes — Finance Monster API surface.

M5A: GET /cost/status, /cost/ledger, POST /cost/record
M5B: POST /cost/litellm-callback, GET /cost/provider-usage
M5C: GET /cost/budget-status, GET /cost/mission/{id}, POST /cost/mission/{id}/roi
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from app.auth import require_api_key
from app.schemas.cost_schemas import (
    CostEntryResponse,
    CostLedgerResponse,
    CostStatusResponse,
    BudgetStatusResponse,
    LiteLLMCallbackResponse,
    MissionCostResponse,
    ProviderUsageResponse,
)

router = APIRouter(tags=["cost"])


# ── Request Models ────────────────────────────────────────────────────────────

class CostRecordRequest(BaseModel):
    execution_id: str
    model: str
    input_tokens: int = 0
    output_tokens: int = 0
    mission_id: str = "unknown"
    endpoint: str = ""
    notes: str = ""


class LiteLLMCallbackRequest(BaseModel):
    """Dual-format intake: LiteLLM spend webhook OR OMNIS internal format.

    LiteLLM format uses: spend, max_budget, metadata.model, metadata.input_tokens, etc.
    Internal format uses: execution_id, model, input_tokens, output_tokens directly.
    """
    execution_id: str = ""
    model: str = ""
    input_tokens: int = 0
    output_tokens: int = 0
    mission_id: str = "unknown"
    provider: str = ""
    agent_id: str = ""
    metadata: Optional[dict] = None
    total_tokens: int = 0
    timestamp: str = ""
    spend: Optional[float] = None
    max_budget: Optional[float] = None
    token: str = ""
    customer_id: str = ""


class MissionROIRequest(BaseModel):
    estimated_value_usd: float
    notes: str = ""


# ── GET Endpoints ─────────────────────────────────────────────────────────────

@router.get("/cost/status", response_model=CostStatusResponse)
def cost_status(days: int = Query(default=30, ge=1, le=365)):
    """Current cost summary: totals, by-model, by-mission, local-vs-cloud."""
    from app.services.cost_service import get_cost_status
    return get_cost_status(days=days)


@router.get("/cost/ledger", response_model=CostLedgerResponse)
def cost_ledger(
    mission_id: str = Query(default=None),
    model: str = Query(default=None),
    days: int = Query(default=30, ge=1, le=365),
    limit: int = Query(default=100, ge=1, le=1000),
):
    """Query cost ledger entries with optional filters."""
    from app.services.cost_service import get_ledger
    return get_ledger(mission_id=mission_id, model=model, days=days, limit=limit)


@router.get("/cost/provider-usage", response_model=ProviderUsageResponse)
def provider_usage(period: str = Query(default=None)):
    """Aggregate provider/model usage, optionally filtered by period (YYYY-MM)."""
    from app.services.cost_service import get_provider_usage
    return get_provider_usage(period=period)


@router.get("/cost/budget-status", response_model=BudgetStatusResponse)
def budget_status():
    """Full budget evaluation: all rules, overall OK/WARNING/CRITICAL/UNKNOWN."""
    from app.services.cost_service import get_budget_status
    return get_budget_status()


@router.get("/cost/mission/{mission_id}", response_model=MissionCostResponse)
def mission_cost(mission_id: str):
    """Total cost + ROI for a mission across all periods."""
    from app.services.cost_service import get_mission_cost
    return get_mission_cost(mission_id=mission_id)


# ── POST Endpoints ────────────────────────────────────────────────────────────

@router.post("/cost/record", response_model=CostEntryResponse)
def cost_record(body: CostRecordRequest, _auth: str = Depends(require_api_key)):
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


@router.post("/cost/litellm-callback", response_model=LiteLLMCallbackResponse)
def cost_litellm_callback(
    body: LiteLLMCallbackRequest,
    dry_run: bool = Query(default=False),
    _auth: str = Depends(require_api_key),
):
    """Receive LiteLLM spend webhook or internal OMNIS callback.

    Two formats supported:
    - LiteLLM: has spend/max_budget, model/tokens in metadata
    - Internal: has execution_id + model directly

    dry_run=True calculates cost without writing to ledger.
    """
    from app.services.cost_service import handle_litellm_callback
    payload = body.model_dump(exclude_unset=True)
    return handle_litellm_callback(payload, dry_run=dry_run)


@router.post("/cost/mission/{mission_id}/roi", response_model=MissionCostResponse)
def mission_roi(mission_id: str, body: MissionROIRequest, _auth: str = Depends(require_api_key)):
    """Set estimated business value for a mission (current period)."""
    from app.services.cost_service import set_mission_roi
    return set_mission_roi(
        mission_id=mission_id,
        estimated_value_usd=body.estimated_value_usd,
        notes=body.notes,
    )
