// controllers/userController.js
import userDAO from "../dao/userDAO.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import filterObj from "../utils/filterObj.js";
import validateInput from "../utils/validateInput.js";
import { updateSchema } from "../validations/userValidation.js";

export const getAllUsers = catchAsync(async (req, res) => {
  console.log(req.query);
  const users = await userDAO.getAllUsers(req.query);
  res.status(200).json({
    message: "success",
    results: users.length,
    data: {
      users: users,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await userDAO.getUserById(req.query, req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    message: "success",
    data: {
      user: user,
    },
  });
});

export const sendMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const allowedFields = ["username"];
  const body = filterObj(req.body, allowedFields);

  validateInput(body, updateSchema);

  const user = await userDAO.updateUserById(req.user.id, body);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});
