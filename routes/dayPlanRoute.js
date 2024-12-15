const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  addMeal,
  addWorkout,
  addDayPlan,
  deleteMeal,
  updateDayPlan,
  deleteWorkout,
} = require("../controllers/dayPlanController");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.use(protect);
route.route("/").get();
route.route("/").post(restrictTo("trainer"), addDayPlan);
route.route("/:id").patch(restrictTo("trainer"), updateDayPlan);
route.use("/:id/meal", restrictTo("trainer"));
route.route("/:id/meal").post(addMeal).delete(deleteMeal);
route.use("/:id/workout", restrictTo("trainer"));
route.route("/:id/workout").post(addWorkout).delete(deleteWorkout);

module.exports = route;
