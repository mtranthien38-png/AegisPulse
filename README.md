# AegisPulse

**Detect anomalies before they become incidents — powered by GenLayer.**

AegisPulse is an infrastructure monitoring dApp built on [GenLayer](https://genlayer.com). It registers monitored assets, scores alerts with on-chain AI consensus, and manages incident response — all as GenLayer Intelligent Contract transactions.

## How it works

1. **Register asset** — onboard a monitored infrastructure component (validator, relay, gateway, watchpoint) as an on-chain entry.
2. **Score alert** — describe the anomaly evidence in plain English. The Intelligent Contract uses multi-validator AI consensus (`gl.eq_principle.prompt_comparative`) to score severity (0–100), confidence, and recommended action (`observe`, `escalate`, `isolate`, `page_oncall`).
3. **Open incident** — escalate a high-risk alert into a tracked on-chain incident.
4. **Resolve** — close the incident after remediation.

Every step is a GenLayer transaction — fully auditable on the blockchain.

## Architecture

```
Browser ──genlayer-js──▸ GenLayer StudioNet
  │                         │
  ├─ register_asset ────────▸ AegisPulseContract
  ├─ score_alert ───────────▸ (AI consensus)
  ├─ open_incident ─────────▸ incident store
  └─ resolve_incident ──────▸ status update
```

No backend server. The React SPA talks directly to the GenLayer chain via `genlayer-js`.

## Intelligent Contract

**File:** `intelligent-contracts/aegis_pulse.py`

| Function | Type | Description |
|----------|------|-------------|
| `register_asset(asset_id, name, asset_type)` | write | Register a monitored asset |
| `score_alert(alert_id, asset_id, severity_hint, evidence_summary)` | write | AI-consensus alert scoring |
| `open_incident(incident_id, alert_id, title)` | write | Open an incident from a scored alert |
| `resolve_incident(incident_id)` | write | Resolve an open incident |
| `get_asset(asset_id)` | view | Read asset state |
| `get_alert(alert_id)` | view | Read alert state |
| `get_incident(incident_id)` | view | Read incident state |

## Tech stack

- **Contract:** Python (genlayer SDK), deployed on StudioNet
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + TypeScript
- **Wallet:** MetaMask / OKX via `window.ethereum` (EIP-1193)
- **Chain interaction:** `genlayer-js` (read via `readContract`, write via `writeContract`)

## Getting started

```bash
cd frontend
cp .env.example .env.local   # set VITE_CONTRACT_ADDRESS
npm install
npm run dev
```

Open http://localhost:5173 and connect your wallet (StudioNet, chain ID 61999).

## Live

https://aegispulse.vercel.app/

## Network

| Field | Value |
|-------|-------|
| Network | GenLayer StudioNet |
| Chain ID | 61999 (0xF22F) |
| RPC | https://studio.genlayer.com/api |
| Explorer | https://explorer-studio.genlayer.com |
