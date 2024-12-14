const mongoose = require("mongoose");
const areaOfExperiseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name for area of expertise"],
  },
  description: {
    type: String,
  },
});
const AreaOfExperise = mongoose.model("AreaOfExperise", areaOfExperiseSchema);
module.exports = AreaOfExperise;
