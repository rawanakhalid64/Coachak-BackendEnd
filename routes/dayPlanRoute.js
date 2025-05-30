const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  updateDayPlan,
  addDayPlan,
  addSingleMealForDay,
  removeSingleMealFromDay,
  // addMeal,
  // addWorkout,
  // deleteMeal,
  // deleteWorkout,
} = require("../controllers/dayPlanController");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.use(protect);

route.route("/").get();
route.route("/:dayId/meals").post(restrictTo("trainer"), addSingleMealForDay);
route
  .route("/:dayId/meals/:mealId")
  .delete(restrictTo("trainer"), removeSingleMealFromDay);

route.route("/:dayId").patch(restrictTo("trainer"), updateDayPlan);
// route.route("/").post(restrictTo("trainer"), addDayPlan);
// route.use("/:id/meal", restrictTo("trainer"));
// route.route("/:id/meal").post(addMeal).delete(deleteMeal);
// route.use("/:id/workout", restrictTo("trainer"));
// route.route("/:id/workout").post(addWorkout).delete(deleteWorkout);

module.exports = route;
