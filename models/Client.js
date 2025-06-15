const mongoose = require("mongoose");
const User = require("./User");
const clientSchema = new mongoose.Schema({
  weight: {
    type: Number,
  },
  weightGoal: {
    type: Number,
  },
  height: {
    type: Number,
  },
  workoutsPerWeek: {
    type: Number,
  },
  includeIngredients: [
    {
      type: String,
    },
  ],
  excludeIngredients: [
    {
      type: String,
    },
  ],
  job: {
    type: String,
  },
  fitnessLevel: {
    type: String,
    enum: {
      values: ["beginner", "intermediate", "advanced"],
      message:
        "Please choose a valid fitness lever (beginner, intermediate, advanced).",
    },
  },
  fitnessGoal: {
    type: String,
    enum: {
      values: ["loseWeight", "gainMuscles", "wightLifting", "diet"],
      message:
        "Please choose a valid fitness lever (loseWeight, gainMuscles, wightLifting, diet).",
    },
  },
  healthCondition: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "HealthCondition",
    },
  ],
  allergy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Allergy",
    },
  ],
});
const Client = User.discriminator("client", clientSchema);
module.exports = Client;
