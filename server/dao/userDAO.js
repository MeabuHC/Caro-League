// dao/userDAO.js
import User from "../models/userModel.js";
import APIFeatures from "../utils/APIFeatures.js";
import AppError from "../utils/appError.js";
import redisClient from "../utils/redisClient.js";

class UserDAO {
  async getAllUsers(queryObj) {
    // Exclude users with the 'admin' role
    const features = new APIFeatures(
      User.find({ role: { $ne: "admin" } }),
      queryObj
    )
      .filter()
      .paginate()
      .sort()
      .limitFields();

    return await features.sqlQuery;
  }

  async getUserById(id, queryObj = {}, withPassword = false) {
    const user = await User.findById(id);

    if (!user || user.role === "admin") {
      throw new AppError("User not found", 404);
    }

    let query = User.findById(id);

    if (withPassword) query = query.select("+password");

    const features = new APIFeatures(query, queryObj).limitFields();
    return await features.sqlQuery;
  }

  async deleteUserById(id) {
    return await User.findByIdAndDelete(id);
  }

  async updateUserById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async findUserByEmail(email) {
    const sqlQuery = User.findOne({ email }).select("+password");
    return await sqlQuery;
  }

  async addFriends(userAId, userBId) {
    if (userAId === userBId) {
      throw new Error("A user cannot add themselves as a friend.");
    }

    // Add userB to userA's friends list
    const userAUpdate = await User.findByIdAndUpdate(
      userAId,
      { $addToSet: { friends: userBId } }, // $addToSet ensures no duplicates
      { new: true }
    );

    // Add userA to userB's friends list
    const userBUpdate = await User.findByIdAndUpdate(
      userBId,
      { $addToSet: { friends: userAId } },
      { new: true }
    );

    if (!userAUpdate || !userBUpdate) {
      throw new Error("Failed to update the friends list.");
    }

    return { userAUpdate, userBUpdate };
  }

  async removeFriend(userAId, userBId) {
    if (userAId === userBId) {
      throw new Error("A user cannot remove themselves as a friend.");
    }

    // Remove userB from userA's friends list
    const userAUpdate = await User.findByIdAndUpdate(
      userAId,
      { $pull: { friends: userBId } }, // $pull removes the friend
      { new: true }
    );

    // Remove userA from userB's friends list
    const userBUpdate = await User.findByIdAndUpdate(
      userBId,
      { $pull: { friends: userAId } },
      { new: true }
    );

    if (!userAUpdate || !userBUpdate) {
      throw new Error("Failed to update the friends list.");
    }

    return { userAUpdate, userBUpdate };
  }

  async getAllOnlineFriendById(userId) {
    const user = await this.getUserById(userId);
    const friends = (await User.populate(user, "friends")).friends;

    // Get all Redis keys for friends' statuses in one call
    const friendIds = friends.map((friend) => `user:${friend._id}:status`);
    const statuses = await redisClient.mGet(friendIds);

    const onlineFriends = friends
      .map((friend, index) => {
        const status = JSON.parse(statuses[index]);
        return {
          friend,
          onlineStatus: status?.online || false,
        };
      })
      .filter((friend) => friend.onlineStatus);

    return onlineFriends;
  }
}

export default new UserDAO();
