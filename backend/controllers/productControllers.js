// Import the Product model from the productModel file and multer for file handling
const Product = require("../model/productModel");
const multer = require("multer");

// Controller to create a new product
exports.createProduct = async (req, res) => {
  try {
    // Destructure product details from the request body
    const { title, description, price, category } = req.body;

    // Handle file uploads
    const coverImage = req.files["coverImage"]
      ? req.files["coverImage"][0].filename
      : null;
    const images = req.files["images"]
      ? req.files["images"].map((file, index) => ({
          path: file.filename,
          index: index + 1,
        }))
      : [];

    // Check if exactly 4 images are provided
    if (images.length !== 4) {
      return res.status(400).json({
        success: false,
        error: "Images array must contain exactly 4 elements",
      });
    }

    // Check if a product with the same title already exists
    const existingProduct = await Product.findOne({ name: title });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: "Product with this name already exists",
      });
    }

    // Create a new product instance
    const newProduct = new Product({
      name: title,
      description,
      price,
      coverImage,
      images: images.map((img) => img.path),
      category,
    });

    // Save the new product to the database
    const product = await newProduct.save();
    // Send a response with status 201 (Created) and the new product object
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // If there's an error, send a response with status 500 (Internal Server Error) and the error message
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Controller to find a product by query
exports.findItem = async (req, res) => {
  try {
    // Get the search query from the request query parameters
    const query = req.query.query;
    // Find products that match the search query (case-insensitive)
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    // Send a response with the found products
    res.json(products);
  } catch (error) {
    // If there's an error, send a response with status 500 (Internal Server Error) and the error message
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    // Get the page and limit query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find products with pagination
    const products = await Product.find().skip(skip).limit(limit);
    // Get the total number of products
    const total = await Product.countDocuments();
    // Send a response with the products, total count, current page, and total pages
    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a product by its ID
exports.getProductById = async (req, res) => {
  try {
    // Find a product by its ID
    const product = await Product.findById(req.params.id);
    // If no product is found, send a response with status 404 (Not Found)
    if (!product) return res.status(404).json({ message: "Product not found" });
    // Send a response with the product object
    res.status(200).json(product);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a product by its ID
exports.updateProduct = async (req, res) => {
  try {
    // Find a product by its ID and update it with the data from the request body
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // If no product is found, send a response with status 404 (Not Found)
    if (!product) return res.status(404).json({ message: "Product not found" });
    // Send a response with the updated product object
    res.status(200).json(product);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a product by its ID
exports.deleteProduct = async (req, res) => {
  try {
    // Find a product by its ID and delete it
    const product = await Product.findByIdAndDelete(req.params.id);
    // If no product is found, send a response with status 404 (Not Found)
    if (!product) return res.status(404).json({ message: "Product not found" });
    // Send a response with a success message
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get products by category ID
exports.getProductsByCategory = async (req, res) => {
  try {
    // Get the category ID from the request parameters
    const categoryId = req.params.categoryId;
    // Find products that belong to the specified category and populate the category details
    const products = await Product.find({ category: categoryId }).populate(
      "category"
    );
    // If no products are found, send a response with status 404 (Not Found)
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }
    // Send a response with the found products
    res.status(200).json(products);
  } catch (error) {
    // If there's an error, send a response with status 500 (Internal Server Error) and the error message
    res.status(500).json({ message: error.message });
  }
};
