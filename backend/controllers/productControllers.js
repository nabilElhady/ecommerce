const Product = require("../model/productModel");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to convert buffer to stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Upload image to Cloudinary
const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    });

    bufferToStream(file.buffer).pipe(stream);
  });
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    // Handle file uploads
    const coverImage = req.files["coverImage"]
      ? req.files["coverImage"][0]
      : null;
    const images = req.files["images"] ? req.files["images"] : [];

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

    // Upload images to Cloudinary
    const coverImageUrl = coverImage ? await uploadImage(coverImage) : null;
    const imageUrls = await Promise.all(
      images.map((file) => uploadImage(file))
    );

    // Create a new product instance
    const newProduct = new Product({
      name: title,
      description,
      price,
      coverImage: coverImageUrl,
      images: imageUrls,
      category,
    });

    // Save the new product to the database
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
