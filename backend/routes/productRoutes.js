const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");
const multer = require("multer");
const path = require("path");
const verifyAdmin = require("./verfyAdmin");

// Initialize image counter
let imageCounter = 0;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../dev-data/images/products")); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    const { title } = req.body;
    const ext = path.extname(file.originalname);
    if (file.fieldname === "coverImage") {
      cb(null, `${title}-cover${ext}`);
    } else if (file.fieldname === "images") {
      cb(null, `${title}-${imageCounter}${ext}`);
      imageCounter++;
    } else {
      cb(null, file.originalname); // Default behavior
    }
  },
});

const upload = multer({ storage });

// Route to create a new product with file upload
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  (req, res, next) => {
    imageCounter = 0; // Reset the counter for each request
    next(); // Continue to the createProduct controller
  },
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
