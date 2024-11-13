import gameHistoryDAO from "../dao/gameHistoryDAO.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Get a specific game history by game id
export const getGameHistoryById = catchAsync(async (req, res, next) => {
  const gameHistory = await gameHistoryDAO.getGameHistoryByGameId(
    req.params.id
  );
  if (!gameHistory) {
    return next(new AppError("GameHistory not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: gameHistory,
  });
});
