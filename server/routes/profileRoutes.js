import express from "express";
import * as profileController from "../controllers/profileController.js";
import * as authController from "../controllers/authController.js";
const router = express.Router();
router
  .route("/:username")
  .get(authController.optionalAuth, profileController.getProfileData);
export default router;
