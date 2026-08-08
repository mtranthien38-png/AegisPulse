export type Asset = {
  id: string;
  name: string;
  asset_type: string;
  network: string;
  status: string;
  uptime_30d: number;
  risk_score: number;
};

export type Alert = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  asset: string;
  signal: string;
  age_minutes: number;
};

export type Incident = {
  id: string;
  title: string;
  status: string;
  priority: string;
  owner: string;
  asset: string;
  next_step: string;
};
