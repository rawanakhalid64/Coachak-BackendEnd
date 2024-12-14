const mongoose = require("mongoose");
const certificateSchema = new mongoose.Schema(
  {
    credintialId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "please add a name for cerificate"],
    },
    imageUrl: {
      type: String,
      required: [true, "please add image for certificate"],
    },
    url: {
      type: String,
    },
    issuingOrganization: {
      type: String,
    },
    expirationDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);
const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;
