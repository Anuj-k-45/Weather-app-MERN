import fetch from "node-fetch";

const OW_BASE = "https://api.openweathermap.org/data/2.5";

export async function currentWeatherByCoords(lat, lon) {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error("Missing OPENWEATHER_API_KEY");
  const url = new URL(OW_BASE + "/weather");
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", key);
  url.searchParams.set("units", "metric");
  const res = await fetch(url);
  if (!res.ok) throw new Error("OpenWeather current failed: " + res.status);
  return res.json();
}

export async function forecastByCoords(lat, lon) {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error("Missing OPENWEATHER_API_KEY");
  const url = new URL(OW_BASE + "/forecast"); // 5-day / 3-hour
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", key);
  url.searchParams.set("units", "metric");
  const res = await fetch(url);
  if (!res.ok) throw new Error("OpenWeather forecast failed: " + res.status);
  return res.json();
}
