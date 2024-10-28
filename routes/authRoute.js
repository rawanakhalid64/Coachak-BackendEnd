const express = require("express");
const {
  register,
  verifyEmail,
  login,
  refreshToken,
  requestPasswordReset,
  verifyPasswordOtp,
  resetPassword,
  sendOtp,
} = require("../controllers/authController");
const route = express.Router();

route.route("/register").post(register);
route.route("/login").post(login);
route.route("/refresh-token").post(refreshToken);
route.route("/verify-email").post(verifyEmail);
route.route("/request-password-reset").post(requestPasswordReset);
route.route("/verify-password-otp").post(verifyPasswordOtp);
route.route("/reset-password").post(resetPassword);
route.route("/send-otp").post(sendOtp);
module.exports = route;
