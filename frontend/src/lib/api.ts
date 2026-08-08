import type { Asset, Alert, Incident } from "@/lib/types";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store", ...options });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export type ContractInfo = {
  name: string;
  network: string;
  address: string;
  deployment_tx_hash: string;
  verified: boolean;
  capabilities: string[];
  runtime?: {
    registered_assets?: number;
    tracked_alerts?: number;
    open_incidents?: number;
  };
};

export type WorkflowStep = {
  key: string;
  label: string;
  status: string;
};

export type WorkflowResponse = {
  steps: WorkflowStep[];
  contract: {
    address: string;
    network: string;
    read_methods: string[];
    write_methods: string[];
  };
};

export const api = {
  overview: () => request<{ summary: Record<string, number>; contract: ContractInfo; risk_trend: Array<{ label: string; value: number }> }>("/overview"),
  metrics: () => request<Record<string, number>>("/metrics/overview"),
  assets: () => request<Asset[]>("/assets"),
  alerts: () => request<Alert[]>("/alerts"),
  incidents: () => request<Incident[]>("/incidents"),
  contract: () => request<ContractInfo>("/contract"),
  workflow: () => request<WorkflowResponse>("/workflow"),
  registerAsset: (body: { id: string; name: string; asset_type: string; network?: string }) =>
    request<{ contract: ContractInfo; asset: Asset; message: string }>("/contract/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  scoreAlert: (body: { id: string; asset: string; severity: string; confidence: number; signal: string; age_minutes?: number; evidence_summary: string }) =>
    request<{ contract: ContractInfo; alert: Alert; message: string }>("/contract/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  openIncident: (body: { id: string; title: string; asset: string; owner?: string; priority?: string }) =>
    request<{ contract: ContractInfo; incident: Incident; message: string }>("/contract/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
};
