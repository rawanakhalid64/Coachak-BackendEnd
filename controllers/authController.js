const OTP = require("../models/OtpModel");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const createOtp = require("../utils/createOtp");

exports.register = async (req, res, next) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      password,
      confirmPassword,
    } = req.body;
    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ error: "Password and confirmed password do not match." });
    }
    if (await User.findOne({ email })) {
      res.status(400).json({ error: "email is already existed." });
    }

    const user = await User.create({
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      password,
    });
    if (user) {
      createOtp(email);
    }
    res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    // check if email exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "no email found" });
    }
    const otpResponse = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (otpResponse.length === 0 || otp !== otpResponse[0].otp) {
      return res
        .status(400)
        .json({ success: false, message: "the OTP is not valid" });
    }
    // set user as verified
    existingUser.isVerified = true;

    await existingUser.save();
    res
      .status(200)
      .json({ message: "email verified successfully", user: existingUser });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};
