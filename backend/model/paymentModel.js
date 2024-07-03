const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema({
  order: { type: mongoose.Schema.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, default: "Pending" },
  transaction_id: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
