# 🤖 NLP Service — Flask + spaCy + dateparser

A lightweight Python microservice that converts **natural language queries** into **structured weather queries** for the backend.

**Input**: free text, e.g., `"weather near Taj Mahal tomorrow"`  
**Output**:
```json
{
  "location": "Taj Mahal",
  "dateFrom": "2025-08-18",
  "dateTo": "2025-08-18"
}
```

---

## 🧱 Stack
- Python 3.9+
- Flask (HTTP service)
- spaCy (`en_core_web_sm`) — Named Entity Recognition (GPE/LOC/FAC/DATE)
- dateparser — robust natural date parsing (“tomorrow”, “next week”, “Saturday”)

---

## ⚙️ Setup

```bash
cd nlp_service
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt  # or: pip install flask spacy dateparser
python -m spacy download en_core_web_sm
python app.py
```
Runs at: `http://localhost:8000/parse`

`requirements.txt` (suggested):
```
flask
spacy
dateparser
```

---

## 📡 API

`POST /parse`  
Body:
```json
{ "query": "weather near Taj Mahal tomorrow" }
```
Response:
```json
{
  "location": "Taj Mahal",
  "dateFrom": "YYYY-MM-DD",
  "dateTo": "YYYY-MM-DD"
}
```

---

## 🧠 Extraction Logic (High-Level)

1. **Location**
   - Use spaCy NER to find first entity in **{GPE, LOC, FAC}**.
   - Fallback: first noun in the sentence.

2. **Date**
   - Look for spaCy `DATE` entity and parse that text with **dateparser**.
   - Fallback: run **dateparser** over entire query with `PREFER_DATES_FROM="future"`.
   - Final fallback: **today**.

> This guarantees a date is always returned; if absent in the query, we default to today.

---

## 🔍 Example Cases

- “Show me **Paris** weather **next week**” → `location=Paris`, `date≈next week start` (normalized to a day; can be extended to ranges).
- “Forecast for **New Delhi** on **Saturday**” → date resolved to the next Saturday.
- “Weather near **Taj Mahal** **tomorrow**” → as shown above.

---

## ⚠️ Notes & Limitations

- The service currently returns a **single day** (same `dateFrom`/`dateTo`).  
  For ranges like “from Monday to Wednesday”, extend to detect two DATE spans and parse both.
- Ambiguous locations (“Springfield”) may need geocoding hints or country defaults.
- If you need multilingual parsing, install appropriate spaCy models and configure dateparser locales.

---

## 🔗 Backend Integration

Backend reads `NLP_SERVICE_URL` from `.env` (default `http://localhost:8000/parse`) and calls it in `utils/nlpService.js`. If the service is unavailable, backend falls back to treating the entire text as `locationInput` and uses **today** for date.

---

## 🧪 Testing

```bash
curl -X POST http://localhost:8000/parse   -H "Content-Type: application/json"   -d '{"query":"weather near Taj Mahal tomorrow"}'
```

---

## 🚀 Deployment

- Containerize with a small Python base image (e.g., `python:3.11-slim`).
- Pre-download spaCy model at build time.
- Expose `8000` behind a reverse proxy.
