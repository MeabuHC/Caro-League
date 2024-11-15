import GameHistory from "../models/gameHistoryModel.js";

class GameHistoryDAO {
  // Method to create a new game history record
  async createGameHistory(
    gameId,
    seasonId,
    moveHistory,
    players,
    result,
    createdAt,
    lpChanges,
    turnDuration
  ) {
    try {
      // Create a new GameHistory instance
      const gameHistory = new GameHistory({
        gameId,
        seasonId,
        moveHistory,
        players,
        result,
        createdAt,
        lpChanges,
        turnDuration,
      });

      // Save the game history document to the database
      const savedGameHistory = await gameHistory.save();

      return savedGameHistory; // Return the saved record
    } catch (error) {
      console.error("Error creating game history:", error);
      throw new Error("Failed to create game history");
    }
  }

  async getGameHistoryByGameId(gameId) {
    try {
      const gameHistory = await GameHistory.findOne({ gameId }).populate({
        path: "players",
        populate: [{ path: "userId" }, { path: "rankId" }],
      });
      return gameHistory;
    } catch (error) {
      console.error("Error retrieving game history:", error);
      throw new Error("Failed to retrieve game history");
    }
  }
}

export default new GameHistoryDAO();
