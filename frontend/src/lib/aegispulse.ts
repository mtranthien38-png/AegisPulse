import { getReadClient, createWriteClient, createLegacyWriteClient, CONTRACT_ADDRESS } from './genlayer'
import { parseEther } from 'viem'
import type { Ticket } from './types'

async function read(fn: string, args: any[] = []): Promise<any> {
  const client = getReadClient()
  return client.readContract({ address: CONTRACT_ADDRESS as any, functionName: fn, args })
}

async function write(account: string, fn: string, args: any[], value?: bigint): Promise<string> {
  const client = createWriteClient(account)
  const request = { address: CONTRACT_ADDRESS as any, functionName: fn, args, value: value ?? 0n }
  try {
    return await client.writeContract(request) as unknown as string
  } catch (error: any) {
    const message = String(error?.message || error)
    if (!/cannot sign raw Bradbury transactions/i.test(message)) throw error
    // Wallets without eth_signTransaction use their normal approval flow.
    // This remains compatible with MetaMask/OKX installations that expose
    // only eth_sendTransaction.
    const legacy = createLegacyWriteClient(account)
    return await legacy.writeContract(request) as unknown as string
  }
}

// ---- reads ----
export async function getTicket(id: number): Promise<Ticket> {
  const raw = await read('get_ticket', [id])
  return raw as unknown as Ticket
}
export async function listAllIds(): Promise<number[]> {
  const raw = await read('list_all_ids', [])
  return (raw as unknown as number[]) ?? []
}
export async function listTicketsFor(party: string): Promise<number[]> {
  const raw = await read('list_tickets_for', [party])
  return (raw as unknown as number[]) ?? []
}
export async function getAppealDeadline(ticketId: number): Promise<number> {
  const raw = await read('get_appeal_deadline', [ticketId])
  return Number(raw)
}
export async function canSettle(ticketId: number): Promise<{ eligible: boolean; window_open: boolean; status: string }> {
  const raw = await read('can_settle', [ticketId])
  return raw as unknown as { eligible: boolean; window_open: boolean; status: string }
}

// ---- writes ----
export async function createTicket(account: string, operator: string, slaSpec: string, deadline: number, genAmount: string) {
  return write(account, 'create_ticket', [operator, slaSpec, deadline], parseEther(genAmount))
}
export async function raiseAlert(account: string, ticketId: number, alertSummary: string) {
  return write(account, 'raise_alert', [ticketId, alertSummary])
}
export async function acknowledge(account: string, ticketId: number) {
  return write(account, 'acknowledge', [ticketId])
}
export async function submitEvidence(account: string, ticketId: number, evidenceUrls: string[], notes: string) {
  return write(account, 'submit_evidence', [ticketId, evidenceUrls, notes])
}
export async function adjudicate(account: string, ticketId: number) {
  return write(account, 'adjudicate', [ticketId])
}
export async function raiseDispute(account: string, ticketId: number, additionalEvidence: string[], reason: string) {
  return write(account, 'raise_dispute', [ticketId, additionalEvidence, reason])
}
export async function settleViolation(account: string, ticketId: number) {
  return write(account, 'settle_violation', [ticketId])
}
export async function settleRefund(account: string, ticketId: number) {
  return write(account, 'settle_refund', [ticketId])
}
export async function refundExpired(account: string, ticketId: number) {
  return write(account, 'refund_expired', [ticketId])
}
