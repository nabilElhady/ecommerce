const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers");

router
  .route("/")
  .get(orderControllers.getAllOrders)
  .post(orderControllers.createOrder);

router
  .route("/:id")
  .get(orderControllers.getOrderById)
  .delete(orderControllers.deleteOrder)
  .patch(orderControllers.updateOrder);

module.exports = router;
