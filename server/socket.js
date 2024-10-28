// socket.js
import { Server } from "socket.io"; // Import Socket.IO
import gameHandlers from "./sockets/game.js"; // Import game handlers

export function initSocket(server) {
  const io = new Server(server); // Initialize Socket.IO with the HTTP server
  const gameNamespace = io.of("/game");
  gameNamespace.on("connection", (socket) => {
    console.log("New client connected to game namespace: " + socket.id);
    gameHandlers(socket, gameNamespace); // Pass socket and game namespace to handlers
  });
}
