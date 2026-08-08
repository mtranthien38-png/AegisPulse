from fastapi import APIRouter

from app.core.config import settings
from app.services import store

router = APIRouter()


@router.get("/")
async def overview() -> dict:
    return {
        "summary": {
            "monitored_assets": len(store.assets),
            "healthy_assets": sum(1 for asset in store.assets.values() if asset["status"] == "healthy"),
            "degraded_assets": sum(1 for asset in store.assets.values() if asset["status"] == "degraded"),
            "open_alerts": len(store.alerts),
            "open_incidents": sum(1 for incident in store.incidents.values() if incident["status"] != "resolved"),
            "resolved_incidents": sum(1 for incident in store.incidents.values() if incident["status"] == "resolved"),
        },
        "contract": {
            "address": settings.CONTRACT_ADDRESS,
            "tx_hash": settings.CONTRACT_TX_HASH,
            "network": "studionet",
        },
        "risk_trend": [
            {"label": "Mon", "value": 18},
            {"label": "Tue", "value": 22},
            {"label": "Wed", "value": 21},
            {"label": "Thu", "value": 27},
            {"label": "Fri", "value": 30},
            {"label": "Sat", "value": 26},
        ],
    }
