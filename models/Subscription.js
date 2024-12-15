const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.ObjectId,
      ref: "Plan",
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
    },

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
    trainingPlan: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "TrainingPlan",
      },
    ],
    nutritionPlan: [
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
