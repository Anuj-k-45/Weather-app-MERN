const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export async function fetchCurrent({ location, lat, lon }) {
  const params = new URLSearchParams();
  if (location) params.set("location", location);
  if (lat && lon) { params.set("lat", lat); params.set("lon", lon); }
  const res = await fetch(`${API_BASE}/weather/current?${params.toString()}`);
  return res.json();
}

export async function createQuery(payload) {
  const res = await fetch(`${API_BASE}/queries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function listQueries() {
  const res = await fetch(`${API_BASE}/queries`);
  return res.json();
}

export async function updateQuery(id, payload) {
  const res = await fetch(`${API_BASE}/queries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function deleteQuery(id) {
  const res = await fetch(`${API_BASE}/queries/${id}`, { method: "DELETE" });
  return res.json();
}
