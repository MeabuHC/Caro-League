import rateLimit from "express-rate-limit";

// Limit requests to 5 per hour per IP for the signup route
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 requests per hour
  message: "Too many signups from this IP, please try again after an hour",
});
