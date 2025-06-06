// controllers/userController.js
import userDAO from "../dao/userDAO.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import filterObj from "../utils/filterObj.js";
import validateInput from "../utils/validateInput.js";
import { updateSchema } from "../validations/userValidation.js";
import cloudinary from "cloudinary";

export const getAllUsers = catchAsync(async (req, res) => {
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
  const user = await userDAO.getUserById(req.params.id, req.query);
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
  const allowedFields = ["username", "statusText"];
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

export const uploadAvatar = catchAsync(async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return next(
      new AppError("Invalid file type. Please upload an image.", 400)
    );
  }

  // Convert buffer to Base64-encoded data URI
  const base64Image = `data:${
    req.file.mimetype
  };base64,${req.file.buffer.toString("base64")}`;

  // Upload directly to Cloudinary
  const result = await cloudinary.v2.uploader.upload(base64Image, {
    folder: "avatars",
    invalidate: true,
  });

  console.log(result);

  // Extract the secure URL of the uploaded image
  const avatarUrl = result.secure_url;

  // Update user avatarUrl
  await userDAO.updateUserById(req.user.id, { avatarUrl });

  res.status(200).json({
    status: "success",
    message: "Avatar uploaded successfully!",
    avatarUrl,
  });
});

export const getAllOnlineFriendMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  const data = await userDAO.getAllOnlineFriendById(user._id.toString());
  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getAllFriendMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  const data = await userDAO.getAllFriendById(user._id.toString());
  res.status(200).json({
    status: "success",
    data: data,
  });
});

export const getAllIncomingChallengeMe = catchAsync(async (req, res, next) => {
  const user = req.user;
  const data = await userDAO.getAllIncomingChallengeById(user._id.toString());
  res.status(200).json({
    status: "success",
    data: data,
  });
});
