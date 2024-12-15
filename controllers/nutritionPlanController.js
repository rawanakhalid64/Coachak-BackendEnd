const NutritionPlan = require("../models/NutritionPlan");
const Subscription = require("../models/Subscription");

exports.createNutritionPlan = async (req, res, next) => {
  try {
    const { title, goal, descritpion, durationInWeeks, subscriptionId } =
      req.body;
    const nutritionPlan = await NutritionPlan.create({
      trainer: req.user.id,
      title,
      goal,
      descritpion,
      durationInWeeks,
    });
    if (subscriptionId) {
      await Subscription.findByIdAndUpdate(subscriptionId, {
        nutritionPlan: nutritionPlan.id,
      });
    }
    res.status(200).json({
      message: "Nutrition plan created successful",
      nutritionPlan,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in creating nutrition plan" });
  }
};

exports.updateNutritionPlan = async (req, res, next) => {
  try {
    const nutritionPlan = await NutritionPlan.findOneAndUpdate(
      {
        _id: req.params.id,
        trainer: req.user.id,
      },
      { ...req.body }
    );

    if (!nutritionPlan) {
      return res.status(404).json({
        message:
          "Nutrition plan not found or you are not authorized to edit it.",
      });
    }
    res
      .status(200)
      .json({ message: "Nutrition plan updated successful", nutritionPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in updating nutrition plan" });
  }
};
