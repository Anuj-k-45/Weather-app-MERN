import fetch from "node-fetch";

export async function geocode(locationInput) {
  const key = process.env.OPENCAGE_API_KEY;
  if (!key) throw new Error("Missing OPENCAGE_API_KEY");
  const url = new URL("https://api.opencagedata.com/geocode/v1/json");
  url.searchParams.set("q", locationInput);
  url.searchParams.set("key", key);
  url.searchParams.set("no_annotations", "1");
  url.searchParams.set("limit", "1");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocode failed: " + res.status);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("Location not found");
  const r = data.results[0];
  return {
    name: r.formatted,
    lat: r.geometry.lat,
    lon: r.geometry.lng
  };
}
