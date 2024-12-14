const mongoose = require("mongoose");
const nutritionPlanSchema = new mongoose.Schema(
  {
    trainer: { type: mongoose.Schema.ObjectId, ref: "Trainer" },
    title: { type: String },
    goal: { type: String },
    descritpion: { type: String },
    durationInWeeks: {
      type: Number,
      required: [true, "please provide duration for the nutrition plan"],
    },
    dayPlan: [{ type: mongoose.Schema.ObjectId, ref: "DayPlan" }],
    meals: [{ type: mongoose.Schema.ObjectId, ref: "Meal" }],
  },
  { timestamps: true }
);
const NutritionPlan = mongoose.model("NutritionPlan", nutritionPlanSchema);
module.exports = NutritionPlan;
