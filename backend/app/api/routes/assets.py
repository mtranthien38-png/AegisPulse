from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_assets() -> list[dict]:
    return [
        {"id": "asset_1", "name": "Validator Node A", "status": "healthy"},
        {"id": "asset_2", "name": "RPC Gateway", "status": "degraded"},
    ]

