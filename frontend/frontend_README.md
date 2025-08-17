# 🎨 Frontend — React + Vite + Tailwind (System Theme)

A clean, responsive UI that lets users search weather by location or **natural language** (thanks to backend + NLP), see **current** and **5‑day** forecasts, **save queries** (CRUD), and export data. Includes **PM Accelerator** branding support.

---

## 🧱 Stack
- React 18 + Vite
- Tailwind CSS (auto **light/dark** via system preference)
- Native Geolocation API (optional current location)

---

## ⚙️ Setup

```bash
cd frontend
cp .env.example .env
# VITE_API_BASE=http://localhost:4000/api
npm install
npm run dev
```
Open the printed URL (e.g., `http://localhost:5173`).

Place your PM Accelerator PNG (optional) at:
```
frontend/public/pmaccelerate.png
```

---

## 🧭 Key Screens & Components

- **Header**: Title, **PM Accelerator logo** (PNG, `h-10 w-auto`), **Info** button (opens modal).
- **Search bar**: free text input (city/landmark/zip/natural phrase) + **Search** button.
- **WeatherCard**: current conditions + 3‑hour forecast grid (up to 16 cards for brevity).
- **QueryForm**: save a query by `locationInput` & date range (or rely on NLP to infer).
- **QueryList**: list, update, delete saved queries; **auto-refresh** on new create (uses `refreshKey` pattern).

Folders:
```
src/
├── App.jsx
├── api.js
├── components/
│   ├── InfoModal.jsx
│   ├── QueryForm.jsx
│   ├── QueryList.jsx
│   └── WeatherCard.jsx
└── index.css
```

---

## 🔗 API Usage (Frontend)

- `api.js` centralizes calls:
  - `fetchCurrent({ location })` or `{ lat, lon }`
  - `createQuery(body)`
  - `listQueries()`
  - `updateQuery(id, body)`
  - `deleteQuery(id)`

**Auto refresh after create**  
`App.jsx` keeps a `refreshKey` state and passes it to `QueryList`:
```jsx
const [refreshKey, setRefreshKey] = useState(0)

<QueryForm onCreated={() => setRefreshKey(k => k + 1)} />
<QueryList refreshKey={refreshKey} />
```

`QueryList.jsx` re-fetches on `refreshKey` changes:
```jsx
useEffect(() => { refresh() }, [refreshKey])
```

---

## 🧰 Styling Notes

- Tailwind `darkMode: 'media'` → respects **system theme** (no manual toggle).
- Inputs/buttons are styled for clarity; layout is responsive; hover states are subtle.
- Logo sits to the left of Info button, **no rounding/no scaling** per product choice.

---

## 🧪 Quick Checks

- Search “London” → weather displays.
- Click **Save Query** with `locationInput="weather near Taj Mahal tomorrow"` → NLP infers.
- See new record appear instantly under **Saved Queries** (no page reload).
- Try **Export** links (JSON/XML/CSV/MD).

---

## 🧭 Extensibility

- Add a **theme toggle** (UI state + `dark` class on `<html>`).
- Add small charts (e.g., hourly temps) with a lightweight chart lib.
- Add a **map preview** by lat/lon (Leaflet/Mapbox) once geocoded.
