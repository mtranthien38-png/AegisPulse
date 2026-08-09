import { getReadClient, createWriteClient, CONTRACT_ADDRESS } from './genlayer'
import type { ContractAsset, ContractAlert, ContractIncident } from './types'

async function read(fn: string, args: any[] = []): Promise<any> {
  const client = getReadClient()
  return client.readContract({
    address: CONTRACT_ADDRESS as any,
    functionName: fn,
    args,
  })
}

async function write(account: string, fn: string, args: any[]): Promise<string> {
  const client = createWriteClient(account)
  return client.writeContract({
    address: CONTRACT_ADDRESS as any,
    functionName: fn,
    args,
    value: 0n,
  }) as unknown as string
}

// ---- READS ----

export async function getAsset(assetId: string): Promise<ContractAsset> {
  const raw = await read('get_asset', [assetId])
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

export async function getAlert(alertId: string): Promise<ContractAlert> {
  const raw = await read('get_alert', [alertId])
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

export async function getIncident(incidentId: string): Promise<ContractIncident> {
  const raw = await read('get_incident', [incidentId])
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

// ---- WRITES ----

export async function registerAsset(
  account: string,
  assetId: string,
  name: string,
  assetType: string,
): Promise<string> {
  return write(account, 'register_asset', [assetId, name, assetType])
}

export async function scoreAlert(
  account: string,
  alertId: string,
  assetId: string,
  severityHint: string,
  evidenceSummary: string,
): Promise<string> {
  return write(account, 'score_alert', [alertId, assetId, severityHint, evidenceSummary])
}

export async function openIncident(
  account: string,
  incidentId: string,
  alertId: string,
  title: string,
): Promise<string> {
  return write(account, 'open_incident', [incidentId, alertId, title])
}

export async function resolveIncident(
  account: string,
  incidentId: string,
): Promise<string> {
  return write(account, 'resolve_incident', [incidentId])
}
