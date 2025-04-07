import express from "express";
import * as seasonController from "../controllers/seasonController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/seasons:
 *   get:
 *     description: Get all seasons
 *     responses:
 *       200:
 *         description: List of all seasons
 *   post:
 *     description: Create a new season
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Season created successfully
 */
router
  .route("/")
  .get(seasonController.getAllSeasons)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    seasonController.createNewSeason
  );

/**
 * @swagger
 * /api/v1/seasons/{id}:
 *   get:
 *     description: Get a specific season by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the season to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Season details
 *       404:
 *         description: Season not found
 *   patch:
 *     description: Update a specific season
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Season updated successfully
 */
router
  .route("/:id")
  .get(seasonController.getSeasonById)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    seasonController.updateSeason
  );

export default router;
