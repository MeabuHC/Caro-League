import express from "express";
import * as seasonController from "../controllers/seasonController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  // Get all seasons
  .get(seasonController.getAllSeasons)
  // Create a new season
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    seasonController.createNewSeason
  );

router
  .route("/:id")
  .get(seasonController.getSeasonById) // Get a specific season by ID
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    seasonController.updateSeason
  ); // Update a season

export default router;
