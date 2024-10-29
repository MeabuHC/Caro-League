import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, extname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/img/avatars"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

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

router.route("/:id").get(userController.getUser);

export default router;
