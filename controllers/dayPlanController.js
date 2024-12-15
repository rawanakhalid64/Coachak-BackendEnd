const DayPlan = require("../models/DayPlan");
const NutritionPlan = require("../models/NutritionPlan");
const TrainingPlan = require("../models/TrainingPlan");

exports.addDayPlan = async (req, res, next) => {
  try {
    const {
      trainingPlanId,
      nutritionPlanId,
      day,
      meal,
      workout,
      subscription,
    } = req.body;
    let dayPlan = await DayPlan.findOne({ subscription, day });
    if (!dayPlan) await DayPlan.create({ subscription, day });
    dayPlan.meal = meal;
    dayPlan.workout = workout;
    await dayPlan.save();
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
    const dayPlan = await DayPlan.findByIdAndUpdate(req.params.id, {
      meal,
      workout,
    });

    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};

exports.addMeal = async (req, res, next) => {
  try {
    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};
exports.editMeal = async (req, res, next) => {
  try {
    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};

exports.deleteMeal = async (req, res, next) => {
  try {
    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};
exports.addWorkout = async (req, res, next) => {
  try {
    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};
exports.editWorkout = async (req, res, next) => {
  try {
    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};

exports.deleteWorkout = async (req, res, next) => {
  try {
    res.status(200).json({ message: "day plan updated successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot update day plan" });
  }
};
