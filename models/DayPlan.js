const mongoose = require("mongoose");
const dayPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    required: true,
  },

  subscription: { type: mongoose.Schema.ObjectId, ref: "Subscription" },
  workout: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Workout",
      sortOrder: { type: Number, required: true },
    },
  ],
  meal: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Meal",
      sortOrder: { type: Number, required: true },
    },
  ],
});
// // Pre-save hook to set sortOrder for workouts and meals
// dayPlanSchema.pre("save", function (next) {
//   // Set sortOrder for workouts
//   this.workouts.forEach((workout) => {
//     workout.sortOrder = this.workouts.length; // Set to current array length
//   });

//   // Set sortOrder for meals
//   this.meals.forEach((meal) => {
//     meal.sortOrder = this.meals.length; // Set to current array length
//   });

//   next();
// });

const DayPlan = mongoose.model("DayPlan", dayPlanSchema);
module.exports = DayPlan;
