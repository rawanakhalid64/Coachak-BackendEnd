const DayPlan = require("./DayPlan");
const mongoose = require("mongoose");

const weekPlanSchema = new mongoose.Schema({
  subscription: {
    type: mongoose.Schema.ObjectId,
    ref: "Subscription",
  },
  weekNumber: {
    type: Number,
    required: true,
  },
  days: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "DayPlan",
    },
  ],
});

weekPlanSchema.pre("save", async function (next) {
  if (this.isNew) {
    const weekPlan = this;

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
    const dayPlans = await Promise.all(
      daysOfWeek.map(async (day) => {
        const dayPlan = await DayPlan.create({
          day: day,
        });
        return dayPlan._id;
      })
    );

    // Add the created day plan IDs to the week plan
    weekPlan.days = dayPlans;
  }
  next();
});

const WeekPlan = mongoose.model("WeekPlan", weekPlanSchema);
module.exports = WeekPlan;
