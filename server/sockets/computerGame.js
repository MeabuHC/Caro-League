import geminiService from "../utils/geminiAPI.js";

const rows = 15;
const columns = 20;

class ComputerGame {
  constructor(
    id,
    computerGameMap,
    mode = "0",
    time = "10",
    rank = "Bronze",
    playerSymbol = "X",
    playerStats,
    socket,
    caroNamespace
  ) {
    this.id = id;
    this.mode = mode; //0: basic, 1: open
    this.board = this.initializeBoard();
    this.turn = "X";
    this.playerSymbol = playerSymbol;
    this.turnTimer = null;
    this.turnDuration = time;
    this.remainingTime = this.turnDuration;
    this.gameResult = null;
    this.moveHistory = [];
    this.lpChanges = new Map(); //UserId -> LpChanges
    this.computerGameMap = computerGameMap;
    this.rank = rank;
    this.playerSymbol = playerSymbol;
    this.state = "in-progress";
    this.playerStats = playerStats;
    this.socket = socket;
    this.caroNamespace = caroNamespace;
    this.startTurnTimer();

    if (this.playerSymbol === "O") {
      this.computerMakeMove();
    }
  }

  initializeBoard() {
    return Array.from({ length: rows }, () => Array(columns).fill(null));
  }

  //Update game
  emitGameUpdate() {
    this.caroNamespace.to(this.id).emit("receive-game-object", this.toObject());
  }

  //isWin new version
  isWin2([x, y]) {
    return (
      this.checkHorizontal([x, y]) ||
      this.checkVertical([x, y]) ||
      this.checkDiagonalRight([x, y]) ||
      this.checkDiagonalLeft([x, y]) ||
      null
    );
  }

  // Check draw condition
  isDraw() {
    for (let row of this.board) {
      for (let cell of row) {
        if (!cell) return false;
      }
    }
    return true;
  }

  isPlayerTurn() {
    return this.playerSymbol === this.turn;
  }

  reconnectGame(socket) {
    console.log("Send reconnect game!");
    this.socket = socket; //Refresh socketId
    socket.join(this.id);
    this.caroNamespace
      .to(this.id)
      .emit("receive-computer-game-object", this.toObject());
  }

  // Make a move and reset the timer
  async makeMove([index_X, index_Y]) {
    if (this.state === "completed") {
      this.socket.emit("moveError", this.id, {
        success: false,
        message: "The game is over!",
      });
      return;
    }

    if (!this.isPlayerTurn()) {
      this.socket.emit("moveError", {
        success: false,
        message: "Not your turn!",
      });
      return;
    }

    this.board[index_X][index_Y] = this.turn;

    this.moveHistory.push({
      playerId: this.playerStats.userId._id.toString(),
      position: [index_X, index_Y],
      symbol: this.turn,
      boardState: JSON.parse(JSON.stringify(this.board)),
      remainingTime: this.remainingTime,
    });

    //Check win
    const pattern = this.isWin2([index_X, index_Y]);
    if (pattern) {
      // Update game status
      await this.endGame("win", pattern);
      return;
    }

    //If draw
    if (this.isDraw()) {
      // Update game status
      await this.endGame("draw");
      return;
    }

    this.switchTurn(); // Switch turn after a valid move

    // Emit move update to both players
    this.caroNamespace
      .to(this.id)
      .emit("receive-computer-game-object", this.toObject());

    await this.computerMakeMove();
  }

  // Switch turn and reset timer
  switchTurn() {
    this.turn = this.turn === "X" ? "O" : "X";
    this.remainingTime = this.turnDuration;
    this.startTurnTimer();
  }

  // Start or reset the turn timer
  startTurnTimer() {
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }

    this.remainingTime = this.turnDuration;
    let emitCounter = 0;

    this.turnTimer = setInterval(async () => {
      this.remainingTime -= 1;
      emitCounter += 1;

      // Emit game state every 3 seconds
      if (emitCounter === 3) {
        this.emitGameUpdate();
        emitCounter = 0; // Reset counter
      }

      // Timer runs out
      if (this.remainingTime <= 0) {
        //No move or only one move was made
        if (this.moveHistory.length <= 1) {
          await this.endGame("abort");
          return;
        }

        await this.endGame("timeout");
      }
    }, 1000);
  }

  //Set status to game over
  async endGame(type, pattern = null) {
    this.state = "completed";
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }

    //Abort
    if (type === "abort") {
      this.gameResult = {
        type: "abort",
        pattern: null,
        winner: null,
        reason: "by no move was made",
      };
    }
    //Win
    else if (type === "win") {
      this.gameResult = {
        type: "win",
        pattern: pattern,
        winner: this.turn === this.playerSymbol ? "You" : "Computer",
        reason: "by five in a row",
      };
    }
    //Draw
    else if (type === "draw") {
      // Emit draw event to both players
      this.gameResult = {
        type: "draw",
        pattern: null,
        winner: null,
        reason: "by out of move",
      };
    }
    //Timeout
    else if (type === "timeout") {
      this.gameResult = {
        type: "timeout",
        pattern: null,
        winner: this.turn === this.playerSymbol ? "Computer" : "You",
        reason: "by out of time",
      };
    }

    //Send update to player
    this.caroNamespace
      .to(this.id)
      .emit("receive-computer-game-object", this.toObject());

    this.computerGameMap.removeGame(this); //Remove the game after finished
  }

  //Update game
  emitGameUpdate() {
    this.caroNamespace
      .to(this.id)
      .emit("receive-computer-game-object", this.toObject());
  }

  // Computer move
  async computerMakeMove() {
    const result = await geminiService.getComputerMove({
      board: this.board,
      turn: this.turn,
      rank: this.rank,
      mode: this.mode,
      turnDuration: this.turnDuration,
    });

    //Return if timeout
    if (this.state === "completed") return;

    //Return if computer cant decide a valid move
    if (!result) {
      return;
    }

    const [index_X, index_Y] = result;

    this.board[index_X][index_Y] = this.turn;

    this.moveHistory.push({
      playerId: null,
      position: [index_X, index_Y],
      symbol: this.turn,
      boardState: JSON.parse(JSON.stringify(this.board)),
      remainingTime: this.remainingTime,
    });

    // Check win
    const pattern = this.isWin2([index_X, index_Y]);
    if (pattern) {
      await this.endGame("win", pattern);
      return;
    }

    // If draw
    if (this.isDraw()) {
      await this.endGame("draw");
      return;
    }

    this.switchTurn();

    this.caroNamespace
      .to(this.id)
      .emit("receive-computer-game-object", this.toObject());
  }

  checkHorizontal([x, y]) {
    let copyY = y; //Copy column index
    const sequence = [[x, y]]; //Start index
    let countBlockSide = 0;

    const currentSymbol = this.board[x][y];
    let count = 1; //Counting the starting one
    while (copyY + 1 < columns) {
      if (currentSymbol != this.board[x][copyY + 1]) {
        if (this.board[x][copyY + 1] != null) countBlockSide += 1;
        break;
      }
      sequence.push([x, copyY + 1]);
      count++;
      copyY++;
    }

    copyY = y; //Reset column index

    while (copyY - 1 >= 0) {
      if (currentSymbol != this.board[x][copyY - 1]) {
        if (this.board[x][copyY - 1] != null) countBlockSide += 1;
        break;
      }
      sequence.push([x, copyY - 1]);
      count++;
      copyY--;
    }

    if (this.mode == 0) {
      if (count != 5 || countBlockSide === 2) return null;
      else return sequence;
    }

    if (this.mode == 1) {
      if (count < 5) {
        return null;
      } else return sequence;
    }
  }

  checkVertical([x, y]) {
    let copyX = x; // Copy row index
    const sequence = [[x, y]]; // Start index
    let countBlockSide = 0; // Blocked sides counter

    const currentSymbol = this.board[x][y];
    let count = 1; // Counting the starting one

    // Check downwards
    while (copyX + 1 < rows) {
      if (currentSymbol !== this.board[copyX + 1][y]) {
        if (this.board[copyX + 1][y] != null) countBlockSide += 1; // Count blocked side
        break;
      }
      copyX++;
      sequence.push([copyX, y]);
      count++;
    }

    copyX = x; // Reset row index

    // Check upwards
    while (copyX - 1 >= 0) {
      if (currentSymbol !== this.board[copyX - 1][y]) {
        if (this.board[copyX - 1][y] != null) countBlockSide += 1; // Count blocked side
        break;
      }
      copyX--;
      sequence.push([copyX, y]);
      count++;
    }

    if (this.mode == 0) {
      if (count !== 5 || countBlockSide === 2)
        return null; // Traditional mode: must be exactly 5 and no blockage at both ends
      else return sequence; // Valid sequence
    }

    if (this.mode == 1) {
      if (count < 5) return null; // Open mode: must be at least 5
      else return sequence; // Valid sequence
    }
  }

  checkDiagonalRight([x, y]) {
    let copyX = x;
    let copyY = y;
    const sequence = [[x, y]]; // Start index
    let countBlockSide = 0; // Blocked sides counter

    const currentSymbol = this.board[x][y];
    let count = 1; // Counting the starting one

    // Check down-right
    while (copyX + 1 < rows && copyY + 1 < columns) {
      if (currentSymbol !== this.board[copyX + 1][copyY + 1]) {
        if (this.board[copyX + 1][copyY + 1] != null) countBlockSide += 1; // Count blocked side
        break;
      }
      copyX++;
      copyY++;
      sequence.push([copyX, copyY]);
      count++;
    }

    copyX = x; // Reset row index
    copyY = y; // Reset column index

    // Check up-left
    while (copyX - 1 >= 0 && copyY - 1 >= 0) {
      if (currentSymbol !== this.board[copyX - 1][copyY - 1]) {
        if (this.board[copyX - 1][copyY - 1] != null) countBlockSide += 1; // Count blocked side
        break;
      }
      copyX--;
      copyY--;
      sequence.push([copyX, copyY]);
      count++;
    }

    if (this.mode == 0) {
      if (count !== 5 || countBlockSide === 2)
        return null; // Traditional mode: must be exactly 5 and no blockage at both ends
      else return sequence; // Valid sequence
    }

    if (this.mode == 1) {
      if (count < 5) return null; // Open mode: must be at least 5
      else return sequence; // Valid sequence
    }
  }

  checkDiagonalLeft([x, y]) {
    let copyX = x;
    let copyY = y;
    const sequence = [[x, y]]; // Start index
    let countBlockSide = 0; // Blocked sides counter

    const currentSymbol = this.board[x][y];
    let count = 1; // Counting the starting one

    // Check down-left
    while (copyX + 1 < rows && copyY - 1 >= 0) {
      if (currentSymbol !== this.board[copyX + 1][copyY - 1]) {
        if (this.board[copyX + 1][copyY - 1] != null) countBlockSide += 1; // Count blocked side
        break;
      }
      copyX++;
      copyY--;
      sequence.push([copyX, copyY]);
      count++;
    }

    copyX = x; // Reset row index
    copyY = y; // Reset column index

    // Check up-right
    while (copyX - 1 >= 0 && copyY + 1 < columns) {
      if (currentSymbol !== this.board[copyX - 1][copyY + 1]) {
        if (this.board[copyX - 1][copyY + 1] != null) countBlockSide += 1; // Count blocked side
        break;
      }
      copyX--;
      copyY++;
      sequence.push([copyX, copyY]);
      count++;
    }

    if (this.mode == 0) {
      if (count !== 5 || countBlockSide === 2)
        return null; // Traditional mode: must be exactly 5 and no blockage at both ends
      else return sequence; // Valid sequence
    }

    if (this.mode == 1) {
      if (count < 5) return null; // Open mode: must be at least 5
      else return sequence; // Valid sequence
    }
  }

  // Convert to plain object for the client, including the timer, no socket
  toObject() {
    return {
      id: this.id,
      mode: this.mode,
      rank: this.rank,
      playerStats: this.playerStats,
      state: this.state,
      board: this.board,
      turn: this.turn,
      playerSymbol: this.playerSymbol,
      turnDuration: this.turnDuration,
      remainingTime: this.remainingTime,
      result: this.gameResult,
      moveHistory: this.moveHistory,
    };
  }
}

export default ComputerGame;
