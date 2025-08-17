# 🌦️ Weather App — AI-Powered MERN + Python NLP

An intelligent weather application that blends a **MERN** stack (MongoDB, Express, React, Node) with a **Python NLP microservice** (Flask + spaCy + dateparser). Users can search by **natural language** (e.g., “weather near Taj Mahal tomorrow”), while the system extracts **location** and **dates**, fetches **real weather data**, and **persists** structured results with full **CRUD** capabilities and data **exports**.

> Built for the **PM Accelerator AI Internship Assessment**. Design emphasizes both **product thinking** (clean UX, brand touches) and **engineering excellence** (modularity, validation, integration testing mindset).

---

## 🧭 Architecture Overview

```
frontend (React + Vite + Tailwind)
   └── calls backend REST API (JSON)
backend (Node + Express + Mongoose)
   ├── integrates OpenCage (geocoding) + OpenWeather (forecast)
   ├── persists WeatherQuery documents in MongoDB
   ├── calls Python NLP microservice for NLU of free text
   └── export routes (JSON/XML/CSV/Markdown)
nlp_service (Python + Flask)
   └── spaCy NER + dateparser for natural date understanding
mongo (local/Atlas)
```

**Data flow (natural query):**  
User types “weather near Taj Mahal tomorrow” → **frontend** sends to **backend** → backend calls **NLP service** → gets `{location: "Taj Mahal", dateFrom: "YYYY-MM-DD", dateTo: "YYYY-MM-DD"}` → backend geocodes with **OpenCage** → fetches forecast via **OpenWeather** → stores in **MongoDB** → renders in UI and available via CRUD + export.

---

## 🔑 Key Capabilities

- **Natural Language Understanding** (Python): location & date extraction from messy input.
- **Current Weather + 5‑day Forecast** (OpenWeather “/forecast” 3‑hour steps).
- **Geocoding** via OpenCage; supports landmarks, cities, zips.
- **CRUD**: save, list, update, delete query results (with validation).
- **Exports**: JSON, XML, CSV, Markdown endpoints.
- **Modern UI**: responsive React + Tailwind, system light/dark mode, PM Accelerator branding option.

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 22 as well)
- Python 3.9+
- MongoDB (local or Atlas)
- API keys: **OpenCage**, **OpenWeather**

### 1) Backend
```bash
cd backend
cp .env.example .env
# Fill: MONGO_URI, OPENWEATHER_API_KEY, OPENCAGE_API_KEY (and optionally PORT, ALLOWED_ORIGINS)
npm install
npm run dev
```
Verify: `http://localhost:4000/api/health` (if provided) or hit `/api/weather/current?location=London`

### 2) NLP Service
```bash
cd nlp_service
pip install -r requirements.txt  # or: pip install flask spacy dateparser
python -m spacy download en_core_web_sm
python app.py
```
Runs on `http://localhost:8000/parse`

### 3) Frontend
```bash
cd frontend
cp .env.example .env   # VITE_API_BASE=http://localhost:4000/api
npm install
npm run dev
```
Open Vite URL (e.g. `http://localhost:5173`).

---

## 📡 Core API Surface (Backend)

- `GET /api/weather/current?location=...` or `?lat=...&lon=...`  
  Returns normalized location, current conditions, plus next 5 days (3‑hour steps).

- `POST /api/queries` → **CREATE**  
  Body examples:
  - Natural: `{ "locationInput": "weather near taj mahal tomorrow" }`
  - Structured: `{ "locationInput": "Agra", "dateFrom": "2025-08-18", "dateTo": "2025-08-19" }`

- `GET /api/queries` → **READ list**  
- `GET /api/queries/:id` → **READ one**  
- `PUT /api/queries/:id` → **UPDATE** (e.g., end date)  
- `DELETE /api/queries/:id` → **DELETE**

- `GET /api/export/json|xml|csv|md` → Download export formats.

---

## 🗃️ Data Model (WeatherQuery)

```json
{
  "_id": "ObjectId",
  "locationInput": "string",
  "normalizedLocation": { "name": "string", "lat": 00.0, "lon": 00.0 },
  "dateFrom": "ISODate",
  "dateTo": "ISODate",
  "snapshots": [
    { "at": "ISODate", "tempC": 23.1, "weather": "broken clouds", "icon": "04d" }
  ],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

> Snapshots are filtered from OpenWeather 3‑hour forecasts into the requested date window.

---

## 🧪 Testing Cheatsheet

### Sample cURL
```bash
# Natural language query → NLP → stored
curl -X POST http://localhost:4000/api/queries   -H "Content-Type: application/json"   -d '{"locationInput":"weather near Taj Mahal tomorrow"}'

# List
curl http://localhost:4000/api/queries

# Update dateTo
curl -X PUT http://localhost:4000/api/queries/<id>   -H "Content-Type: application/json"   -d '{"dateTo":"2025-08-20"}'

# Export CSV
curl http://localhost:4000/api/export/csv -o export.csv
```

---

## 🔐 Security & Robustness Notes

- **CORS**: lock `ALLOWED_ORIGINS` in backend `.env` for production.
- **Validation**: date order, well‑formed inputs; NLP fallback to “today” if date missing.
- **API Keys**: never commit keys; use environment variables; for frontend, proxy via backend where possible.
- **Rate Limits** (recommended): wrap 3rd‑party calls with caching and throttling (e.g., LRU in-memory TTL cache for forecasts).
- **Error Handling**: consistent JSON error shape `{ error: "message" }` + HTTP status codes.

---

## 🧩 Design Choices

- **Python for NLP**: best-in-class ecosystem (spaCy/dateparser), clean separation as microservice.
- **MERN for product surface**: fast iteration, familiar CRUD, Mongo for flexible JSON docs.
- **Tailwind UI**: quick, consistent theming; system-preference dark mode.
- **Exports**: demonstrate data ownership and downstream integration readiness.

---

## 🗺️ Roadmap Ideas

- NLP: support **date ranges** (“from Monday to Thursday”), **multi-entity** disambiguation.
- ML: add a **local temperature forecaster** (e.g., Prophet/LSTM) & compare against API predictions.
- Caching: in-memory + Redis layer for API responses.
- Tests: supertest for backend routes, pytest for NLP service.

---

## 🧾 License
MIT (customize if needed).
