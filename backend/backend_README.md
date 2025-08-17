# 🧱 Backend — Node.js + Express + MongoDB

This service powers the REST API: geocoding, weather fetch, persistence, CRUD, and data exports. It also integrates with the **Python NLP microservice** to parse natural language queries into structured `{ location, dateFrom, dateTo }`.

---

## 🔧 Tech & Libraries
- **Node.js**, **Express**
- **Mongoose** (MongoDB)
- **node-fetch** (HTTP)
- **OpenCage** (geocoding)
- **OpenWeather** (forecast)
- **fast-xml-parser**, **csv-stringify**, **markdown-table** (exports)

> Note: `markdown-table` requires a named import: `import { markdownTable as table } from "markdown-table";`.

---

## ⚙️ Configuration

Create `.env`:
```ini
PORT=4000
MONGO_URI=mongodb://localhost:27017/weatherapp
OPENWEATHER_API_KEY=your_openweather_key
OPENCAGE_API_KEY=your_opencage_key
ALLOWED_ORIGINS=http://localhost:5173
NLP_SERVICE_URL=http://localhost:8000/parse
```

Install & run:
```bash
npm install
npm run dev
```

---

## 🧩 Project Structure

```
backend/
├── src/
│   ├── server.js
│   ├── routes/
│   │   ├── weather.js
│   │   ├── queries.js
│   │   └── exports.js
│   ├── controllers/
│   │   ├── weatherController.js
│   │   └── queryController.js
│   ├── models/
│   │   └── WeatherQuery.js
│   ├── services/
│   │   ├── geocode.js
│   │   └── openweather.js
│   └── utils/
│       └── nlpService.js
└── .env
```

---

## 📡 Endpoints

### 1) Weather
`GET /api/weather/current?location=London`  
or `GET /api/weather/current?lat=..&lon=..`

**Response (example):**
```json
{
  "location": { "name": "London, UK", "lat": 51.5072, "lon": -0.1276 },
  "current": { "tempC": 18.4, "weather": "light rain", "icon": "10d", "at": "2025-08-17T12:00:00.000Z" },
  "forecast": [
    { "at": "2025-08-17T15:00:00.000Z", "tempC": 19.1, "weather": "overcast clouds", "icon": "04d" }
  ]
}
```

### 2) Queries (CRUD)
- `POST /api/queries` (natural or structured body)
  - If `dateFrom`/`dateTo` are missing, backend calls **NLP service**.
- `GET /api/queries`
- `GET /api/queries/:id`
- `PUT /api/queries/:id` (e.g., update `dateTo`)
- `DELETE /api/queries/:id`

**POST example (natural):**
```json
{ "locationInput": "weather near Taj Mahal tomorrow" }
```
**POST example (structured):**
```json
{ "locationInput": "Agra", "dateFrom": "2025-08-18", "dateTo": "2025-08-19" }
```

### 3) Exports
- `GET /api/export/json`
- `GET /api/export/xml`
- `GET /api/export/csv`
- `GET /api/export/md`

---

## 🧠 NLP Integration

**utils/nlpService.js**
```js
import fetch from "node-fetch";
const NLP_URL = process.env.NLP_SERVICE_URL || "http://localhost:8000/parse";

export async function parseWithNlp(text) {
  try {
    const res = await fetch(NLP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text })
    });
    return await res.json();
  } catch (e) {
    console.error("NLP error:", e.message);
    return { location: text, dateFrom: null, dateTo: null };
  }
}
```

**controllers/queryController.js (snippet):**
```js
let { locationInput, dateFrom, dateTo } = req.body;
if (!dateFrom || !dateTo) {
  const parsed = await parseWithNlp(locationInput);
  locationInput = parsed.location || locationInput;
  dateFrom = dateFrom || parsed.dateFrom;
  dateTo = dateTo || parsed.dateTo;
}
```

---

## 🗃️ Mongoose Model (WeatherQuery)

```js
const WeatherQuerySchema = new Schema({
  locationInput: { type: String, required: true },
  normalizedLocation: {
    name: String, lat: Number, lon: Number
  },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  snapshots: [{
    at: Date, tempC: Number, weather: String, icon: String
  }]
}, { timestamps: true });
```

---

## 🧰 Implementation Notes

- **OpenWeather**: using 5‑day / 3‑hour forecast; filter to `[dateFrom, dateTo]` window.
- **Validation**: reject invalid dates & reversed ranges; provide clear `{ error }` JSON.
- **CORS**: restrict to `ALLOWED_ORIGINS` in prod.
- **ESM gotcha**: `markdown-table` needs named import; default import will crash in Node 22.

---

## 🧪 Testing

- Postman collection (optional) or cURL examples in root README.
- Unit-test candidates: geocode normalization, forecast mapper, export serializers.

---

## 🚀 Deployment Tips

- Set `NODE_ENV=production`, enable a **process manager** (pm2), attach a **reverse proxy** (nginx).
- Move secrets to platform env vars. Add **TTL caching** for weather calls to reduce API usage.
