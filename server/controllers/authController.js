// controllers/userController.js
import userDAO from "../dao/userDAO.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  signupSchema,
  loginSchema,
  setupSchema,
  changePasswordSchema,
} from "../validations/userValidation.js";
import validateInput from "../utils/validateInput.js";
import { sendVerifyEmail } from "../utils/email.js";
import {
  signToken,
  getTokenPayload,
  parseExpiration,
} from "../utils/authUtils.js";

const createSendTokens = async (user, res) => {
  const accessToken = signToken({ id: user._id }, "access");
  const refreshToken = signToken({ id: user._id }, "refresh");

  res.cookie("accessToken", accessToken, {
    maxAge: parseExpiration(process.env.ACCESS_TOKEN_EXPIRATION),
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: parseExpiration(process.env.REFRESH_TOKEN_EXPIRATION),
  });

  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
};

export const refreshToken = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies; // Get refresh token from cookies
  if (accessToken) {
    return res.status(200).json({ message: "Access token still valid" });
  }

  // Validate refresh token
  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 401));
  }

  const decoded = await getTokenPayload(refreshToken); // Decode refresh token

  // Check if the user still exists
  const freshUser = await userDAO.findUserById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token no longer exists!", 401)
    );
  }

  // Create new access token
  const newAccessToken = signToken({ id: freshUser._id }, "access");

  res.cookie("accessToken", newAccessToken, {
    maxAge: parseExpiration(process.env.ACCESS_TOKEN_EXPIRATION),
  });

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
  });
});

export const signup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const data = { email };
  validateInput(data, signupSchema);

  //Email existed
  if (await userDAO.findUserByEmail(email)) {
    return next(new AppError("Email already used!", 409));
  }

  const emailToken = signToken({ email: email }, "email");
  await sendVerifyEmail(
    email,
    `http://localhost:8080/verify-email/${emailToken}`
  );
  res.status(200).json({
    status: "success",
    message: "Verification email sent! Please check your inbox.",
  });
});

// Get email from token : Stop client getting to setup UI
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.body; // Get token from request body
  console.log(`This is token: ${token}`);

  const { email } = await getTokenPayload(token);

  // No email field
  if (!email) return next(new AppError("Invalid token!"), 400);

  // Email already exists
  if (await userDAO.findUserByEmail(email)) {
    return next(new AppError("Email already used!", 409));
  }

  res.status(200).json({
    status: "success",
    data: email,
  });
});

//Final setup
export const setup = catchAsync(async (req, res, next) => {
  const { token, username, password, confirmPassword } = req.body;
  const { email } = await getTokenPayload(token);

  //No email field
  if (!email) return next(new AppError("Invalid token!"), 400);

  //Check data format
  validateInput({ email, username, password, confirmPassword }, setupSchema);

  //Email existed
  if (await userDAO.findUserByEmail(email)) {
    return next(new AppError("Email already used!", 409));
  }

  const userData = { email, username, password };
  // Create the user using the DAO
  const user = await userDAO.createUser(userData);
  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    status: "success",
    message: "Your setup is complete! You can now log in.",
    data: user,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const data = { email, password };
  validateInput(data, loginSchema);

  // Find user by email using the DAO
  const user = await userDAO.findUserByEmail(email);

  // Check if user exists && correct password
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // Delete password from user
  user.password = undefined;

  await createSendTokens(user, res);
});

export const logout = (req, res) => {
  // Clear the JWT cookies
  res.cookie("accessToken", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
};

export const protect = catchAsync(async (req, res, next) => {
  // Check for access token in cookies
  const accessToken = req.cookies.accessToken;

  // Validate accessToken
  if (!accessToken) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await getTokenPayload(accessToken);

  // Check if user still exists
  const freshUser = await userDAO.findUserById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token no longer exists!", 401)
    );
  }

  //Check if user changed password after token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Pass the user to the next middleware
  req.user = freshUser;
  next();
});

// Middleware to restrict access based on user roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user is authenticated and has a role
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const changePassword = catchAsync(async (req, res, next) => {
  validateInput(req.body, changePasswordSchema);
  const user = await userDAO.getUserById(req.query, req.user.id, true);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  //Wrong password
  if (!(await user.correctPassword(req.body.oldPassword))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  //Handle change password
  user.password = req.body.newPassword;
  await user.save();

  //Remove password from output
  user.password = undefined;

  //Send new token
  await createSendTokens(user, res);
});
