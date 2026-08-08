from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import store

router = APIRouter()


class IncidentCreateRequest(BaseModel):
    id: str
    title: str
    asset: str
    owner: str = "ops"
    priority: str = "p2"


@router.get("/")
async def list_incidents() -> list[dict]:
    return store.list_incidents()


@router.post("/")
async def create_incident(request: IncidentCreateRequest) -> dict:
    try:
        return store.add_incident(
            incident_id=request.id,
            title=request.title,
            asset=request.asset,
            owner=request.owner,
            priority=request.priority,
            status="open",
            next_step="investigate",
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
