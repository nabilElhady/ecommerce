const CartItem = ({
  item,
  handleIncreaseItem,
  handleDecreaseItem,
  handleRemoveItem,
}) => {
  console.log(item);
  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg space-x-4">
      <img
        src={`http://localhost:8000/images/products/${item.product.coverImage}`}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-lg text-white font-semibold">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-400">${item.product.price}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleDecreaseItem(item.product._id)}
          className="bg-gray-700 text-white px-2 py-1 rounded-lg"
        >
          -
        </button>
        <span className="text-white">{item.quantity}</span>
        <button
          onClick={() => handleIncreaseItem(item.product._id)}
          className="bg-gray-700 text-white px-2 py-1 rounded-lg"
        >
          +
        </button>
        <button
          onClick={() => handleRemoveItem(item.product._id)}
          className="bg-red-500 text-white px-2 py-1 rounded-lg"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
