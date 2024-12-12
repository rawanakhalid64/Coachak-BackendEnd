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
      unique: [true, "phone number already exists."],
      required: [true, "Please provide a phone number."],
    },
    // role: {
    //   type: String,
    //   default: "client",
    //   enum: {
    //     values: ["admin", "trainer", "client"],
    //     message: "Please choose a valid role (admin, trainer, or client).",
    //   },
    //   required: [true, "Role is required."],
    // },
    lastLogin: { type: Date },
    gender: { type: String },
    isVerified: { type: Boolean, default: false },
    pendingPasswordChange: { type: Boolean, default: false },

    areaOfExpertise: {
      type: mongoose.Schema.ObjectId,
      ref: "AreaOfExpertise",
    },
    profilePhoto: {
      default:
        "https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg",
      type: String,
    },
  },
  {
    discriminatorKey: "role",
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
User.discriminator("trainer", new mongoose.Schema());
module.exports = User;
