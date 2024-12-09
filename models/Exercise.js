const mongoose = require("mongoose");
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: [true, "please add name for the exercise"] },
  video_url: { type: String },
  instructions: { type: String },
});
const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
