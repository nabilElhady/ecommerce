const express = require("express");
const router = express.Router();
const paymentControllers = require("../controllers/paymentControllers");
router
  .route("/")
  .get(paymentControllers.getAllPayments)
  .post(paymentControllers.createPayment);
router
  .route("/:id")
  .get(paymentControllers.getPaymentById)
  .delete(paymentControllers.deletePayment)
  .patch(paymentControllers.updatePayment);
module.exports = router;
