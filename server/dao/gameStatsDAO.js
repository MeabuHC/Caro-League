import GameStats from "../models/gameStatsModel.js";
import Ranking from "../models/rankingModel.js";
import User from "../models/userModel.js";
import rankingDAO from "./rankingDAO.js";
import seasonDAO from "./seasonDAO.js";

class GameStatsDAO {
  async getCurrentSeasonGameStatsFromUserId(userId) {
    const currentSeasonId = (await seasonDAO.getCurrentActiveSeason()).id;
    const gameStats = await GameStats.findOne({
      userId,
      seasonId: currentSeasonId,
    })
      .populate("userId")
      .populate("rankId")
      .populate("seasonId");

    return gameStats;
  }

  async updateUserCurrentSeasonRank(userId, newRank) {
    const currentSeasonId = (await seasonDAO.getCurrentActiveSeason()).id;
    const gameStats = await GameStats.findOne({
      userId,
      seasonId: currentSeasonId,
    });

    const newRankObject = await rankingDAO.getRankByRankName(newRank);

    gameStats.rankId = newRankObject._id;
    gameStats.lp = 20;
    gameStats.currentDivision = newRankObject.divisions?.[0] || "";

    // Save the updated gameStats
    await gameStats.save();

    return gameStats;
  }

  // Method to create game stats for a specific user ID
  async createGameStatsForUserId(userId) {
    const currentSeasonId = (await seasonDAO.getCurrentActiveSeason()).id;
    const newGameStats = new GameStats({
      userId,
      seasonId: currentSeasonId,
    });

    const savedGameStats = await newGameStats.save(); // Save the new game stats to the database
    return savedGameStats;
  }

  async getTop10Leaderboard() {
    const currentSeasonId = (await seasonDAO.getCurrentActiveSeason())._id;

    console.log(currentSeasonId);

    const leaderboard = await GameStats.aggregate([
      {
        $match: {
          seasonId: currentSeasonId,
        },
      },
      {
        //Populate rank
        $lookup: {
          from: "rankings",
          foreignField: "_id",
          localField: "rankId",
          as: "rankId",
        },
      },
      {
        $unwind: "$rankId",
      },
      {
        $addFields: {
          numericDivision: {
            $switch: {
              branches: [
                { case: { $eq: ["$currentDivision", "I"] }, then: 1 },
                { case: { $eq: ["$currentDivision", "II"] }, then: 2 },
                { case: { $eq: ["$currentDivision", "III"] }, then: 3 },
                { case: { $eq: ["$currentDivision", "IV"] }, then: 4 },
              ],
              default: 0,
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "userId",
          pipeline: [
            {
              $match: {
                $expr: {
                  $ne: ["$role", "admin"],
                },
              },
            },
            {
              $project: {
                avatarUrl: 1,
                username: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$userId" },
      {
        $sort: {
          "rankId.priority": -1,
          numericDivision: 1,
          lp: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return leaderboard;
  }

  // Update player stats after the match
  async updatePlayerStats(winnerStats, loserStats, status, lpChanges) {
    const winnerLpChanges = lpChanges.get(winnerStats.userId._id.toString());
    const loserLpChanges = lpChanges.get(loserStats.userId._id.toString());

    winnerStats.totalGames += 1;
    loserStats.totalGames += 1;

    if (status === "win") {
      winnerStats.wins += 1;
      winnerStats.lp += winnerLpChanges.win;

      loserStats.losses += 1;
      //Only derank if lp = 0
      if (loserStats.lp !== 0 && loserStats.lp + loserLpChanges.lose < 0) {
        loserStats.lp = 0;
      } else {
        loserStats.lp += loserLpChanges.lose;
      }
    } else if (status === "draw") {
      winnerStats.draws += 1;
      winnerStats.lp += winnerLpChanges.draw;

      loserStats.draws += 1;
      loserStats.lp += loserLpChanges.draw;
    }

    //Update both player ranks
    await this.upRank(winnerStats);
    await this.upRank(loserStats);

    await winnerStats.save();
    await loserStats.save();
  }

  async upRank(playerStats) {
    // Find index of current division
    const divisionIndex = playerStats.rankId.divisions.indexOf(
      playerStats.currentDivision
    );

    // Derank for master
    if (playerStats.lp < 0 && playerStats.rankId.tier == "Master") {
      // Move to previous tier
      const previousRankTierName = playerStats.rankId.previousRankTier;
      const previousTier = await rankingDAO.getRankByRankName(
        previousRankTierName
      );
      playerStats.rankId = previousTier._id;
      playerStats.currentDivision =
        previousTier.divisions[previousTier.divisions.length - 1]; // Reset to last division of the tier
      playerStats.lp += previousTier.lpThreshold;
    } else if (playerStats.lp < 0) {
      playerStats.lp += playerStats.rankId.lpThreshold; // Reset LP

      // Check if already in the first division
      if (divisionIndex === 0) {
        const previousRankTierName = playerStats.rankId.previousRankTier;
        //Lowest rank => Cant be derank
        if (!previousRankTierName) {
          playerStats.lp = 0;
          return;
        }

        // Move to previous tier
        const previousTier = await rankingDAO.getRankByRankName(
          previousRankTierName
        );

        playerStats.rankId = previousTier._id;
        playerStats.currentDivision =
          previousTier.divisions[previousTier.divisions.length - 1]; // Reset to last division of the tier
      } else {
        // Move to previous division
        playerStats.currentDivision =
          playerStats.rankId.divisions[divisionIndex - 1];
      }
    }
    // Uprank
    else if (
      playerStats.rankId.tier != "Master" &&
      playerStats.lp >= playerStats.rankId.lpThreshold
    ) {
      playerStats.lp -= playerStats.rankId.lpThreshold;

      // Final division
      if (divisionIndex === playerStats.rankId.divisions.length - 1) {
        // Move to next tier
        const nextTier = await rankingDAO.getRankByRankName(
          playerStats.rankId.nextRankTier
        );

        playerStats.rankId = nextTier._id;
        if (nextTier.tier === "Master") {
          playerStats.currentDivision = "";
        } else playerStats.currentDivision = nextTier.divisions[0]; // Reset to first division of new tier
      } else {
        // Move to next division
        playerStats.currentDivision =
          playerStats.rankId.divisions[divisionIndex + 1];
      }
    }

    // Re-populate rankId to refresh rank details
    await playerStats.populate("rankId");
  }
}

export default new GameStatsDAO();
