"""Akasha bridge tests — mock fallback behavior (no real Akasha required)."""
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.services.akasha_bridge import (
    reset_backend_check,
    get_akasha_health,
    search_akasha,
    get_akasha_context,
    get_akasha_sources,
)
from app.routes.akasha import router as akasha_router


@pytest.fixture(autouse=True)
def reset_cache():
    reset_backend_check()
    yield
    reset_backend_check()


def make_app() -> FastAPI:
    app = FastAPI()
    app.include_router(akasha_router)
    return app


class TestAkashaHealth:
    """GET /akasha/health — bridge + collector health."""

    def test_health_returns_bridge_status(self):
        result = get_akasha_health()
        assert result["bridge_status"] == "online"
        assert "akasha_status" in result
        assert "timestamp" in result

    def test_health_endpoint_200(self):
        client = TestClient(make_app())
        resp = client.get("/akasha/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["bridge_status"] == "online"


class TestAkashaSearch:
    """POST /akasha/search — mock fallback when Akasha unavailable."""

    def test_search_mock_fallback(self):
        result = search_akasha("test query", limit=5)
        assert result["source_badge"] == "offline"
        assert "note" in result
        assert result["query"] == "test query"
        assert result["total"] == 0
        assert result["results"] == []

    def test_search_endpoint_200(self):
        client = TestClient(make_app())
        resp = client.post("/akasha/search", json={"query": "test"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["source_badge"] == "offline"
        assert data["query"] == "test"

    def test_search_with_domain_filter(self):
        result = search_akasha("test", domain="omnis", limit=3)
        assert result["source_badge"] == "offline"
        assert result["total"] == 0

    def test_search_validation_rejects_empty_query(self):
        client = TestClient(make_app())
        resp = client.post("/akasha/search", json={"query": ""})
        assert resp.status_code == 422


class TestAkashaContext:
    """POST /akasha/context — mock fallback."""

    def test_context_mock_fallback(self):
        result = get_akasha_context("test-project", query="context query")
        assert result["source_badge"] == "offline"
        assert "note" in result
        assert result["context"] == ""

    def test_context_endpoint_200(self):
        client = TestClient(make_app())
        resp = client.post("/akasha/context", json={"project_id": "omnis-p0"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["source_badge"] == "offline"

    def test_context_validation_rejects_missing_project(self):
        client = TestClient(make_app())
        resp = client.post("/akasha/context", json={"query": "test"})
        assert resp.status_code == 422


class TestAkashaSources:
    """GET /akasha/sources — mock fallback."""

    def test_sources_mock_fallback(self):
        result = get_akasha_sources()
        assert result["source_badge"] == "offline"
        assert "note" in result
        assert result["domains"] == []
        assert result["total_documents"] == 0

    def test_sources_endpoint_200(self):
        client = TestClient(make_app())
        resp = client.get("/akasha/sources")
        assert resp.status_code == 200
        data = resp.json()
        assert data["source_badge"] == "offline"


class TestAkashaStatusEndpoint:
    """GET /akasha/status — existing collector endpoint."""

    def test_status_endpoint_returns_data(self):
        client = TestClient(make_app())
        resp = client.get("/akasha/status")
        assert resp.status_code == 200
        data = resp.json()
        assert "source" in data
        assert "data" in data
