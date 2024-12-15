const express = require("express");
const {
  addCertificate,
  editCertificate,
  getCertificate,
  getMyCertificates,
  getTrainersCertificates,
} = require("../controllers/certificateController");
const { protect } = require("../controllers/authController");
const route = express.Router();

route.route("trainer/:id").get(protect, getTrainersCertificates);
route.route("/").get(protect, getMyCertificates).post(protect, addCertificate);
route
  .route("/:id")
  .get(protect, getCertificate)
  .patch(protect, editCertificate);

module.exports = route;
