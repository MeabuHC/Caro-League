import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import paymentDAO from "../dao/paymentDAO.js";
import gameStatsDAO from "../dao/gameStatsDAO.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { itemName } = req.body;
  if (!itemName) {
    return next(new AppError("Missing itemName field!"), 400);
  }

  const data = await paymentDAO.createOrder(itemName);
  console.log(data);
  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const completeOrder = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { orderId } = req.body;

  const data = await paymentDAO.capturePayment(orderId);

  const newRank =
    data.purchase_units[0].reference_id
      .split("_")[1] // Extracts rank (e.g., "bronze")
      .charAt(0)
      .toUpperCase() +
    data.purchase_units[0].reference_id.split("_")[1].slice(1); // Capitalizes the first letter (e.g., "Bronze")

  const newGameStats = await gameStatsDAO.updateUserCurrentSeasonRank(
    user._id.toString(),
    newRank
  );

  console.log(data);
  res.status(200).json({
    status: "success",
    data: newGameStats,
  });
});
