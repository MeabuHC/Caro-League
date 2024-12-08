import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import gameStatsDAO from "../dao/gameStatsDAO.js";

// Get a specific game history by game id
export const getGameStatsMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  const gameStatsData = await gameStatsDAO.getCurrentSeasonGameStatsFromUserId(
    user._id.toString()
  );
  res.status(200).json({
    status: "success",
    data: gameStatsData,
  });
});
