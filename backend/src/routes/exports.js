import { Router } from "express";
import WeatherQuery from "../models/WeatherQuery.js";
import { XMLBuilder } from "fast-xml-parser";
import { createObjectCsvStringifier } from "csv-writer";
import { markdownTable as table } from "markdown-table";

const r = Router();

r.get("/export/:format", async (req, res) => {
  const items = await WeatherQuery.find().sort({ createdAt: -1 }).limit(100).lean();
  const format = (req.params.format || "").toLowerCase();

  if (format === "json") {
    res.type("application/json").send(JSON.stringify(items, null, 2));
  } else if (format === "xml") {
    const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
    res.type("application/xml").send(builder.build({ queries: { query: items } }));
  } else if (format === "csv") {
    const flat = items.map(i => ({
      id: i._id.toString(),
      locationInput: i.locationInput,
      normalizedName: i.normalizedLocation?.name || "",
      lat: i.normalizedLocation?.lat ?? "",
      lon: i.normalizedLocation?.lon ?? "",
      dateFrom: new Date(i.dateFrom).toISOString(),
      dateTo: new Date(i.dateTo).toISOString(),
      snapshotsCount: (i.snapshots || []).length
    }));
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "id", title: "id" },
        { id: "locationInput", title: "locationInput" },
        { id: "normalizedName", title: "normalizedName" },
        { id: "lat", title: "lat" },
        { id: "lon", title: "lon" },
        { id: "dateFrom", title: "dateFrom" },
        { id: "dateTo", title: "dateTo" },
        { id: "snapshotsCount", title: "snapshotsCount" }
      ]
    });
    const header = csvStringifier.getHeaderString();
    const body = csvStringifier.stringifyRecords(flat);
    res.type("text/csv").send(header + body);
  } else if (format === "md" || format === "markdown") {
    const rows = [["id", "location", "dateFrom", "dateTo", "snapshots"]];
    items.forEach(i => rows.push([
      i._id.toString(),
      i.normalizedLocation?.name || i.locationInput,
      new Date(i.dateFrom).toISOString().slice(0,10),
      new Date(i.dateTo).toISOString().slice(0,10),
      String(i.snapshots?.length || 0)
    ]));
    res.type("text/markdown").send(table(rows));
  } else {
    res.status(400).json({ error: "Unsupported format. Use json|xml|csv|md" });
  }
});

export default r;
