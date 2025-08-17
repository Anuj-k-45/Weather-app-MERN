from flask import Flask, request, jsonify
import spacy
from dateparser import parse as dateparse

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

@app.route("/parse", methods=["POST"])
def parse_query():
    data = request.json
    query = data.get("query", "")
    doc = nlp(query)

    # Extract location (NER)
    location = None
    for ent in doc.ents:
        if ent.label_ in ["GPE", "LOC", "FAC"]:
            location = ent.text
            break

    if not location:
        nouns = [token.text for token in doc if token.pos_ == "NOUN"]
        if nouns:
            location = nouns[0]

        # --- Extract Date ---
    dateFrom, dateTo = None, None

    # First try: spaCy DATE entity
    date_text = None
    for ent in doc.ents:
        if ent.label_ == "DATE":
            date_text = ent.text
            break

    # Second try: keyword search
    if not date_text:
        lowered = query.lower()
        for kw in ["today", "tomorrow", "yesterday",
                   "monday","tuesday","wednesday","thursday","friday","saturday","sunday"]:
            if kw in lowered:
                date_text = kw
                break

    # Final fallback: whole query
    if not date_text:
        date_text = query

    # Parse with dateparser
    d = dateparse(date_text, settings={"PREFER_DATES_FROM": "future"})
    if d:
        dateFrom = dateTo = d

    result = {
        "location": location,
        "dateFrom": dateFrom.strftime("%Y-%m-%d") if dateFrom else None,
        "dateTo": dateTo.strftime("%Y-%m-%d") if dateTo else None
    }
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=8000)
