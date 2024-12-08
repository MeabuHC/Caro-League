import express from "express";
import * as gameStatsController from "../controllers/gameStatsController.js";
import * as authController from "../controllers/authController.js";
const router = express.Router();
router
  .route("/me")
  .get(authController.protect, gameStatsController.getGameStatsMe);
export default router;
