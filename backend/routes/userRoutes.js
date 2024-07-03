const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const verfyAdmin = require("./verfyAdmin");
router.post("/signup", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.route("/").get(userControllers.getAllUsers);
router
  .route("/:id")
  .get(userControllers.getAllUsers)
  .delete(userControllers.deleteUser)
  .patch(userControllers.updateUser);
module.exports = router;
