const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  createMeal,
  editMeal,
  getAllMeals,
} = require("../controllers/mealController");
const route = express.Router({ mergeParams: true });
route.route("/meals").post();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),

route.use(protect);
route.route("/").get(getAllMeals);
route.route("/").post(restrictTo("trainer"), createMeal);
route.route("/:id").patch(restrictTo("trainer"), editMeal);

module.exports = route;
