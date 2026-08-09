# AegisPulse

**Infrastructure SLA compliance escrow on GenLayer.**

AegisPulse lets infrastructure providers stake GEN on SLA commitments. When a monitoring alert triggers, the provider submits evidence URLs. Independent AI validators fetch the evidence live and adjudicate whether the SLA was violated — with dispute resolution and appeal windows.

## How it works

1. **Create ticket** — provider stakes GEN, sets SLA spec, deadline, and operator (monitoring party)
2. **Raise alert** — operator detects SLA breach and raises an on-chain alert
3. **Submit evidence** — provider submits URLs proving SLA compliance
4. **AI adjudication** — validators fetch evidence live via `gl.nondet.web.render()` and compare against SLA spec
5. **Settlement** — violation → payout to operator / no violation → refund to provider
6. **Dispute** — either party can dispute within a 3-day appeal window with additional evidence

## Architecture

```
Provider stakes GEN ──▸ AegisPulseContract (Bradbury)
Operator raises alert ──▸ ...
Provider submits URLs ──▸ ...
AI validators fetch URLs live ──▸ adjudicate SLA compliance
Verdict ──▸ payout or refund (emit_transfer)
Dispute window ──▸ re-adjudicate with new evidence
```

## Contract

| Function | Type | Description |
|----------|------|-------------|
| `create_ticket(operator, sla_spec, deadline)` | write.payable | Provider stakes GEN |
| `raise_alert(ticket_id, alert_summary)` | write | Operator reports SLA breach |
| `acknowledge(ticket_id)` | write | Provider acknowledges alert |
| `submit_evidence(ticket_id, evidence_urls, notes)` | write | Provider submits evidence URLs |
| `adjudicate(ticket_id)` | write | AI fetches evidence, adjudicates |
| `raise_dispute(ticket_id, additional_evidence, reason)` | write | Either party disputes |
| `settle_refund(ticket_id)` | write | Final refund after appeal window |
| `refund_expired(ticket_id)` | write | Auto-refund past deadline |
| `get_ticket(ticket_id)` | view | Read ticket state |
| `list_tickets_for(party)` | view | List tickets for address |
| `list_all_ids()` | view | List all ticket IDs |

## Tech stack

- **Contract:** Python (genlayer SDK) with `gl.nondet.web.render()` evidence fetching
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + TypeScript
- **Wallet:** MetaMask / OKX via `window.ethereum`
- **Chain:** GenLayer Bradbury Testnet (chain ID 4221)

## Getting started

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Live

https://aegispulse.vercel.app/

## Network

| Field | Value |
|-------|-------|
| Network | GenLayer Bradbury Testnet |
| Chain ID | 4221 (0x107D) |
| Contract | 0x1D6dd7cDCaA02c1Ac791d9091d7651bE21A03A72 |
| RPC | https://rpc-bradbury.genlayer.com |
| Explorer | https://explorer-bradbury.genlayer.com |
