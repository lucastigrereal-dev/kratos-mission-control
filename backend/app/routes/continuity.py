"""Continuity router — project context persistence between sessions."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.services import continuity_service

router = APIRouter(prefix="/continuity", tags=["continuity"])


class UpdateContinuityBody(BaseModel):
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    last_action: Optional[str] = None
    next_step: Optional[str] = None
    branch: Optional[str] = None
    critical_files: Optional[list[str]] = None
    focus_state: Optional[str] = None


@router.get("/state")
def get_state():
    return {"source": "real", "data": continuity_service.get_continuity_state()}


@router.post("/state")
def update_state(body: UpdateContinuityBody):
    result = continuity_service.update_continuity_state(
        project_id=body.project_id,
        project_name=body.project_name,
        last_action=body.last_action,
        next_step=body.next_step,
        branch=body.branch,
        critical_files=body.critical_files,
        focus_state=body.focus_state,
    )
    return {"source": "real", "data": result}


@router.post("/reset")
def reset_state():
    return {"source": "real", "data": continuity_service.reset_continuity()}
