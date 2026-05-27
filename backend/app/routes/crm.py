from fastapi import APIRouter
from app.services import get_crm_status

router = APIRouter(prefix="/crm", tags=["crm"])


@router.get("/status")
def crm_status():
    """CRM pipeline status — vendas_crm sector health, lead state machine, gaps."""
    return get_crm_status()
