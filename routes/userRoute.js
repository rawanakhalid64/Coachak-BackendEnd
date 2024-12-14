const express = require("express");
const {
  updateProfile,
  getMyProfile,
  getProfile,
  addCertificate,
} = require("../controllers/UserController");
const { protect } = require("../controllers/authController");
const route = express.Router();
route.route("/update-me").patch(protect, updateProfile);
route.route("/get-me").get(protect, getMyProfile);
route.route("/:id").get(protect, getProfile);

module.exports = route;
