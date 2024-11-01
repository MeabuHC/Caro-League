import RoomMap from "./roomMap.js"; // Import the RoomMap class
import { getTokenFromCookies, getTokenPayload } from "../utils/authUtils.js";
import userDAO from "../dao/userDAO.js";
// Saving room
let roomMap = new RoomMap();

//--------------- NAMESPACE FOR MAIN METHOD --------------//
const Caro = {
  startGame: (roomId, caroNamespace) => {
    // Get the sockets in the room
    console.log("This is roomMap from startGame");
    console.log(roomMap);

    const roomObj = roomMap.rooms.get(roomId);
    const socketsInRoom = Array.from(roomObj.players.keys());

    // Reset the board in room
    console.log("Run reset board!");
    roomObj.resetBoard();
    roomObj.startGame("X");

    // Emit to every player in the room
    console.log("Sending start-match signal");
    caroNamespace.to(roomObj.id).emit("start-match", roomObj.toObject());
  },

  // Final function for finding a match
  findMatchMaking: async (socket, caroNamespace, user) => {
    // Check if the user is already in a room
    if (roomMap.getRoomForUser(user.id)) {
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
    roomMap.rooms.get(roomId).addPlayer(socket.id, user);

    // Check condition to start the game
    if (isReadyToStartGame(roomId)) {
      Caro.startGame(roomId, caroNamespace);
    }
    //Wait for another player
    else {
      waitMatch(roomId, socket);
    }
  },

  cancelMatchMaking: (socket, caroNamespace, roomId) => {
    console.log(socket.id + " leaves " + roomId);
    socket.leave(roomId);
    roomMap.updateRoomMap(caroNamespace);
  },
  // Update the room board with the player's move
  updateRoomBoard: async (socket, caroNamespace, index) => {
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    const players = roomObj.players;
    const symbol = roomObj.turn;

    roomObj.makeMove(index, socket.id);

    // Emit move update to both players
    caroNamespace
      .to(roomObj.id)
      .emit("receiveMove", symbol, index, roomObj.toObject());

    // Check if there's a win or a draw
    const isWinObj = roomObj.isWin();
    if (isWinObj[0]) {
      const winner = players.get(socket.id);
      const loser = [...players].find(([id]) => id !== socket.id)[1];

      // Emit 'winner' event to the current player
      socket.emit("winner", isWinObj[1]);

      // Emit 'loser' event to the other player
      socket.to(roomObj.id).emit("loser", isWinObj[1]);

      // Update stats for winner and loser
      await updatePlayerStats(winner, loser, "result", 5);

      // Update room status
      roomObj.endGame();
    } else if (roomObj.isDraw()) {
      // Emit draw event to both players
      const playerArray = Array.from(players.values());
      caroNamespace.to(roomObj.id).emit("draw");

      // Update stats for both players
      await updatePlayerStats(playerArray[0], playerArray[1], "draw", 0);

      // Update room status
      roomObj.endGame();
    }
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
        const loser = players.get(socket.id);
        const winner = [...players].find(([id]) => id !== socket.id)[1];

        // The game started but hasn't ended
        if (roomObj.isGameStarted && !roomObj.isGameOver) {
          // Update stats and notify the remaining player
          updatePlayerStats(winner, loser, "result", 20);
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

// Update player stats after the match
async function updatePlayerStats(player1, player2, status, elo) {
  const winnerStats = player1.gameStats;
  const loserStats = player2.gameStats;

  winnerStats.totalGamesPlayed += 1;
  loserStats.totalGamesPlayed += 1;

  if (status === "result") {
    winnerStats.totalWins += 1;
    winnerStats.eloRating += elo;
    loserStats.totalLosses += 1;
    loserStats.eloRating -= elo;
  } else if (status === "draw") {
    winnerStats.totalDraws += 1;
    winnerStats.eloRating += elo;
    loserStats.totalDraws += 1;
    loserStats.eloRating += elo;
  }

  await player1.save();
  await player2.save();
}

//-----------------  EXPORT HANDLER --------------//
const caroHandlers = async (socket, caroNamespace) => {
  console.log("New client connected: " + socket.id); // New player

  // Extract user ID from JWT token
  const token = getTokenFromCookies(socket.request.headers.cookie);
  const decoded = await getTokenPayload(token);
  const user = await userDAO.findUserById(decoded.id);

  // Handle finding a match
  socket.on("find-match-making", () =>
    Caro.findMatchMaking(socket, caroNamespace, user)
  );

  socket.on("cancel-match-making", (roomId) => {
    Caro.cancelMatchMaking(socket, caroNamespace, roomId);
  });

  // Sending player move to the other player
  socket.on("makeMove", async (index) => {
    await Caro.updateRoomBoard(socket, caroNamespace, index);
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
