import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
