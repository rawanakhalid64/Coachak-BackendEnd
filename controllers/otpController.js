const otpGenerator = require("otp-generator");
const OTP = require("../models/OtpModel");
const User = require("../models/User");

exports.sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    // check if user is present
    const userPresent = await User.findOne({ email });
    if (userPresent) {
      return res
        .status(401)
        .json({ success: false, message: "User is already registered" });
    }
  } catch (error) {}
};
