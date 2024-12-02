const Client = require("../models/Client");
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const { filterObj } = require("../utils/helper");

exports.uploadImage = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.updateProfile = async (req, res, next) => {
  try {
    console.log(req.body);
    let updateObj = filterObj(req.body, "avgRating", "role");
    console.log(updateObj);
    let userType;
    if (req.user.role === "Trainer") userType = Trainer;
    else if (req.user.role === "Client") userType = Client;
    const user = await Trainer.findByIdAndUpdate(
      req.user.id,
      { ...updateObj },
      { new: true }
    );
    console.log(user);
    res.status(200).json({ message: "profile updated successful", user });
  } catch (error) {
    res.status(404).json({ message: "error in updating profile" });
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    res.status(200).json({ message: "profile retrieved successful", user });
  } catch (error) {
    res.status(404).json({ message: "error in getting profile" });
  }
};
