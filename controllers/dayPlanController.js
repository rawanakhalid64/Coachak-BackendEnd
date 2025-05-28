const DayPlan = require("../models/DayPlan");
const NutritionPlan = require("../models/NutritionPlan");
const TrainingPlan = require("../models/TrainingPlan");

exports.getDayPlans = async (req, res, next) => {
  try {
    const { id: subscription } = req.param;
    const dayPlans = await DayPlan.find({ subscription })
      .populate("workout")
      .populate("meals");

    res.status(200).json({
      status: "success",
      dayPlans,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "fail",
      message: "Could not get day plans",
    });
  }
};

exports.addSingleMealForDay = async (req, res, next) => {
  try {
    const meal = req.body.meal;
    const type = req.body.type;
    const day = await DayPlan.findById(req.params.dayId);

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    // Add the meal to the meals array
    day.meals.push({ meal, type });

    // Save the updated day
    await day.save();

    return res.status(200).json({ message: "Meal added successfully", day });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateDayPlan = async (req, res, next) => {
  try {
    const { meals, workout } = req.body;
    const day = req.params.dayId;
    // console.log(day);
    let dayPlan = await DayPlan.findById(day);
    if (!dayPlan) {
      dayPlan = await DayPlan.create({ subscription, day });
    }
    if (meals !== undefined) dayPlan.meals = meals;
    if (workout !== undefined) dayPlan.workout = workout;
    await dayPlan.save();
    dayPlan = await DayPlan.findById(dayPlan._id)
      .populate({
        path: "meals.meal", // Populate meals
      })
      .populate("workout"); // Populate workout

    res.status(200).json({ message: "day plan added successfull", dayPlan });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot add day plan" });
  }
};
// exports.updateDayPlan = async (req, res, next) => {
//   try {
//     const {
//       trainingPlanId,
//       nutritionPlanId,

//       meals,
//       workout,
//       subscription,
//     } = req.body;
//     const day = req.params.day;
//     console.log(day);
//     let dayPlan = await DayPlan.findOneAndUpdate(
//       { subscription, day },
//       { meals, workout },
//       { new: true }
//     );
//     console.log(dayPlan);

//     if (!dayPlan) {
//       console.log("yes");
//       dayPlan = await DayPlan.create({ subscription, day, meals, workout });
//     }
//     // console.log(meals);
//     // dayPlan.meals = meals;
//     // dayPlan.workout = workout;
//     // await dayPlan.save();
//     console.log(dayPlan);
//     if (trainingPlanId) {
//       await TrainingPlan.findByIdAndUpdate(trainingPlanId, {
//         $push: dayPlan.id,
//       });
//     }
//     if (nutritionPlanId) {
//       await NutritionPlan.findByIdAndUpdate(nutritionPlanId, {
//         $push: dayPlan.id,
//       });
//     }
//     res.status(200).json({ message: "day plan added successfull", dayPlan });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "cannot add day plan" });
//   }
// };
// exports.updateDayPlan = async (req, res, next) => {
//   try {
//     const { meals, workout, subscription } = req.body;
//     const { day } = req.params;
//     const dayPlan = await DayPlan.findAndUpdate(
//       { day, subscription },
//       {
//         meals,
//         workout,
//       }
//     );

//     res.status(200).json({ message: "day plan updated successfull", dayPlan });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "cannot update day plan" });
//   }
// };

// exports.addMeal = async (req, res, next) => {
//   try {
//     const { meal } = res.body;
//     const dayPlan = await DayPlan.findByIdAndUpdate(req.params.id)
//       .status(200)
//       .json({ message: "day plan updated successfull", dayPlan });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "cannot update day plan" });
//   }
// };
// exports.deleteMeal = async (req, res, next) => {
//   try {
//     res.status(200).json({ message: "day plan updated successfull", dayPlan });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "cannot update day plan" });
//   }
// };
// exports.editMeal = async (req, res, next) => {
//   try {
//     res.status(200).json({ message: "day plan updated successfull", dayPlan });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "cannot update day plan" });
//   }
// };

exports.addWorkout = async (req, res, next) => {
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
// exports.editWorkout = async (req, res, next) => {
//   try {
//     res.status(200).json({ message: "day plan updated successfull", dayPlan });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "cannot update day plan" });
//   }
// };
