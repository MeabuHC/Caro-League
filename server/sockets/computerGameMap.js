class ComputerGameMap {
  constructor() {
    this.games = new Map(); // Store games by ID
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
}

export default ComputerGameMap;
