import Ranking from "../models/rankingModel.js";

class RankingDAO {
  // Method to get a ranking by its tier name
  async getRankByRankName(tierName) {
    const rank = await Ranking.findOne({ tier: tierName });
    return rank;
  }
}

export default new RankingDAO();
