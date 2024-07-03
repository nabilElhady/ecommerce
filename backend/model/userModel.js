const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  isAdmin: { type: Boolean, default: false },
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // New field for purchases
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
