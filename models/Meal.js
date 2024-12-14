const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "Trainer",
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
  notes: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  ingredients: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Ingredient",
    },
  ],
});
const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
