const Product = require("../model/productModel");
const cloudinary = require("cloudinary").v2;

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    // Handle file uploads
    let coverImage;
    const images = [];

    if (req.files && req.files.coverImage) {
      const result = await cloudinary.uploader.upload(
        req.files.coverImage.tempFilePath
      );
      coverImage = result.secure_url;
    }

    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      for (const file of imageFiles) {
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        images.push(result.secure_url);
      }
    }

    if (images.length !== 4) {
      return res.status(400).json({
        success: false,
        error: "Images array must contain exactly 4 elements",
      });
    }

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: "Product with this name already exists",
      });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      coverImage,
      images,
      category,
    });

    const product = await newProduct.save();
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Find a product by query
exports.findItem = async (req, res) => {
  try {
    const query = req.query.query;
    const products = await Product.find({
      title: { $regex: query, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products with pagination
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();
    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a product by its ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a product by its ID
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by its ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get products by category ID
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.find({ category: categoryId }).populate(
      "category"
    );
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
