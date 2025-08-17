import { Router } from "express";
import {
  getCurrentWeather,
  createQuery,
  listQueries,
  getQuery,
  updateQuery,
  deleteQuery
} from "../controllers/weatherController.js";

const r = Router();

// Tech Assessment 1 endpoints (current + 5-day forecast)
r.get("/weather/current", getCurrentWeather);

// Tech Assessment 2 CRUD
r.post("/queries", createQuery);   // CREATE
r.get("/queries", listQueries);    // READ all
r.get("/queries/:id", getQuery);   // READ one
r.put("/queries/:id", updateQuery);// UPDATE
r.delete("/queries/:id", deleteQuery); // DELETE

export default r;
