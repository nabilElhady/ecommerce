import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Page size can be customized

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/products?page=${currentPage}&limit=${pageSize}`
        );
        setProducts(response.data.products);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [currentPage, pageSize]);

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Management</h2>
        <Link to="/create-product">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Product
          </button>
        </Link>
      </div>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="p-4 bg-gray-50 rounded shadow">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:8000/images/products/${product.coverImage}`}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex flex-col items-center md:items-start">
                  <div className="font-semibold text-black">{product.name}</div>
                  <div className="text-black">${product.price}</div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="text-black">
                  Rating:{" "}
                  {product.avgRating ? product.avgRating.toFixed(1) : "N/A"}
                </div>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Previous
        </button>
        <span className="text-black">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductManagement;
