import GameStats from "../models/gameStatsModel.js";
import Ranking from "../models/rankingModel.js";
import rankingDAO from "./rankingDAO.js";
import seasonDAO from "./seasonDAO.js";

class GameStatsDAO {
  async getGameStatsFromUserId(userId) {
    const gameStats = await GameStats.findOne({ userId })
      .populate("userId")
      .populate("rankId")
      .populate("seasonId");

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

  // Update player stats after the match
  async updatePlayerStats(winnerStats, loserStats, status, lp) {
    winnerStats.totalGames += 1;
    loserStats.totalGames += 1;

    if (status === "result") {
      winnerStats.wins += 1;
      winnerStats.lp += lp;

      loserStats.losses += 1;
      //Only derank if lp = 0
      if (loserStats.lp !== 0 && loserStats.lp - lp < 0) {
        loserStats.lp = 0;
      } else {
        loserStats.lp -= lp;
      }
    } else if (status === "draw") {
      winnerStats.draws += 1;
      winnerStats.lp += lp;

      loserStats.draws += 1;
      loserStats.lp += lp;
    }

    //Update both player ranks
    await this.updateRank(winnerStats);
    await this.updateRank(loserStats);

    await winnerStats.save();
    await loserStats.save();
  }

  async updateRank(playerStats) {
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
