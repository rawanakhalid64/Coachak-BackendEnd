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
      match: [/.+\@.+\..+/, "Please enter a valid email address."],
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
      unique: [true, "phone number already exists."],
      required: [true, "Please provide a phone number."],
    },
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
    toJSON: { virtuals: true }, // <-- add this to make virtuals appear in JSON
    toObject: { virtuals: true }, // <-- add this to make virtuals appear in object
  }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Virtual populate for certificates
userSchema.virtual("certificates", {
  ref: "Certificate", // model to populate from
  localField: "_id", // user's _id
  foreignField: "credintialId", // field in certificate model that references user
});

// Auto-populate certificates on every find
userSchema.pre(/^find/, function (next) {
  this.populate("certificates");
  next();
});

// Virtual for calculating age
userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  let age = today.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())
  ) {
    age--;
  }
  return age;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
