const Allergy = require("../models/Allergy");

exports.addAllergy = async (req, res, next) => {
  try {
    const allergy = await Allergy.create({ ...req.body });
    res.status(200).json({ message: "allergy added successfull", allergy });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot add allergy" });
  }
};
exports.updateAllergy = async (req, res, next) => {
  try {
    const allergy = await Allergy.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json({ message: "allergy added successfull", allergy });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot add allergy" });
  }
};

exports.getAllergies = async (req, res, next) => {
  try {
    const allergies = await Allergy.find();
    res.status(200).json({
      message: "allergies retrieved successful",
      allergies,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot get allergies" });
  }
};
