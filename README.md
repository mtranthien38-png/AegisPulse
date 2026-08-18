# AegisPulse

**Infrastructure SLA compliance escrow on GenLayer.**

AegisPulse lets infrastructure providers stake GEN on SLA commitments. When a monitoring alert triggers, the provider submits evidence URLs. Independent AI validators fetch the evidence live and adjudicate whether the SLA was violated — with dispute resolution and appeal windows.

## How it works

1. **Create ticket** — provider stakes GEN, sets SLA spec, deadline, and operator (monitoring party)
2. **Raise alert** — operator detects SLA breach and raises an on-chain alert
3. **Submit evidence** — provider and operator submit evidence URLs within their separate budgets
4. **AI adjudication** — validators fetch evidence live via `gl.nondet.web.render()` and compare against SLA spec
5. **Settlement** — violation → payout to operator / no violation → refund to provider
6. **Dispute** — either party can dispute within a 3-day appeal window with additional evidence
7. **Re-adjudicate** — disputed tickets are re-evaluated using both parties' evidence
8. **Settle** — only a valid verdict after the appeal window can move escrow

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
| `submit_evidence(ticket_id, evidence_urls, notes)` | write | Provider or operator submits evidence URLs |
| `adjudicate(ticket_id)` | write | AI fetches evidence, adjudicates |
| `raise_dispute(ticket_id, additional_evidence, reason)` | write | Either party disputes |
| `settle_violation(ticket_id)` | write | Final payout after appeal window |
| `settle_refund(ticket_id)` | write | Final refund after appeal window |
| `refund_expired(ticket_id)` | write | Auto-refund past deadline |
| `get_ticket(ticket_id)` | view | Read ticket state |
| `list_tickets_for(party)` | view | List tickets for address |
| `list_all_ids()` | view | List all ticket IDs |

## Deployed contract

The frontend and repository source are matched to this Bradbury deployment:

- Contract: [`0xE22120B588Ab64eEE419b06Ba786355789e95fEb`](https://explorer-bradbury.genlayer.com/address/0xE22120B588Ab64eEE419b06Ba786355789e95fEb)
- Deployment transaction: [`0x82267f48f8f9a434b724ccc0b92a5034d0c5e4ec046f42477290787f57f5f53c`](https://explorer-bradbury.genlayer.com/tx/0x82267f48f8f9a434b724ccc0b92a5034d0c5e4ec046f42477290787f57f5f53c)
- Source file: [`intelligent-contracts/aegis_pulse.py`](intelligent-contracts/aegis_pulse.py)

The deployment includes the `verdict_valid` field and the safe-hold behavior;
the older address must not be used for this submission.

### Safety guarantees

- `adjudicate()` accepts both `evidence_submitted` and `disputed` tickets, so a
  disputed ticket can be re-adjudicated with both parties' evidence.
- A malformed or unavailable validator verdict is recorded as a safe hold,
  keeps the ticket retryable, and never authorizes a refund or payout.
- Every mutation checks its allowed lifecycle status before changing state;
  settlement also requires a valid verdict and a closed appeal window.
- Provider and operator each have an independent ten-URL evidence budget.
- Every fresh valid verdict resets `verdict_decided_at`; a reversal to a
  violation clears the old refund timestamp, while a no-violation verdict sets
  `rejected_at` to the same new decision time.

## Additional Intelligent Contracts

| Contract | Industry | Non-deterministic consensus outcome |
|----------|----------|-------------------------------------|
| `HarvestGuard` | Agriculture and food supply chains | Whether live inspection and traceability evidence meets a produce lot's quality criteria |
| `CarbonProof` | Climate finance and carbon markets | Whether live registry and verification evidence proves the agreed carbon-credit delivery |

See [Intelligent Contracts](docs/intelligent-contracts.md) for the flows, methods, and escrow safety properties.

## Tech stack

- **Contract:** Python (genlayer SDK) with `gl.nondet.web.render()` evidence fetching
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + TypeScript
- **RPC compatibility:** `viem@2.30.6` is pinned for Bradbury's integer JSON-RPC request IDs
- **Wallet:** MetaMask / OKX via `window.ethereum`
- **Chain:** GenLayer Bradbury Testnet (chain ID 4221)

## Getting started

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The exact `viem` version is intentional. Do not replace it with a floating
`^2.x` range: newer versions can serialize the Bradbury JSON-RPC request ID as
a string and cause `eth_sendRawTransaction` batch parse errors.

## Live

https://aegispulse.vercel.app/

## Network

| Field | Value |
|-------|-------|
| Network | GenLayer Bradbury Testnet |
| Chain ID | 4221 (0x107D) |
| Contract | 0xE22120B588Ab64eEE419b06Ba786355789e95fEb |
| RPC | https://rpc-bradbury.genlayer.com |
| Explorer | https://explorer-bradbury.genlayer.com |
