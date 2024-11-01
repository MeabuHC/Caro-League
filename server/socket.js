import { Server } from "socket.io";
import caroHandlers from "./sockets/caro.js";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const caroNamespace = io.of("/caro");
  caroNamespace.on("connection", (socket) => {
    caroHandlers(socket, caroNamespace);
  });
}
