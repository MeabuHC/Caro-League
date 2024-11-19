//ALL THE GAME ROOM
import Game from "./game.js"; // Import the Game class

class GameMap {
  constructor() {
    this.games = new Map(); // Store games by ID
  }

  //Check if user has joined any game and return that game
  getGameByUserId(userId) {
    for (const game of this.games.values()) {
      if (game.players.has(userId)) {
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
