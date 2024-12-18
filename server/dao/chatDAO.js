import Chat from "../models/chatModel.js"; // Assuming you have a Chat model
class ChatDAO {
  // Find a message by its ID
  async findById(chatId) {
    return await Chat.findById(chatId);
  }

  // Create a new chat message
  async create(senderId, message, status = "sent", isSeen = false) {
    const newChat = new Chat({
      senderId,
      message,
      status,
      isSeen,
    });

    await newChat.save();

    return newChat;
  }
}

export default new ChatDAO();
