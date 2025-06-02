const mongoose = require("mongoose");
const User = require("./User");
const trainerSchema = new mongoose.Schema({
  bio: { type: String },
  // availableInterval: [{ type: "string" }],

  availableDays: {
    type: [String],
    default: ["Sun", "Mon", "Tue", "Wed", "Thu"],
    enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    required: true,
    validate: {
      validator: function (value) {
        return value.length === new Set(value).size; // Check for duplicates
      },
      message: "Days of the week must be unique.",
    },
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

const Trainer = User.discriminator("trainer", trainerSchema);
module.exports = Trainer;
