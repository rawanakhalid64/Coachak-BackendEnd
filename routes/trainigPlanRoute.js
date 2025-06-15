const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  createTrainingPlan,
  updateTrainingPlan,
  getTrainingPlan,
} = require("../controllers/trainingPlanController");
const route = express.Router();

route.use(protect);
route.route("/").get();
route.route("/").post(restrictTo("trainer"), createTrainingPlan);
route.route("/:id").patch(restrictTo("trainer"), updateTrainingPlan);
module.exports = route;
