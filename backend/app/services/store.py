from __future__ import annotations

from typing import Any

assets: dict[str, dict[str, Any]] = {
    "asset_1": {
        "id": "asset_1",
        "name": "Validator Node A",
        "asset_type": "validator",
        "network": "eigenlayer",
        "status": "healthy",
        "uptime_30d": 99.92,
        "risk_score": 11,
    },
    "asset_2": {
        "id": "asset_2",
        "name": "RPC Gateway",
        "asset_type": "service",
        "network": "cosmos",
        "status": "degraded",
        "uptime_30d": 97.48,
        "risk_score": 41,
    },
    "asset_3": {
        "id": "asset_3",
        "name": "Bridge Watcher",
        "asset_type": "monitor",
        "network": "symbiotic",
        "status": "healthy",
        "uptime_30d": 99.68,
        "risk_score": 18,
    },
}

alerts: dict[str, dict[str, Any]] = {
    "alert_1": {
        "id": "alert_1",
        "title": "Heartbeat missed",
        "severity": "high",
        "confidence": 87,
        "asset": "Validator Node A",
        "signal": "missed_heartbeat",
        "age_minutes": 8,
    },
    "alert_2": {
        "id": "alert_2",
        "title": "Latency spike detected",
        "severity": "medium",
        "confidence": 71,
        "asset": "RPC Gateway",
        "signal": "latency_spike",
        "age_minutes": 21,
    },
    "alert_3": {
        "id": "alert_3",
        "title": "Peer divergence warning",
        "severity": "high",
        "confidence": 83,
        "asset": "Bridge Watcher",
        "signal": "state_divergence",
        "age_minutes": 44,
    },
}

incidents: dict[str, dict[str, Any]] = {
    "inc_1": {
        "id": "inc_1",
        "title": "Validator drift detected",
        "status": "triaged",
        "priority": "p1",
        "owner": "oncall",
        "asset": "Validator Node A",
        "next_step": "isolate",
    },
    "inc_2": {
        "id": "inc_2",
        "title": "RPC gateway instability",
        "status": "investigating",
        "priority": "p2",
        "owner": "platform",
        "asset": "RPC Gateway",
        "next_step": "gather_evidence",
    },
}


def list_assets() -> list[dict[str, Any]]:
    return list(assets.values())


def add_asset(asset_id: str, name: str, asset_type: str, network: str = "studionet") -> dict[str, Any]:
    if asset_id in assets:
        raise ValueError("Asset already exists")

    payload = {
        "id": asset_id,
        "name": name,
        "asset_type": asset_type,
        "network": network,
        "status": "healthy",
        "uptime_30d": 100.0,
        "risk_score": 10,
    }
    assets[asset_id] = payload
    return payload


def list_alerts() -> list[dict[str, Any]]:
    return list(alerts.values())


def add_alert(alert_id: str, title: str, asset: str, severity: str, confidence: int, signal: str, age_minutes: int = 0) -> dict[str, Any]:
    if alert_id in alerts:
        raise ValueError("Alert already exists")

    payload = {
        "id": alert_id,
        "title": title,
        "severity": severity,
        "confidence": confidence,
        "asset": asset,
        "signal": signal,
        "age_minutes": age_minutes,
    }
    alerts[alert_id] = payload
    return payload


def list_incidents() -> list[dict[str, Any]]:
    return list(incidents.values())


def add_incident(incident_id: str, title: str, asset: str, status: str = "open", priority: str = "p2", owner: str = "ops", next_step: str = "investigate") -> dict[str, Any]:
    if incident_id in incidents:
        raise ValueError("Incident already exists")

    payload = {
        "id": incident_id,
        "title": title,
        "status": status,
        "priority": priority,
        "owner": owner,
        "asset": asset,
        "next_step": next_step,
    }
    incidents[incident_id] = payload
    return payload


def workflow_steps() -> list[dict[str, str]]:
    steps = [
        {"key": "asset_onboard", "label": "Onboard asset", "status": "done" if assets else "pending"},
        {"key": "alert_ingest", "label": "Ingest alert", "status": "done" if alerts else "pending"},
        {"key": "contract_score", "label": "Score on-chain", "status": "done" if alerts else "pending"},
    ]

    if any(inc["status"] == "open" for inc in incidents.values()):
        steps.append({"key": "incident_open", "label": "Open incident", "status": "active"})
        steps.append({"key": "review_close", "label": "Review and close", "status": "pending"})
    else:
        steps.append({"key": "incident_open", "label": "Open incident", "status": "done" if incidents else "pending"})
        steps.append({"key": "review_close", "label": "Review and close", "status": "done" if incidents else "pending"})

    return steps
