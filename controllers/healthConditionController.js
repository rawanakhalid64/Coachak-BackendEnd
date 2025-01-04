const HealthCondition = require("../models/HealthCondition");

exports.addHealthCondition = async (req, res, next) => {
  try {
    const healthCondition = await HealthCondition.create({ ...req.body });
    res
      .status(200)
      .json({ message: "health condition added successfull", healthCondition });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ message: "cannot add healthCondition", error: error.message });
  }
};

exports.updateHealthCondition = async (req, res, next) => {
  try {
    const healthCondition = await HealthCondition.findByIdAndUpdate(
      req.params.id,
      { ...req.body }
    );
    res.status(200).json({
      message: "health condition updated successfull",
      healthCondition,
    });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ message: "cannot update healthCondition", error: error.message });
  }
};
exports.getHealthCondition = async (req, res, next) => {
  try {
    const healthConditions = await HealthCondition.find();
    res.status(200).json({
      message: "health conditions retrieved successful",
      healthConditions,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot get healthConditions" });
  }
};
