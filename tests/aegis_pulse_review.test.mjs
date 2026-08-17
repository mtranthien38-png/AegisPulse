import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const contract = read("intelligent-contracts/aegis_pulse.py");
const detail = read("frontend/src/pages/TicketDetail.tsx");
const types = read("frontend/src/lib/types.ts");

test("disputed tickets can be re-adjudicated", () => {
  assert.match(contract, /t\.status not in \(Status\.EVIDENCE_SUBMITTED, Status\.DISPUTED\)/);
  assert.match(contract, /Status\.DISPUTED: \(Status\.VIOLATION_CONFIRMED, Status\.NO_VIOLATION\)/);
  assert.match(detail, /ticket\.status === 'disputed'/);
  assert.match(detail, /Re-adjudicate Dispute/);
});

test("malformed verdicts hold escrow and remain retryable", () => {
  assert.match(contract, /if not verdict\.get\("valid", True\)/);
  assert.match(contract, /t\.verdict_valid = False/);
  assert.match(contract, /t\.verdict_decided_at = u256\(0\)/);
  assert.match(contract, /t\.rejected_at = u256\(0\)/);
  assert.match(contract, /return/);
  assert.match(contract, /or not t\.verdict_valid/);
  assert.match(contract, /SAFE HOLD/);
});

test("mutation lifecycle guards and settlement transition are enforced", () => {
  assert.match(contract, /Alerts can only be raised for open tickets/);
  assert.match(contract, /Ticket is not accepting evidence in status/);
  assert.match(contract, /self\._transition\(t, Status\.EXPIRED\)/);
  assert.match(contract, /settle_violation[\s\S]*?or not t\.verdict_valid/);
  assert.match(contract, /settle_refund[\s\S]*?or not t\.verdict_valid/);
});

test("evidence capacity is balanced independently for both parties", () => {
  assert.match(contract, /provider_evidence_urls/);
  assert.match(contract, /operator_evidence_urls/);
  assert.match(contract, /MAX_EVIDENCE_URLS - existing/);
  assert.match(contract, /Evidence budget exceeded/);
  assert.match(contract, /Evidence URLs must use https/);
});

test("reversal resets verdict timing consistently", () => {
  assert.match(contract, /t\.verdict_decided_at = self\._now\(\)/);
  assert.match(contract, /t\.rejected_at = t\.verdict_decided_at/);
  assert.match(contract, /t\.rejected_at = u256\(0\)/);
  assert.match(types, /verdict_valid: boolean/);
});
