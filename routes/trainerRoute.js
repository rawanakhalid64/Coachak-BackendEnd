const express = require("express");
const { getTrainersPlans } = require("../controllers/planController");
const { protect } = require("../controllers/authController");
const route = express.Router();

route.route("/:trainerId/plans").get(getTrainersPlans);
// trainer roujt

module.exports = route;
