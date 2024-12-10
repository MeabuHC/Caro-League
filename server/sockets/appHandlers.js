import redisClient from "../utils/redisClient.js";
import {
  getAccessTokenFromCookies,
  getTokenPayload,
} from "../utils/authUtils.js";
import userDAO from "../dao/userDAO.js";

const AppHandlers = {
  //Send challenge request
  handleSendChallengeRequest: async (appNamespace, request) => {
    console.log(request);

    const receiver = (
      await userDAO.getAllUsers({
        username: request.receiver,
      })
    )[0];

    const sender = (
      await userDAO.getAllUsers({
        username: request.sender,
      })
    )[0];

    // Existed opponent and valid sender
    if (receiver && sender) {
      const receiverId = receiver._id.toString();
      const senderId = sender._id.toString();

      // Check if sender already has an outgoing challenge
      const outgoingChallengesKey = `user:${senderId}:outgoing_challenge`;
      const existingChallenge = await redisClient.get(outgoingChallengesKey);

      if (existingChallenge) {
        console.log("Sender already has an active challenge.");
        appNamespace.to(request.senderSocketId).emit("challenge-error", {
          status: "fail",
          message: "You already have an active challenge.",
        });
        return;
      }

      // Save challenge request to Redis
      const incomingChallengesKey = `user:${receiverId}:incoming_challenges`;

      const challengeData = JSON.stringify({
        sender: senderId,
        receiver: receiverId,
        time: request.time,
        mode: request.mode,
        createdAt: Date.now(),
      });

      // Save to incoming challenges for the receiver
      await redisClient.sAdd(incomingChallengesKey, challengeData);

      // Save the outgoing challenge for the sender (overwrite any existing one)
      await redisClient.set(outgoingChallengesKey, challengeData);

      console.log("Challenge request saved to Redis.");

      // Notify all active sockets of the receiver
      const activeSocketsKey = `user:${receiverId}:active_sockets`;
      const activeSockets = await redisClient.sMembers(activeSocketsKey);
      console.log(activeSockets);

      //Make new request with more details
      const newRequest = {
        sender: sender,
        receiver: receiver,
        time: request.time,
        mode: request.mode,
        createdAt: Date.now(),
      };

      activeSockets.forEach((socketId) => {
        console.log("Emit to socket!");
        appNamespace.to(socketId).emit("receive-challenge-request", newRequest);
      });
    } else {
      console.log("Receiver or sender not found.");
    }
  },

  handleCancelChallengeRequest: async (socket, appNamespace, senderId) => {
    try {
      // Retrieve the existing challenge from the sender's outgoing challenge
      const outgoingChallengesKey = `user:${senderId}:outgoing_challenge`;
      const challengeData = await redisClient.get(outgoingChallengesKey);

      if (!challengeData) {
        console.log("No challenge found for this sender.");
        return;
      }

      const challengeDataObject = JSON.parse(challengeData);

      // Remove the challenge from both the sender's outgoing challenge and the receiver's incoming challenges
      const incomingChallengesKey = `user:${challengeDataObject.receiver}:incoming_challenges`;

      // Delete the challenge from the outgoing key
      await redisClient.del(outgoingChallengesKey);

      // Remove from the receiver's incoming challenges
      await redisClient.sRem(incomingChallengesKey, challengeData);

      console.log("Challenge request canceled and removed from Redis.");

      // Notify the receiver's active sockets about the canceled challenge
      const activeSocketsKey = `user:${challengeDataObject.receiver}:active_sockets`;
      const activeSockets = await redisClient.sMembers(activeSocketsKey);

      // Emit to each socket of the receiver

      activeSockets.forEach((socketId) => {
        appNamespace
          .to(socketId)
          .emit("challenge-canceled", challengeDataObject);
      });

      console.log(
        "Challenge canceled notification sent to receiver's active sockets."
      );
    } catch (error) {
      console.error("Error canceling challenge request:", error);
    }
  },

  disconnect: async (socket, appNamespace, user) => {
    const userKey = `user:${user._id.toString()}:status`;
    const activeSocketsKey = `user:${user._id.toString()}:active_sockets`;
    try {
      // Remove the socket ID from the active sockets set in Redis
      await redisClient.sRem(activeSocketsKey, socket.id);

      const remainingSockets = await redisClient.sCard(activeSocketsKey);
      if (remainingSockets === 0) {
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

      //Cancel every challenge request has made
      await AppHandlers.handleCancelChallengeRequest(
        socket,
        appNamespace,
        user._id.toString()
      );
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

    // Add the socket ID to the user's active sockets set in Redis
    await redisClient.sAdd(activeSocketsKey, socket.id);

    // Mark the user as online in Redis and update their last active time
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

    //Handle challenge request
    socket.on("send-challenge-request", (request) => {
      AppHandlers.handleSendChallengeRequest(appNamespace, request);
    });

    //Handle challenge request
    socket.on("cancel-challenge-request", () => {
      AppHandlers.handleCancelChallengeRequest(socket, appNamespace, userId);
    });

    // Handle disconnect
    socket.on("disconnect", () =>
      AppHandlers.disconnect(socket, appNamespace, user)
    );
  } catch (error) {
    console.error("Error in appHandlers:", error);
    socket.emit("error", { message: "Internal server error." });
  }
};

export default appHandlers;
