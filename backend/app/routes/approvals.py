"""Approval cockpit routes — local decision queue. No external actions triggered."""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from app.services import approval_service

router = APIRouter(prefix="/approvals", tags=["approvals"])


class CreateApprovalBody(BaseModel):
    title: str
    description: str = ""
    risk: str = "low"
    source: str = "manual"


class UpdateApprovalBody(BaseModel):
    status: str


@router.get("/")
def list_approvals(status: Optional[str] = Query(None)):
    items = approval_service.list_approvals(status)
    return {"source": "real", "data": items, "meta": {"count": len(items)}}


@router.post("/", status_code=201)
def create_approval(body: CreateApprovalBody):
    item = approval_service.create_approval(
        title=body.title,
        description=body.description,
        risk=body.risk,
        source=body.source,
    )
    return {"source": "real", "data": item}


@router.patch("/{approval_id}")
def update_approval(approval_id: str, body: UpdateApprovalBody):
    valid = {"pending", "approved", "rejected", "deferred", "needs_context"}
    if body.status not in valid:
        raise HTTPException(422, f"Invalid status. Must be one of: {', '.join(sorted(valid))}")
    item = approval_service.update_approval(approval_id, body.status)
    if item is None:
        raise HTTPException(404, "Approval not found")
    return {"source": "real", "data": item}


@router.delete("/{approval_id}")
def delete_approval(approval_id: str):
    if not approval_service.delete_approval(approval_id):
        raise HTTPException(404, "Approval not found")
    return {"source": "real", "data": {"deleted": True}}
