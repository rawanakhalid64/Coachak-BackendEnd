const Plan = require("../models/Plan");

exports.createPlan = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      durationInWeeks,
      hasNutritionPlan,
      hasTrainingPlan,
    } = req.body;
    const plan = new Plan({
      trainer: req.user.id,
      title,
      description,
      durationInWeeks,
      price,
      hasNutritionPlan,
      hasTrainingPlan,
    });
    await plan.save();
    res.status(200).json({ message: "plan created successful", plan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in creating plan" });
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      {
        _id: req.params.id,
        trainer: req.user.id,
      },
      { ...req.body }
    );
    res.status(200).json({ message: "plan updated successful", plan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in creating plan" });
  }
};

exports.getTrainersPlans = async (req, res, next) => {
  try {
    const plan = await Plan.find({
      trainer: req.params.trainerId,
    });
    res.status(200).json({ message: "plans retrieved successful", plan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in getting plans" });
  }
};
exports.getMyPlans = async (req, res, next) => {
  console.log(req.user.id);
  try {
    const plan = await Plan.find({
      trainer: req.user.id,
    });
    res.status(200).json({ message: "plans retrieved successful", plan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in getting plans" });
  }
};
