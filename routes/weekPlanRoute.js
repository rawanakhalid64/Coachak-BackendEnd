const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictTo } = require("../utils/helper");
const {
  getAllWeeks,
  getWeek,
  getCurrentWeek,
} = require("../controllers/weekPlanController");
const { getDayPlan } = require("../controllers/dayNameController");

const route = express.Router({ mergeParams: true });

route.use(protect);

route.post("/:weekNum/day-names/:dayName", getDayPlan); // Gets specific week
route.get("/", getAllWeeks); // Gets all weeks for a subscription
route.get("/:weekNum", getWeek); // Gets specific week
// route.get("/current", getCurrentWeek); // Gets current week
module.exports = route;
