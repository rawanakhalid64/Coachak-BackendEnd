const mongoose = require("mongoose");
const certificationSchema = new mongoose.Schema(
  {
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
    credintialId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);
const AreaOfExperise = mongoose.model("AreaOfExperise", certificationSchema);
module.exports = AreaOfExperise;
