import React, { useEffect, useState } from "react";
import ItemCard from "./Card";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ItemList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const list = useSelector((state) => state.list);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-backend-wine-one.vercel.app/api/v1/products`,
          {
            params: {
              page,
              limit: 10,
            },
          }
        );
        if (list.list.length > 0) {
          setProducts(list.list || []);
        } else {
          setProducts(response.data.products || []);
        }
        setPages(response.data.pages);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [page, list.list]);

  const handlePrevious = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setPage((prevPage) => Math.min(prevPage + 1, pages));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-8">
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((item) => {
          return (
            <ItemCard
              key={item._id}
              id={item._id}
              image={item.coverImage}
              title={item.name}
              description={item.description}
              price={item.price}
              onAddToCart={() => toast.success("Item added successfully")}
              onError={(msg) => toast.error(msg)}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={page === pages}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItemList;
