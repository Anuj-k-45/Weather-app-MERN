import React, { useEffect, useState } from "react";
import { fetchCurrent } from "./api";
import WeatherCard from "./components/WeatherCard";
import QueryForm from "./components/QueryForm";
import QueryList from "./components/QueryList";
import InfoModal from "./components/InfoModal";

export default function App() {
  const [data, setData] = useState(null);
  const [q, setQ] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 🔑 add state

  async function runForQuery() {
    if (!q) return;
    const res = await fetchCurrent({ location: q });
    setData(res);
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const res = await fetchCurrent({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setData(res);
      });
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Weather App — Anuj</h1>
        <div className="flex items-center gap-3">
          {/* PM Accelerator Logo */}
          <a
            href="https://www.linkedin.com/school/pmaccelerator/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="./src/assets/logo.png" // place logo inside frontend/public/
              alt="PM Accelerator Logo"
              className="h-10 w-auto" // ✅ adjust height, keep aspect ratio
            />
          </a>

          {/* Info Button */}
          <button
            onClick={() => setInfoOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Info
          </button>
        </div>
      </header>

      <div className="flex gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Enter city, landmark, zip..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={runForQuery}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Search
        </button>
      </div>

      <WeatherCard data={data} />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Save a Weather Query (CRUD)
        </h2>
        {/* pass setRefreshKey here */}
        <QueryForm onCreated={() => setRefreshKey((prev) => prev + 1)} />
        <QueryList refreshKey={refreshKey} /> //
      </section>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
