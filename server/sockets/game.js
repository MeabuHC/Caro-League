import RoomMap from "./roomMap.js"; // Import the RoomMap class
import { getTokenFromCookies, getTokenPayload } from "../utils/authUtils.js";

// Saving room
let roomMap = new RoomMap();

//--------------- NAMESPACE FOR MAIN METHOD --------------//
const Game = {
  startGame: (roomId, gameNamespace) => {
    // Get the sockets in the room
    console.log("This is roomMap from startGame");
    console.log(roomMap);
    const roomObj = roomMap.rooms.get(roomId);
    const socketsInRoom = Array.from(roomObj.players.keys());

    //Reset the board in room
    console.log("Run reset board!");
    roomObj.resetBoard();
    roomObj.startGame("X");

    console.log(socketsInRoom);

    // Emit to each player with their assigned turn
    gameNamespace.to(socketsInRoom[0]).emit("start-match", roomObj.toObject()); // First player

    gameNamespace.to(socketsInRoom[1]).emit("start-match", roomObj.toObject()); // Second player
  },

  //Final function for find match
  findMatch: async (socket, user, gameNamespace) => {
    if (roomMap.getRoomForUser(user.id)) {
      socket.emit("already-in-room");
      socket.disconnect();
      return;
    }
    let roomId; // Variable to store the room

    //Find room based on logic
    roomId = await findRoomId(gameNamespace);

    // Join the determined room and update room map
    console.log("User join room: " + roomId);
    socket.join(roomId);
    roomMap.updateRoomMap(gameNamespace);
    roomMap.rooms.get(roomId).addPlayer(socket.id, user);

    console.log("This is room: ");
    console.log(roomMap.rooms.get(roomId));

    //Check condition to start game
    if (isReadyToStartGame(roomId)) Game.startGame(roomId, gameNamespace);
    else waitMatch(roomId, socket);
  },

  updateRoomBoard: async (symbol, index, socket, gameNamespace) => {
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    const players = roomObj.players;
    roomObj.makeMove(index, symbol, socket.id);

    // Emit move update to both players
    gameNamespace
      .to(roomObj.id)
      .emit("receiveMove", symbol, index, roomObj.toObject());

    // Check if it's a win or draw
    const isWinObj = roomObj.isWin();
    if (isWinObj[0]) {
      const winner = players.get(socket.id);
      const loser = [...players].find(([id]) => id !== socket.id)[1];
      // Emit 'winner' event to the current socket (player who made the move) with the winning index
      socket.emit("winner", isWinObj[1]);

      // Emit 'loser' event to the other socket in the room with the winning index
      socket.to(roomObj.id).emit("loser", isWinObj[1]);

      // Fix the stats for winner and loser
      await updatePlayerStats(winner, loser, "result", 5);

      // Update room status
      roomObj.endGame();
    } else if (roomObj.isDraw()) {
      // Emit draw event to both players
      const playerArray = Array.from(players.values());
      gameNamespace.to(roomObj.id).emit("draw");
      await updatePlayerStats(playerArray[0], playerArray[1], "draw", 0);

      // Update room status
      roomObj.endGame();
    }
  },

  handleDisconnect: (socket, gameNamespace) => {
    console.log(`${socket.id} disconnected!`);
    //Get room by socket
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
        }
        // If the game has ended
        else {
          socket.to(roomObj.id).emit("opponent-leave-room");
        }
      }

      // Remove the disconnected player from the room
      players.delete(socket.id);
    }

    // Update the roomMap after disconnection
    roomMap.updateRoomMap(gameNamespace);
  },

  //Handle receive rematch request
  handleRematchRequest: (socket) => {
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    socket
      .to(roomObj.id)
      .emit("receive-rematch-request", roomObj.players.get(socket.id).username);
  },

  //Handle accept rematch request
  handleAcceptRematch: (socket, gameNamespace) => {
    const roomObj = roomMap.getRoomBySocketId(socket.id);
    Game.startGame(roomObj.id, gameNamespace);
  },
};

//---------- UTILS ------------------//

//Wait for other player to join
function waitMatch(room, socket) {
  console.log("Sending waiting signal!");
  socket.emit("wait-match", room);
}

// Check if it is okay to start the game
function isReadyToStartGame(roomName) {
  const currentRoom = roomMap.rooms.get(roomName);
  return currentRoom.players.size === 2 && !currentRoom.isGameStarted;
}

// Find a valid roomId
async function findRoomId(gameNamespace) {
  //gameNamespace.adapter.rooms : return a map of roomId and a set of sockets id
  // const rooms = Array.from(gameNamespace.adapter.rooms); // Get all rooms
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
  return await createUniqueRoomId(gameNamespace); // Generate a new room ID
}

//Give a random room id
function generateRoomId() {
  const randomNumber = Math.floor(Math.random() * 10000); // Adjust the range as needed
  return `room${randomNumber}`;
}

// Return the unique room ID
async function createUniqueRoomId(gameNamespace) {
  let roomId;
  let roomExists = true;

  while (roomExists) {
    roomId = generateRoomId();
    roomExists = gameNamespace.adapter.rooms.has(roomId); // Check if the room exists
  }

  return roomId;
}

//Update after status after the match
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
const gameHandlers = async (socket, gameNamespace) => {
  console.log("New client connected: " + socket.id); //New player
  // Extract user ID from JWT token
  const token = getTokenFromCookies(socket.request.headers.cookie);
  const decoded = await getTokenPayload(token);
  const user = await User.findById(decoded.id);
  socket.on("find-match", () => Game.findMatch(socket, user, gameNamespace)); // Handle find match

  // Sending player move to the other player
  socket.on("makeMove", async (symbol, index) => {
    await Game.updateRoomBoard(symbol, index, socket, gameNamespace);
  });

  //Handle rematch request
  socket.on("rematch-request", () => {
    Game.handleRematchRequest(socket);
  });

  //Handle accept rematch request
  socket.on("accept-rematch", () => {
    Game.handleAcceptRematch(socket, gameNamespace);
  });

  // Handle socket disconnection : Refresh page
  socket.on("disconnect", () => {
    Game.handleDisconnect(socket, gameNamespace);
  });
};

// Export the game handlers
export default gameHandlers;
