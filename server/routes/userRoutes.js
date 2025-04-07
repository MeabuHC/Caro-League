import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";
import multer from "multer";

// Store in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: List of all users
 */
router.route("/").get(userController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     description: Get the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The current user details
 *   patch:
 *     description: Update the current user details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated user details
 */
router
  .route("/me")
  .get(authController.protect, userController.sendMe)
  .patch(authController.protect, userController.updateMe);

/**
 * @swagger
 * /api/v1/users/me/avatar:
 *   post:
 *     description: Upload a new avatar for the current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 */
router
  .route("/me/avatar")
  .post(
    authController.protect,
    upload.single("avatar"),
    userController.uploadAvatar
  );

/**
 * @swagger
 * /api/v1/users/me/online-friends:
 *   get:
 *     description: Get all online friends of the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of online friends
 */
router
  .route("/me/online-friends")
  .get(authController.protect, userController.getAllOnlineFriendMe);

/**
 * @swagger
 * /api/v1/users/me/friends:
 *   get:
 *     description: Get all friends of the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 */
router
  .route("/me/friends")
  .get(authController.protect, userController.getAllFriendMe);

/**
 * @swagger
 * /api/v1/users/me/challenges:
 *   get:
 *     description: Get all incoming challenges for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incoming challenges
 */
router
  .route("/me/challenges")
  .get(authController.protect, userController.getAllIncomingChallengeMe);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     description: Get a user by their ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to fetch
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.route("/:id").get(userController.getUser);

export default router;
