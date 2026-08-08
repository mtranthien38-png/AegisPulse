from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import contract_client

router = APIRouter()


class RegisterAssetRequest(BaseModel):
    id: str
    name: str
    asset_type: str
    network: str = "studionet"


class ScoreAlertRequest(BaseModel):
    id: str
    asset: str
    severity: str
    confidence: int
    signal: str
    age_minutes: int = 0
    evidence_summary: str


class OpenIncidentRequest(BaseModel):
    id: str
    title: str
    asset: str
    owner: str = "ops"
    priority: str = "p2"


@router.get("/")
async def contract_info() -> dict:
    return contract_client.get_contract_info()


@router.post("/register")
async def register_asset(request: RegisterAssetRequest) -> dict:
    try:
        return contract_client.register_asset(
            asset_id=request.id,
            name=request.name,
            asset_type=request.asset_type,
            network=request.network,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/score")
async def score_alert(request: ScoreAlertRequest) -> dict:
    try:
        return contract_client.score_alert(
            alert_id=request.id,
            asset=request.asset,
            severity=request.severity,
            confidence=request.confidence,
            signal=request.signal,
            age_minutes=request.age_minutes,
            evidence_summary=request.evidence_summary,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/open")
async def open_incident(request: OpenIncidentRequest) -> dict:
    try:
        return contract_client.open_incident(
            incident_id=request.id,
            title=request.title,
            asset=request.asset,
            owner=request.owner,
            priority=request.priority,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/alerts/{alert_id}")
async def get_alert(alert_id: str) -> dict:
    try:
        return contract_client.get_alert(alert_id=alert_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Alert not found")
