const mongoose = require("mongoose");
const User = require("./User");
const trainerSchema = new mongoose.Schema({
  bio: { type: String },
  // availableInterval: [{ type: "string" }],

  availableInterval: {
    start: { type: Date, default: Date.now() },
    end: { type: Date, default: Date.now() },
  },
  yearsOfExperience: {
    type: Number,
  },
  avgRating: {
    type: String,
    default: 0,
    min: 1,
    max: 5,
  },
  pricePerSession: {
    type: Number,
  },
});

trainerSchema.virtual("isAvailable").get(function () {
  const now = new Date();
  return (
    this.availableInterval.start <= now && this.availableInterval.end >= now
  );
});
const Trainer = User.discriminator("trainer", trainerSchema);
module.exports = Trainer;
