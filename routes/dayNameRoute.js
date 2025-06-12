const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  updateDayPlan,
  addDayPlan,
  addSingleMealForDay,
  removeSingleMealFromDay,
  updateSingleMealInDay,
  addWorkoutToDay,
  getDayPlan,
  // addMeal,
  // addWorkout,
  // deleteMeal,
  // deleteWorkout,
} = require("../controllers/dayNameController");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.use(protect);

// route.route("/:dayName/meals").post(restrictTo("trainer"), addSingleMealForDay);
// route
//   .route("/:dayName/meals/:mealId")
//   .delete(restrictTo("trainer"), removeSingleMealFromDay)
//   .patch(restrictTo("trainer"), updateSingleMealInDay);

// route.route("/:dayName/workouts").post(restrictTo("trainer"), addWorkoutToDay);

// route.route("/:dayName").get(getDayPlan);
// route.route("/:dayName").patch(restrictTo("trainer"), updateDayPlan);
// // route.route("/").post(restrictTo("trainer"), addDayPlan);
// // route.use("/:id/meal", restrictTo("trainer"));
// // route.route("/:id/meal").post(addMeal).delete(deleteMeal);
// // route.use("/:id/workout", restrictTo("trainer"));
// // route.route("/:id/workout").post(addWorkout).delete(deleteWorkout);

module.exports = route;
