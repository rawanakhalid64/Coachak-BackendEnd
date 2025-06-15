const mongoose = require("mongoose");
const dayPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    required: true,
  },

  workout: {
    type: mongoose.Schema.ObjectId,
    ref: "Workout",
  },

  meals: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Meal",
    },
  ],
});

const DayPlan = mongoose.model("DayPlan", dayPlanSchema);
module.exports = DayPlan;
