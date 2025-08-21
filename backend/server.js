import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import weatherRouter from "./src/routes/weather.js";
import exportRouter from "./src/routes/exports.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS
const allowed = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean);
app.use(
  cors({
    origin: "*", // Allow all origins (for testing)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Routes
app.use("/api", weatherRouter);
app.use("/api", exportRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/weatherapp";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
