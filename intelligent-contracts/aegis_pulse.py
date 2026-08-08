import json

from genlayer import *  # type: ignore


class AegisPulseContract(gl.Contract):
    assets: TreeMap[str, str]
    alerts: TreeMap[str, str]
    incidents: TreeMap[str, str]
    reviews: TreeMap[str, str]

    owner: str
    paused: bool

    def __init__(self) -> None:
        self.owner = gl.message.sender_address.as_hex
        self.paused = False

    def _only_owner(self) -> None:
        assert gl.message.sender_address.as_hex == self.owner, "Only owner"

    @gl.public.write
    def register_asset(self, asset_id: str, name: str, asset_type: str) -> bool:
        assert asset_id not in self.assets, "Asset already exists"
        self.assets[asset_id] = json.dumps(
            {"asset_id": asset_id, "name": name, "asset_type": asset_type, "status": "healthy"}
        )
        return True

    @gl.public.write
    def score_alert(self, alert_id: str, asset_id: str, severity_hint: str, evidence_summary: str) -> str:
        prompt = f"""
You are an incident scoring engine for AegisPulse.
Return only JSON with:
severity_score 0-100,
confidence 0-100,
recommended_action one of [observe, escalate, isolate, page_oncall].

Asset: {asset_id}
Hint: {severity_hint}
Evidence: {evidence_summary[:1500]}
"""

        def nondet() -> str:
            raw = gl.nondet.exec_prompt(prompt)
            return raw.replace("```json", "").replace("```", "").strip()

        raw = gl.eq_principle.prompt_comparative(nondet, principle="numeric fields within 15")
        data = json.loads(raw)
        result = {
            "alert_id": alert_id,
            "asset_id": asset_id,
            "severity_score": max(0, min(100, int(data.get("severity_score", 50)))),
            "confidence": max(0, min(100, int(data.get("confidence", 60)))),
            "recommended_action": str(data.get("recommended_action", "observe")),
        }
        self.alerts[alert_id] = json.dumps(result)
        return json.dumps(result)

    @gl.public.write
    def open_incident(self, incident_id: str, alert_id: str, title: str) -> str:
        payload = {"incident_id": incident_id, "alert_id": alert_id, "title": title, "status": "open"}
        self.incidents[incident_id] = json.dumps(payload)
        return json.dumps(payload)

    @gl.public.view
    def get_alert(self, alert_id: str) -> str:
        return self.alerts[alert_id]
