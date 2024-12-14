const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "Trainer",
  },
  quantity: {
    type: Number,
    required: [true, "please provide a quantity for the meal"],
  },
  unit: {
    type: String,
    enums: ["g", "kg"],
  },
  food: [{ type: mongoose.Schema.ObjectId, ref: "Food" }],
});
const Ingredient = mongoose.model("Ingredient", ingredientSchema);
module.exports = Ingredient;
