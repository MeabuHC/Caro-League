import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";
import multer from "multer";

//Store inmemory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.route("/").get(userController.getAllUsers);

router
  .route("/me")
  .get(authController.protect, userController.sendMe)
  .patch(authController.protect, userController.updateMe);

router
  .route("/me/avatar")
  .post(
    authController.protect,
    upload.single("avatar"),
    userController.uploadAvatar
  );

router
  .route("/me/online-friends")
  .get(authController.protect, userController.getAllOnlineFriendMe);

router.route("/:id").get(userController.getUser);

export default router;
