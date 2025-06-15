const Exercise = require("../models/Exercise");
const Workout = require("../models/Workout");
const mongoose = require("mongoose");

exports.createWorkout = async (req, res, next) => {
  try {
    const { name, exercises } = req.body;
    const workout = await Workout.create({
      creator: req.user.id,
      name,

      exercises,
    });
    res.status(200).json({ message: "Workout added successfull", workout });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot add workout" });
  }
};

exports.editWorkout = async (req, res, next) => {
  try {
    const { exercises, ...rest } = req.body;
    console.log(req.params.id);
    const workout = await Workout.findOne({
      // creator: req.user.id,
      _id: req.params.id,
    });
    console.log(workout.creator.toString(), req.user.id);
    if (!workout || workout.creator.toString() !== req.user.id) {
      return res.status(404).json({ message: "Workout not found" });
    }
    console.log(workout);
    workout.exercises = exercises;
    await workout.save();
    res.status(200).json({ message: "Workout edited successfull", workout });
  } catch (error) {
    res.status(404).json({ message: "cannot edit workout" });
  }
};
exports.addExercisesToWorkoutData = async (req, res, next) => {
  try {
    const { exercise, sortOrder, sets, reps, rest } = req.body;

    // Find the workout first
    let workout = await Workout.findById(req.params.workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    let exerciseId;

    // Check if exercise is an ObjectId (existing exercise)
    if (mongoose.Types.ObjectId.isValid(exercise)) {
      exerciseId = exercise;
    } else if (typeof exercise === "string" && exercise.trim() !== "") {
      // Otherwise, treat exercise as a new exercise name; create it
      const newExercise = new Exercise({
        name: exercise.trim(),
        creator: req.user.id,
      });
      await newExercise.save();
      exerciseId = newExercise._id;
    } else {
      return res.status(400).json({ message: "Invalid exercise data" });
    }

    workout.exercises.push({
      exercise: exerciseId,
      sets,
      reps,
      rest,
      sortOrder: sortOrder ?? workout.exercises.length,
    });

    await workout.save();

    // Populate the exercises.exercise to get details (like name)
    workout = await Workout.findById(workout._id).populate(
      "exercises.exercise",
      "name"
    );

    res.status(200).json({ message: "Workout updated successfully", workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot add exercise to workout" });
  }
};
exports.removeExerciseFromWorkout = async (req, res, next) => {
  try {
    const { workoutId, exerciseId } = req.params;

    // Find the workout
    const workout = await Workout.findById(workoutId);
    console.log(workout.exercises.length);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Find the index of the exercise to remove
    const index = workout.exercises.findIndex(
      (ex) => ex._id.toString() === exerciseId
    );

    if (index === -1) {
      return res.status(404).json({ message: "Exercise not found in workout" });
    }

    // Remove the exercise
    workout.exercises.splice(index, 1);

    // Save the workout
    await workout.save();
    console.log(workout.exercises.length);
    res.status(200).json({ message: "Exercise removed successfully", workout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove exercise from workout" });
  }
};

exports.editExerciseInWorkout = async (req, res) => {
  try {
    console.log(req.params);
    const { workoutId, exerciseId } = req.params;
    const { sets, reps, rest, sortOrder, exercise } = req.body;

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    console.log(workout);
    const exerciseToEdit = workout.exercises.id(exerciseId);
    if (!exerciseToEdit) {
      return res.status(404).json({ message: "Exercise not found in workout" });
    }

    // Update only the provided fields
    if (typeof sets !== "undefined") exerciseToEdit.sets = sets;
    if (typeof reps !== "undefined") exerciseToEdit.reps = reps;
    if (typeof rest !== "undefined") exerciseToEdit.rest = rest;
    if (typeof sortOrder !== "undefined") exerciseToEdit.sortOrder = sortOrder;
    if (typeof exercise !== "undefined") exerciseToEdit.exercise = exercise;

    await workout.save();

    // Optional: populate the exercise field if needed
    await workout.populate("exercises.exercise", "name");

    res.status(200).json({
      message: "Exercise updated successfully",
      workout,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update exercise in workout",
    });
  }
};
