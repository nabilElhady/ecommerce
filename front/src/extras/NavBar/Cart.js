import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import CartItem from "../CartItem";
import { useCookies } from "react-cookie";

// Cart component definition
const Cart = ({
  isOpen, // Prop to control the visibility of the cart
  toggleCart, // Prop to handle the toggle action for the cart
  handleIncreaseItem, // Prop to handle increasing the quantity of an item
  handleDecreaseItem, // Prop to handle decreasing the quantity of an item
  handleRemoveItem, // Prop to handle removing an item from the cart
}) => {
  const cartRef = useRef(null); // Ref to the cart element for detecting outside clicks
  const [items, setItems] = useState([]); // State to store cart items
  const [loading, setLoading] = useState(false); // State to manage loading spinner
  const [cookies] = useCookies(["user"]); // Hook to manage cookies

  // Handle click outside the cart to close it
  const handleClickOutside = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      toggleCart();
    }
  };

  // Effect to add and remove event listener for outside clicks when the cart is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      fetchCartItems();
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Function to fetch cart items from the server
  const fetchCartItems = async () => {
    if (!cookies.user) return; // If no user is logged in, do nothing
    setLoading(true); // Start loading spinner
    try {
      const response = await axios.get(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}`
      );
      setItems(response.data.products); // Set fetched items to state
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Effect to fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Function to update cart items in state
  const handleUpdateItems = (newItems) => {
    setItems(newItems);
  };

  return (
    isOpen && ( // Render the cart only if it's open
      <div
        ref={cartRef} // Attach ref to the cart div
        className="fixed right-0 top-0 mt-16 w-[28rem] bg-gray-900 shadow-lg rounded-lg py-2 z-50 max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-xl font-semibold mb-2 px-4 text-white border-b pb-2">
          Cart
        </h2>
        {loading ? ( // Show loading spinner if loading state is true
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.length > 0 ? ( // Check if there are items in the cart
              items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  handleIncreaseItem={(id) =>
                    handleIncreaseItem(id).then(() => fetchCartItems())
                  }
                  handleDecreaseItem={(id) =>
                    handleDecreaseItem(id).then(() => fetchCartItems())
                  }
                  handleRemoveItem={(id) =>
                    handleRemoveItem(id).then(() => fetchCartItems())
                  }
                />
              ))
            ) : (
              <p className="text-center text-white">Your cart is empty.</p>
            )}
          </div>
        )}
        <div className="px-4 border-t pt-2">
          <Link
            to="/cart"
            className="block bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600"
          >
            View Cart
          </Link>
        </div>
      </div>
    )
  );
};

export default Cart;
