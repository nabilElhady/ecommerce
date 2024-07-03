// Import the Payment model from the paymentModel file
const Payment = require("../model/paymentModel");

// Controller to create a new payment
exports.createPayment = async (req, res) => {
  try {
    // Create a new payment using the data from the request body
    const newpayment = Payment.create(req.body);
    // Send a response with status 201 (Created) and the new payment object
    res.status(201).json(newpayment);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get all payments
exports.getAllPayments = async (req, res) => {
  try {
    // Find all payments and populate the associated order details
    const payments = await Payment.find().populate("order");
    // Send a response with status 200 (OK) and the list of payments
    res.status(200).json(payments);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to get a payment by its ID
exports.getPaymentById = async (req, res) => {
  try {
    // Find a payment by its ID and populate the associated order details
    const payment = await Payment.findById(req.params.id).populate("order");
    // If no payment is found, send a response with status 404 (Not Found)
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    // Send a response with status 200 (OK) and the payment object
    res.status(200).json(payment);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a payment
exports.updatePayment = async (req, res) => {
  try {
    // Find a payment by its ID and update it with the data from the request body
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // If no payment is found, send a response with status 404 (Not Found)
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    // Send a response with status 200 (OK) and the updated payment object
    res.status(200).json(payment);
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a payment
exports.deletePayment = async (req, res) => {
  try {
    // Find a payment by its ID and delete it
    const payment = await Payment.findByIdAndDelete(req.params.id);
    // If no payment is found, send a response with status 404 (Not Found)
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    // Send a response with status 200 (OK) and a success message
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    // If there's an error, send a response with status 400 (Bad Request) and the error message
    res.status(400).json({ message: error.message });
  }
};
