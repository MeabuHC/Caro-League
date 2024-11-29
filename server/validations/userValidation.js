import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),

  password: Joi.string().max(20).required().messages({
    "string.empty": "Password is required",
    "string.max": "Username cannot exceed 10 characters",
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

  username: Joi.string().trim().min(3).max(10).required().messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 10 characters",
  }),

  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Username cannot exceed 10 characters",
      "string.pattern.base":
        "Password must contain at least one letter, one number, and one special character.",
    })
    .pattern(
      /^(?=(?:[^a-zA-Z]*[a-zA-Z]){1})(?=(?:[^\d]*\d){1})(?=(?:[^\W_]*[\W_]){1}).{3,}$/
    ),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .max(20)
    .messages({
      "string.empty": "Confirm Password is required",
      "any.only": "Confirm Password must match Password",
    })
    .required(),
}).unknown(false);

export const updateSchema = Joi.object({
  username: Joi.string().trim().min(3).max(10).messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 10 characters",
  }),
  statusText: Joi.string().min(0).max(50).messages({
    "string.min": "Status text must be at least 0 characters long",
    "string.max": "Status text cannot exceed 50 characters",
  }),
}).unknown(false);

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().max(20),

  newPassword: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 20 characters",
      "string.pattern.base":
        "Password must contain at least one letter, one number, and one special character.",
    })
    .pattern(
      /^(?=(?:[^a-zA-Z]*[a-zA-Z]){1})(?=(?:[^\d]*\d){1})(?=(?:[^\W_]*[\W_]){1}).{3,}$/
    ),

  confirmPassword: Joi.string()
    .max(20)
    .valid(Joi.ref("newPassword"))
    .messages({
      "string.empty": "Confirm Password is required",
      "any.only": "Confirm Password must match New Password",
    })
    .required(),
}).unknown(false);
