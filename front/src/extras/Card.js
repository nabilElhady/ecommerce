import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem, fullItems } from "../store/cartSlice";
import axios from "axios";
import { useCookies } from "react-cookie";

const ItemCard = ({
  id,
  image,
  title,
  description,
  price,
  onAddToCart = () => {},
  onError = () => {},
}) => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["user"]);

  const fetchCartItems = async () => {
    if (cookies.user) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/carts/${cookies.user._id}`
        );
        const productsIds = response.data.products;
        dispatch(fullItems(productsIds));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!cookies.user) {
      return alert("please sign in");
    }

    try {
      const { data: cart } = await axios.get(
        `http://localhost:8000/api/v1/carts/${cookies.user._id}`
      );

      const updatePayload = {
        products: [
          {
            product: id,
            quantity: 1,
            image,
            title,
            description,
            price,
          },
        ],
      };

      if (cart) {
        await axios.patch(
          `http://localhost:8000/api/v1/carts/${cookies.user._id}`,
          updatePayload
        );
      }

      onAddToCart();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const payload = {
            user: cookies.user._id,
            products: [
              {
                product: id,
                quantity: 1,
                image,
                title,
                description,
                price,
              },
            ],
          };
          await axios.post(`http://localhost:8000/api/v1/carts`, payload);
          onAddToCart();
        } catch (postError) {
          console.error(
            "Error creating cart:",
            postError.response ? postError.response.data : postError
          );
          onError("Error adding item to cart");
        }
      } else {
        console.error(
          "Error checking cart:",
          error.response ? error.response.data : error
        );
        onError("Error adding item to cart");
      }
    }
    fetchCartItems(); // Fetch cart items after updating
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl">
      <Link to={`/item/${id}`} className="block">
        <img
          src={`http://localhost:8000/dev-data/images/products/${image}`}
          alt="Item"
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/item/${id}`} className="block">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-700 mb-4">{description}</p>
        </Link>
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-gray-900">${price}</div>
          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 text-white px-4 py-2 rounded font-bold transition-transform transform hover:scale-105 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
