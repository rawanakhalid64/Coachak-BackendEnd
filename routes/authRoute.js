const express = require("express");
const { register, verifyEmail } = require("../controllers/authController");
const route = express.Router();

route.route("/register").post(register);
route.route("/verify-email").post(verifyEmail);
module.exports = route;
