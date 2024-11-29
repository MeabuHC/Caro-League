import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: function (value) {
          // Prevent sending a request to self
          return value.toString() !== this.senderId.toString();
        },
        message: "Sender and receiver cannot be the same user.",
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);
export default FriendRequest;
