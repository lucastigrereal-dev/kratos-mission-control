"""Tests for GET /aurora/insight — corrente OMNIS state.json → endpoint.

Testa a lógica da rota sem precisar do FastAPI TestClient (sem venv completo).
Prova: lê do state.json real, retorna null honesto quando ausente, reflete
mutações (anti-teatro), lida com string simples e dict completo.
"""
import json
import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.routes.aurora import aurora_insight


# ── Helper ───────────────────────────────────────────────────────────────────

def _patch_state(state):
    """Monkeypatch _read_state_file para retornar `state` (dict ou None)."""
    return patch("app.routes.aurora._read_state_file", return_value=state)


# ── Cenário 1: sem state.json → data: null ───────────────────────────────────

def test_sem_state_retorna_data_null():
    with _patch_state(None):
        resp = aurora_insight()
    assert resp["data"] is None
    assert resp["source"] == "live"
    assert "state_path" in resp


def test_state_sem_aurora_insight_retorna_null():
    state = {"test_count": 9976, "branch": "feature/omnis-5waves-runtime-supreme"}
    with _patch_state(state):
        resp = aurora_insight()
    assert resp["data"] is None


# ── Cenário 2: aurora_insight como string simples ────────────────────────────

def test_insight_string_simples_retorna_text():
    state = {
        "aurora_insight": "Foco do dia: aprovar leads quentes.",
        "timestamp": "2026-05-25T22:00:00+00:00",
    }
    with _patch_state(state):
        resp = aurora_insight()
    assert resp["data"] is not None
    assert resp["data"]["text"] == "Foco do dia: aprovar leads quentes."
    assert resp["data"]["source"] == "omnis_ollama"
    assert resp["data"]["generated_at"] == "2026-05-25T22:00:00+00:00"


def test_insight_string_nao_tem_confidence():
    state = {"aurora_insight": "Texto qualquer.", "timestamp": "2026-05-25T22:00:00+00:00"}
    with _patch_state(state):
        resp = aurora_insight()
    assert "confidence" not in resp["data"]


# ── Cenário 3: aurora_insight como dict completo ─────────────────────────────

def test_insight_dict_completo_retorna_todos_campos():
    raw = {
        "text": "Priorizar publi hoteis.",
        "generated_at": "2026-05-25T23:00:00+00:00",
        "source": "omnis_ollama",
        "confidence": "high",
        "focus_recommendation": "Ligar para Hotel Serrano hoje.",
    }
    state = {"aurora_insight": raw}
    with _patch_state(state):
        resp = aurora_insight()
    d = resp["data"]
    assert d["text"] == "Priorizar publi hoteis."
    assert d["confidence"] == "high"
    assert d["focus_recommendation"] == "Ligar para Hotel Serrano hoje."
    assert d["source"] == "omnis_ollama"


def test_insight_dict_sem_campos_opcionais():
    raw = {
        "text": "Texto sem opcionais.",
        "generated_at": "2026-05-25T23:00:00+00:00",
        "source": "omnis_ollama",
    }
    state = {"aurora_insight": raw}
    with _patch_state(state):
        resp = aurora_insight()
    assert resp["data"]["text"] == "Texto sem opcionais."
    assert "confidence" not in resp["data"]
    assert "focus_recommendation" not in resp["data"]


# ── Cenário 4: tipo inesperado → null honesto ─────────────────────────────────

def test_aurora_insight_tipo_int_retorna_null():
    with _patch_state({"aurora_insight": 42}):
        resp = aurora_insight()
    assert resp["data"] is None


def test_aurora_insight_tipo_lista_retorna_null():
    with _patch_state({"aurora_insight": ["a", "b"]}):
        resp = aurora_insight()
    assert resp["data"] is None


# ── Anti-teatro: valor muda → resposta reflete ───────────────────────────────

def test_anti_teatro_valor_mutado_reflete_na_resposta():
    """Prova que o endpoint lê do disco a cada chamada — não é hardcoded."""
    state_v1 = {"aurora_insight": "Valor original."}
    state_v2 = {"aurora_insight": "TESTE_AURORA_123"}

    with _patch_state(state_v1):
        r1 = aurora_insight()
    with _patch_state(state_v2):
        r2 = aurora_insight()

    assert r1["data"]["text"] == "Valor original."
    assert r2["data"]["text"] == "TESTE_AURORA_123"
    assert r1["data"]["text"] != r2["data"]["text"], "Endpoint deveria refletir valor novo"


# ── state_path sempre presente na resposta ────────────────────────────────────

def test_state_path_sempre_presente():
    with _patch_state(None):
        r = aurora_insight()
    assert "state_path" in r

    with _patch_state({"aurora_insight": "Qualquer."}):
        r2 = aurora_insight()
    assert "state_path" in r2
