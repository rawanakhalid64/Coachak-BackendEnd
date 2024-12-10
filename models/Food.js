const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "Trainer",
  },
  name: {
    type: Number,
    required: [true, "please provide a name for the meal"],
  },
  calories: {
    type: Number,
    required: [true, "please provide number of calories per 100g"],
  },
  protein: {
    type: Number,
    required: [true, "please provide number of protein grams per 100g"],
  },
  carbohydrates: {
    type: Number,
    required: [true, "please provide number of carbohydrates grams per 100g"],
  },
  fats: {
    type: Number,
    required: [true, "please provide number of fats grams per 100g"],
  },
});
const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
