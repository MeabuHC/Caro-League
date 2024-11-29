import AppError from "./appError.js";

const validateInput = (data, schema) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    console.log(error);
    const errorMessages = error.details.map((err) => err.message);
    throw new AppError(`Validation failed: ${errorMessages.join(", ")}`, 400);
  }
};

export default validateInput;
