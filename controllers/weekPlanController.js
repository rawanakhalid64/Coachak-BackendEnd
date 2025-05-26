const WeekPlan = require("../models/WeekPlan");

exports.getAllWeeks = async (req, res, next) => {
  try {
    const weeks = await WeekPlan.find({
      subscription: req.params.subscriptionId,
    });
    res.status(200).json({
      status: "success",
      data: weeks,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: "Could not get weeks",
    });
  }
};
exports.getWeek = async (req, res, next) => {
  try {
    const weekData = await WeekPlan.find({
      subscription: req.params.subscriptionId,
      weekNumber: req.params.weekNum,
    }).populate({ path: "days", populate: { path: "meals.meal workout" } });

    // Transform array of days into key-value pairs

    const transformedWeek = {
      ...weekData[0].toObject(),
      days: weekData[0].days.reduce((acc, day) => {
        acc[day.day] = {
          _id: day._id,
          meals: day.meals,
          workout: day.workout,
        };
        return acc;
      }, {}),
    };
    const week = transformedWeek;
    res.status(200).json({
      status: "success",
      data: week,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: "Could not get week plan",
    });
  }
};
exports.getCurrentWeek = async (req, res, next) => {
  try {
    // calculate the current week and get its number
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: "Could not get day plans",
    });
  }
};
