const mongoose = require("mongoose");
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name for plan"],
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
    subscription: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Subscription",
      },
    ],
  },
  { timestamps: true }
);
const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan;
