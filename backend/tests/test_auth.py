"""Auth tests — API key baseline."""
import pytest
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient

from app.auth import require_api_key, is_dev_mode


@pytest.fixture
def app_with_protected_route():
    app = FastAPI()

    @app.get("/public")
    def public():
        return {"status": "ok"}

    @app.post("/write")
    def write(_auth: str = Depends(require_api_key)):
        return {"status": "written"}

    return app


class TestAuthDevMode:
    """Dev mode: KRATOS_API_KEY not set — all requests pass."""

    def test_dev_mode_is_active(self):
        assert is_dev_mode(), "Should be in dev mode when KRATOS_API_KEY is not set"

    def test_public_endpoint_no_key(self, app_with_protected_route):
        client = TestClient(app_with_protected_route)
        resp = client.get("/public")
        assert resp.status_code == 200

    def test_write_endpoint_no_key_dev_mode(self, app_with_protected_route):
        client = TestClient(app_with_protected_route)
        resp = client.post("/write")
        assert resp.status_code == 200
        assert resp.json() == {"status": "written"}


class TestAuthProductionMode:
    """Production mode: KRATOS_API_KEY is set — requires valid X-API-Key."""

    @pytest.fixture(autouse=True)
    def set_api_key(self, monkeypatch):
        monkeypatch.setenv("KRATOS_API_KEY", "prod-secret-key-123")
        # Force re-import to pick up env
        import app.auth as auth_mod
        auth_mod._API_KEY = "prod-secret-key-123"
        auth_mod._DEV_MODE = False
        yield
        auth_mod._DEV_MODE = True
        auth_mod._API_KEY = None

    def test_prod_mode_is_not_dev(self):
        import app.auth as auth_mod
        assert not auth_mod.is_dev_mode()

    def test_write_endpoint_missing_key(self, app_with_protected_route):
        client = TestClient(app_with_protected_route)
        resp = client.post("/write")
        assert resp.status_code == 401

    def test_write_endpoint_valid_key(self, app_with_protected_route):
        client = TestClient(app_with_protected_route)
        resp = client.post("/write", headers={"X-API-Key": "prod-secret-key-123"})
        assert resp.status_code == 200

    def test_write_endpoint_invalid_key(self, app_with_protected_route):
        client = TestClient(app_with_protected_route)
        resp = client.post("/write", headers={"X-API-Key": "wrong-key"})
        assert resp.status_code == 403

    def test_public_endpoint_no_key_prod_mode(self, app_with_protected_route):
        """Public endpoints should still work in prod mode."""
        client = TestClient(app_with_protected_route)
        resp = client.get("/public")
        assert resp.status_code == 200
