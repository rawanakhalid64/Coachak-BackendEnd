const express = require("express");
const {
  updateProfile,
  getMyProfile,
} = require("../controllers/UserController");
const { protect } = require("../controllers/authController");
const route = express.Router();
route.route("/update-me").patch(protect, updateProfile);
route.route("/get-me").patch(protect, getMyProfile);

module.exports = route;
