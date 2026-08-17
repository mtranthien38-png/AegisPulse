export interface Ticket {
  id: number
  provider: string
  operator: string
  stake_amount: number
  sla_spec: string
  alert_summary: string
  provider_evidence_urls: string[]
  operator_evidence_urls: string[]
  status: string
  verdict_reasoning: string
  created_at: number
  deadline: number
  dispute_round: number
  funds_moved: boolean
  rejected_at: number
  verdict_decided_at: number
  verdict_valid: boolean
}

export const STATUS_LABELS: Record<string, string> = {
  open: 'OPEN',
  acknowledged: 'ACKNOWLEDGED',
  evidence_submitted: 'EVIDENCE SUBMITTED',
  violation_confirmed: 'VIOLATION CONFIRMED',
  no_violation: 'NO VIOLATION',
  disputed: 'DISPUTED',
  settled_payout: 'SETTLED — PAYOUT',
  settled_refund: 'SETTLED — REFUND',
  expired: 'EXPIRED',
}

export const STATUS_COLORS: Record<string, string> = {
  open: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  acknowledged: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  evidence_submitted: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  violation_confirmed: 'text-red-400 border-red-400/30 bg-red-400/10',
  no_violation: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  disputed: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  settled_payout: 'text-red-300 border-red-300/30 bg-red-300/10',
  settled_refund: 'text-emerald-300 border-emerald-300/30 bg-emerald-300/10',
  expired: 'text-slate-500 border-slate-500/30 bg-slate-500/10',
}
