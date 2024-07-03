const express = require("express"); // Express framework for handling HTTP requests
const app = express(); // Create an Express application
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests
app.use(
  "/dev-data/images",
  express.static(path.join(__dirname, "dev-data/images"))
);

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/carts", cartRoutes);

module.exports = app;
