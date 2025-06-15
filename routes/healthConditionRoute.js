const express = require("express");
const { protect } = require("../controllers/authController");
const {
  addHealthCondition,
  getHealthCondition,
  updateHealthCondition,
} = require("../controllers/healthConditionController.js");
const HealthCondition = require("../models/HealthCondition.js");
const route = express.Router();
// add role's prevelage for admin only

route.route("/").post(protect, addHealthCondition).get(getHealthCondition);
route.route("/:id").patch(protect, updateHealthCondition);

module.exports = route;
