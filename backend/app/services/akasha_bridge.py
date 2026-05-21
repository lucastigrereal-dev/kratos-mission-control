"""
AKASHA Bridge — read-only adapter for AKASHA memory system.

Tries real Akasha modules first (search, context, sources).
Falls back to mock data when Akasha backend is unavailable.

No ingestion. No vector writes. No production secrets.
"""
from datetime import datetime, timezone
from typing import Any

from app.collectors.akasha_collector import collect_status

# ── Backend availability ──────────────────────────────────────────────────────

_BACKEND_CHECKED: bool = False
_BACKEND_AVAILABLE: bool = False


def _check_backend() -> bool:
    """Lightweight check: is Akasha PostgreSQL reachable?"""
    global _BACKEND_CHECKED, _BACKEND_AVAILABLE
    if _BACKEND_CHECKED:
        return _BACKEND_AVAILABLE

    try:
        _, source, _ = collect_status()
        _BACKEND_AVAILABLE = source == "real"
    except Exception:
        _BACKEND_AVAILABLE = False
    _BACKEND_CHECKED = True
    return _BACKEND_AVAILABLE


def reset_backend_check():
    """Reset cached backend status (for tests)."""
    global _BACKEND_CHECKED, _BACKEND_AVAILABLE
    _BACKEND_CHECKED = False
    _BACKEND_AVAILABLE = False


# ── Health ────────────────────────────────────────────────────────────────────

def get_akasha_health() -> dict[str, Any]:
    """Extended health — reuses existing collector, adds bridge metadata."""
    data, source, collector_status = collect_status()
    return {
        "bridge_status": "online",
        "akasha_status": data.get("status", "unknown"),
        "postgres": data.get("postgres_responding", False),
        "source_badge": data.get("source_badge", "offline"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ── Search ────────────────────────────────────────────────────────────────────

def _mock_search(query: str, domain: Any, file_type: Any, limit: int, include_chunks: bool) -> dict[str, Any]:
    """Mock search results when Akasha backend is unavailable."""
    return {
        "results": [],
        "total": 0,
        "query": query,
        "source_badge": "offline",
        "note": "AKASHA backend unavailable — no results returned",
    }


def search_akasha(
    query: str,
    domain: str | None = None,
    file_type: str | None = None,
    limit: int = 8,
    include_chunks: bool = False,
) -> dict[str, Any]:
    """Search Akasha knowledge base. Falls back to mock on failure."""
    available = _check_backend()
    if not available:
        return _mock_search(query, domain, file_type, limit, include_chunks)

    try:
        from akasha.search.hybrid import search_hybrid
    except ImportError:
        return _mock_search(query, domain, file_type, limit, include_chunks)

    try:
        results = search_hybrid(query, domain=domain, file_type=file_type, limit=limit)
    except Exception:
        return _mock_search(query, domain, file_type, limit, include_chunks)

    output = []
    for r in results:
        item = {
            "chunk_id": r.chunk_id,
            "document_id": r.document_id,
            "file_name": r.file_name,
            "domain": r.domain,
            "file_type": r.file_type,
            "section_path": r.section_path,
            "page_number": r.page_number,
            "score": round(r.rrf_score, 4),
        }
        if include_chunks and r.chunk_text:
            item["chunk_text"] = r.chunk_text[:500]
        output.append(item)

    return {
        "results": output,
        "total": len(output),
        "query": query,
        "source_badge": "confirmed",
    }


# ── Context ───────────────────────────────────────────────────────────────────

def _mock_context(project_id: str, query: str) -> dict[str, Any]:
    return {
        "context": "",
        "sources": [],
        "source_badge": "offline",
        "note": "AKASHA backend unavailable",
    }


def get_akasha_context(project_id: str, query: str = "", limit: int = 5) -> dict[str, Any]:
    """Get context for a project/mission. Falls back to mock."""
    available = _check_backend()
    if not available:
        return _mock_context(project_id, query)

    try:
        from akasha.search.hybrid import search_hybrid
        from akasha.rag.context import build_context
    except ImportError:
        return _mock_context(project_id, query)

    try:
        search_query = query or project_id
        results = search_hybrid(search_query, domain=None, file_type=None, limit=limit)
        if not results:
            return {"context": "", "sources": [], "source_badge": "confirmed", "query": search_query}

        from akasha.rag.context import build_context
        context_text, sources = build_context(results)
        formatted_sources = [
            {
                "document_id": s.document_id if hasattr(s, "document_id") else i,
                "file_name": s.file_name if hasattr(s, "file_name") else str(s),
                "relevance": "alta" if i < 3 else "media",
            }
            for i, s in enumerate(sources)
        ]
        return {
            "context": context_text[:2000],
            "sources": formatted_sources,
            "source_badge": "confirmed",
            "query": search_query,
        }
    except Exception:
        return _mock_context(project_id, query)


# ── Sources ───────────────────────────────────────────────────────────────────

def _mock_sources() -> dict[str, Any]:
    return {
        "domains": [],
        "total_documents": 0,
        "total_chunks": 0,
        "source_badge": "offline",
        "note": "AKASHA backend unavailable",
    }


def get_akasha_sources() -> dict[str, Any]:
    """List available source domains from Akasha."""
    available = _check_backend()
    if not available:
        return _mock_sources()

    try:
        from akasha.core.database import get_connection
    except ImportError:
        return _mock_sources()

    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM documents")
            doc_count = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM chunks")
            chunk_count = cur.fetchone()[0]
            cur.execute("SELECT domain, COUNT(*) FROM documents GROUP BY domain ORDER BY COUNT(*) DESC")
            domains = [{"name": row[0], "count": row[1]} for row in cur.fetchall()]
        conn.close()
        return {
            "domains": domains,
            "total_documents": doc_count,
            "total_chunks": chunk_count,
            "source_badge": "confirmed",
        }
    except Exception:
        return _mock_sources()
