const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers");
router
  .route("/")
  .get(categoryControllers.getAllCategories)
  .post(categoryControllers.createCategory);
router
  .route("/:id")
  .get(categoryControllers.getCategoryById)
  .delete(categoryControllers.deleteCategory)
  .patch(categoryControllers.updateCategory);
module.exports = router;
