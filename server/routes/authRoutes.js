import express from "express";
import * as authController from "../controllers/authController.js";
import * as rateLimiters from "../utils/rateLimiters.js";

const router = express.Router();

router.route("/signup").post(rateLimiters.signupLimiter, authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);
router.route("/verify-email").post(authController.verifyEmail);
router.route("/setup").post(authController.setup);
router.post("/refresh-token", authController.refreshToken);
router.patch(
  "/change-password",
  authController.protect,
  authController.changePassword
);

export default router;
