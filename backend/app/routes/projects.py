from fastapi import APIRouter, Request
from app.services import get_projects, get_project_detail
from app.db import get_db, generate_id, now_iso

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("")
def list_projects():
    return get_projects()


@router.get("/{project_id}")
def project_detail(project_id: str):
    result = get_project_detail(project_id)
    if result is None:
        from fastapi.responses import JSONResponse
        return JSONResponse({"detail": "Project not found"}, status_code=404)
    return result
