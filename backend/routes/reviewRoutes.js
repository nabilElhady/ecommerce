const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewControllers");

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);
router
  .route("/:id")
  .get(reviewController.getReviewById)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);
module.exports = router;
