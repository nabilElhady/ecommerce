import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    coverImage: null,
    images: [],
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-backend-wine-one.vercel.app/api/v1/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "coverImage") {
      setFormData((prevData) => ({ ...prevData, coverImage: files[0] }));
    } else if (name === "images") {
      const selectedImages = Array.from(files).slice(0, 4 - imageCount);
      const updatedImages = [...formData.images, ...selectedImages].slice(0, 4);
      setFormData((prevData) => ({ ...prevData, images: updatedImages }));
      setImageCount(updatedImages.length);
      if (updatedImages.length === 4) {
        alert("You have selected the maximum of 4 images.");
      }
    }
  };

  const handleCategoryChange = (e) => {
    setFormData((prevData) => ({ ...prevData, category: e.target.value }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.title) formErrors.title = "Title is required.";
    if (!formData.description)
      formErrors.description = "Description is required.";
    if (!formData.price) formErrors.price = "Price is required.";
    if (!formData.coverImage)
      formErrors.coverImage = "Cover image is required.";
    if (formData.images.length !== 4)
      formErrors.images = "Exactly 4 images are required.";
    if (!formData.category) formErrors.category = "Category is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = new FormData();
    productData.append("title", formData.title);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("category", formData.category);
    if (formData.coverImage) {
      productData.append("coverImage", formData.coverImage);
    }
    formData.images.forEach((image, index) => {
      productData.append(`images[${index}]`, image);
    });

    // Log FormData entries for debugging
    for (let pair of productData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      const response = await axios.post(
        "https://ecommerce-backend-wine-one.vercel.app/api/v1/products",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product created:", response.data);
      setMessage("Product created successfully!");
      setFormData({
        title: "",
        description: "",
        price: "",
        coverImage: null,
        images: [],
        category: "",
      });
      setImageCount(0);
      setErrors({});
    } catch (error) {
      console.error("Error creating product:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Error creating product. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Create Product
        </h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Product Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter product title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter product description"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter product price"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="coverImage"
            >
              Cover Image
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            {errors.coverImage && (
              <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="images"
            >
              Additional Images (up to 4 images)
            </label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <p className="text-sm text-gray-600 mt-1">
              You have selected {imageCount} images.
            </p>
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">{errors.images}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-yellow-200 text-black px-4 py-2 rounded font-bold text-lg hover:bg-yellow-400 transition-colors duration-300 w-full"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
