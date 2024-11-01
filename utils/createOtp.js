const OTP = require("../models/OtpModel");
const otpGenerator = require("otp-generator");

const createOtp = async (email) => {
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  let result = await OTP.findOne({ otp });
  // to check if otp is existed
  while (result) {
    // if existed create a new one with less restriction
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
    });
    result = await OTP.findOne({ otp });
  }
  const otpBody = await OTP.create({ email, otp });
};

module.exports = createOtp;
