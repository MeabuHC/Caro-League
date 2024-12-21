import Chat from "../models/chatModel.js";
import Conversation from "../models/conversationModel.js";
import redisClient from "../utils/redisClient.js";
import chatDAO from "./chatDAO.js";

class ConversationDAO {
  // Create a new conversation between two users
  async create(user1Id, user2Id) {
    if (user1Id === user2Id) {
      throw new Error("Users cannot be the same.");
    }

    // Check if a conversation already exists between the two users
    const existingConversation = await this.findConversation(user1Id, user2Id);
    if (existingConversation) {
      throw new Error("A conversation already exists between these users.");
    }

    // Create the conversation
    const newConversation = new Conversation({
      user1: user1Id,
      user2: user2Id,
    });
    return await newConversation.save();
  }

  // Find all conversations + active status for a specific user, including the last message
  async findConversationsByUser(userId) {
    const conversationList = await Conversation.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .populate("user1 user2", "avatarUrl username") // Populate user details
      .populate({
        path: "messages", // Populate the 'messages' field
        options: {
          sort: { createdAt: -1 }, // Sort messages by creation date in descending order
        },
        perDocumentLimit: 1,
      })
      .lean();

    for (const conversation of conversationList) {
      const otherUser =
        conversation.user1._id.toString() === userId
          ? conversation.user2
          : conversation.user1;

      const userKey = `user:${otherUser._id.toString()}:status`;

      try {
        // Fetch active status and active sockets from Redis
        const activeStatus = await redisClient.get(userKey);

        conversation.active_status = activeStatus
          ? JSON.parse(activeStatus)
          : null;

        if (conversation.messages.length > 0) {
          conversation.last_message = conversation.messages[0];
          conversation.messages = undefined;
        } else {
          conversation.last_message = null;
          conversation.messages = undefined;
        }
      } catch (err) {
        console.error("Error fetching data from Redis or last message:", err);
      }
    }

    // Return the updated conversation list
    return conversationList;
  }

  // Find a conversation between two users
  async findConversation(user1Id, user2Id) {
    return await Conversation.findOne({
      $or: [
        { user1: user1Id, user2: user2Id },
        { user1: user2Id, user2: user1Id },
      ],
    });
  }

  async getPaginatedMessages(conversationId, page = 1, limit = 20) {
    const conversation = await Conversation.findById(conversationId)
      .populate({
        path: "messages",
        select: "message senderId createdAt",
        options: {
          skip: (page - 1) * limit,
          limit: limit,
          sort: { createdAt: -1 },
        },
        populate: {
          path: "senderId",
          select: "username avatarUrl",
        },
      })
      .lean();
    // conversation.messages.sort(
    //   (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    // );

    // Return the messages and the current page for pagination
    return {
      messages: conversation.messages,
      currentPage: page,
    };
  }

  async findById(conversationId) {
    return await Conversation.findById(conversationId);
  }

  // Create a new message
  async sendMessage(senderId, conversationId, messageContent) {
    if (!messageContent || messageContent.trim() === "") {
      throw new Error("Message content cannot be empty.");
    }

    let conversation = await this.findById(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    // Create the chat message
    const newMessage = await chatDAO.create(senderId, messageContent);

    conversation.messages.push(newMessage._id.toString());
    await conversation.save();

    return newMessage;
  }
}

export default new ConversationDAO();
