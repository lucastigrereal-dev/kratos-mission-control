"""Pydantic response models for /approvals endpoints."""
from pydantic import BaseModel


class ApprovalItemResponse(BaseModel):
    id: str
    title: str
    description: str
    status: str
    risk: str
    source: str
    created_at: str
    updated_at: str


class ApprovalCreateResponse(BaseModel):
    source: str
    data: ApprovalItemResponse


class ApprovalListResponse(BaseModel):
    source: str
    data: list[ApprovalItemResponse]
    meta: dict
