from fastapi import APIRouter
from app.services import get_project_goals

router = APIRouter(tags=["goals"])


@router.get("/projects/{project_id}/goals")
def project_goals(project_id: str):
    return get_project_goals()
