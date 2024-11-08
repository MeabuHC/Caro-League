//ALL THE GAME ROOM
import Game from "./game.js"; // Import the Game class

class GameMap {
  constructor() {
    this.games = new Map(); // Store games by ID
  }

  //Check if user has joined any game and return that game
  getGameForUser(userId) {
    for (const game of this.games.values()) {
      for (const playerStats of game.players.values()) {
        if (playerStats.userId._id === userId) {
          return game; // User is already in a game
        }
      }
    }
    return null; // User is not in any game
  }

  //Find user with socket_id
  getGameByUserId(userId) {
    const gameObjArray = Array.from(this.games.values());
    for (let gameObj of gameObjArray) {
      const players = gameObj.players;
      if (players.has(userId)) {
        return gameObj;
      }
    }
    return null;
  }

  addGame(gameObj) {
    if (!this.games.has(gameObj.id)) {
      this.games.set(gameObj.id, gameObj);
    }
  }

  removeGame(gameObj) {
    if (this.games.has(gameObj.id)) {
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
