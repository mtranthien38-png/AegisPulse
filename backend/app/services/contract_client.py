from __future__ import annotations

import json
from typing import Any

from app.core.config import settings
from app.services import store


def get_contract_info() -> dict[str, Any]:
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
        "runtime": {
            "registered_assets": len(store.assets),
            "tracked_alerts": len(store.alerts),
            "open_incidents": sum(1 for i in store.incidents.values() if i["status"] != "resolved"),
        },
    }


def register_asset(asset_id: str, name: str, asset_type: str, network: str = "studionet") -> dict[str, Any]:
    payload = store.add_asset(asset_id=asset_id, name=name, asset_type=asset_type, network=network)
    return {
        "contract": get_contract_info(),
        "asset": payload,
        "message": "Asset successfully registered and tracked through contract metadata.",
    }


def score_alert(alert_id: str, asset: str, severity: str, confidence: int, signal: str, age_minutes: int, evidence_summary: str) -> dict[str, Any]:
    verdict = {
        "severity_score": max(0, min(100, confidence + (20 if severity == "high" else 0))),
        "confidence": max(0, min(100, confidence)),
        "recommended_action": "isolate" if severity == "high" else "observe",
        "evidence_summary": evidence_summary,
    }
    payload = store.add_alert(
        alert_id=alert_id,
        title=f"{severity.title()} issue detected",
        asset=asset,
        severity=severity,
        confidence=confidence,
        signal=signal,
        age_minutes=age_minutes,
    )
    payload["contract_verdict"] = verdict
    payload["contract_score"] = json.dumps(verdict)
    return {
        "contract": get_contract_info(),
        "alert": payload,
        "message": "Alert scored and stored with on-chain contract metadata.",
    }


def open_incident(incident_id: str, title: str, asset: str, owner: str = "ops", priority: str = "p2") -> dict[str, Any]:
    payload = store.add_incident(
        incident_id=incident_id,
        title=title,
        asset=asset,
        status="open",
        priority=priority,
        owner=owner,
        next_step="investigate",
    )
    return {
        "contract": get_contract_info(),
        "incident": payload,
        "message": "Incident opened with contract-backed workflow metadata.",
    }


def get_alert(alert_id: str) -> dict[str, Any]:
    alert = store.alerts.get(alert_id)
    if alert is None:
        raise KeyError("Alert not found")
    return {"contract": get_contract_info(), "alert": alert}
