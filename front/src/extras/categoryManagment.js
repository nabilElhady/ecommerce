import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/v1/categories"
      );
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    const response = await axios.post(
      "http://localhost:8000/api/v1/categories",
      newCategory
    );
    setCategories([...categories, response.data]);
  };

  const handleDeleteCategory = async (id) => {
    await axios.delete(`http://localhost:8000/api/v1/categories/${id}`);
    setCategories(categories.filter((category) => category._id !== id));
  };

  return (
    <div className="category-management">
      <h2>Category Management</h2>
      <div className="category-list">
        {categories.map((category) => (
          <div key={category._id}>
            <p>{category.name}</p>
            <button onClick={() => handleDeleteCategory(category._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="add-category">
        <h3>Add Category</h3>
        <input
          type="text"
          placeholder="Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
    </div>
  );
};

export default CategoryManagement;
