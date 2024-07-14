import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";
import { useCookies } from "react-cookie";

const ItemDetails = () => {
  const [cookies] = useCookies(["user"]);

  const dispatch = useDispatch();

  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [bigPicture, setBigPicture] = useState("");
  const [smallPictures, setSmallPictures] = useState([]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-backend-wine-one.vercel.app/api/v1/products/${id}`
        );
        const itemData = response.data;
        setItem(itemData);
        setBigPicture(itemData.coverImage);
        setSmallPictures(itemData.images);
      } catch (error) {}
    };

    fetchItemDetails();
  }, [id]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleClickOutside = (event) => {
    if (event.target.id === "details-container") {
      handleClose();
    }
  };

  const swapPictures = (index) => {
    const newBigPicture = smallPictures[index];
    setSmallPictures((prevSmallPictures) => {
      const newSmallPictures = [...prevSmallPictures];
      newSmallPictures[index] = bigPicture;
      setBigPicture(newBigPicture);
      return newSmallPictures;
    });
  };

  const handleAddToCart = async () => {
    if (item) {
      const { _id, title, price, coverImage, description } = item; // Ensure item has all required fields
      if (!cookies.user) {
        return alert("Please sign in");
      }

      try {
        const { data: cart } = await axios.get(
          `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}`
        );

        const productPayload = {
          product: id,
          quantity: 1,
          image: coverImage,
          title,
          description,
          price,
        };

        const updatePayload = {
          products: [productPayload],
        };

        if (cart) {
          await axios.patch(
            `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts/${cookies.user._id}`,
            updatePayload
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          try {
            const payload = {
              user: cookies.user._id,
              products: [
                {
                  product: id,
                  quantity: 1,
                  image: coverImage,
                  title,
                  description,
                  price,
                },
              ],
            };
            await axios.post(
              `https://ecommerce-backend-wine-one.vercel.app/api/v1/carts`,
              payload
            );
          } catch (postError) {
            console.error("Error creating cart:", postError);
          }
        } else {
          console.error("Error checking cart:", error);
        }
      }
    } else {
      console.log("no item");
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div
      id="details-container"
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full">
        <button
          onClick={handleClose}
          className="absolute top-2 left-2 text-black text-2xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="w-full lg:w-2/5 flex flex-col">
            <img
              src={`/${bigPicture}`}
              alt={`Item ${id}`}
              className="w-full h-auto object-cover rounded-lg mb-4 lg:mb-0 transition-transform duration-300 ease-in-out transform scale-100"
            />
            <div className="flex justify-center text-center h-full align-middle items-center">
              <button
                onClick={handleAddToCart}
                className="w-1/2 bg-yellow-500 h-12 text-white px-4 py-2 rounded font-bold transition-transform transform hover:scale-105 active:scale-95 mt-4 lg:mt-0"
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className="w-full lg:w-3/5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {item.title}
              </h2>
              <p className="text-gray-700 mb-4">{item.description}</p>
              <div className="text-lg font-bold mb-4">${item.price}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 lg:mt-0">
              {smallPictures.map((pic, index) => (
                <img
                  key={index}
                  src={`${pic}`}
                  alt={`Item ${id} - ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                  onClick={() => swapPictures(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
