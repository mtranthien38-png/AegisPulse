from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/")
async def workflow() -> dict:
    return {
        "steps": [
            {"key": "asset_onboard", "label": "Onboard asset", "status": "done"},
            {"key": "alert_ingest", "label": "Ingest alert", "status": "done"},
            {"key": "contract_score", "label": "Score on-chain", "status": "done"},
            {"key": "incident_open", "label": "Open incident", "status": "active"},
            {"key": "review_close", "label": "Review and close", "status": "pending"},
        ],
        "contract": {
            "address": settings.CONTRACT_ADDRESS,
            "network": "studionet",
            "read_methods": ["get_alert"],
            "write_methods": ["register_asset", "score_alert", "open_incident"],
        },
    }
