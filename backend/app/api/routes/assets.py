from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_assets() -> list[dict]:
    return [
        {
            "id": "asset_1",
            "name": "Validator Node A",
            "asset_type": "validator",
            "network": "eigenlayer",
            "status": "healthy",
            "uptime_30d": 99.92,
            "risk_score": 11,
        },
        {
            "id": "asset_2",
            "name": "RPC Gateway",
            "asset_type": "service",
            "network": "cosmos",
            "status": "degraded",
            "uptime_30d": 97.48,
            "risk_score": 41,
        },
        {
            "id": "asset_3",
            "name": "Bridge Watcher",
            "asset_type": "monitor",
            "network": "symbiotic",
            "status": "healthy",
            "uptime_30d": 99.68,
            "risk_score": 18,
        },
    ]
