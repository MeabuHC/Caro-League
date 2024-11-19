import GameMap from "./gameMap.js"; // Import the GameMap class
import {
  getAccessTokenFromCookies,
  getTokenPayload,
} from "../utils/authUtils.js";
import GameStatsDAO from "../dao/gameStatsDAO.js";
import Game from "./game.js";
import { v4 as uuidv4 } from "uuid";
import seasonDAO from "../dao/seasonDAO.js";

// Saving game
let gameMap = new GameMap();

//--------------- NAMESPACE FOR MAIN METHOD --------------//
const Caro = {
  startGame: (gameId) => {
    const gameObj = gameMap.games.get(gameId);
    gameObj.startGame();
  },

  // Final function for finding a match
  findMatchMaking: async (socket, caroNamespace, playerStats) => {
    // Check if the user is already in a game
    const currentGame = gameMap.getGameByUserId(
      playerStats.userId._id.toString()
    );
    if (currentGame) {
      socket.emit("already-in-game", currentGame.id);
      return;
    }

    let gameId; // Variable to store the game

    // Find game based on logic
    gameId = await findGameId(caroNamespace);

    // Join the determined game and update game map
    let game = gameMap.games.get(gameId);
    if (!game) {
      const seasonId = (
        await seasonDAO.getCurrentActiveSeason()
      )._id.toString();
      game = new Game(gameId, seasonId, caroNamespace, gameMap);
      gameMap.addGame(game);
    }

    game.addPlayer(socket, playerStats);

    // Check condition to start the game
    if (isReadyToStartGame(gameId)) {
      console.log("Navigate game emitted!");
      caroNamespace.to(gameId).emit("navigate-game", gameId);
      Caro.startGame(gameId);
    }
    //Wait for another player
    else {
      waitMatch(gameId, socket);
    }
  },

  leaveMatchMaking: (socket, gameId, userId) => {
    const gameObj = gameMap.games.get(gameId);
    if (gameObj && gameObj.players.has(userId)) {
      gameObj.players.delete(userId);
      if (gameObj.players.size === 0) {
        gameMap.removeGame(gameObj);
      }
    }
    console.log(socket.id + " leaves " + gameId);
    socket.gameId = undefined;
    socket.leave(gameId); //Leave the room socket
  },

  //Send game object to requester
  sendInitialGame: (socket, gameId, userId) => {
    console.log("This runs again! " + socket.id);
    const gameObj = gameMap.games.get(gameId);
    if (gameObj) {
      const player = gameObj.players.get(userId);
      //Reconnect
      console.log("Current socket in room: ");
      console.log(player?.socket?.id);
      console.log("New socket id ");
      console.log(socket.id);
      if (player && !player.socket && gameObj.state === "in-progress") {
        socket.gameId = gameId;
        player.socket = socket;
        socket.join(gameId);
      }
      socket.emit("receive-game-object", gameObj.toObject());
    } else {
      socket.emit("receive-game-object", null);
    }
  },

  // Update the game board with the player's move
  updateGameBoard: async (gameId, userId, [index_X, index_Y]) => {
    const gameObj = gameMap.games.get(gameId);
    gameObj.makeMove([index_X, index_Y], userId);
  },

  handleDisconnect: (socket, caroNamespace, userId) => {
    const previousGame = gameMap.getGameByUserId(userId);
    //If having a game
    if (socket.gameId) {
      console.log(`${socket.id} disconnected from game ${socket.gameId}`);
      const currentGame = gameMap.games.get(socket.gameId);
      //In progress
      if (currentGame.state === "in-progress") {
        currentGame.disconnectPlayer(userId);
      }
    }
    //Done previous game but still in room
    else if (previousGame) {
      previousGame.removePlayer(userId);
    }
    //Nothing
    else {
      console.log(`${socket.id} disconnected with no active game.`);
    }
  },

  // Handle send rematch request
  handleSendRematchRequest: (socket, gameId) => {
    console.log("Send rematch!" + gameId);

    //Send to other socket except itself
    socket.to(gameId).emit("receive-rematch-request");
  },

  // Handle cancel rematch request
  handleCancelRematchRequest: (socket, gameId) => {
    console.log("Cancel rematch!" + gameId);

    //Send to other socket except itself
    socket.to(gameId).emit("cancel-rematch-request");
  },

  // Handle decline rematch request
  handleDeclineRematchRequest: (socket, gameId) => {
    console.log("Decline rematch!");
    //Send to other socket except itself
    socket.to(gameId).emit("decline-rematch-request");
  },

  // Handle accept rematch request
  handleAcceptRematchRequest: async (caroNamespace, gameId) => {
    console.log("Accept rematch!");
    try {
      const oldGame = gameMap.games.get(gameId);
      const newGameId = await createUniqueGameId(caroNamespace);
      const seasonId = (
        await seasonDAO.getCurrentActiveSeason()
      )._id.toString();
      const newGame = new Game(newGameId, seasonId, caroNamespace, gameMap);
      // Move all players to new game
      caroNamespace.in(oldGame.id).socketsJoin(newGameId);
      caroNamespace.in(newGameId).socketsLeave(oldGame.id);

      // Update game map to reflect changes
      gameMap.removeGame(oldGame);
      gameMap.addGame(newGame);

      // Prepare the new game and update player stats
      for (const [playerId, playerStats] of oldGame.players.entries()) {
        //Refetch
        const newStats = await GameStatsDAO.getGameStatsFromUserId(playerId);
        newStats.socket = playerStats.socket;

        newGame.addPlayer(newStats.socket, newStats);
      }

      // Notify both players in the game of the new game ID
      caroNamespace.to(newGameId).emit("new-game", newGameId);

      // Start the game in the new game
      Caro.startGame(newGameId, caroNamespace);
    } catch (error) {
      console.error("Error handling rematch request:", error);
      // Additional error handling can be added here
    }
  },
};

//---------- UTILS ------------------//

// Wait for another player to join
function waitMatch(game, socket) {
  console.log("Sending waiting signal!");
  socket.emit("wait-match-making", game);
}

// Check if it is okay to start the game
function isReadyToStartGame(gameName) {
  const currentGame = gameMap.games.get(gameName);
  return currentGame.players.size === 2 && currentGame.state === "waiting";
}

// Find a valid gameId
async function findGameId(caroNamespace) {
  // Iterate through existing games to find a game with one player
  for (const [gameId, gameObj] of gameMap.games) {
    if (gameObj.players.size === 1 && gameObj.state === "waiting") {
      return gameId; // Found a game with 1 person and game not started
    }
  }

  // If no game found, create a new game
  return await createUniqueGameId(caroNamespace); // Generate a new game ID
}

// Generate a random game ID
function generateGameId() {
  const gameId = uuidv4();
  return gameId;
}

// Return a unique game ID
async function createUniqueGameId(caroNamespace) {
  let gameId;
  let gameExists = true;

  while (gameExists) {
    gameId = generateGameId();
    gameExists = caroNamespace.adapter.rooms.has(gameId); // Check if the game exists
  }

  return gameId;
}

//-----------------  EXPORT HANDLER --------------//
const caroHandlers = async (socket, caroNamespace) => {
  try {
    console.log("New client connected: " + socket.id); // New player

    // Extract user ID from JWT token
    const token = getAccessTokenFromCookies(socket.request.headers.cookie);
    // if (!token) {
    //   console.log("Unauthorized!");
    //   socket.emit("unauthorized", {
    //     status: "fail",
    //     message: "jwt token missing or invalid!",
    //   });
    // }
    const decoded = await getTokenPayload(token);
    const userId = decoded.id;

    // Handle request player stats
    socket.on("get-player-stats", async () => {
      let playerStats = await GameStatsDAO.getGameStatsFromUserId(decoded.id); //Refetch again
      if (playerStats === null) {
        playerStats = await GameStatsDAO.createGameStatsForUserId(decoded.id);
      }
      socket.emit("receive-player-stats", playerStats);
    });

    // Handle finding a match
    socket.on("find-match-making", async () => {
      let playerStats = await GameStatsDAO.getGameStatsFromUserId(decoded.id); //Refetch again
      Caro.findMatchMaking(socket, caroNamespace, playerStats);
    });

    //Handle cancel match-making
    socket.on("leave-match-making", async (gameId) => {
      Caro.leaveMatchMaking(socket, gameId, userId);
    });

    //Handle sending game object
    socket.on("get-initial-game", (gameId) => {
      Caro.sendInitialGame(socket, gameId, userId);
    });

    // Sending player move to the other player
    socket.on("makeMove", async (gameId, index) => {
      await Caro.updateGameBoard(gameId, userId, index);
    });

    // Handle send rematch request
    socket.on("send-rematch-request", (gameId) => {
      Caro.handleSendRematchRequest(socket, gameId);
    });

    // Handle cancel rematch request
    socket.on("cancel-rematch-request", (gameId) => {
      Caro.handleCancelRematchRequest(socket, gameId);
    });

    // Handle decline rematch request
    socket.on("decline-rematch-request", (gameId) => {
      Caro.handleDeclineRematchRequest(socket, gameId);
    });

    // Handle accept rematch request
    socket.on("accept-rematch-request", (gameId) => {
      Caro.handleAcceptRematchRequest(caroNamespace, gameId);
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      Caro.handleDisconnect(socket, caroNamespace, userId);
    });
  } catch (error) {
    console.log(error);
  }
};

// Export the Caro handlers
export default caroHandlers;
