# Intelligent Contracts

The project now includes two additional GenLayer Intelligent Contracts that adapt the useful parts of Deliverable Escrow: value is escrowed first, a party submits live-web evidence, GenLayer validators independently run an AI review under the Equivalence Principle, and the shared verdict controls release or refund.

## 1. HarvestGuard: Agriculture and food supply chains

Source: `intelligent-contracts/harvest_guard.py`

A buyer escrows GEN for an agricultural lot. The producer supplies public inspection documents, traceability records, certificates, or delivery records. `verify_quality` uses `gl.nondet.web.render` and `gl.nondet.exec_prompt` within `gl.eq_principle.prompt_comparative` to decide whether the lot meets the buyer's product and inspection criteria.

Flow: `create_lot` (payable) -> `submit_inspection_evidence` -> `verify_quality` -> producer is paid on approval; buyer calls `refund_rejected_lot` on rejection. `refund_expired_lot` ensures the buyer's funds cannot remain locked after the deadline.

## 2. CarbonProof: Climate finance and carbon markets

Source: `intelligent-contracts/carbon_proof.py`

A carbon-credit buyer escrows GEN for a project developer. The developer submits public registry entries, verification reports, and project documentation. `verify_delivery` asks validator consensus to determine whether evidence proves delivery against the agreed methodology, registry, and quantity criteria.

Flow: `create_order` (payable) -> `submit_delivery_proof` -> `verify_delivery` -> developer is paid on verification; buyer calls `refund_rejected_order` if the proof is rejected. `refund_expired_order` recovers escrow after the deadline.

## Shared safety properties

- Each contract performs non-deterministic AI/web evaluation through validator consensus; it does not store a single-node AI opinion.
- Prompt instructions treat fetched web content as untrusted data.
- Escrow balances are set to zero and state is persisted before any GEN transfer, preventing double settlement.
- The contracts use the EVM bridge recipient interface for transfers to ordinary wallet addresses.
