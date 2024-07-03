const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  products: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
