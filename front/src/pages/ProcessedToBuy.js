import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ProceedToBuy = () => {
  const dispatch = useDispatch();
  const [cartItems, setCartItems] = useState([]);
  const [cookies] = useCookies(["user"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleIncreaseItem = async (id) => {
    try {
      const updatePayload = {
        products: [
          {
            product: id,
            quantity: 1,
          },
        ],
      };

      const response = await axios.patch(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}`,
        updatePayload
      );
      setCartItems(response.data.products);
    } catch (error) {
      console.error(
        "Error increasing item quantity:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleDecreaseItem = async (id) => {
    try {
      const response = await axios.patch(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}/decrease`,
        { productId: id }
      );
      setCartItems(response.data.products);
    } catch (error) {
      console.error(
        "Error decreasing item quantity:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const response = await axios.patch(
        `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}/remove`,
        { productId: id }
      );
      setCartItems(response.data.products);
    } catch (error) {
      console.error(
        "Error removing item from cart:",
        error.response ? error.response.data : error
      );
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://ecommerce-backend-wine-one.vercel.app/api/v1/orders",
        {
          userId: cookies.user._id,
          productsId: cartItems.map((item) => item.product._id).filter(Boolean),
        }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error
      );
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (cookies.user) {
        try {
          const response = await axios.get(
            `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}`
          );
          const products = response.data.products || [];
          setCartItems(products);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setError("Error fetching cart items. Please try again.");
          setLoading(false);
        }
      }
    };
    fetchCartItems();
  }, [cookies.user, cartItems]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-black">Proceed to Buy</h1>
        <button
          onClick={() => navigate("/cart")}
          className="font-bold text-black outline-none focus:outline-none ml-4 hover:text-yellow-400 bg-gray-300 hover:bg-gray-600 transition-colors duration-200 py-1 px-3 rounded"
        >
          Back to Cart
        </button>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div className="w-full lg:w-2/3">
          <form className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Billing Information
            </h2>
            <div>
              <label className="block text-black">Name</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border rounded-lg text-black"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-black">Email</label>
              <input
                type="email"
                className="w-full p-2 mt-1 border rounded-lg text-black"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-black">Address</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border rounded-lg text-black"
                placeholder="Your Address"
              />
            </div>
            <div>
              <label className="block text-black">Credit Card Number</label>
              <InputMask
                mask="9999 9999 9999 9999"
                maskChar=" "
                className="w-full p-2 mt-1 border rounded-lg text-black"
                placeholder="Card Number"
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-black">Expiry Date</label>
                <InputMask
                  mask="99/99"
                  maskChar=" "
                  className="w-full p-2 mt-1 border rounded-lg text-black"
                  placeholder="MM/YY"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-black">CVV</label>
                <InputMask
                  mask="9999"
                  maskChar=" "
                  className="w-full p-2 mt-1 border rounded-lg text-black"
                  placeholder="CVV"
                />
              </div>
            </div>
            <button
              onClick={handleCheckOut}
              className="w-full bg-yellow-200 text-black py-2 rounded font-bold text-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              Complete Purchase
            </button>
          </form>
        </div>
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <h2 className="text-2xl font-bold mb-4 text-black">Your Cart</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4"
                onClick={() => {
                  console.log(item);
                }}
              >
                <img
                  src={`${item.image}`}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-black">{item.title}</h3>
                  <p className="text-gray-700">
                    ${(item.product.price || 0).toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-200 text-black px-2 py-1 rounded-l"
                      onClick={() => handleDecreaseItem(item.product._id)}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b text-black">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-gray-200 text-black px-2 py-1 rounded-r"
                      onClick={() => handleIncreaseItem(item.product._id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-lg font-bold text-right text-black">
              Total: ${(totalPrice || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProceedToBuy;
