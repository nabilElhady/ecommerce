const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");
const multer = require("multer");
const path = require("path");

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Use memory storage to handle files in memory
const upload = multer({ storage });

// Route to create a new product with file upload
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  productControllers.createProduct
);

// Other routes for getting, updating, and deleting products
router.route("/").get(productControllers.getAllProducts);

router.get("/search", productControllers.findItem);

router
  .route("/:id")
  .get(productControllers.getProductById)
  .delete(productControllers.deleteProduct)
  .patch(productControllers.updateProduct);

router.get("/category/:categoryId", productControllers.getProductsByCategory);

module.exports = router;
