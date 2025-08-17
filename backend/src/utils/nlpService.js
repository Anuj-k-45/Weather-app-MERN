import fetch from "node-fetch";

export async function parseWithNlp(text) {
  try {
    const res = await fetch("http://localhost:8000/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text }),
    });
    return await res.json();
  } catch (err) {
    console.error("NLP service error:", err.message);
    return { location: text, dateFrom: null, dateTo: null };
  }
}
