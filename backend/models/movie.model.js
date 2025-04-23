import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String ,enum: ["available", "not available"], default: "available" },
    cost: { type: Number, default: 1 },
    procurementDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
