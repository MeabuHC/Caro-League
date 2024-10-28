import jwt from "jsonwebtoken";
import { promisify } from "util";

// Function to extract JWT token from cookies
export function getTokenFromCookies(cookieHeader) {
  const token = cookieHeader
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];
  return token;
}

// Function to sign tokens
export const signToken = (payload, type) => {
  let expiresIn;

  // Determine expiration time based on token type
  switch (type) {
    case "access":
      expiresIn = process.env.ACCESS_TOKEN_EXPIRATION || "1d";
      break;
    case "refresh":
      expiresIn = process.env.REFRESH_TOKEN_EXPIRATION || "7d";
      break;
    case "email":
      expiresIn = process.env.EMAIL_TOKEN_EXPIRATION || "1d";
      break;
    default:
      throw new Error("Invalid token type");
  }

  // Sign the token with the specified expiration time
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export const getTokenPayload = async (token) => {
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return decoded;
};

//Parse 90d to mili
export const parseExpiration = (expiration) => {
  const unit = expiration.slice(-1);
  const value = parseInt(expiration.slice(0, -1), 10);

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000; // days to milliseconds
    case "h":
      return value * 60 * 60 * 1000; // hours to milliseconds
    case "m":
      return value * 60 * 1000; // minutes to milliseconds
    case "s":
      return value * 1000; // seconds to milliseconds
    default:
      throw new Error("Invalid expiration format");
  }
};
