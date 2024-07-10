import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { logout } from "../../store/authSlice";
import { filteredList } from "../../store/listSlice";
import LoadingSpinner from "../LoadingSpinner";
import CategoriesMenu from "./CategoriesMenu";
import SearchBar from "./SearchBar";
import Cart from "./Cart";
import MobileMenu from "./MobileMenu";
import logo from "../images/logo-no-background.png";
require("dotenv").config({ path: "./config.env" });

const Navbar = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useSelector((state) => state.cart.items);
  const [items, setItems] = useState([]);
  const cartCount = cartItems.length;
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (cookies.user) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/carts/${cookies.user._id}`
          );
          const productsIds = response.data.products;
          setItems(productsIds);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [cartCount, cookies.user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/categories`);

        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, [cookies.user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(".search-results")
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsCategoriesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false);
    }, 2000);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCategory = async (categoryId) => {
    try {
      setLoading(true);
      console.log(API_BASE_URL);
      const response = await axios.get(`${API_BASE_URL}/categories`);

      dispatch(filteredList(response.data));
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setLoading(false);
      throw error;
    }
  };

  const handleIncreaseItem = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/carts/${cookies.user._id}/increase`,
        { productId: id }
      );
      console.log(response.data);
      setItems(response.data.products);
    } catch (error) {
      console.error("Error increasing item quantity:", error);
    }
  };

  const handleDecreaseItem = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/carts/${cookies.user._id}/decrease`,
        { productId: id }
      );
      setItems(response.data.products);
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/carts/${cookies.user._id}/remove`,
        { productId: id }
      );
      setItems(response.data.products);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleLogout = () => {
    removeCookie("user", { path: "/" });
    removeCookie("token", { path: "/" });
    dispatch(logout());
    window.location.href = "/";
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/products/search?query=${searchQuery}`
      );
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error searching for products:", error);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/item/${id}`);
    setSearchResults([]);
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/products`
        );
        dispatch(filteredList(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-200 py-4 relative z-30">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="text-white lg:hidden focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon
              icon={faBars}
              className="hover:text-gray-400 transition-colors duration-200"
            />
          </button>
          <img className="w-12 h-12" src={logo}></img>
        </div>

        <CategoriesMenu
          isOpen={isCategoriesOpen}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          categories={categories}
          handleCategory={handleCategory}
        />

        <SearchBar
          searchRef={searchRef}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          handleSearchFocus={handleSearchFocus}
          handleSearchBlur={handleSearchBlur}
          handleSearchSubmit={handleSearchSubmit}
          searchResults={searchResults}
          handleResultClick={handleResultClick}
        />

        <div className="flex items-center">
          <button
            className="text-white focus:outline-none relative"
            onClick={toggleCart}
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="hover:text-gray-400 transition-colors duration-200"
            />
            {cartCount > 0 ? (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                {cartCount}
              </span>
            ) : (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                {items.length}
              </span>
            )}
          </button>
          <Cart
            isOpen={isCartOpen}
            toggleCart={toggleCart}
            items={items}
            setItems={setItems}
            loading={loading}
            handleIncreaseItem={handleIncreaseItem}
            handleDecreaseItem={handleDecreaseItem}
            handleRemoveItem={handleRemoveItem}
          />
        </div>

        {cookies.user ? (
          <button
            onClick={handleLogout}
            className="text-white focus:outline-none ml-4 hover:text-gray-400 transition-colors duration-200"
          >
            Logout
          </button>
        ) : (
          <Link to={"/signup"}>
            <button className=" font-bold text-white  outline-text focus:outline-none ml-4 hover:text-yellow-400 hover:bg-gray-600 transition-colors duration-200  py-1 px-3 rounded">
              Sign Up
            </button>
          </Link>
        )}
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        categories={categories}
        handleCategory={handleCategory}
        handleLogout={handleLogout}
        user={cookies.user}
      />
    </nav>
  );
};

export default Navbar;
