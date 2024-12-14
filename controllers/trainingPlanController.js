const TrainingPlan = require("../models/TrainingPlan");
const Subscription = require("../models/Subscription");

exports.getTrainingPlan = async (req, res, next) => {
  try {
    const trainingPlan = await TrainingPlan.find({ trainer: req.user.id });
    res
      .status(200)
      .json({ message: "training plan retreived successful", trainingPlan });
  } catch {
    res.status(404).json({ message: "error in getting training plan" });
  }
};
exports.createTrainingPlan = async (req, res, next) => {
  try {
    const { title, goal, descritpion, durationInWeeks, subscriptionId } =
      req.body;
    const trainingplan = new TrainingPlan({
      trainer: req.user.id,
      title,
      goal,
      descritpion,
      durationInWeeks,
    });
    await trainingplan.save();
    if (subscriptionId) {
      await Subscription.findByIdAndUpdate(subscriptionId, {
        trainingplan: trainingplan.id,
      });
    }
    res.status(200).json({
      message: "training plan created successful",
      trainingplan,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in creating training plan" });
  }
};

exports.updateTrainingPlan = async (req, res, next) => {
  try {
    const trainerId = req.params.id;

    const plan = await TrainingPlan.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { ...req.body }
    );
    res.status(200).json({ message: "Training plan updated successful", plan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in updating training plan" });
  }
};
