const mongoose = require("mongoose");
const allergySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "please add a name for allergy"],
  },
  description: {
    type: String,
  },
  severity: {
    type: String,
  },
});
const Allergy = mongoose.model("Allergy", allergySchema);
module.exports = Allergy;
