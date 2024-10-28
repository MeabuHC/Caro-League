import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
}).unknown(false);

export const signupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Disable TLD validation for more flexibility
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
}).unknown(false);

export const setupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Disable TLD validation for more flexibility
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),

  username: Joi.string().trim().min(3).max(20).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 20 characters",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .messages({
      "string.empty": "Confirm Password is required",
      "any.only": "Confirm Password must match Password",
    })
    .required(),
}).unknown(false);
