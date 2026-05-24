from fastapi import APIRouter, Request, status
from app.services import get_checkpoints
from app.db import get_db, generate_id, now_iso
from app.schemas.checkpoint_schemas import CheckpointResponse
import json

router = APIRouter(prefix="/checkpoints", tags=["checkpoints"])


@router.get("", response_model=list[CheckpointResponse])
def list_checkpoints():
    return get_checkpoints()


@router.post("", status_code=status.HTTP_201_CREATED, response_model=CheckpointResponse)
async def create_checkpoint(request: Request):
    body = await request.json()
    db = get_db()
    cp_id = body.get("id", f"checkpoint-{generate_id()}")
    tags = json.dumps(body.get("tags", []))
    snapshot = json.dumps(body.get("snapshot", {}))
    db.execute(
        "INSERT INTO checkpoints (id, project_id, name, description, tags, snapshot, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (
            cp_id,
            body.get("project_id") or None,
            body.get("name", ""),
            body.get("description", ""),
            tags,
            snapshot,
            now_iso(),
        ),
    )
    db.commit()
    db.close()
    return {
        "id": cp_id,
        "project_id": body.get("project_id", ""),
        "name": body.get("name", ""),
        "description": body.get("description", ""),
        "tags": body.get("tags", []),
        "created_at": now_iso(),
    }
