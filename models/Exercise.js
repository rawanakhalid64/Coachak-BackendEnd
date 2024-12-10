const mongoose = require("mongoose");
const exerciseSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.ObjectId, ref: "Trainer" },
  name: { type: String, required: [true, "please add name for the exercise"] },
  video_url: { type: String },
  instructions: { type: String },
});
const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
