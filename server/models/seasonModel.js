import mongoose from "mongoose";
import AppError from "../utils/appError.js";

const seasonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Season name is required."],
      unique: [true, "Season name must be unique."],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required."],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required."],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
  }
);

seasonSchema.pre("save", async function (next) {
  if (this.startDate >= this.endDate) {
    return next(new AppError("Start date must be before end date", 400));
  }

  // Find any overlapping seasons
  const overlappingSeasons = await Season.find({
    $or: [
      {
        startDate: { $lt: this.endDate },
        endDate: { $gt: this.startDate },
      },
    ],
  });

  if (overlappingSeasons.length > 0) {
    const overlappingNames = overlappingSeasons
      .map((season) => season.name)
      .join(", ");
    return next(
      new AppError(
        `The season dates collide with existing seasons: ${overlappingNames}`,
        400
      )
    );
  }

  next();
});

const Season = mongoose.model("Season", seasonSchema);

export default Season;
