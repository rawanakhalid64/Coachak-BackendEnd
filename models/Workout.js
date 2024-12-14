const mongoose = require("mongoose");
const workoutSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "Trainer",
    },
    name: {
      type: String,
      required: [true, "please provide name for the workout day"],
    },
    exercises: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Exercise",
        sets: { type: Number },
        reps: { type: Number },
        rest: { type: Number },
      },
    ],
  },
  { timeseries: true }
);
const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout;
