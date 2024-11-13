import mongoose from "mongoose";
const { Schema } = mongoose;

//Player schema
const playerSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  rankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ranking",
    required: true,
  },
  currentDivision: {
    type: String,
    default: "IV", // Bronze IV
  },
  lp: {
    type: Number,
    default: 0,
  },
  symbol: { type: String, required: true },
});

// Define the move object inside moveHistory
const moveSchema = new Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  symbol: { type: String, required: true },
  boardState: { type: [[String]], required: true },
  remainingTime: { type: Number, required: true },
});

// Define the result schema
const resultSchema = new Schema({
  type: { type: String, required: true },
  pattern: { type: [[Number]], default: [] },
  winner: { type: String },
  reason: { type: String, required: true },
});

// Define the main GameHistory schema
const gameHistorySchema = new Schema({
  gameId: { type: String, required: true, unique: true },
  seasonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Season",
    required: true,
  },
  players: [playerSchema],
  moveHistory: [moveSchema],
  result: resultSchema,
  lpChanges: {
    win: { type: Number, required: true },
    lose: { type: Number, required: true },
    draw: { type: Number, required: true },
  },
  createdAt: { type: Date, required: true },
});

// Create the GameHistory model
const GameHistory = mongoose.model("GameHistory", gameHistorySchema);

export default GameHistory;
