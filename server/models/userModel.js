import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

//Password regex
const regex =
  /^(?=(?:[^a-zA-Z]*[a-zA-Z]){1})(?=(?:[^\d]*\d){1})(?=(?:[^\W_]*[\W_]){1}).{3,}$/;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [10, "Username cannot exceed 10 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [20, "Password cannoto exceed 20 characters"],
      select: false,
      validate: {
        validator: function (v) {
          return regex.test(v);
        },
        message:
          "Password must contain at least one letter, one number, and one special character.",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    avatarUrl: {
      type: String,
      default: "/img/default-avatar.jpg", // Relative path to the default avatar
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["admin", "player"],
      default: "player",
    },
  },
  {
    versionKey: false,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//Change password
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  //Login Token is invalid if user changes password after the token was issued
  next();
  this.passwordChangedAt = Date.now() - 1000; //Minus 1 seconds to synchronise
});

//JWT saves seconds, date.getTime() return miliseconds
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  //Haven't change password
  return false;
};

userSchema.methods.correctPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
