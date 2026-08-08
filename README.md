# AegisPulse

**AI-powered anomaly detection and incident response for decentralized infrastructure.**

AegisPulse is a GenLayer-ready security operations project for monitoring validator fleets, protocol services, and critical infrastructure. It focuses on detecting abnormal behavior early, scoring incident severity, and coordinating response with a clean human review path.

## What it does

- Watches nodes, validators, relays, and service endpoints for drift, downtime, and suspicious patterns.
- Aggregates alerts into incidents with severity and confidence scoring.
- Uses an intelligent contract to score incident likelihood, recommend next actions, and track response decisions.
- Gives operators a dashboard for live health, alert history, and resolution workflow.

## Suggested stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: FastAPI + PostgreSQL + Redis
- Intelligent contract: GenLayer Python contract
- Monitoring: background workers and webhook ingestion

## Core modules

- `backend/` API, workers, persistence, auth
- `frontend/` dashboard and incident workflow UI
- `intelligent-contracts/` GenLayer logic for scoring and approval
- `docs/` product and workflow notes

## First milestone

1. Register a monitored asset.
2. Ingest an alert or heartbeat failure.
3. Open an incident.
4. Score it through the GenLayer contract.
5. Track resolution and postmortem notes.

## Running locally

- Backend: `cd backend && uvicorn app.main:app --reload --port 8000`
- Frontend: `cd frontend && npm install && npm run dev`
- Contract: upload `intelligent-contracts/aegis_pulse.py` to GenLayer Studio

## Deployed on-chain

- Network: `Bradbury Testnet`
- Contract address: `0xc32725AAA0062754C9fA7B297821CF47bB2C37F9`
- Deployment tx: `0x995fe577b527bc7d6f23573d7eed6b7eda1b47ca79fd2758466e8a9d6dec237d`
