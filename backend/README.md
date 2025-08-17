# Weather Backend (Express + MongoDB)

## Setup
1. `cp .env.example .env` and fill keys:
   - `MONGO_URI`
   - `OPENWEATHER_API_KEY` (https://openweathermap.org/api)
   - `OPENCAGE_API_KEY` (https://opencagedata.com/)
2. Install and run:
```bash
npm install
npm run dev
```

## Endpoints
- `GET /api/weather/current?location=London` or `?lat=..&lon=..` – current + 5-day/3-hour forecast
- CRUD:
  - `POST /api/queries` `{ locationInput, dateFrom, dateTo }`
  - `GET /api/queries`
  - `GET /api/queries/:id`
  - `PUT /api/queries/:id`
  - `DELETE /api/queries/:id`
- Export:
  - `GET /api/export/json|xml|csv|md`
