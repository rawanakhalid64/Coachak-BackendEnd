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
    }).populate({
      path: "days",
      populate: [
        {
          path: "meals.meal", // Populate meals
        },
        {
          path: "workout",
          populate: {
            path: "exercises.exercise", // Populate each exercise inside workout
            select: "name",
          },
        },
      ],
    });

    if (!weekData || weekData.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Week plan not found",
      });
    }

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

    res.status(200).json({
      status: "success",
      data: transformedWeek,
    });
  } catch (error) {
    console.error(error);
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
