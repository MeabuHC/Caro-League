import GameStatsDAO from "../dao/gameStatsDAO.js";

const rows = 15;
const columns = 20;
class Game {
  constructor(id, caroNamespace) {
    this.id = id;
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
  }

  initializeBoard() {
    return Array.from({ length: rows }, () => Array(columns).fill(null));
  }

  addPlayer(socket, player) {
    this.players.size;
    player.socket = socket;
    this.players.set(player.userId._id.toString(), player); // Add player with socket ID as key
  }

  removePlayer(playerId) {
    if (this.players.has(playerId)) {
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
      userSocket.emit("moveError", {
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

    //Check win
    const [isWin, pattern] = this.isWin();
    if (isWin) {
      // Update game status
      clearInterval(this.turnTimer);
      this.endGame();

      // Update stats for winnerStats and loserStats
      const winnerStats = this.players.get(userId);
      const loserStats = [...this.players].find(([id]) => id !== userId)[1];
      await GameStatsDAO.updatePlayerStats(
        winnerStats,
        loserStats,
        "result",
        55
      );

      this.gameResult = {
        type: "win",
        pattern: pattern,
        winner: winnerStats.userId.username,
        reason: "five in a row",
      };

      // Emit move update to both players
      this.caroNamespace
        .to(this.id)
        .emit("receive-game-object", this.toObject());

      // Emit 'winner' event to the current player
      this.caroNamespace.to(this.id).emit("gameResult", this.gameResult);

      return;
    }
    if (this.isDraw()) {
      //Update game status
      this.endGame();
      clearInterval(this.turnTimer);

      // Update stats for both players
      const playerArray = Array.from(this.players.values());
      await GameStatsDAO.updatePlayerStats(
        playerArray[0],
        playerArray[1],
        "draw",
        0
      );

      // Emit draw event to both players
      this.gameResult = {
        type: "draw",
        pattern: null,
        reason: "out of move",
      };

      // Update game status
      this.endGame();
      // Emit move update to both players
      this.caroNamespace
        .to(this.id)
        .emit("receive-game-object", this.toObject());
      this.caroNamespace.to(this.id).emit("draw", this.gameResult);

      return;
    }

    this.switchTurn(); // Switch turn after a valid move
    // Emit move update to both players
    this.caroNamespace.to(this.id).emit("receive-game-object", this.toObject());
  }

  isPlayerTurn(userId) {
    return this.symbols.get(userId) === this.turn;
  }

  // Check win condition for 5 in a row
  isWin() {
    const directions = [
      [0, 1], // Horizontal
      [1, 0], // Vertical
      [1, 1], // Diagonal down-right
      [1, -1], // Diagonal down-left
    ];

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        const currentSymbol = this.board[x][y];
        if (!currentSymbol) continue;

        for (const [dx, dy] of directions) {
          let count = 1;
          let nx = x + dx;
          let ny = y + dy;
          const sequence = [[x, y]]; // Start with the current cell in the sequence

          while (
            nx >= 0 &&
            nx < rows &&
            ny >= 0 &&
            ny < columns &&
            this.board[nx][ny] === currentSymbol
          ) {
            sequence.push([nx, ny]);
            count++;
            if (count === 5) {
              return [true, sequence]; // Return true and the full sequence
            }
            nx += dx;
            ny += dy;
          }
        }
      }
    }
    return [false, null];
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

  // Start the game and initialize the turn timer
  startGame() {
    this.state = "game-started";
    const playerIds = Array.from(this.players.keys());
    const randomTurn = Math.random() > 0.5 ? "X" : "O";
    this.symbols.set(playerIds[0], randomTurn);
    this.symbols.set(playerIds[1], randomTurn === "X" ? "O" : "X");
    this.turn = "X";
    this.startTurnTimer(); // Start the turn timer

    // Send game object and their corresponding userId
    // console.log("Sending start-match signal");
    // console.log(this);

    // this.caroNamespace
    //   .to(this.players.get(playerIds[0]).socket.id)
    //   .emit("start-match", this.toObject(), playerIds[0]);
    // this.caroNamespace
    //   .to(this.players.get(playerIds[1]).socket.id)
    //   .emit("start-match", this.toObject(), playerIds[1]);
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
      clearInterval(this.turnTimer); // Clear prev timer
    }

    this.remainingTime = this.turnDuration;
    this.turnTimer = setInterval(async () => {
      this.remainingTime -= 1;

      // Timer runs out
      if (this.remainingTime <= 0) {
        // End game
        this.endGame();

        // Update stats for winner and loser
        await GameStatsDAO.updatePlayerStats(
          winnerStats,
          loserStats,
          "result",
          55
        );

        this.gameResult = {
          type: "timeout",
          pattern: null,
          winner: winnerStats.userId.username,
          reason: "out of time",
        };

        this.caroNamespace
          .to(this.id)
          .emit("receive-game-object", this.toObject());
        this.caroNamespace.to(this.id).emit("gameResult", this.gameResult);
      }
    }, 1000);
  }

  //Set status to game over
  endGame() {
    this.state = "completed";
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
    }
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
      remainingTime: this.remainingTime, // Add remaining time to client data
    };
  }
}

export default Game;
