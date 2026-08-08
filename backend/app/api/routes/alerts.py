from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import store

router = APIRouter()


class AlertCreateRequest(BaseModel):
    id: str
    title: str
    asset: str
    severity: str
    confidence: int
    signal: str
    age_minutes: int = 0


@router.get("/")
async def list_alerts() -> list[dict]:
    return store.list_alerts()


@router.post("/")
async def create_alert(request: AlertCreateRequest) -> dict:
    try:
        return store.add_alert(
            alert_id=request.id,
            title=request.title,
            asset=request.asset,
            severity=request.severity,
            confidence=request.confidence,
            signal=request.signal,
            age_minutes=request.age_minutes,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
