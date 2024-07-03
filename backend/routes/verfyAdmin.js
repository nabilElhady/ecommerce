// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../model/userModel"); // Assuming you have a User model

const verifyAdmin = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id);

    // Check if user is admin
    if (user && user.role === "admin") {
      req.user = user; // Attach user to request object
      next(); // Proceed to the next middleware/controller
    } else {
      res.status(403).json({ message: "Forbidden: Admins only" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyAdmin;
