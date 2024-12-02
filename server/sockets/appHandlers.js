import redisClient from "../utils/redisClient.js";
import {
  getAccessTokenFromCookies,
  getTokenPayload,
} from "../utils/authUtils.js";
import userDAO from "../dao/userDAO.js";

const AppHandlers = {
  disconnect: async (appNamespace, user) => {
    const userKey = `user:${user._id.toString()}:status`;
    const activeSocketsKey = `user:${user._id.toString()}:active_sockets`;
    try {
      const remainingSockets = await redisClient.decr(activeSocketsKey);

      if (remainingSockets <= 0) {
        // Mark user as offline and clean up
        await redisClient.set(
          userKey,
          JSON.stringify({ online: false, last_active: Date.now() })
        );
        await redisClient.del(activeSocketsKey); // Clean up counter
        console.log(`${user.username} is offline!`);

        //Broadcast event to every socket
        appNamespace.emit("user-active-status", {
          userId: user._id.toString(),
          online: false,
          last_active: Date.now(),
        });
      } else {
        console.log(
          `${user.username} has ${remainingSockets} active sockets remaining.`
        );
      }
    } catch (error) {
      console.error("Failed to update Redis on disconnect:", error);
    }
  },
};

//-------------------- Export ------------------------- //
const appHandlers = async (socket, appNamespace) => {
  const token = getAccessTokenFromCookies(socket.request.headers.cookie);
  if (!token) {
    console.log("Unauthorized!");
    socket.emit("unauthorized", {
      status: "fail",
      message: "jwt token missing or invalid!",
    });
    return;
  }

  try {
    const decoded = await getTokenPayload(token);
    const userId = decoded.id;
    const user = await userDAO.getUserById(userId);

    const userKey = `user:${userId}:status`;
    const activeSocketsKey = `user:${userId}:active_sockets`;

    // Increment the counter and mark as online
    await redisClient.incr(activeSocketsKey);

    await redisClient.set(
      userKey,
      JSON.stringify({ online: true, last_active: Date.now() })
    );
    console.log(`${user.username} is online!`);

    //Broadcast event to every socket
    appNamespace.emit("user-active-status", {
      userId: userId,
      online: true,
      last_active: Date.now(),
    });

    // Handle disconnect
    socket.on(
      "disconnect",
      async () => await AppHandlers.disconnect(appNamespace, user)
    );
  } catch (error) {
    console.error("Error in appHandlers:", error);
    socket.emit("error", { message: "Internal server error." });
  }
};

export default appHandlers;
