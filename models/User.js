const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required."],
      type: String,
    },
    lastName: {
      required: [true, "Last name is required."],
      type: String,
    },
    email: {
      required: [true, "Email is required."],
      type: String,
      unique: [true, "Email already exists."],
      match: [/.+\@.+\..+/, "Please enter a valid email address."], // Simple regex for email validation
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: [8, "Password must be at least 8 characters long."],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "please provide date of birth"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a phone number."],
    },
    role: {
      type: String,
      default: "client",
      enum: {
        values: ["admin", "trainer", "client"],
        message: "Please choose a valid role (admin, trainer, or client).",
      },
      required: [true, "Role is required."],
    },
    lastLogin: { type: Date },
    gender: { type: String },
    isVerified: { type: Boolean, default: false },
    pendingPasswordChange: { type: Boolean, default: false },

    areaOfExpertise: {
      type: mongoose.Schema.ObjectId,
      ref: "AreaOfExpertise",
    },

    // for client
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
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
    // for trainers
    bio: { type: String },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    avgRating: {
      type: String,
      default: 0,
      min: 1,
      max: 5,
    },
    pricePerSession: {
      type: Number,
      required: [true, "please provide a price per session"],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// // Verification method
// userSchema.methods.verifyUser = function () {
//   this.isVerified = true;
//   return this.save(); // Save the updated user document
// };

const User = mongoose.model("User", userSchema);
module.exports = User;
