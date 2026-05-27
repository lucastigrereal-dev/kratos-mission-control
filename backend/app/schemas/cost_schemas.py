"""Pydantic response models for /cost endpoints."""
from pydantic import BaseModel, Field


class CostEntryResponse(BaseModel):
    id: str
    execution_id: str
    mission_id: str
    model: str
    provider: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float
    local_or_cloud: str
    endpoint: str
    timestamp: str
    notes: str


class CostLedgerResponse(BaseModel):
    entries: list[CostEntryResponse]
    total: int
    source: str


class ModelCostSummary(BaseModel):
    cost: float
    calls: int


class BudgetWarning(BaseModel):
    level: str
    message: str


class CostStatusResponse(BaseModel):
    status: str
    source: str
    period_days: int
    total_cost_usd: float
    total_executions: int
    by_model: dict[str, ModelCostSummary]
    by_mission: dict[str, ModelCostSummary]
    local_vs_cloud: dict[str, float]
    local_percent: float
    daily_average_usd: float
    projected_monthly_usd: float
    budget_warnings: list[BudgetWarning]


class BudgetRuleItem(BaseModel):
    rule_name: str
    scope: str
    scope_value: str | None = None
    period: str
    threshold_usd: float
    current_spend_usd: float
    pct_used: float
    level: str
    alert_severity: str


class BudgetStatusResponse(BaseModel):
    overall_status: str
    rules: list[BudgetRuleItem]
    critical_count: int
    warning_count: int
    ok_count: int
    mode: str
    note: str


class LiteLLMCallbackResponse(BaseModel):
    recorded: bool
    execution_id: str
    estimated_cost_usd: float
    model: str
    provider: str
    local_or_cloud: str
    input_tokens: int
    output_tokens: int
    mission_id: str
    dry_run: bool
    budget_status: str
    budget_warnings: list[dict] = []
    error: str | None = None


class PeriodCostItem(BaseModel):
    period: str
    total_cost_usd: float
    estimated_value_usd: float
    roi_ratio: float
    notes: str | None = None


class MissionCostResponse(BaseModel):
    mission_id: str
    total_cost_usd: float
    total_estimated_value_usd: float
    roi_usd: float
    roi_ratio: float
    roi_status: str
    periods: list[PeriodCostItem]
    source: str


class ProviderUsageItem(BaseModel):
    provider: str
    model_name: str
    period: str
    input_tokens_total: int
    output_tokens_total: int
    total_cost_usd: float
    call_count: int
    last_updated: str


class ProviderUsageResponse(BaseModel):
    usage: list[ProviderUsageItem]
    total_entries: int
    source: str
