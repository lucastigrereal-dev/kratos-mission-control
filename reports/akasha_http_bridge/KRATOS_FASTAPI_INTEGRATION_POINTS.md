# KRATOS FASTAPI INTEGRATION POINTS — ABA23

**Date:** 2026-05-21 | **Project:** KRATOS Mission Control

---

## App Structure

| Layer | Path | Pattern |
|-------|------|---------|
| Main app | `backend/app/main.py` | FastAPI + router includes |
| Routes | `backend/app/routes/{name}.py` | `APIRouter(prefix=..., tags=[...])` |
| Services | `backend/app/services/__init__.py` | `_collector_wrapper()` pattern |
| Collectors | `backend/app/collectors/` | Real data source + fallback |
| Mock data | `mock-data/` | JSON fallbacks |

## Router Pattern (canonical)

Every router follows:
```python
from fastapi import APIRouter
from app.services import get_something

router = APIRouter(prefix="/something", tags=["something"])

@router.get("/status")
def status():
    return get_something()
```

## How to Add New Akasha Endpoints

### Option A — Add to existing `akasha.py` router (recommended)

The existing `akasha.py` has prefix `/akasha` and tag `akasha`. New endpoints should be added here:
- `GET /akasha/health` — extended health
- `POST /akasha/search` — search query
- `POST /akasha/context` — context retrieval
- `GET /akasha/sources` — source list

### Option B — New router file

Not needed for P0. Existing router is sufficient.

### Key Integration Rule

Add to `backend/app/routes/akasha.py`:
```python
from app.services.akasha_bridge import search_akasha, get_akasha_context, get_akasha_sources
```

Add to `backend/app/services/akasha_bridge.py` (new file):
```python
# Tries to import real Akasha, falls back to mock
```

### main.py Registration

Already done:
```python
from app.routes.akasha import router as akasha_router
app.include_router(akasha_router)  # line 85
```

No change needed in main.py.

## Test Pattern

Existing tests at `backend/tests/test_akasha_collector.py`. New tests go to:
- `backend/tests/test_akasha_bridge.py`

Pattern:
```python
from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
```

## Integration Points Summary

| Integration | Status | Action |
|------------|--------|--------|
| `GET /akasha/status` | ✅ Existing | No change |
| `POST /akasha/search` | ❌ Missing | Add to router + service |
| `POST /akasha/context` | ❌ Missing | Add to router + service |
| `GET /akasha/sources` | ❌ Missing | Add to router + service |
| Akasha service adapter | ❌ Missing | Create `akasha_bridge.py` |
| Test file | ❌ Missing | Create `test_akasha_bridge.py` |
| main.py changes | ❌ Not needed | Router already registered |
