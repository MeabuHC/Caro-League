import mongoose from "mongoose";
import Chat from "./chatModel.js";

const ConversationSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Chat",
      default: [],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;
