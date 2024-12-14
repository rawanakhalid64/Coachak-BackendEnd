const mongoose = require("mongoose");
const trainingPlanSchema = new mongoose.Schema(
  {
    title: { type: String },
    goal: { type: String },
    descritpion: { type: String },
    durationInWeeks: {
      type: Number,
      required: [true, "please provide duration for the nutrition plan"],
    },
    dayPlan: [{ type: mongoose.Schema.ObjectId, ref: "DayPlan" }],
  },
  { timestamps: true }
);
const TrainingPlan = mongoose.model("TrainingPlan", trainingPlanSchema);
module.exports = TrainingPlan;
