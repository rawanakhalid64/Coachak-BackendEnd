const Exercise = require("../models/Exercise");

exports.createExercise = async (req, res, next) => {
  try {
    const { name, instructions, video_url } = req.body;
    const exercise = await Exercise.create({
      creator: req.user.id,
      name,
      instructions,
      video_url,
    });
    res.status(200).json({ message: "Exercise added successfull", exercise });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot add exercise" });
  }
};

exports.editExercise = async (req, res, next) => {
  try {
    const { instructions, video_url, name } = req.body;
    const exercise = await Exercise.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      { instructions, video_url, name },
      { new: true }
    );

    res.status(200).json({ message: "Exercise edited successfull", exercise });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot edit exercise" });
  }
};
