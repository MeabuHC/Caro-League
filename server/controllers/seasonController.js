// seasonController.js
import seasonDAO from "../dao/seasonDAO.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// Get all seasons
export const getAllSeasons = catchAsync(async (req, res) => {
  const seasons = await seasonDAO.getAllSeasons();
  res.status(200).json({
    status: "success",
    results: seasons.length,
    data: seasons,
  });
});

// Get a specific season by ID
export const getSeasonById = catchAsync(async (req, res) => {
  const season = await seasonDAO.getSeasonById(req.params.id);
  if (!season) {
    return new AppError("Season not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: season,
  });
});

// Create a new season
export const createNewSeason = catchAsync(async (req, res) => {
  const season = await seasonDAO.createSeason(req.body);
  res.status(201).json({
    status: "success",
    data: season,
  });
});

// Update a season
export const updateSeason = catchAsync(async (req, res) => {
  const season = await seasonDAO.updateSeason(req.params.id, req.body);
  if (!season) {
    return new AppError("Season not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: season,
  });
});
