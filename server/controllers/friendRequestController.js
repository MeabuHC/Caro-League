import friendRequestDAO from "../dao/friendRequestDAO.js";
import conversationDAO from "../dao/conversationDAO.js";
import userDAO from "../dao/userDAO.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

//Get all friend request of me
export const getAllFriendRequestMe = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const data = await friendRequestDAO.findFriendRequests(userId, "pending");

  res.status(200).json({
    status: "success",
    data: data,
  });
});

// Create a new friend request
export const createFriendRequest = catchAsync(async (req, res, next) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  if (!receiverId) {
    return next(new AppError("Receiver ID is required", 400));
  }

  if (senderId === receiverId) {
    return next(
      new AppError("You cannot send a friend request to yourself", 400)
    );
  }

  if (
    await friendRequestDAO.findSentFriendRequest(
      receiverId,
      senderId,
      "pending"
    )
  ) {
    return next(
      new AppError("You already received a friend request from this player!"),
      400
    );
  }

  const newRequest = await friendRequestDAO.create(senderId, receiverId);

  res.status(201).json({
    status: "success",
    data: newRequest,
  });
});

export const cancelFriendRequest = catchAsync(async (req, res, next) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;

  if (!receiverId) {
    return next(new AppError("Receiver ID is required", 400));
  }

  // Find the pending friend request
  const friendRequest = await friendRequestDAO.findSentFriendRequest(
    senderId,
    receiverId,
    "pending"
  );

  if (!friendRequest) {
    return next(new AppError("Friend request does not exist", 404));
  }

  // Change the status to "cancelled"
  const updatedRequest = await friendRequestDAO.changeStatus(
    friendRequest,
    "cancelled"
  );

  res.status(200).json({
    status: "success",
    data: updatedRequest,
  });
});

export const acceptFriendRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.body;
  const userId = req.user._id;

  const friendRequest = await friendRequestDAO.findById(requestId);

  if (!friendRequest || friendRequest.status != "pending") {
    return next(new AppError("Friend request not found", 404));
  }

  // Logged in user != receiver
  if (friendRequest.receiverId.toString() !== userId.toString()) {
    return next(
      new AppError("You are not authorized to accept this request", 403)
    );
  }

  // Change the status of the friend request to 'accepted'
  await friendRequestDAO.changeStatus(friendRequest, "accepted");

  // Optionally, add users to each other's friends list
  await userDAO.addFriends(userId, friendRequest.senderId);

  //Create a chat if not existed
  try {
    await conversationDAO.create(userId, friendRequest.senderId);
  } catch {}

  res.status(200).json({
    status: "success",
    message: "Friend request accepted successfully!",
  });
});

export const declineFriendRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.body;
  const userId = req.user._id;

  const friendRequest = await friendRequestDAO.findById(requestId);

  if (!friendRequest || friendRequest.status != "pending") {
    return next(new AppError("Friend request not found", 404));
  }

  // Logged in user != receiver
  if (friendRequest.receiverId.toString() !== userId.toString()) {
    return next(
      new AppError("You are not authorized to decline this request", 403)
    );
  }

  // Change the status of the friend request to 'declined'
  await friendRequestDAO.changeStatus(friendRequest, "declined");

  res.status(200).json({
    status: "success",
    message: "Friend request declined successfully!",
  });
});

export const removeFriend = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { friendId } = req.body;

  if (
    !user.friends.some((userFriend) => userFriend._id.toString() === friendId)
  ) {
    return next(new AppError("You are not friends with this user.", 400));
  }

  userDAO.removeFriend(user._id, friendId);

  return res.status(204).json({
    status: "success",
    message: "Friend removed successfully",
  });
});
