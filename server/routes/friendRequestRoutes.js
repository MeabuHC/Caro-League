import express from "express";
import * as friendRequestController from "../controllers/friendRequestController.js"; // Import the controller methods
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Create a new friend request
router.post(
  "/",
  authController.protect,
  friendRequestController.createFriendRequest
);

// Cancel a friend request
router.delete(
  "/",
  authController.protect,
  friendRequestController.cancelFriendRequest
);
export default router;

//Accept
router.patch(
  "/accept",
  authController.protect,
  friendRequestController.acceptFriendRequest
);

//Decline
router.patch(
  "/decline",
  authController.protect,
  friendRequestController.declineFriendRequest
);

// Remove a friend
router.delete(
  "/remove",
  authController.protect,
  friendRequestController.removeFriend
);
