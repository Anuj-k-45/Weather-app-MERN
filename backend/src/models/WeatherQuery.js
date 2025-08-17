import mongoose from "mongoose";

const WeatherSnapshotSchema = new mongoose.Schema({
  at: { type: Date, required: true },
  tempC: Number,
  weather: String
}, { _id: false });

const WeatherQuerySchema = new mongoose.Schema({
  locationInput: { type: String, required: true },
  normalizedLocation: {
    name: String,
    lat: Number,
    lon: Number
  },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  snapshots: [WeatherSnapshotSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("WeatherQuery", WeatherQuerySchema);
