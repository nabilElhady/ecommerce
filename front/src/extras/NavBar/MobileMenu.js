import React from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({
  isOpen,
  toggleMobileMenu,
  categories,
  handleCategory,
  handleLogout,
  user,
}) => {
  return (
    isOpen && (
      <div className="lg:hidden absolute top-full left-0 w-full bg-gray-800 shadow-lg z-40">
        <ul>
          <li className="border-b border-gray-700">
            <button
              className="block text-white px-4 py-2 w-full text-left focus:outline-none"
              onClick={toggleMobileMenu}
            >
              Categories
            </button>
          </li>
          {categories.map((category) => (
            <li key={category._id} className="border-b border-gray-700">
              <Link
                onClick={() => handleCategory(category._id)}
                className="block text-white px-4 py-2 hover:bg-gray-700"
              >
                {category.name}
              </Link>
            </li>
          ))}
          <li className="border-b border-gray-700">
            <Link
              to="/cart"
              className="block text-white px-4 py-2 hover:bg-gray-700"
            >
              Cart
            </Link>
          </li>
          {user && (
            <li className="border-b border-gray-700">
              <button
                onClick={handleLogout}
                className="block text-white px-4 py-2 w-full text-left focus:outline-none"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    )
  );
};

export default MobileMenu;
