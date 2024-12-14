const express = require("express");
const {
  addAllergy,
  getAllergies,
} = require("../controllers/allergyController");
const { protect } = require("../controllers/authController");
const route = express.Router();
// add role's prevelage for admin only
route.route("/").post(protect, addAllergy).get(getAllergies);

module.exports = route;
