const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "Trainer",
    required: [true, "Meal should have creator"],
  },
  name: {
    type: String,
    required: [true, "please provide name for the meal"],
  },
  type: {
    type: String,

    required: [true, "please provide type of the meal"],
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  notes: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  unit: {
    type: String,
  },
  ingredients: {
    type: mongoose.Schema.ObjectId,
    ref: "Ingredient",
  },
});
const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
