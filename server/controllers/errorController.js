import AppError from "./../utils/appError.js";

//3 situations:
//1) Error that we defined: wrong username, wrong password, v...v => Return AppError
//2) Error that we know and handle: castError, duplicateField, ... => Return AppError
//3) Weird errors

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // Get all field names that caused the duplicate error and capitalize the first letter
  const fields = Object.keys(err.keyValue).map(
    (field) => field.charAt(0).toUpperCase() + field.slice(1)
  );

  const linking = fields.length > 1 ? "are" : "is";
  const message = `${fields.join(", ")} ${linking} already in use`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleUserValidationErrorDB = (err) => {
  return new AppError(err.message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired!", 401);
};

const sendError = (err, res) => {
  //Operational, trusted error a.k.a AppError: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error: don't leak error details
  } else {
    //2) Send generic message
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || "Something went very wrong!",
    });
  }
};

export default (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Create a copy of the error object => only copy NUMERABLE => message is not included
  let error = { ...err };
  error.message = err.message; // Explicitly copy the message

  // Handle specific errors
  if (error.kind === "ObjectId") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error._message === "Validation failed")
    error = handleValidationErrorDB(error);
  if (error._message === "User validation failed")
    error = handleUserValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  sendError(error, res);
};
