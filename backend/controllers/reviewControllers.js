// Import the Review model from the reviewModel file
const Review = require("../model/reviewModel");

// Controller to create a new review
exports.createReview = async (req, res) => {
  try {
    // Create a new review instance with the data from the request body
    const review = new Review(req.body);
    // Save the new review to the database
    await review.save();
    // Send a response with status 201 (Created) and the review object
    res.status(201).json(review);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    // Find all reviews and populate the user and product fields
    const reviews = await Review.find().populate("user").populate("product");
    // Send a response with the found reviews
    res.status(200).json(reviews);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a review by its ID
exports.getReviewById = async (req, res) => {
  try {
    // Find a review by its ID and populate the user and product fields
    const review = await Review.findById(req.params.id)
      .populate("user")
      .populate("product");
    // If no review is found, send a response with status 404 (Not Found)
    if (!review) return res.status(404).json({ message: "Review not found" });
    // Send a response with the review object
    res.status(200).json(review);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a review by its ID
exports.updateReview = async (req, res) => {
  try {
    // Find a review by its ID and update it with the data from the request body
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // If no review is found, send a response with status 404 (Not Found)
    if (!review) return res.status(404).json({ message: "Review not found" });
    // Send a response with the updated review object
    res.status(200).json(review);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a review by its ID
exports.deleteReview = async (req, res) => {
  try {
    // Find a review by its ID and delete it
    const review = await Review.findByIdAndDelete(req.params.id);
    // If no review is found, send a response with status 404 (Not Found)
    if (!review) return res.status(404).json({ message: "Review not found" });
    // Send a response with a success message
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};
