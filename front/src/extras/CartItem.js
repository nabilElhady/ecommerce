import React from "react";

const CartItem = ({
  item,
  handleIncreaseItem,
  handleDecreaseItem,
  handleRemoveItem,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 bg-gray-800 p-4 rounded-lg mb-4">
      <img
        src={item.product.image}
        alt={item.product.title}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex flex-col items-center lg:items-start lg:flex-grow">
        <h3 className="text-lg font-bold text-white">{item.product.title}</h3>
        <p className="text-gray-400">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="bg-gray-700 text-white px-2 py-1 rounded-l"
          onClick={() => handleDecreaseItem(item.product._id)}
        >
          -
        </button>
        <span className="px-4 py-1 bg-gray-700 text-white border-t border-b">
          {item.quantity}
        </span>
        <button
          className="bg-gray-700 text-white px-2 py-1 rounded-r"
          onClick={() => handleIncreaseItem(item.product._id)}
        >
          +
        </button>
      </div>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
        onClick={() => handleRemoveItem(item.product._id)}
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
