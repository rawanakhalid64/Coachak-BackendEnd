const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  createIngredient,
  editIngredient,
} = require("../controllers/ingredientController");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.use(protect);
route.route("/").get();
route.route("/").post(restrictTo("trainer"), createIngredient);
route.route("/:id").patch(restrictTo("trainer"), editIngredient);

module.exports = route;
