from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/")
async def contract_info() -> dict:
    return {
        "name": "AegisPulseContract",
        "network": "studionet",
        "address": settings.CONTRACT_ADDRESS,
        "deployment_tx_hash": settings.CONTRACT_TX_HASH,
        "verified": True,
        "capabilities": [
            "register_asset",
            "score_alert",
            "open_incident",
            "get_alert",
        ],
    }
