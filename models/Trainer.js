const mongoose = require("mongoose");
const User = require("./User");
const trainerSchema = new mongoose.Schema({
  bio: { type: String },
  isAvailable: {
    type: Boolean,
    default: true,
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
const Trainer = User.discriminator("Trainer", trainerSchema);
module.exports = Trainer;
