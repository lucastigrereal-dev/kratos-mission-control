from fastapi import APIRouter, Body
from pydantic import BaseModel, Field
from app.services import get_akasha_status
from app.services.akasha_bridge import (
    get_akasha_health,
    search_akasha,
    get_akasha_context,
    get_akasha_sources,
)

router = APIRouter(prefix="/akasha", tags=["akasha"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class AkashaSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    domain: str | None = Field(None, max_length=100)
    file_type: str | None = Field(None, max_length=20)
    limit: int = Field(8, ge=1, le=50)
    include_chunks: bool = False


class AkashaContextRequest(BaseModel):
    project_id: str = Field(..., max_length=200)
    query: str = Field("", max_length=500)
    limit: int = Field(5, ge=1, le=20)


# ── Existing endpoints ────────────────────────────────────────────────────────

@router.get("/status")
def akasha_status():
    """AKASHA memory health — PostgreSQL/pgvector status with source badge."""
    return get_akasha_status()


# ── New bridge endpoints (P0 read-only) ───────────────────────────────────────

@router.get("/health")
def akasha_health():
    """Extended health — bridge status, PostgreSQL, pgvector, and timestamp."""
    return get_akasha_health()


@router.post("/search")
def akasha_search(body: AkashaSearchRequest):
    """Search Akasha knowledge base (hybrid BM25 + vector).

    Returns ranked results with metadata and optional controlled excerpts.
    Falls back gracefully when Akasha backend is unavailable.
    """
    return search_akasha(
        query=body.query,
        domain=body.domain,
        file_type=body.file_type,
        limit=body.limit,
        include_chunks=body.include_chunks,
    )


@router.post("/context")
def akasha_context(body: AkashaContextRequest):
    """Get context for a project/mission from Akasha.

    Returns synthesized context from relevant documents.
    Falls back gracefully when Akasha backend is unavailable.
    """
    return get_akasha_context(
        project_id=body.project_id,
        query=body.query,
        limit=body.limit,
    )


@router.get("/sources")
def akasha_sources():
    """List available source domains and document counts from Akasha."""
    return get_akasha_sources()
