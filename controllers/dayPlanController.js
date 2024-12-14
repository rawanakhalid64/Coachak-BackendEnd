const DayPlan = require("../models/DayPlan");
const NutritionPlan = require("../models/NutritionPlan");
const TrainingPlan = require("../models/TrainingPlan");

exports.addDayPlan = async (req, res, next) => {
  try {
    const { trainingPlanId, nutritionPlanId, meal, workout, subscription } =
      req.body;
    const dayPlan = await DayPlan.create({ day, meal, workout, subscription });
    if (trainingPlanId) {
      await TrainingPlan.findByIdAndUpdate(trainingPlanId, {
        $push: dayPlan.id,
      });
    }
    if (nutritionPlanId) {
      await NutritionPlan.findByIdAndUpdate(nutritionPlanId, {
        $push: dayPlan.id,
      });
    }
    res.status(200).json({ message: "day plan added successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot add day plan" });
  }
};
exports.updateDayPlan = async (req, res, next) => {
  try {
    const { meal, workout } = req.body;
    const dayPlan = await DayPlan.findById(req.params.id);
    if (meal) {
      dayPlan.meal.push(meal);
    }
    if (workout) {
      dayPlan.workout.push(workout);
    }
    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};
