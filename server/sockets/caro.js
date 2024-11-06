import RoomMap from "./roomMap.js"; // Import the RoomMap class
import { getTokenFromCookies, getTokenPayload } from "../utils/authUtils.js";
import GameStatsDAO from "../dao/gameStatsDAO.js";

// Saving room
let roomMap = new RoomMap();

//--------------- NAMESPACE FOR MAIN METHOD --------------//
const Caro = {
  startGame: (roomId) => {
    // Get the sockets in the room
    console.log("This is roomMap from startGame");
    console.log(roomMap);

    const roomObj = roomMap.rooms.get(roomId);

    // Reset the board in room
    roomObj.resetBoard();
    roomObj.startGame();
  },

  // Final function for finding a match
  findMatchMaking: async (socket, caroNamespace, playerStats) => {
    // Check if the user is already in a room
    if (roomMap.getRoomForUser(playerStats.userId._id)) {
      socket.emit("already-in-room");
      socket.disconnect();
      return;
    }

    let roomId; // Variable to store the room

    // Find room based on logic
    roomId = await findRoomId(caroNamespace);

    // Join the determined room and update room map
    console.log(socket.id + " joins: " + roomId);
    socket.join(roomId);
    roomMap.updateRoomMap(caroNamespace);
    roomMap.rooms.get(roomId).addPlayer(socket.id, playerStats);

    // Check condition to start the game
    if (isReadyToStartGame(roomId)) {
      Caro.startGame(roomId);
    }
    //Wait for another player
    else {
      waitMatch(roomId, socket);
    }
  },

  //Cancel requester quick play
  leaveRoom: (socket, caroNamespace, roomId) => {
    console.log(socket.id + " leaves " + roomId);
    socket.leave(roomId);
    roomMap.updateRoomMap(caroNamespace);
  },

  //Send room object to requester
  sendRoomObject: (socket, roomId) => {
    const roomObj = roomMap.rooms.get(roomId);
    socket.emit("receive-room-object", roomObj?.toObject());
  },

  // Update the room board with the player's move
  updateRoomBoard: async (socket, [index_X, index_Y]) => {
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    roomObj.makeMove([index_X, index_Y], socket);
  },

  // Handle socket disconnection
  handleDisconnect: (socket, caroNamespace) => {
    console.log(`${socket.id} disconnected!`);

    // Get room by socket
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    if (roomObj) {
      const players = roomObj.players;

      // If the game has started and there are 2 players in the room
      if (players.size === 2) {
        const loserStats = players.get(socket.id);
        const winnerStats = [...players].find(([id]) => id !== socket.id)[1];

        // The game started but hasn't ended
        if (roomObj.isGameStarted && !roomObj.isGameOver) {
          // Update stats and notify the remaining player
          GameStatsDAO.updatePlayerStats(winnerStats, loserStats, "result", 55);
          socket.to(roomObj.id).emit("opponent-disconnect");
        } else {
          // If the game has ended
          socket.to(roomObj.id).emit("opponent-leave-room");
        }
      }

      // Remove the disconnected player from the room
      players.delete(socket.id);
    }

    // Update the roomMap after disconnection
    roomMap.updateRoomMap(caroNamespace);
  },

  // Handle receive rematch request
  handleRematchRequest: (socket) => {
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    socket
      .to(roomObj.id)
      .emit("receive-rematch-request", roomObj.players.get(socket.id).username);
  },

  // Handle accept rematch request
  handleAcceptRematch: (socket, caroNamespace) => {
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    Caro.startGame(roomObj.id, caroNamespace);
  },
};

//---------- UTILS ------------------//

// Wait for another player to join
function waitMatch(room, socket) {
  console.log("Sending waiting signal!");
  socket.emit("wait-match-making", room);
}

// Check if it is okay to start the game
function isReadyToStartGame(roomName) {
  const currentRoom = roomMap.rooms.get(roomName);
  return currentRoom.players.size === 2 && !currentRoom.isGameStarted;
}

// Find a valid roomId
async function findRoomId(caroNamespace) {
  // Iterate through existing rooms to find a room with one player
  for (const [roomId, roomObj] of roomMap.rooms) {
    if (
      roomObj.players.size === 1 &&
      roomObj.isGameOver === false &&
      roomObj.isGameStarted === false
    ) {
      return roomId; // Found a room with 1 person and game not started
    }
  }

  // If no room found, create a new room
  return await createUniqueRoomId(caroNamespace); // Generate a new room ID
}

// Generate a random room ID
function generateRoomId() {
  const randomNumber = Math.floor(Math.random() * 10000); // Adjust the range as needed
  return `room${randomNumber}`;
}

// Return a unique room ID
async function createUniqueRoomId(caroNamespace) {
  let roomId;
  let roomExists = true;

  while (roomExists) {
    roomId = generateRoomId();
    roomExists = caroNamespace.adapter.rooms.has(roomId); // Check if the room exists
  }

  return roomId;
}

//-----------------  EXPORT HANDLER --------------//
const caroHandlers = async (socket, caroNamespace) => {
  console.log("New client connected: " + socket.id); // New player

  // Extract user ID from JWT token
  const token = getTokenFromCookies(socket.request.headers.cookie);
  const decoded = await getTokenPayload(token);

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

  //Handle cancel match
  socket.on("leave-room", (roomId) => {
    Caro.leaveRoom(socket, caroNamespace, roomId);
  });

  //Handle sending room object
  socket.on("get-room-object", (roomId) => {
    Caro.sendRoomObject(socket, roomId);
  });

  // Sending player move to the other player
  socket.on("makeMove", async (index) => {
    await Caro.updateRoomBoard(socket, index);
  });

  // Handle rematch request
  socket.on("rematch-request", () => {
    Caro.handleRematchRequest(socket);
  });

  // Handle accept rematch request
  socket.on("accept-rematch", () => {
    Caro.handleAcceptRematch(socket, caroNamespace);
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    Caro.handleDisconnect(socket, caroNamespace);
  });
};

// Export the Caro handlers
export default caroHandlers;
