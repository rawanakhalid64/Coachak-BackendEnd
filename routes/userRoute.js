const express = require("express");
const {
  updateProfile,
  getMyProfile,
  getProfile,
  addCertificate,
} = require("../controllers/UserController");
const { protect } = require("../controllers/authController");
const route = express.Router();
route.use(protect);
route.route("/me").get(getMyProfile).patch(updateProfile);
route.route("/:id").get(getProfile);

module.exports = route;
