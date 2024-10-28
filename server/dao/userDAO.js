// dao/userDAO.js
import User from "../models/userModel.js";
import APIFeatures from "../utils/APIFeatures.js";
import AppError from "../utils/appError.js";

class UserDAO {
  async getAllUsers(queryObj) {
    // Exclude users with the 'admin' role
    const features = new APIFeatures(
      User.find({ role: { $ne: "admin" } }),
      queryObj
    )
      .filter()
      .paginate()
      .sort()
      .limitFields();

    return await features.sqlQuery;
  }

  async getUserById(queryObj, id, withPassword = false) {
    const user = await User.findById(id);

    if (!user || user.role === "admin") {
      throw new AppError("User not found", 404);
    }

    let query = User.findById(id);

    if (withPassword) query = query.select("+password");

    const features = new APIFeatures(query, queryObj).limitFields();
    return await features.sqlQuery;
  }

  async deleteUserById(id) {
    return await User.findByIdAndDelete(id);
  }

  async updateUserById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async findUserByEmail(email) {
    const sqlQuery = User.findOne({ email }).select("+password");
    return await sqlQuery;
  }

  async findUserById(id) {
    return await User.findById(id);
  }
}

export default new UserDAO();
