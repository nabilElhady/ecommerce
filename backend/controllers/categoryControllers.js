// Import the Category model from the CategoryModel file
const Category = require("../model/CategoryModel");

// Controller to create a new category
exports.createCategory = async (req, res) => {
  try {
    // Create a new category using the data from the request body
    const newcategory = await Category.create(req.body);
    // Send a response with status 201 (Created) and the new category object
    res.status(201).json(newcategory);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get all categories
exports.getAllCategories = async (req, res) => {
  try {
    // Find all categories. Optionally, populate the products if needed
    // const categories = await Category.find().populate('products');
    const categories = await Category.find();
    // Send a response with status 200 (OK) and the list of categories
    res.status(200).json(categories);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a category by its ID
exports.getCategoryById = async (req, res) => {
  try {
    // Find a category by its ID. Optionally, populate the products if needed
    // const category = await Category.findById(req.params.id).populate("products");
    const category = await Category.findById(req.params.id);
    // If no category is found, send a response with status 404 (Not Found)
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    // Send a response with status 200 (OK) and the category object
    res.status(200).json(category);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a category
exports.updateCategory = async (req, res) => {
  try {
    // Find a category by its ID and update it with the data from the request body
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // If no category is found, send a response with status 404 (Not Found)
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    // Send a response with status 200 (OK) and the updated category object
    res.status(200).json(category);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Find a category by its ID and delete it
    const category = await Category.findByIdAndDelete(req.params.id);
    // If no category is found, send a response with status 404 (Not Found)
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    // Send a response with status 200 (OK) and a success message
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};
