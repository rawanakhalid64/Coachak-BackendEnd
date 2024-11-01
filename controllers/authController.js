const OTP = require("../models/OtpModel");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const createOtp = require("../utils/createOtp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyOtp } = require("../utils/verifyOtp");
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
      return res
        .status(400)
        .json({ error: "Password and confirmed password do not match." });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "email is already existed." });
    }

    const user = await User.create({
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      password,
    });
    console.log(user);
    if (user) {
      createOtp(email);
    }
    res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    // check if email exists
    const existingUser = await verifyOtp(email, otp, res);
    res
      .status(200)
      .json({ message: "email verified successfully", user: existingUser });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) {
      return res
        .status(404)
        .json({ message: "error in credintials, please try again" });
    }
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    // the best Practice is to send the refreshtoken in cookie, to prevent the client from accessing it in js , and automatically send it with credintials

    // res.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "None",
    //   maxAge: 7 * 24 * 60 * 60 * 100,
    // });
    return res.status(200).json({
      message: "signed in successfull",
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "error occured, please try again", error });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }
        console.log(user);
        const decodedUser = await User.findById(user.id);
        if (!decodedUser) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const accessToken = await jwt.sign(
          { id: decodedUser.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    return res
      .status(404)
      .json({ message: "error occured, please try again", error });
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    createOtp(req.body.email);
    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
exports.verifyPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const existingUser = await verifyOtp(email, otp, res);
    existingUser.pendingPasswordChange = true;
    await existingUser.save();

    res.status(201).json({ message: "OTP verified successfull" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Password and confirmed password do not match." });
  }

  const user = await User.findOne({ email, pendingPasswordChange: true });
  if (!user) {
    return res.status(400).json({ error: "cannot change password" });
  }
  user.password = password;
  user.pendingPasswordChange = false;
  await user.save();
  res.status(201).json({ message: "password changed successfull" });
  try {
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    await createOtp(email);

    res.status(201).json({ message: "otp sent successfull" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
