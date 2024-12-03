const mongoose = require("mongoose");
const healthConditionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "please add a name for health condition"],
  },
  description: {
    type: String,
  },
  severity: {
    type: String,
  },
});
const HealthCondition = mongoose.model(
  "HealthCondition",
  healthConditionSchema
);
module.exports = HealthCondition;
