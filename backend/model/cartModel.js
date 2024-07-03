const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      image: String,
      title: String,
      description: String,
      price: Number,
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
