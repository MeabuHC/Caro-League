import GameStats from "../models/gameStatsModel.js"; // Adjust path as needed
import GameHistory from "../models/gameHistoryModel.js"; // Adjust path as needed
import mongoose from "mongoose";
import userDAO from "../dao/userDAO.js";
import gameStatsDAO from "../dao/gameStatsDAO.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import seasonDAO from "../dao/seasonDAO.js";
import User from "../models/userModel.js";
import Season from "../models/seasonModel.js";
import Ranking from "../models/rankingModel.js";
import friendRequestDAO from "../dao/friendRequestDAO.js";

export const getProfileData = catchAsync(async (req, res, next) => {
  const viewer = req?.user; //Logged in or not
  const { username } = req.params;
  const user = await userDAO.getAllUsers({ username: username });

  const { _id: seasonId } = await seasonDAO.getCurrentActiveSeason();
  if (user.length === 0) {
    return next(new AppError("User not found", 404));
  } else {
    const { _id: userId } = user[0];

    const profileData = await GameStats.aggregate([
      {
        $match: {
          userId: userId,
          seasonId: seasonId,
        },
      },
      {
        $lookup: {
          from: "gamehistories",
          pipeline: [
            { $match: { $expr: { $in: [userId, "$players.userId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $addFields: {
                totalMoves: { $size: "$moveHistory" },
              },
            },
          ],
          as: "top10GameHistories",
        },
      },
      {
        $lookup: {
          from: "gamestats",
          localField: "userId",
          foreignField: "userId",
          as: "allSeasonData",
        },
      },
      {
        $project: {
          _id: 0,
          top10GameHistories: {
            moveHistory: 0,
          },
        },
      },
    ]);

    // Populate data
    await User.populate(profileData, {
      path: "userId",
    });

    //Slice friend data
    if (profileData.length > 0 && profileData[0]?.userId?.friends) {
      profileData[0].userId.friends = profileData[0].userId.friends
        .slice(-10)
        .reverse();
    }

    await User.populate(profileData, {
      path: "userId.friends",
      select: "username avatarUrl",
    });
    await User.populate(profileData, {
      path: "top10GameHistories.players.userId",
    });
    await Season.populate(profileData, {
      path: "seasonId",
    });
    await Ranking.populate(profileData, {
      path: "rankId",
    });
    await Ranking.populate(profileData, {
      path: "top10GameHistories.players.rankId",
    });
    await Season.populate(profileData, {
      path: "allSeasonData.seasonId",
    });
    await Ranking.populate(profileData, {
      path: "allSeasonData.rankId",
    });

    if (viewer && user[0].username != viewer.username) {
      const friendRequest = await friendRequestDAO.findFriendRequest(
        userId,
        viewer._id,
        "pending"
      );

      if (friendRequest) profileData[0].friendRequest = friendRequest;
      if (
        user[0].friends.find(
          (friendId) => friendId.toString() === viewer._id.toString()
        )
      )
        profileData[0].isFriend = true;
    }

    res.status(200).json({
      status: "success",
      data: profileData[0],
    });
  }
});
