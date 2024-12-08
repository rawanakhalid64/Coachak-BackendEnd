const OTP = require("../models/OtpModel");
const User = require("../models/User");

exports.verifyOtp = async (email, otp, res) => {
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw Error("no email found");
  }
  const otpResponse = await OTP.find({ email })
    .sort({ createdAt: -1 })
    .limit(1);
  if (otpResponse.length === 0 || otp !== otpResponse[0].otp) {
    // return res
    //   .status(400)
    //   .json({ success: false, message: "the OTP is not valid" });
    throw Error("the OTP is not valid");
  }
  // set user as verified
  existingUser.isVerified = true;

  // Delete the OTP after verifying
  await OTP.deleteOne({ email }); // This will delete the most recent OTP for the email

  await existingUser.save();
  return existingUser;
};
