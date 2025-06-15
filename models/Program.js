const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Program title is required"],
      unique: true
    },
    icon: {
      type: String,
      required: [true, "Program icon is required"]
    },
    description: {
      type: String,
      required: [true, "Program description is required"]
    },
    trainers: [{
      trainer: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      },
      joinedAt: {
        type: Date,
        default: Date.now
      },
      isApproved: {
        type: Boolean,
        default: true
      }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
programSchema.index({ title: 1 });

const Program = mongoose.model("Program", programSchema);
module.exports = Program;