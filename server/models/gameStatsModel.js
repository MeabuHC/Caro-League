import mongoose from "mongoose";

const gameStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season", // Reference to the Season model
      required: true,
    },
    rankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ranking", // Reference to the Ranking model
      required: true,
      default: new mongoose.Types.ObjectId("67190d9b7d9cfb73241731de"), //Bronze default
    },
    currentDivision: {
      type: String,
      required: true,
      default: "IV", //Bronze IV
    },
    totalGames: {
      type: Number,
      default: 0,
    },
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    draws: {
      type: Number,
      default: 0,
    },
    lp: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

gameStatsSchema.index({ userId: 1, seasonId: 1 }, { unique: true });

const GameStats = mongoose.model("GameStats", gameStatsSchema);

export default GameStats;
