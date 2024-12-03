const Allergy = require("../models/Allergy");
const Certificate = require("../models/Certificate");
const Client = require("../models/Client");
const HealthCondition = require("../models/HealthCondition");
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const { filterObj } = require("../utils/helper");

exports.uploadImage = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updateObj = filterObj(
      req.body,
      "avgRating",
      "role",
      "allergy",
      "healthCondition"
    );

    const userType = req.user.role === "Trainer" ? Trainer : Client;

    let healthConditionId = null;

    if (req.body.healthCondition) {
      let healthCondition = await HealthCondition.findOne({
        name: req.body.healthCondition,
      });

      if (!healthCondition) {
        healthCondition = await HealthCondition.create({
          name: req.body.healthCondition,
        });
      }

      healthConditionId = healthCondition._id;
    }

    let allergyId = null;
    if (req.body.allergy) {
      let allergy = await Allergy.findOne({
        name: req.body.allergy,
      });

      if (!allergy) {
        allergy = await Allergy.create({
          name: req.body.allergy,
        });
      }

      allergyId = allergy._id;
    }

    const user = await userType.findByIdAndUpdate(
      req.user.id,
      {
        ...updateObj,
        ...(healthConditionId && {
          $push: { healthCondition: healthConditionId },
        }),
        ...(allergyId && {
          $push: { allergy: allergyId },
        }),
      },
      { new: true }
    );

    res.status(200).json({ message: "profile updated successful", user });
  } catch (error) {
    console.log(error);
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
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ message: "profile retrieved successful", user });
  } catch (error) {
    res.status(404).json({ message: "error in getting profile" });
  }
};
