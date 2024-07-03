const express = require("express");
const router = express.Router();
const cartControllers = require("../controllers/cartControllers");

router.route("/:id/decrease").patch(cartControllers.decreaseCartItem);
router.route("/:id/increase").patch(cartControllers.increaseCartItem);
router.route("/:id/remove").patch(cartControllers.removeCartItem);
router.route("/").post(cartControllers.createCart);
router
  .route("/:id")
  .get(cartControllers.getCartByUserId)
  .delete(cartControllers.deleteCart)
  .patch(cartControllers.updateCart);

module.exports = router;
