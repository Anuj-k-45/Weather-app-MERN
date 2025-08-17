import WeatherQuery from "../models/WeatherQuery.js";
import { geocode } from "../utils/geocode.js";
import {
  currentWeatherByCoords,
  forecastByCoords,
} from "../utils/openweather.js";
import { parseWithNlp } from "../utils/nlpService.js";

function parseDate(s) {
  const d = new Date(s);
  if (isNaN(d.getTime())) throw new Error("Invalid date: " + s);
  return d;
}

export async function getCurrentWeather(req, res) {
  try {
    const { location, lat, lon } = req.query;
    let coords;
    if (lat && lon) coords = { lat, lon, name: "Current Location" };
    else if (location) coords = await geocode(location);
    else
      return res
        .status(400)
        .json({ error: "Provide ?location= or ?lat=&lon=" });

    const curr = await currentWeatherByCoords(coords.lat, coords.lon);
    const fc = await forecastByCoords(coords.lat, coords.lon);

    res.json({
      location: coords,
      current: {
        at: new Date(curr.dt * 1000),
        tempC: curr.main.temp,
        weather: curr.weather?.[0]?.description,
        icon: curr.weather?.[0]?.icon,
      },
      forecast: fc.list.map((x) => ({
        at: new Date(x.dt * 1000),
        tempC: x.main.temp,
        weather: x.weather?.[0]?.description,
        icon: x.weather?.[0]?.icon,
      })),
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function createQuery(req, res) {
  try {
    let { locationInput, dateFrom, dateTo } = req.body;

    // If dates not provided, run NLP service
    if (!dateFrom || !dateTo) {
      const parsed = await parseWithNlp(locationInput);
      locationInput = parsed.location || locationInput;
      if (parsed.dateFrom && parsed.dateTo) {
        dateFrom = parsed.dateFrom;
        dateTo = parsed.dateTo;
      }
    }

    if (!locationInput) throw new Error("locationInput is required");
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    if (isNaN(from) || isNaN(to)) throw new Error("Invalid date(s)");
    if (from > to) throw new Error("dateFrom must be <= dateTo");

    // --- Geocode ---
    const coords = await geocode(locationInput);

    // --- Special handling for "today" ---
    const today = new Date();
    if (
      from.toDateString() === today.toDateString() &&
      to.toDateString() === today.toDateString()
    ) {
      // Fetch current weather if query is for today
      const curr = await currentWeatherByCoords(coords.lat, coords.lon);
      const snaps = [
        {
          at: new Date(curr.dt * 1000),
          tempC: curr.main.temp,
          weather: curr.weather?.[0]?.description,
        },
      ];

      const doc = await WeatherQuery.create({
        locationInput,
        normalizedLocation: {
          name: coords.name,
          lat: coords.lat,
          lon: coords.lon,
        },
        dateFrom: from,
        dateTo: to,
        snapshots: snaps,
      });

      return res.status(201).json(doc);
    }

    // --- Otherwise use forecast data ---
    const fc = await forecastByCoords(coords.lat, coords.lon);

    const snaps = fc.list
      .map((x) => ({
        at: new Date(x.dt * 1000),
        tempC: x.main.temp,
        weather: x.weather?.[0]?.description,
      }))
      .filter((s) => s.at >= from && s.at <= to);

    const doc = await WeatherQuery.create({
      locationInput,
      normalizedLocation: {
        name: coords.name,
        lat: coords.lat,
        lon: coords.lon,
      },
      dateFrom: from,
      dateTo: to,
      snapshots: snaps,
    });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function listQueries(_req, res) {
  const items = await WeatherQuery.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
}

export async function getQuery(req, res) {
  const item = await WeatherQuery.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
}

export async function updateQuery(req, res) {
  try {
    const { locationInput, dateFrom, dateTo } = req.body;
    const update = {};
    if (locationInput) update.locationInput = locationInput;
    if (dateFrom) update.dateFrom = parseDate(dateFrom);
    if (dateTo) update.dateTo = parseDate(dateTo);
    if (update.dateFrom && update.dateTo && update.dateFrom > update.dateTo)
      throw new Error("dateFrom must be <= dateTo");

    // If location/date changed, re-geocode and refetch forecast
    if (locationInput || dateFrom || dateTo) {
      const base = await WeatherQuery.findById(req.params.id);
      if (!base) return res.status(404).json({ error: "Not found" });
      const locInput = locationInput || base.locationInput;
      const from = update.dateFrom || base.dateFrom;
      const to = update.dateTo || base.dateTo;
      const coords = await geocode(locInput);
      const fc = await forecastByCoords(coords.lat, coords.lon);
      const snaps = fc.list
        .map((x) => ({
          at: new Date(x.dt * 1000),
          tempC: x.main.temp,
          weather: x.weather?.[0]?.description,
        }))
        .filter((s) => s.at >= from && s.at <= to);
      update.normalizedLocation = {
        name: coords.name,
        lat: coords.lat,
        lon: coords.lon,
      };
      update.snapshots = snaps;
    }

    const item = await WeatherQuery.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function deleteQuery(req, res) {
  const del = await WeatherQuery.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
}
