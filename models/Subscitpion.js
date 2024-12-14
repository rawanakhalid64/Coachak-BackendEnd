const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
    },
    TrainingPlan: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "TrainingPlan",
      },
    ],
    NutritionPlan: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "NutritionPlan",
      },
    ],
  },
  { timestamps: true }
);
const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
