import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();
router.route("/").get(userController.getAllUsers);

router
  .route("/me")
  .get(authController.protect, userController.sendMe)
  .patch(authController.protect, userController.updateMe);

router.route("/:id").get(userController.getUser);

export default router;
