import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  tier: {
    type: String,
    required: true,
    enum: [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Emerald",
      "Diamond",
      "Master",
    ],
  },
  divisions: {
    type: [String], // Array of divisions for the tier ['IV', 'III', 'II', 'I']
    required: true,
  },
  lpThreshold: {
    type: Number,
    required: true, // LP threshold for promotion
  },
  imageUrl: {
    type: String,
    required: true, // Image URL for this tier (e.g., "/img/ranks/bronze.png")
  },
  nextRankTier: {
    type: String, // Store the name of the next rank tier (e.g., "Silver")
  },
  previousRankTier: {
    type: String, // Store the name of the previous rank tier (e.g., "Bronze")
  },
});

// Create the model
const Ranking = mongoose.model("Ranking", rankingSchema);

export default Ranking;
