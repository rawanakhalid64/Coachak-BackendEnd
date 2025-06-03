const Workout = require("../models/Workout");

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
    console.log(req.params.workoutId);
    let workout = await Workout.findById(req.params.workoutId);
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    workout.exercises.push({
      exercise,
      sets,
      reps,
      rest,
      sortOrder: sortOrder || workout.exercises.length,
    });
    await workout.save();

    // Re-fetch workout with populated exercise data
    workout = await Workout.findById(workout._id).populate(
      "exercises.exercise",
      "name"
    );

    res.status(200).json({ message: "Workout edited successfull", workout });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot add workout to day" });
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
