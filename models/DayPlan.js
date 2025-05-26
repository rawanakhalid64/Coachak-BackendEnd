const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const mealSchema = new mongoose.Schema({
  meal: {
    type: mongoose.Schema.ObjectId,
    ref: "Meal",
  },
  type: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true,
  },
  order: {
    type: Number,
  },
});

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
  meals: [mealSchema],
});

// Add pre-save hook to maintain order sequence
dayPlanSchema.pre("save", function (next) {
  if (this.isModified("meals")) {
    // Sort meals by current order first
    this.meals.sort((a, b) => a.order - b.order);

    // Reassign orders sequentially starting from 1
    this.meals.forEach((meal, index) => {
      meal.order = index + 1;
    });
  }
  next();
});

const DayPlan = mongoose.model("DayPlan", dayPlanSchema);
module.exports = DayPlan;
