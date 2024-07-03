const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Products = require("../../model/productModel"); // Adjust the path to your model
const User = require("../../model/userModel");
const Category = require("../../model/CategoryModel");
const Review = require("../../model/reviewModel");
dotenv.config({ path: "../../config.env" }); // Adjust the path to your config file

const DB = process.env.DataBaseURL;
const importData = async () => {
  try {
    const users = JSON.parse(
      fs.readFileSync(`${__dirname}/../data/users.json`, "utf-8")
    ); // Adjust the path to your JSON file
    await User.create(users);
    console.log("Data successfully loaded");
  } catch (err) {
    console.error("Error loading data:", err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany(); // Ensure you are deleting from the correct model
    console.log("Data successfully deleted");
  } catch (err) {
    console.error("Error deleting data:", err);
  }
};

mongoose
  .connect(
    "mongodb://nabilelhady73:NLAswc123@ac-82n0wqd-shard-00-00.an5lxer.mongodb.net:27017,ac-82n0wqd-shard-00-01.an5lxer.mongodb.net:27017,ac-82n0wqd-shard-00-02.an5lxer.mongodb.net:27017/?ssl=true&replicaSet=atlas-10ylpm-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connection successful");

    // Decide which action to perform based on command line arguments
    if (process.argv[2] === "--import") {
      importData();
    } else if (process.argv[2] === "--delete") {
      deleteData();
    }
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
