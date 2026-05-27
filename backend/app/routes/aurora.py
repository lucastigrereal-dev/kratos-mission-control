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

    # C4 — fio_mental e tom escritos pelo OMNIS A2/A4 em aurora_fio_mental / aurora_tom
    fio_mental: str | None = state.get("aurora_fio_mental") or None
    tom: str | None = state.get("aurora_tom") or None

    # Aceita string simples (atalho) ou dict completo
    if isinstance(raw, str):
        insight = {
            "text": raw,
            "generated_at": best_ts,
            "source": "omnis_ollama",
        }
        if model:
            insight["model"] = model
        if fio_mental:
            insight["fio_mental"] = fio_mental
        if tom:
            insight["tom"] = tom
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
        # fio_mental / tom: preferir no dict se presentes, senão usar nível state
        _fio = raw.get("fio_mental") or fio_mental
        _tom = raw.get("tom") or tom
        if _fio:
            insight["fio_mental"] = _fio
        if _tom:
            insight["tom"] = _tom
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
