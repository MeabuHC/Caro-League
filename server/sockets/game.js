import gameHistoryDAO from "../dao/gameHistoryDAO.js";
import GameStatsDAO from "../dao/gameStatsDAO.js";
import seasonDAO from "../dao/seasonDAO.js";

const rows = 15;
const columns = 20;
class Game {
  constructor(id, seasonId, caroNamespace) {
    this.id = id;
    this.seasonId = seasonId;
    this.caroNamespace = caroNamespace;
    this.players = new Map(); //UserId -> UserStats + (Socket)
    this.state = "waiting";
    this.board = this.initializeBoard();
    this.turn = "X";
    this.symbols = new Map(); //UserId -> Symbols
    this.turnTimer = null;
    this.turnDuration = 20;
    this.remainingTime = this.turnDuration;
    this.gameResult = null;
    this.moveHistory = [];
    this.startDate = null;
    this.lpChanges = null;
  }

  initializeBoard() {
    return Array.from({ length: rows }, () => Array(columns).fill(null));
  }

  addPlayer(socket, player) {
    //If this players is not inside the room
    let oldPlayer = this.players.has(player.userId._id.toString());
    if (!oldPlayer) {
      console.log(socket.id + " joins: " + this.id);
      socket.join(this.id);
      socket.gameId = this.id; //Assign gameId to socket
      player.socket = socket;
      this.players.set(player.userId._id.toString(), player); // Add player with socket ID as key
    }
  }

  disconnectPlayer(playerId) {
    if (this.players.has(playerId)) {
      console.log(this.players.get(playerId).socket.id + " is removed!");
      this.players.get(playerId).socket = undefined;
    }
  }

  // Switch turn and reset timer
  switchTurn() {
    this.turn = this.turn === "X" ? "O" : "X";
    this.remainingTime = this.turnDuration;
    this.startTurnTimer();
  }

  // Make a move and reset the timer
  async makeMove([index_X, index_Y], userId) {
    const userSocket = this.players.get(userId).socket;
    if (this.state === "completed") {
      userSocket.emit("moveError", this.id, {
        success: false,
        message: "The game is over!",
      });
      return;
    }

    if (!this.isPlayerTurn(userId)) {
      userSocket.emit("moveError", {
        success: false,
        message: "Not your turn!",
      });
      return;
    }

    this.board[index_X][index_Y] = this.turn;

    this.moveHistory.push({
      playerId: userId,
      position: [index_X, index_Y],
      symbol: this.turn,
      boardState: JSON.parse(JSON.stringify(this.board)),
      remainingTime: this.remainingTime,
    });

    //Check win
    const pattern = this.isWin2([index_X, index_Y]);
    if (pattern) {
      // Update stats for winnerStats and loserStats
      const winnerStats = this.players.get(userId);
      const loserStats = [...this.players].find(([id]) => id !== userId)[1];

      // Update game status
      await this.endGame("win", winnerStats, loserStats, pattern);
      return;
    }

    //If draw
    if (this.isDraw()) {
      // Update stats for both players
      const playerArray = Array.from(this.players.values());

      //Update game status
      await this.endGame("draw", playerArray[0], playerArray[1]);
      return;
    }

    this.switchTurn(); // Switch turn after a valid move
    // Emit move update to both players
    this.caroNamespace.to(this.id).emit("receive-game-object", this.toObject());
  }

  isPlayerTurn(userId) {
    return this.symbols.get(userId) === this.turn;
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

  //Calculate LP changes for win, lose and draw
  calculateLpChanges() {
    this.lpChanges = {
      win: 55,
      lose: -55,
      draw: 1,
    };
  }

  // Start the game and initialize the turn timer
  startGame() {
    this.state = "in-progress";
    this.startDate = new Date();
    const playerIds = Array.from(this.players.keys());
    const randomTurn = Math.random() > 0.5 ? "X" : "O";
    this.symbols.set(playerIds[0], randomTurn);
    this.symbols.set(playerIds[1], randomTurn === "X" ? "O" : "X");
    this.turn = "X";
    this.calculateLpChanges();
    this.startTurnTimer(); // Start the turn timer

    console.log("This is season id" + this.seasonId);
  }

  // Start or reset the turn timer
  startTurnTimer() {
    const winnerSymbol = Array.from(this.symbols.values()).find(
      (symbol) => symbol !== this.turn
    );

    const winnerId = [...this.symbols].find(
      ([userId, symbol]) => symbol === winnerSymbol
    )?.[0];

    // Find the winner and loser stats
    const winnerStats = this.players.get(winnerId);
    const loserStats = [...this.players].find(
      ([userId]) => userId !== winnerId
    )?.[1];

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

        await this.endGame("timeout", winnerStats, loserStats);
      }
    }, 1000);
  }

  //Update game
  emitGameUpdate() {
    this.caroNamespace.to(this.id).emit("receive-game-object", this.toObject());
  }

  //Set status to game over
  async endGame(type, winnerStats, loserStats, pattern = null) {
    this.state = "completed";
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }

    //Clear socket game id
    for (const player of this.players.values()) {
      if (player.socket && player.socket.gameId) {
        player.socket.gameId = undefined;
      }
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
      await GameStatsDAO.updatePlayerStats(
        winnerStats,
        loserStats,
        type,
        this.lpChanges
      );

      this.gameResult = {
        type: "win",
        pattern: pattern,
        winner: winnerStats.userId.username,
        reason: "by five in a row",
      };
    }
    //Draw
    else if (type === "draw") {
      await GameStatsDAO.updatePlayerStats(
        winnerStats,
        loserStats,
        type,
        this.lpChanges
      );

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
      // Update stats for winner and loser
      await GameStatsDAO.updatePlayerStats(
        winnerStats,
        loserStats,
        "win",
        this.lpChanges
      );

      this.gameResult = {
        type: "timeout",
        pattern: null,
        winner: winnerStats.userId.username,
        reason: "by out of time",
      };
    }

    if (type != "abort") {
      //Take out players stats
      const newPlayerStats = Array.from(this.players.values()).map(
        (player) => ({
          userId: player.userId._id,
          rankId: player.rankId._id,
          currentDivision: player.currentDivision,
          lp: player.lp,
          symbol: this.symbols.get(player.userId._id.toString()),
        })
      );

      //Save game to database
      await gameHistoryDAO.createGameHistory(
        this.id,
        this.seasonId,
        this.moveHistory,
        newPlayerStats,
        this.gameResult,
        this.startDate,
        this.lpChanges,
        this.turnDuration
      );
    }

    //Send update to player
    this.caroNamespace.to(this.id).emit("receive-game-object", this.toObject());

    console.log(this.startDate);
    console.log(this.moveHistory);
  }

  // Convert to plain object for the client, including the timer, no socket
  toObject() {
    return {
      id: this.id,
      players: Object.fromEntries(
        // Remove the socket and format each player data correctly
        Array.from(this.players.entries()).map(([userId, player]) => [
          userId,
          player._doc,
        ])
      ),
      state: this.state,
      board: this.board,
      turn: this.turn,
      symbols: Object.fromEntries(this.symbols),
      turnDuration: this.turnDuration,
      remainingTime: this.remainingTime,
      result: this.gameResult,
      moveHistory: this.moveHistory,
    };
  }

  checkHorizontal([x, y]) {
    let copyY = y; //Copy column index
    const sequence = [[x, y]]; //Start index

    const currentSymbol = this.board[x][y];
    let count = 1; //Counting the starting one
    while (copyY + 1 < columns) {
      if (currentSymbol != this.board[x][copyY + 1]) break;
      sequence.push([x, copyY + 1]);
      count++;
      copyY++;
    }

    copyY = y; //Reset column index

    while (copyY - 1 >= 0) {
      if (currentSymbol != this.board[x][copyY - 1]) break;
      sequence.push([x, copyY - 1]);
      count++;
      copyY--;
    }

    if (count < 5) {
      return null;
    } else return sequence;
  }

  checkVertical([x, y]) {
    let copyX = x; // Copy row index
    const sequence = [[x, y]]; // Start index

    const currentSymbol = this.board[x][y];
    let count = 1; // Counting the starting one

    // Check downwards
    while (copyX + 1 < rows) {
      if (currentSymbol !== this.board[copyX + 1][y]) break;
      copyX++;
      sequence.push([copyX, y]);
      count++;
      if (count === 5) {
        return sequence; // Return the sequence if 5 in a row is found
      }
    }

    copyX = x; // Reset row index

    // Check upwards
    while (copyX - 1 >= 0) {
      if (currentSymbol !== this.board[copyX - 1][y]) break;
      copyX--;
      sequence.push([copyX, y]);
      count++;
      if (count === 5) {
        return sequence; // Return the sequence if 5 in a row is found
      }
    }

    // If less than 5 in a row, return false
    return count >= 5 ? sequence : null;
  }

  checkDiagonalRight([x, y]) {
    let copyX = x;
    let copyY = y;
    const sequence = [[x, y]]; // Start index

    const currentSymbol = this.board[x][y];
    let count = 1; // Counting the starting one

    // Check down-right
    while (copyX + 1 < rows && copyY + 1 < columns) {
      if (currentSymbol !== this.board[copyX + 1][copyY + 1]) break;
      copyX++;
      copyY++;
      sequence.push([copyX, copyY]);
      count++;
      if (count === 5) {
        return sequence; // Return the sequence if 5 in a row is found
      }
    }

    copyX = x; // Reset row index
    copyY = y; // Reset column index

    // Check up-left
    while (copyX - 1 >= 0 && copyY - 1 >= 0) {
      if (currentSymbol !== this.board[copyX - 1][copyY - 1]) break;
      copyX--;
      copyY--;
      sequence.push([copyX, copyY]);
      count++;
      if (count === 5) {
        return sequence; // Return the sequence if 5 in a row is found
      }
    }

    // If less than 5 in a row, return false
    return count >= 5 ? sequence : null;
  }

  checkDiagonalLeft([x, y]) {
    let copyX = x;
    let copyY = y;
    const sequence = [[x, y]]; // Start index

    const currentSymbol = this.board[x][y];
    let count = 1; // Counting the starting one

    // Check down-left
    while (copyX + 1 < rows && copyY - 1 >= 0) {
      if (currentSymbol !== this.board[copyX + 1][copyY - 1]) break;
      copyX++;
      copyY--;
      sequence.push([copyX, copyY]);
      count++;
      if (count === 5) {
        return sequence; // Return the sequence if 5 in a row is found
      }
    }

    copyX = x; // Reset row index
    copyY = y; // Reset column index

    // Check up-right
    while (copyX - 1 >= 0 && copyY + 1 < columns) {
      if (currentSymbol !== this.board[copyX - 1][copyY + 1]) break;
      copyX--;
      copyY++;
      sequence.push([copyX, copyY]);
      count++;
      if (count === 5) {
        return sequence; // Return the sequence if 5 in a row is found
      }
    }

    // If less than 5 in a row, return false
    return count >= 5 ? sequence : null;
  }
}

export default Game;
