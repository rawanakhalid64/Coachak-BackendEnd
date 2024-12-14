const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  createExercise,
  editExercise,
} = require("../controllers/exerciseController");
const route = express.Router();

route.use(protect);
route.route("/").get();
route.route("/").post(restrictTo("trainer"), createExercise);
route.route("/:id").patch(restrictTo("trainer"), editExercise);

module.exports = route;
