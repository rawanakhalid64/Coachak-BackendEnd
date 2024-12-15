const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  addMeal,
  addWorkout,
  editMeal,
  deleteMeal,
} = require("../controllers/dayPlanController");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.use(protect);
route.route("/").get();
route.route("/").post(restrictTo("trainer"));
route.route("/:id").patch(restrictTo("trainer"));
route.route("/:id/meal").patch(restrictTo("trainer"), addMeal);
route
  .route("/:id/meal")
  .patch(restrictTo("trainer"), editMeal)
  .delete(deleteMeal);
route.route("/:id/workout").patch(restrictTo("trainer"), addWorkout);

module.exports = route;
