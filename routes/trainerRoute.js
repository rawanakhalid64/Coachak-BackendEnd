const express = require("express");
const { getTrainersPlans } = require("../controllers/planController");
const { protect } = require("../controllers/authController");
const { getAllTrainers } = require("../controllers/UserController");
const route = express.Router();

// route.use(protect);
route.route("/").get(getAllTrainers);
route.route("/:trainerId/plans").get(getTrainersPlans);
// trainer roujt

module.exports = route;
