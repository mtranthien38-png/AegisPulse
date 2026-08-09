export interface ContractAsset {
  asset_id: string
  name: string
  asset_type: string
  status: string
}

export interface ContractAlert {
  alert_id: string
  asset_id: string
  severity_score: number
  confidence: number
  recommended_action: string
}

export interface ContractIncident {
  incident_id: string
  alert_id: string
  title: string
  status: string
}

export interface LocalAsset extends ContractAsset {
  network: string
  registered_at: string
}

export interface LocalAlert extends ContractAlert {
  severity_hint: string
  evidence_summary: string
  scored_at: string
  tx_hash?: string
}

export interface LocalIncident extends ContractIncident {
  opened_at: string
  tx_hash?: string
}
