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
      minlength: [6, "Password must be at least 6 characters long."],
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
      default: "trainee",
      enum: {
        values: ["admin", "trainer", "trainee"],
        message: "Please choose a valid role (admin, trainer, or trainee).",
      },
      required: [true, "Role is required."],
    },
    lastLogin: { type: Date },
    gender: { type: String },
    isVerified: { type: Boolean, default: false },
    pendingPasswordChange: { type: Boolean, default: false },
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
