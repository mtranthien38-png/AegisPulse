export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api/v1";

async function request(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  overview: () => request("/overview"),
  metrics: () => request("/metrics/overview"),
  assets: () => request("/assets"),
  alerts: () => request("/alerts"),
  incidents: () => request("/incidents"),
  contract: () => request("/contract"),
};
