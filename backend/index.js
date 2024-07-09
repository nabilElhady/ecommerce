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
require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");

const DB = process.env.DataBaseURL;
const corsOptions = {
  origin: "https://ecommerce-frontend-pi-fawn.vercel.app", // Replace with your frontend URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON requests
const imagesPath = path.join(__dirname, "./dev-data/images");
console.log("Serving static files from:", imagesPath);

app.use("/images", express.static(imagesPath));
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/carts", cartRoutes);
app.get("/api", (req, res) => {
  res.send({ message: "Hello from the backend!", db: DB });
});
app.get("/", (req, res) => {
  res.send({ message: "Hello from the backend!1", DB: DB });
});
console.log(DB);
mongoose.connect(DB, {}).then((con) => {
  console.log("connection to db is done");
});
app.listen(8000, () => {
  console.log(`app is running on port 8000`);
});
module.exports = app;
