const DayPlan = require("../models/DayPlan");
const NutritionPlan = require("../models/NutritionPlan");
const Subscription = require("../models/Subscription");
const TrainingPlan = require("../models/TrainingPlan");
const WeekPlan = require("../models/WeekPlan");
const Workout = require("../models/Workout");

exports.getDayPlan = async (req, res, next) => {
  try {
    const { weekNum, dayName } = req.params;
    console.log(weekNum);
    const subscriptionId = (
      await Subscription.findOne({
        client: req.body.client,
        trainer: req.user.id,
      })
    )._id;

    const dayPlan = await WeekPlan.findOne({
      subscription: subscriptionId,
      weekNumber: weekNum,
    }).populate({
      path: "days",
      populate: [
        {
          path: "meals.meal",
          model: "Meal",
        },
        {
          path: "workout",
          populate: {
            path: "exercises.exercise",
            model: "Exercise",
          },
        },
      ],
    });

    if (!dayPlan) {
      return res.status(404).json({
        status: "fail",
        message: "Week plan not found",
      });
    }

    const returnedDay = dayPlan.days.find(
      (day) => day.day.toLowerCase() === dayName.toLowerCase()
    );
    res.status(200).json({
      status: "success",
      day: returnedDay,
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
    const { meal, type } = req.body;

    // Step 1: Push the new meal entry
    const updatedDay = await DayPlan.findById(req.params.dayId);
    updatedDay.meals.push({ meal, type });
    await updatedDay.save();
    if (!updatedDay) {
      return res.status(404).json({ message: "Day not found" });
    }

    // Step 2: Get the last meal (just added)
    const lastMeal = updatedDay.meals[updatedDay.meals.length - 1];

    if (!lastMeal) {
      return res.status(500).json({ message: "Meal push failed" });
    }

    // Step 3: Populate the last meal
    const populatedDay = await DayPlan.findById(updatedDay._id).populate(
      "meals.meal"
    );

    const populatedLastMeal = populatedDay.meals.find(
      (m) => m._id.toString() === lastMeal._id.toString()
    );

    return res.status(200).json({
      message: "Meal added successfully",
      meal: populatedLastMeal,
      day: updatedDay._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSingleMealInDay = async (req, res, next) => {
  try {
    const { meal, type } = req.body;
    const { dayId, mealId } = req.params;

    const dayPlan = await DayPlan.findById(dayId);
    if (!dayPlan) {
      return res.status(404).json({ message: "Day plan not found" });
    }

    // const mealIndex = dayPlan.meals.findIndex(
    //   (m) => m._id.toString() === mealId
    // );

    // if (mealIndex === -1) {
    //   return res.status(404).json({ message: "Meal not found in day plan" });
    // }

    const currentMeal = dayPlan.meals.filter((meal) => {
      // console.log(meal);
      return meal._id.toString() !== mealId;
    });
    console.log(currentMeal);
    // Update meal fields
    // if (meal) dayPlan.meals[mealIndex].meal = meal;
    // if (type) dayPlan.meals[mealIndex].type = type;

    await dayPlan.save();

    // Repopulate meals to return updated version
    const populatedDay = await DayPlan.findById(dayId).populate("meals.meal");
    const updatedMeal = populatedDay.meals.filter(
      (m) => m._id.toString() === mealId
    );

    return res.status(200).json({
      message: "Meal updated successfully",
      meal: updatedMeal,
      day: populatedDay._id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update meal in day plan" });
  }
};

exports.removeSingleMealFromDay = async (req, res, next) => {
  try {
    const dayMeals = await DayPlan.findById(req.params.dayId);
    if (!dayMeals) {
      return res.status(404).json({ message: "Day plan not found" });
    }

    const mealExists = dayMeals.meals.some(
      (meal) => meal._id.toString() === req.params.mealId
    );

    if (!mealExists) {
      return res.status(200).json({ message: "Meal is not in the plan" });
    }

    dayMeals.meals = dayMeals.meals.filter(
      (meal) => meal._id.toString() !== req.params.mealId
    );

    await dayMeals.save();

    res
      .status(200)
      .json({ message: "Meal removed successfully from day plan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove meal from day plan" });
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
      .populate({
        path: "workout",
        populate: {
          path: "exercises.exercise", // Populate each exercise inside workout
        },
      });
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
exports.addWorkoutToDay = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { dayId } = req.params;

    // Find the day plan
    const dayPlan = await DayPlan.findById(dayId);
    if (!dayPlan) {
      return res.status(404).json({ message: "DayPlan not found." });
    }

    // Create and save the workout
    const workout = new Workout({ name, creator: req.user.id });
    await workout.save();

    // Assign the workout and save the day plan
    dayPlan.workout = workout._id;
    await dayPlan.save();

    // Re-fetch and populate the workout field
    const updatedDayPlan = await DayPlan.findById(dayId).populate("workout");

    res.status(200).json({
      message: "Workout added successfully.",
      dayPlan: updatedDayPlan,
    });
  } catch (error) {
    console.error("Error adding workout to day:", error);
    res.status(500).json({ message: "Cannot update DayPlan." });
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
