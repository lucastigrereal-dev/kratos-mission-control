"""KRATOS Auth — API Key minimum layer.

Reads KRATOS_API_KEY from environment.
Provides FastAPI dependency for protecting critical endpoints.
Dev-safe: when KRATOS_API_KEY is not set, all requests pass with a warning header.
"""
import os
import secrets
from typing import Optional

from fastapi import Header, HTTPException, Request, status

# ── Configuration ────────────────────────────────────────────────────────────

_API_KEY: Optional[str] = os.getenv("KRATOS_API_KEY")
_DEV_MODE: bool = _API_KEY is None

if _DEV_MODE:
    _API_KEY = "dev-insecure-" + secrets.token_hex(8)


def is_dev_mode() -> bool:
    return _DEV_MODE


# ── Dependency ───────────────────────────────────────────────────────────────


async def require_api_key(
    request: Request,
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
) -> str:
    """FastAPI dependency — validates API key for protected routes.

    In dev mode (no KRATOS_API_KEY env var), all requests pass.
    In production mode, X-API-Key header must match.
    """
    if _DEV_MODE:
        request.state.auth_mode = "dev-bypass"
        return "dev"

    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-API-Key header",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    if not secrets.compare_digest(x_api_key, _API_KEY or ""):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )

    request.state.auth_mode = "authenticated"
    return "authenticated"


# ── Audit-only middleware ────────────────────────────────────────────────────

_AUDIT_PREFIXES = {
    "/cost": "financial",
    "/approvals": "mutation",
    "/events/bridge/start": "service-control",
    "/mission": "mission-state",
    "/alerts": "alert-mutation",
    "/checkpoints": "checkpoint-mutation",
}
