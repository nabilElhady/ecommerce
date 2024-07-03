// Import required modules
const { default: Stripe } = require("stripe");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const Cart = require("../model/cartModel"); // Assuming you have a Cart model

// Controller to create a new order
exports.createOrder = async (req, res) => {
  try {
    // Find the user by their ID from the request body
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the product IDs from the request body and find the products
    const productIds = req.body.productsId;
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res.status(404).json({ message: "Products not found" });
    }

    // Initialize Stripe with the secret key
    const stripe = Stripe(process.env.SECRET_KEY);

    // Create line items for the Stripe session
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          // Optionally include more product details here
        },
        unit_amount: Math.round(product.price * 100), // Convert price to cents and round to nearest integer
      },
      quantity: 1, // Adjust quantity as needed
    }));

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/failed",
      customer_email: user.email,
      client_reference_id: req.body.userId,
      line_items: lineItems,
    });

    // After successful order creation, delete the user's cart
    await Cart.findOneAndDelete({ user: req.body.userId });
    // Add products to user's purchases
    user.purchases = [...user.purchases, ...productIds];
    await user.save();

    // Send the URL of the Stripe session to the client
    res.status(201).json({ url: session.url });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Find all orders. Optionally, populate the user and product details if needed
    // const orders = await Order.find().populate('user').populate('products.product');
    const orders = await Order.find();

    // Send a response with status 200 (OK) and the list of orders
    res.status(200).json(orders);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get an order by its ID
exports.getOrderById = async (req, res) => {
  try {
    // Find an order by its ID and populate the user and product details
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("products.product");
    // If no order is found, send a response with status 404 (Not Found)
    if (!order) return res.status(404).json({ message: "Order not found" });
    // Send a response with status 200 (OK) and the order object
    res.status(200).json(order);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to update an order
exports.updateOrder = async (req, res) => {
  try {
    // Find an order by its ID and update it with the data from the request body
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // If no order is found, send a response with status 404 (Not Found)
    if (!order) return res.status(404).json({ message: "Order not found" });
    // Send a response with status 200 (OK) and the updated order object
    res.status(200).json(order);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete an order
exports.deleteOrder = async (req, res) => {
  try {
    // Find an order by its ID and delete it
    const order = await Order.findByIdAndDelete(req.params.id);
    // If no order is found, send a response with status 404 (Not Found)
    if (!order) return res.status(404).json({ message: "Order not found" });
    // Send a response with status 200 (OK) and a success message
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};
