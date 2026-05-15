from fastapi import APIRouter, Request
from app.services import get_context_current, get_context_lost
from app.db import get_db, generate_id, now_iso
import json

router = APIRouter(prefix="/context", tags=["context"])


@router.get("/current")
def current():
    return get_context_current()


@router.get("/lost")
def lost():
    return get_context_lost()


@router.get("/project-guess")
def project_guess():
    ctx = get_context_current()
    return {
        "project_guess": ctx.get("project_guess"),
        "confidence": ctx.get("confidence"),
        "reason_guess": ctx.get("reason_guess"),
    }


@router.post("/checkpoint")
async def save_context_checkpoint(request: Request):
    body = await request.json()
    context_payload = body.get("context_payload", {})
    db = get_db()
    cp_id = f"checkpoint-{generate_id()}"

    snapshot = json.dumps({
        "context_payload": context_payload,
        "where_i_stopped": body.get("where_i_stopped", ""),
        "next_action": body.get("next_action", ""),
        "mission_guess": body.get("mission_guess", ""),
        "confidence": body.get("confidence", 0),
        "saved_from": "context_checkpoint",
    })

    db.execute(
        "INSERT INTO checkpoints (id, project_id, name, description, tags, snapshot, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (
            cp_id,
            body.get("project_id", ""),
            body.get("name", f"Checkpoint: {body.get('mission_guess', 'Contexto')}"),
            body.get("description", ""),
            json.dumps(body.get("tags", [])),
            snapshot,
            now_iso(),
        ),
    )
    db.commit()
    db.close()
    return {"id": cp_id, "saved": True}
