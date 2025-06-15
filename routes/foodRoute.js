const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  createFood,
  editFood,
  getAllFoods,
} = require("../controllers/foodController");
const route = express.Router();
route.route("/").get(getAllFoods);
route.use(protect);
route.route("/").post(restrictTo("trainer", "admin"), createFood);
route.route("/:id").patch(restrictTo("trainer", "admin"), editFood);

module.exports = route;
