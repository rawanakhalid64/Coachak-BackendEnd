const mongoose = require("mongoose");
const DayPlan = require("./DayPlan");
const WeekPlan = require("./WeekPlan");
const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.ObjectId,
      ref: "Plan",
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    trainer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
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
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for active status
subscriptionSchema.virtual("active").get(function () {
  return new Date() < this.expiresAt;
});

// Virtual for daysUntilExpire
subscriptionSchema.virtual("daysUntilExpire").get(function () {
  const now = new Date();
  const diffTime = this.expiresAt - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0; // return 0 if already expired
});

subscriptionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const subscription = this.id;

    // Calculate number of weeks between start and end dates
    const startDate = new Date(this.startedAt);
    const endDate = new Date(this.expiresAt);
    const diffTime = Math.abs(endDate - startDate);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    console.log(diffWeeks);
    // Create WeekPlans based on subscription duration
    for (let i = 1; i <= diffWeeks; i++) {
      await WeekPlan.create({
        weekNumber: i,
        subscription,
      });
    }
  }
  next();
});

subscriptionSchema.post("save", async function (doc, next) {
  if (this.isNew && this.plan) {
    await Plan.findByIdAndUpdate(this.plan, { $inc: { subscriptionCount: 1 } });
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
