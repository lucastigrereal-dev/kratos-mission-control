from fastapi import APIRouter
from app.services import get_omnis_status, get_omnis_summary

router = APIRouter(prefix="/omnis", tags=["omnis"])


@router.get("/status")
def omnis_status():
    return get_omnis_status()


@router.get("/summary")
def omnis_summary():
    return get_omnis_summary()
