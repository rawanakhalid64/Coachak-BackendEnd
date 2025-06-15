const OTP = require("../models/OtpModel");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const createOtp = require("../utils/createOtp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyOtp } = require("../utils/verifyOtp");
const Trainer = require("../models/Trainer");

exports.protect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return next(new Error("you are not logged or jwt expired.", 401));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // if (!decoded)
    //   return next(new AppError("you are not logged in to access.", 401));
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};
exports.register = async (req, res, next) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      password,
      role,
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
    const user = new User({
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      role,
      password,
    });
    await user.save();
    // user.userTuserT
    let otp;
    if (user) {
      otp = await createOtp(email);
      console.log(otp);
    }
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully.",
      data: { user, accessToken, refreshToken },
      otp: `otp (for testing only): ${otp}`,
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
    console.log(user);
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) {
      return res
        .status(404)
        .json({ message: "error in credintials, please try again" });
    }
    if (!user || !checkedPassword) {
      return res.status(400).json({
        message: "Invalid email or password. Please try again.",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "signed in successfull",
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    return res.status(404).json({
      message: "error occured, please try again",
      error: error.message,
    });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    console.log(req.body);
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
    const otp = await createOtp(req.body.email);
    res.status(201).json({
      message: "OTP sent to email",
      otp: `otp (for testing only): ${otp}`,
    });
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
