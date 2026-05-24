"""Pydantic response models for /checkpoints endpoints."""
from pydantic import BaseModel


class CheckpointResponse(BaseModel):
    id: str
    project_id: str | None = None
    name: str
    description: str = ""
    tags: list[str] = []
    snapshot: dict | None = None
    created_at: str
