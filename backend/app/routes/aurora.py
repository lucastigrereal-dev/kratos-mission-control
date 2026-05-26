"""Aurora insight endpoint — lê aurora_insight do state.json do OMNIS.

Arquitetura Opção A: OMNIS pensa via Ollama, escreve no state.json,
KRATOS lê e espelha. Sem dado real = data: null (honesto).
"""
from fastapi import APIRouter
from app.collectors.omnis_collector import OMNIS_STATE_PATH, _read_state_file

router = APIRouter(prefix="/aurora", tags=["aurora"])


@router.get("/insight")
def aurora_insight():
    """Retorna aurora_insight do state.json do OMNIS, ou null se ausente."""
    state = _read_state_file()

    if state is None or "aurora_insight" not in state:
        return {
            "data": None,
            "source": "live",
            "state_path": str(OMNIS_STATE_PATH),
        }

    raw = state["aurora_insight"]

    # aurora_updated_at é mais específico que timestamp — preferir quando disponível
    best_ts = state.get("aurora_updated_at") or state.get("timestamp", "")
    model = state.get("aurora_model")  # ex: "llama3.1:8b"

    # Aceita string simples (atalho) ou dict completo
    if isinstance(raw, str):
        insight = {
            "text": raw,
            "generated_at": best_ts,
            "source": "omnis_ollama",
        }
        if model:
            insight["model"] = model
    elif isinstance(raw, dict):
        insight = {
            "text": raw.get("text", ""),
            "generated_at": raw.get("generated_at", best_ts),
            "source": raw.get("source", "omnis_ollama"),
        }
        if "confidence" in raw:
            insight["confidence"] = raw["confidence"]
        if "focus_recommendation" in raw:
            insight["focus_recommendation"] = raw["focus_recommendation"]
        if model:
            insight["model"] = raw.get("model", model)
    else:
        # Tipo inesperado — retorna null honesto
        return {
            "data": None,
            "source": "live",
            "state_path": str(OMNIS_STATE_PATH),
        }

    return {
        "data": insight,
        "source": "live",
        "state_path": str(OMNIS_STATE_PATH),
    }
