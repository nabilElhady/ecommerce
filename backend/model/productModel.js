const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  coverImage: { type: String, required: true },
  images: [{ type: String, required: true }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
