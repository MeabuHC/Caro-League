import Season from "../models/seasonModel.js"; // Adjust the path according to your project structure

// Get all seasons

const seasonDAO = {
  async getAllSeasons() {
    return await Season.find({});
  },

  // Get a season by ID
  async getSeasonById(id) {
    return await Season.findById(id);
  },

  // Create a new season
  async createSeason(seasonData) {
    const startDate = convertToISO(seasonData.startDate);
    const endDate = convertToISO(seasonData.endDate);

    const newSeason = new Season({
      name: seasonData.name,
      startDate: startDate,
      endDate: endDate,
      active: seasonData.active,
    });

    return await newSeason.save();
  },

  // Update a season
  async updateSeason(id, seasonData) {
    const season = await this.getSeasonById(id);
    if (!season) return null;
    Object.assign(season, seasonData);
    return await season.save();
  },

  // Delete a season by ID
  async deleteSeason(id) {
    return await Season.findByIdAndDelete(id);
  },

  async getCurrentActiveSeason() {
    const today = Date.now();
    const data = await Season.findOne({
      active: true,
      startDate: { $lte: today },
      endDate: { $gte: today },
    });
    return data;
  },
};

export default seasonDAO;

// Utility function to convert DD/MM/YYYY to ISO format
function convertToISO(dateString) {
  const parts = dateString.split("/");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Please use DD/MM/YYYY.");
  }

  const [day, month, year] = parts;
  return new Date(year, month - 1, day).toISOString();
}
