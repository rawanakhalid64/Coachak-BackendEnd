const mongoose = require("mongoose");
const planSchema = new mongoose.Schema(
  {
    trainer: {
      type: String,
      required: [true, "please add trainer id"],
    },
    title: {
      type: String,
      required: [true, "please add a title for plan"],
    },
    description: {
      type: String,
      required: [true, "please add desciption for the plan"],
    },
    price: {
      type: Number,
      min: 1,
      required: [true, "please add price for the plan"],
    },
    durationInWeeks: {
      type: Number,
      min: 1,
      required: [true, "please add duration for the plan"],
    },
    hasTrainingPlan: {
      type: Boolean,
      required: [true, "does the plan has training plan?"],
    },
    hasNutritionPlan: {
      type: Boolean,
      required: [true, "does the plan has nutrition plan?"],
    },
    subscriptionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
