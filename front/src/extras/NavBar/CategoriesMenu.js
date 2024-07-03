import React from "react";
import { Link } from "react-router-dom";

const CategoriesMenu = ({
  isOpen,
  handleMouseEnter,
  handleMouseLeave,
  categories,
  handleCategory,
}) => {
  return (
    <div className="hidden lg:flex items-center">
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="font-bold text-white  outline-text focus:outline-none ml-4 hover:text-yellow-400 hover:bg-gray-600 transition-colors duration-200  py-1 px-3 rounded">
          Categories
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-40">
            {categories.map((category) => (
              <Link
                key={category._id}
                onClick={() => handleCategory(category._id)}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesMenu;
