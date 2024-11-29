import FriendRequest from "../models/friendRequestModel.js";

class FriendRequestDAO {
  // Create a new friend request
  async create(senderId, receiverId) {
    if (senderId === receiverId) {
      throw new Error("Sender and receiver cannot be the same.");
    }

    // Check if a similar request already exists
    const existingRequest = await this.findSentFriendRequest(
      senderId,
      receiverId,
      "pending"
    );

    if (existingRequest) {
      throw new Error("A pending request already exists.");
    }

    // Create the request
    const newRequest = new FriendRequest({
      senderId: senderId,
      receiverId: receiverId,
    });
    return await newRequest.save();
  }

  async findSentFriendRequest(senderId, receiverId, status) {
    return await FriendRequest.findOne({
      senderId: senderId,
      receiverId: receiverId,
      status: status,
    });
  }

  async findFriendRequest(userId1, userId2, status) {
    return await FriendRequest.findOne({
      $or: [
        { senderId: userId1, receiverId: userId2, status: status },
        { senderId: userId2, receiverId: userId1, status: status },
      ],
    });
  }

  async changeStatus(friendRequest, status) {
    friendRequest.status = status;
    return await friendRequest.save();
  }

  async findById(friendRequestId) {
    return await FriendRequest.findById(friendRequestId);
  }
}

export default new FriendRequestDAO();
