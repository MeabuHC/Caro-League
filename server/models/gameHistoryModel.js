import mongoose from "mongoose";

const gameHistorySchema = mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
  },
  moves: [
    {
      playerId: {
        type: String,
        required: true,
      },
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
      symbol: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  players: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true,
      },
      symbol: { type: String, required: true },
    },
  ],
  result: {
    winnerId: { type: String, required: false }, // Winner player ID or null if a draw
    reason: { type: String, required: true }, // e.g., "time expired", "victory", "draw"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("GameHistory", gameHistorySchema);
