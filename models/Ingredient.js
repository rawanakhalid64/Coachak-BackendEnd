const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "Trainer",
    required: [true, "ingredient must has creater"],
  },
  foodItems: [
    {
      foodItem: {
        type: mongoose.Schema.ObjectId,
        ref: "Food",
      },
      quantity: {
        type: Number,
        required: [true, "please provide a quantity for the meal"],
      },
      unit: {
        type: String,
        enums: ["g", "kg"],
      },
    },
  ],
});
const Ingredient = mongoose.model("Ingredient", ingredientSchema);
module.exports = Ingredient;
