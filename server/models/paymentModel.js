import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  payerId: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Completed", "Canceled"],
  },
  date: {
    type: Date,
    required: true,
  },
  reference_id: {
    type: String,
    required: true,
  },
});

// Create the model
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
