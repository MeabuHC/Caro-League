//GAME ROOM

class Room {
  constructor(id) {
    this.id = id;
    this.players = new Map(); // Stores players with socket IDs as keys
    this.isGameStarted = false;
    this.isGameOver = false;
    this.board = this.initializeBoard();
    this.turn = "X"; // Track which player turn
    this.symbols = new Map(); // To store the symbols assigned to players (X or O)
  }

  initializeBoard() {
    return new Array(9).fill(undefined); // 9 for a 3x3 board, adjust for Gomoku size
  }

  addPlayer(socketId, player) {
    this.players.set(socketId, player); // Add player with socket ID as key
  }

  assignSymbol(socketId, symbol) {
    this.symbols.set(socketId, symbol);
  }

  resetBoard() {
    this.board = this.initializeBoard(); // Reset the board for rematch
    this.isGameOver = false;
    this.isGameStarted = false;
    this.turn = "X"; // Reset the turn tracking
    this.symbols = new Map(); //Reset turn assignment
  }

  switchTurn() {
    this.turn = this.turn === "X" ? "O" : "X"; // Alternate between X and O
  }

  makeMove(index, symbol, socketId) {
    if (this.isGameOver === true) throw new Error("The game has over!"); //Game over
    if (this.isGameStarted === false)
      throw new Error("The game has not started!"); //Game not started
    if (!this.isPlayerTurn(socketId)) throw new Error("Not user turn!"); //Not user turn
    this.board[index] = this.turn;
    this.switchTurn();
  }

  isPlayerTurn(socketId) {
    return this.symbols.get(socketId) === this.turn;
  }

  //Check win condition
  isWin() {
    // Array of all possible win conditions
    let winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winConditions.length; i++) {
      let v0 = this.board[winConditions[i][0]];
      let v1 = this.board[winConditions[i][1]];
      let v2 = this.board[winConditions[i][2]];

      if (v0 && v0 === v1 && v1 === v2) {
        return [
          true,
          [winConditions[i][0], winConditions[i][1], winConditions[i][2]],
        ];
      }
    }

    return [false, null];
  }

  // Check draw condition
  isDraw() {
    let isDraw = true;

    for (const element of this.board) {
      if (element === undefined) {
        isDraw = false;
        break; // Exit the loop if an undefined element is found
      }
    }

    return isDraw;
  }

  //Start the game
  startGame(startingSymbol) {
    this.isGameStarted = true;
    this.isGameOver = false;

    console.log("Run start game!");

    // Get the player socket IDs
    const playerSocketIds = Array.from(this.players.keys());

    // Randomly assign the first turn to either "X" or "O"
    const randomTurn = Math.random() > 0.5 ? "X" : "O";
    this.symbols.set(playerSocketIds[0], randomTurn);
    this.symbols.set(playerSocketIds[1], randomTurn === "X" ? "O" : "X");

    // Set the starting turn
    this.turn = startingSymbol;
  }

  //Set status to game over
  endGame() {
    this.isGameStarted = false;
    this.isGameOver = true;
  }

  //Convert Map to object because client cant receive map
  toObject() {
    return {
      id: this.id,
      players: Object.fromEntries(this.players),
      isGameStarted: this.isGameStarted,
      isGameOver: this.isGameOver,
      board: this.board,
      turn: this.turn,
      symbols: Object.fromEntries(this.symbols),
    };
  }
}

export default Room;
