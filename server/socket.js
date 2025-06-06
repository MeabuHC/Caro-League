import { Server } from "socket.io";
import caroHandlers from "./sockets/caroHandlers.js";
import appHandlers from "./sockets/appHandlers.js";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_BASE_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const appNamespace = io.of("/app");
  appNamespace.on("connection", (socket) => {
    appHandlers(socket, appNamespace);
  });

  const caroNamespace = io.of("/caro");
  caroNamespace.on("connection", (socket) => {
    caroHandlers(socket, caroNamespace);
  });
}
