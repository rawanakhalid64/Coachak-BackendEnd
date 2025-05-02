const mongoose = require("mongoose");
const DayPlan = require("./DayPlan");
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
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: "Trainer",
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

// Create a pre-save hook to add DayPlan entries
subscriptionSchema.pre("save", async function (next) {
  const subscription = this;

  // Define the days of the week
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Create DayPlan entries for each day
  const dayPlans = daysOfWeek.map((day) => ({
    day: day,
    subscription: subscription._id,
    workouts: [], // Add any default workout if needed
    meals: [], // Add any default meals if needed
  }));

  // Save the DayPlan entries to the database
  await DayPlan.insertMany(dayPlans);
  next();
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
