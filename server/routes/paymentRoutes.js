import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import * as authController from "../controllers/authController.js";
const router = express.Router();
router.route("/").post(authController.protect, paymentController.createOrder);
router
  .route("/complete-order")
  .post(authController.protect, paymentController.completeOrder);

export default router;
