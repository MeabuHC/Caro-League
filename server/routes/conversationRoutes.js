import express from "express";
import * as conversationController from "../controllers/conversationController.js"; // Import the controller methods
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Create a new conversation
router.post(
  "/:id",
  authController.protect,
  conversationController.createConversation
);

router.get(
  "/me",
  authController.protect,
  conversationController.getAllConversationMe
);

router.get(
  "/:id/messages",
  authController.protect,
  conversationController.getConversationMessagesById
);

router.post(
  "/:id/messages",
  authController.protect,
  conversationController.sendMessage
);

export default router;
