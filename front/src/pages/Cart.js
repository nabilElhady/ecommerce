import React, { useState, useEffect } from "react";
import CartItem from "../extras/CartItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    if (!cookies.user) return;
    try {
      const response = await axios.get(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}`
      );
      setItems(response.data.products);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleIncreaseItem = async (id) => {
    try {
      const response = await axios.patch(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}/increase`,
        { productId: id }
      );
      setItems(response.data.products);
    } catch (error) {
      console.error("Error increasing item quantity:", error);
    }
  };

  const handleDecreaseItem = async (id) => {
    try {
      const response = await axios.patch(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}/decrease`,
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
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}/remove`,
        { productId: id }
      );
      setItems(response.data.products);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + item.quantity * item.product.price, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    navigate("/proceed-to-buy");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <h1 className="text-3xl font-bold text-black">Your Cart</h1>
        <button
          onClick={() => navigate("/")}
          className="font-bold text-black outline-none focus:outline-none ml-4 bg-gray-200 hover:text-yellow-400 hover:bg-gray-600 transition-colors duration-200 py-1 px-3 rounded mt-2 lg:mt-0"
        >
          Back to Home
        </button>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
        {items.length === 0 ? (
          <p className="text-white">Your cart is empty.</p>
        ) : (
          <>
            {items.map((item) => (
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
            ))}
            <div className="flex justify-between items-center mt-6 flex-wrap">
              <h2 className="text-2xl text-white mb-2 lg:mb-0">
                Total: ${calculateTotal()}
              </h2>
              <button
                onClick={handleCheckout}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
