"""Pydantic response models for /mission-control endpoints."""
from pydantic import BaseModel


class MCReportsAvailable(BaseModel):
    architecture_inventory: bool
    autopilot_files: list[str]


class MCHealthChecks(BaseModel):
    reports_accessible: bool
    architecture_inventory: bool


class MCOverviewResponse(BaseModel):
    status: str
    generated_at: str
    reports_root: str
    reports_available: MCReportsAvailable
    autopilot_status: dict


class MCHealthResponse(BaseModel):
    status: str
    generated_at: str
    checks: MCHealthChecks


class MCBlockersResponse(BaseModel):
    status: str
    generated_at: str
    blocked_count: int
    blocked_blocks: list[str]
    source: str


class MCCapabilitiesResponse(BaseModel):
    status: str
    generated_at: str
    source: str
    data: dict | None = None
    error: str | None = None


class MCRuntimeResponse(BaseModel):
    status: str
    generated_at: str
    runtime: dict
