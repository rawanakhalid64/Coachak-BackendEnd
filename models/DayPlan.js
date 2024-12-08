const mongoose = require("mongoose");
const dayPlanSchema = new mongoose.Schema({
  day: { type: String },
  workout: [{ type: mongoose.Schema.ObjectId, ref: "Workout" }],
  meal: [{ type: mongoose.Schema.ObjectId, ref: "Meal" }],
});
const DayPlan = mongoose.model("DayPlan", dayPlanSchema);
module.exports = DayPlan;
