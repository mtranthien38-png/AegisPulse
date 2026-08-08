from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services import store

router = APIRouter()


class AssetCreateRequest(BaseModel):
    id: str
    name: str
    asset_type: str
    network: str = "studionet"


@router.get("/")
async def list_assets() -> list[dict]:
    return store.list_assets()


@router.post("/")
async def create_asset(request: AssetCreateRequest) -> dict:
    try:
        return store.add_asset(
            asset_id=request.id,
            name=request.name,
            asset_type=request.asset_type,
            network=request.network,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
