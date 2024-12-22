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
    const workout = await Workout.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      { exercises },
      { new: true }
    );

    res.status(200).json({ message: "Workout edited successfull", workout });
  } catch (error) {
    res.status(404).json({ message: "cannot edit workout" });
  }
};
