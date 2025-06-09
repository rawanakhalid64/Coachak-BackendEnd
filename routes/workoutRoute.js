const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  createWorkout,
  editWorkout,
  addExercisesToWorkoutData,
  removeExerciseFromWorkout,
  editExerciseInWorkout,
} = require("../controllers/workoutController");
const route = express.Router();
// add role's prevelage for trainers only
// protect,restrictTo('trainer'),
route.use(protect);
route
  .route("/:workoutId/exercises")
  .post(restrictTo("trainer"), addExercisesToWorkoutData);
route
  .route("/:workoutId/exercises/:exerciseId")
  .delete(restrictTo("trainer"), removeExerciseFromWorkout)
  .patch(restrictTo("trainer"), editExerciseInWorkout);

route.route("/").get();
route.route("/").post(restrictTo("trainer"), createWorkout);
route.route("/:id").patch(restrictTo("trainer"), editWorkout);

module.exports = route;
