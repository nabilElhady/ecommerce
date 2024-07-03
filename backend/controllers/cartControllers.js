// Import the Cart model from the cartModel file
const Cart = require("../model/cartModel");

// Controller to create a new cart
exports.createCart = async (req, res) => {
  try {
    // Create a new cart using the data from the request body
    const newCart = await Cart.create(req.body);
    // Send a response with status 201 (Created) and the new cart object
    res.status(201).json(newCart);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a cart by user ID
exports.getCartByUserId = async (req, res) => {
  try {
    // Find a cart by the user ID from the request parameters and populate the product details
    const cart = await Cart.findOne({ user: req.params.id }).populate(
      "products.product"
    );
    // If no cart is found, send a response with status 404 (Not Found)
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    // Send a response with status 200 (OK) and the cart object
    res.status(200).json(cart);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a cart
exports.updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    // Find a cart by the user ID from the request parameters
    const cart = await Cart.findOne({ user: req.params.id });

    // If no cart is found, send a response with status 404 (Not Found)
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Update or add new products to the existing cart
    products.forEach((newProduct) => {
      const existingProduct = cart.products.find(
        (product) => product.product.toString() === newProduct.product
      );
      if (existingProduct) {
        // If the product already exists in the cart, update the quantity
        existingProduct.quantity += newProduct.quantity;
      } else {
        // If the product doesn't exist in the cart, add it to the cart
        cart.products.push(newProduct);
      }
    });

    // Save the updated cart
    const updatedCart = await cart.save();
    // Send a response with status 200 (OK) and the updated cart object
    res.status(200).json(updatedCart);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to increase the quantity of a cart item
exports.increaseCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    // Find a cart by the user ID from the request parameters
    const cart = await Cart.findOne({ user: req.params.id });

    // If no cart is found, send a response with status 404 (Not Found)
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the product in the cart
    const product = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (product) {
      // If the product exists in the cart, increase the quantity
      product.quantity += 1;
    } else {
      // If the product doesn't exist in the cart, send a response with status 404 (Not Found)
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Save the updated cart and populate the product details
    const updatedCart = await cart.save();
    await updatedCart.populate("products.product");
    // Send a response with status 200 (OK) and the updated cart object
    res.status(200).json(updatedCart);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to decrease the quantity of a cart item
exports.decreaseCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    // Find a cart by the user ID from the request parameters
    const cart = await Cart.findOne({ user: req.params.id });

    // If no cart is found, send a response with status 404 (Not Found)
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the product in the cart
    const product = cart.products.find(
      (item) => item.product.toString() === productId
    );

    if (product) {
      if (product.quantity > 1) {
        // If the product quantity is greater than 1, decrease the quantity
        product.quantity -= 1;
      } else {
        // If the product quantity is 1 or less, remove the product from the cart
        cart.products = cart.products.filter(
          (item) => item.product.toString() !== productId
        );
      }
    }

    // Save the updated cart
    const updatedCart = await cart.save();
    // Send a response with status 200 (OK) and the updated cart object
    res.status(200).json(updatedCart);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to remove an item from the cart
exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    // Find a cart by the user ID from the request parameters
    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      // If no cart is found, send a response with status 404 (Not Found)
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex !== -1) {
      // If the product exists in the cart, remove it
      cart.products.splice(productIndex, 1);
      cart.updated_at = Date.now();
      await cart.save();
    }

    // Send a response with status 200 (OK) and the remaining products in the cart
    res.status(200).json({ products: cart.products });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a cart
exports.deleteCart = async (req, res) => {
  try {
    // Find and delete a cart by the user ID from the request parameters
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    // Send a response with status 200 (OK) and a success message
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};
