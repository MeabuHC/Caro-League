import { Server } from "socket.io";
import gameHandlers from "./sockets/game.js";

export function initSocket(server) {
  const io = new Server(server);
  const gameNamespace = io.of("/game");
  gameNamespace.on("connection", (socket) => {
    console.log("New client connected to game namespace: " + socket.id);
    gameHandlers(socket, gameNamespace);
  });
}
