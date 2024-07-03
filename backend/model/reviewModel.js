const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
