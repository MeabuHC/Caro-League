import express from "express";
import * as gameHistoryController from "../controllers/gameHistoryController.js";
const router = express.Router();

router.route("/:id").get(gameHistoryController.getGameHistoryById);
export default router;
