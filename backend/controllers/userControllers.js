// Import necessary modules and the User model
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Controller to register a new user
exports.registerUser = async (req, res) => {
  try {
    // Hash the user's password with a salt rounds value of 10
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Create a new user with the hashed password
    const newuser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    // Send a response with status 201 (Created) and the new user object
    res.status(201).json(newuser);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to log in a user
exports.loginUser = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    // Check if the user exists and the password is correct
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      // If credentials are invalid, send a response with status 400 (Bad Request) and an error message
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate a JWT token with the user's ID and a secret key, set to expire in 20 seconds
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", {
      expiresIn: "20s",
    });
    // Send a response with status 200 (OK), a success message, the token, and the user object
    return res.status(200).json({ message: "Login successful!", token, user });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();
    // Send a response with status 200 (OK) and the users array
    res.status(200).json(users);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a user by ID
exports.getUserById = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    // If no user is found, send a response with status 404 (Not Found)
    if (!user) return res.status(404).json({ message: "User not found" });
    // Send a response with status 200 (OK) and the user object
    res.status(200).json(user);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a user by ID
exports.updateUser = async (req, res) => {
  try {
    // Find the user by ID and update it with the data from the request body, returning the new document
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // If no user is found, send a response with status 404 (Not Found)
    if (!user) return res.status(404).json({ message: "User not found" });
    // Send a response with status 200 (OK) and the updated user object
    res.status(200).json(user);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(req.params.id);
    // If no user is found, send a response with status 404 (Not Found)
    if (!user) return res.status(404).json({ message: "User not found" });
    // Send a response with status 200 (OK) and a success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};
