const Workout = require("../models/Workout");

exports.createWorkout = async (req, res, next) => {
  try {
    const { name, exercises } = req.body;
    const workout = await Workout.create({
      name,
      creator: req.user.id,
      exercises,
    });
    res.status(200).json({ message: "Workout added successfull", workout });
  } catch (error) {
    res.status(404).json({ message: "cannot add workout" });
  }
};

exports.editWorkout = async (req, res, next) => {
  try {
    const { exercises, creator: _, ...rest } = req.body;
    const workout = await Workout.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      { rest, $push: exercises }
    );

    res.status(200).json({ message: "Workout edited successfull", workout });
  } catch (error) {
    res.status(404).json({ message: "cannot edit workout" });
  }
};
