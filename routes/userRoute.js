const express = require("express");
const {
  updateProfile,
  getMyProfile,
  getProfile,
  addCertificate,
} = require("../controllers/UserController");
const { protect } = require("../controllers/authController");
const route = express.Router();
route.route("/me").get(protect, getMyProfile).patch(protect, updateProfile);
route.route("/:id").get(protect, getProfile);

module.exports = route;
