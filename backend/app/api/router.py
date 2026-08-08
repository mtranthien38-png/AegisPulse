from fastapi import APIRouter

from app.api.routes import assets, alerts, incidents, metrics

api_router = APIRouter()
api_router.include_router(assets.router, prefix="/assets", tags=["assets"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])

