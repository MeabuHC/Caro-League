//ALL THE GAME ROOM
import Game from "./game.js"; // Import the Game class

class GameMap {
  constructor() {
    this.games = new Map(); // Store games by ID
  }

  //Check if user has joined any game that are still in-progress and return that game
  getInProgressGameByUserId(userId) {
    for (const game of this.games.values()) {
      if (game.players.has(userId) && game.state === "in-progress") {
        return game;
      }
    }
    return null; // User is not in any game
  }

  //Check if user still inside any completed games
  getCompletedGameByUserId(userId) {
    for (const game of this.games.values()) {
      if (game.players.has(userId) && game.state === "completed") {
        return game;
      }
    }
    return null; // User is not in any game
  }

  addGame(gameObj) {
    if (!this.games.has(gameObj.id)) {
      this.games.set(gameObj.id, gameObj);
    }
  }

  removeGame(gameObj) {
    if (this.games.has(gameObj.id)) {
      console.log(gameObj.id + " room is removed!");
      this.games.delete(gameObj.id);
    }
  }

  updateGame(gameObj) {
    if (this.games.has(gameObj.id)) {
      this.games.set(gameObj.id, gameObj);
    }
  }
}

export default GameMap;
